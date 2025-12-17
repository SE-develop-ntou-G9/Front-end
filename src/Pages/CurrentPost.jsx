import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import PostCard from "./Functions/PostCard";
import { motion, AnimatePresence } from "framer-motion";
import { useUserNotify } from "./hooks/useUserNotify.jsx";
import PassengerPopover from "../components/PassengerPopover.jsx";

function SkeletonCard() {
    return (
        <div className="p-4 bg-white rounded-xl shadow animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-24 bg-gray-200 rounded" />
        </div>
    );
}

function CurrentPost() {
    const { user } = useUser();
    const [myPosts, setMyPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("driver");
    const [clientMap, setClientMap] = useState({});
    const [loading, setLoading] = useState(true);
    const { sendNotification } = useUserNotify();
    const [activePassengerId, setActivePassengerId] = useState(null);


    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.04,
                delayChildren: 0.05,
            }
        }
    };


    const itemVariants = {
        hidden: { opacity: 0, y: 12 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.15 }
        }
    };


    async function fetchClientInfo(clientId) {
        try {
            const res = await fetch(
                `https://ntouber-user.zeabur.app/v1/users/${clientId}`
            );
            if (!res.ok) throw new Error("取得使用者失敗");

            const data = await res.json();

            return {
                name: data.Name,
                avatar: data.AvatarURL,
                Email: data.Email,
                PhoneNumber: data.PhoneNumber,
            };
        } catch (err) {
            console.error("取得乘客資訊錯誤:", err);
            return {
                name: "尚未有乘客請求",
                avatar: null,
            };
        }
    }

    async function fetchPosts() {
        try {
            setLoading(true);
            const url = `https://ntouber-post.zeabur.app/api/posts/search/${user.ID}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error("搜尋貼文失敗");

            const posts = await res.json();

            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setMyPosts(posts);
            setLoading(false);
        } catch (err) {
            console.error("Posts fetch error:", err);
        }
    }

    // useEffect(() => {
    //     if (myPosts.length > 0) {
    //         console.log("所有貼文資料 myPosts:", myPosts);
    //     }
    // }, [myPosts]);


    useEffect(() => {
        if (user?.ID) fetchPosts();
    }, [user]);

    useEffect(() => {
        async function loadClientInfo() {
            const clientIds = [
                ...new Set(myPosts.filter(p => p.client_id).map(p => p.client_id))
            ].filter(id => !clientMap[id]);

            if (clientIds.length === 0) return;

            const results = await Promise.all(
                clientIds.map(id =>
                    fetchClientInfo(id).then(info => ({ id, info }))
                )
            );

            const newMap = {};
            results.forEach(r => {
                newMap[r.id] = r.info;
            });

            setClientMap(prev => ({ ...prev, ...newMap }));
        }

        if (myPosts.length > 0) loadClientInfo();
    }, [myPosts, clientMap]);




    const driverPosts = myPosts.filter((p) => p.driver_id === user.ID);
    const passengerPosts = myPosts.filter((p) => p.client_id === user.ID);

    const StatusBadge = ({ status }) => {
        const colors = {
            open: "bg-green-200 text-green-700 border border-green-300",
            matched: "bg-yellow-200 text-yellow-700 border border-yellow-300",
            closed: "bg-gray-200 text-gray-700 border border-gray-300",
        };

        const text = {
            open: "開放中",
            matched: "匹配中",
            closed: "已關閉",
        };

        return (
            <span
                className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${colors[status]}`}
            >
                {text[status]}
            </span>
        );
    };

    async function acceptPost(post) {
        await fetch(`https://ntouber-post.zeabur.app/api/posts/driver_posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "closed" })
        });

        if (post.client_id && user.ID) {
            const message = `您的共乘請求 ${post.starting_point.Name} > ${post.destination.Name} 已被車主 ${user.Name || '已匹配'} 接受！請去"我的貼文"查看:)`;

            await sendNotification({
                receiverId: post.client_id, // 接收方: 乘客 ID
                senderId: user.ID,          // 發送方: 車主/目前用戶 ID
                message: message,
            });
        }

        alert("已接受共乘，貼文已關閉！");
        fetchPosts();
    }



    async function rejectPost(post) {
        await fetch(`https://ntouber-post.zeabur.app/api/posts/driver_posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: "unknown",
                status: "open",
            })
        });

        if (post.client_id && user.ID) {
            const message = `很抱歉，您的共乘請求 ${post.starting_point.Name} > ${post.destination.Name} 被車主 ${user.Name || '拒絕'} 拒絕了，貼文已重新開放。`;

            await sendNotification({
                receiverId: post.client_id, // 接收方: 乘客 ID
                senderId: user.ID,            // 發送方: 車主/目前用戶 ID
                message: message,
            });
        }

        alert("你已拒絕共乘，貼文已重新開放！");
        fetchPosts();
    }


    const renderPosts = (posts) => (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            variants={listVariants}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.18, ease: "easeOut" }}
        >
            {posts.map(post => (
                <motion.div
                    key={post.id}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="relative"
                >
                    <div className="absolute right-3 top-3 z-10">
                        <StatusBadge status={post.status} />
                    </div>

                    {activeTab === "driver" && post.client_id && (
                        <div className="relative px-2 mb-1">
                            <div
                                className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePassengerId(
                                        activePassengerId === post.client_id
                                            ? null
                                            : post.client_id
                                    );
                                }}
                            >
                                <img
                                    src={
                                        clientMap[post.client_id]?.avatar ||
                                        "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                    }
                                    alt="avatar"
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="font-medium text-gray-800">乘客：</span>
                                <span>
                                    {clientMap[post.client_id]?.name || "載入中..."}
                                </span>
                            </div>

                            {/*  浮動小卡ㄎㄚ */}
                            {activePassengerId === post.client_id && (
                                <PassengerPopover
                                    passenger={clientMap[post.client_id]}
                                    onClose={() => setActivePassengerId(null)}
                                />
                            )}
                        </div>
                    )}


                    <PostCard postData={post} />

                    {activeTab === "driver" && post.status === "matched" && (
                        <div className="flex gap-2 mt-3 px-2">
                            <button
                                onClick={() => acceptPost(post)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600 transition"
                            >
                                ✔ 接受
                            </button>
                            <button
                                onClick={() => rejectPost(post)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                                ✖ 拒絕
                            </button>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
    function EmptyState({ text }) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-20 text-gray-500"
            >
                <p className="text-lg font-medium">{text}</p>
                <p className="text-sm mt-2 text-gray-400">
                    有新的貼文時會顯示在這裡
                </p>
            </motion.div>
        );
    }


    return (
        <motion.div
            className="p-5 max-w-4xl mx-auto"
            onClick={() => setActivePassengerId(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
        >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">目前貼文</h2>

            <div className="flex gap-10 mb-6 border-b border-gray-300 pb-2 text-lg font-medium">
                <button
                    className={`pb-2 transition ${activeTab === "driver"
                        ? "text-purple-600 border-b-4 border-purple-600 font-bold"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("driver")}
                >
                    🚗 車主貼文
                </button>

                <button
                    className={`pb-2 transition ${activeTab === "passenger"
                        ? "text-purple-600 border-b-4 border-purple-600 font-bold"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("passenger")}
                >
                    🙋 乘客貼文
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "driver" && (
                    <motion.div
                        key="driver"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25 }}
                    >
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : driverPosts.length === 0 ? (
                            <EmptyState text="目前沒有車主貼文喔!!!" />
                        ) : (
                            renderPosts(driverPosts)
                        )}

                    </motion.div>
                )}

                {activeTab === "passenger" && (
                    <motion.div
                        key="passenger"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.25 }}
                    >
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : passengerPosts.length === 0 ? (
                            <EmptyState text="目前沒有乘客貼文喔 🙋" />
                        ) : (
                            renderPosts(passengerPosts)
                        )}

                    </motion.div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

export default CurrentPost;
