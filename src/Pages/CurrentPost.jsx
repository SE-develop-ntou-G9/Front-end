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
    const [activePostId, setActivePostId] = useState(null);
    const [popoverPos, setPopoverPos] = useState(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false); 
    const [rejectReason, setRejectReason] = useState("");             
    const [postToReject, setPostToReject] = useState(null);           

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
        setLoading(true);
        try {
            const url = `https://ntouber-post.zeabur.app/api/posts/search/${user.ID}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error("搜尋貼文失敗");

            const posts = await res.json();

            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setMyPosts(posts);
        } catch (err) {
            console.error("Posts fetch error:", err);
            setMyPosts([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        function handleClickOutside(e) {
            if (!activePostId) return;

            const popover = document.getElementById("passenger-popover");
            if (popover && !popover.contains(e.target)) {
                setActivePostId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activePostId]);

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
            const message = `行程通知: 您的共乘請求已被接受！
            行程：${post.starting_point.Name} > ${post.destination.Name}
            車主：${user.Name}
            請去"我的貼文"查看:)`;
           

            await sendNotification({
                receiverId: post.client_id, // 接收方: 乘客 ID
                senderId: user.ID,          // 發送方: 車主/目前用戶 ID
                message: message,
            });
        }

        alert("已接受共乘，貼文已關閉！");
        fetchPosts();
    }



async function rejectPost(post, reason) {
    const previousClientId = post.client_id;

    try {
        const res = await fetch(`https://ntouber-post.zeabur.app/api/posts/driver_posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: "unknown",
                status: "open",
            })
        });

        if (!res.ok) throw new Error("更新貼文狀態失敗");

        if (res.ok && previousClientId && user.ID) {
            const message = `行程通知: 您的共乘請求已被拒絕。
            行程：${post.starting_point.Name} > ${post.destination.Name}
            車主：${user.Name} 拒絕理由：
            ${reason || "未提供特定理由"}`;
            
            await sendNotification({
                receiverId: previousClientId,
                senderId: user.ID,
                message: message,
            });
        }

        alert("已拒絕共乘請求，理由已傳送給乘客。");
        fetchPosts();
        
    } catch (error) {
        console.error("拒絕請求失敗:", error);
        alert("操作失敗，請稍後再試。");
    }
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
                    whileHover={
                        activePostId === post.id
                            ? undefined
                            : { y: -6, scale: 1.01 }
                    }
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

                                    if (!post.client_id || post.client_id === "unknown") return;
                                    if (!clientMap[post.client_id]) return;

                                    const rect = e.currentTarget.getBoundingClientRect();

                                    setPopoverPos({
                                        top: rect.bottom + 8,
                                        left: rect.left,
                                    });

                                    setActivePostId(
                                        activePostId === post.id ? null : post.id
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
                            {activePostId === post.id && (
                                // <div
                                //     className="fixed inset-0 z-40"
                                //     onClick={(e) => {
                                //         if (e.target === e.currentTarget) {
                                //             setActivePostId(null);
                                //         }
                                //     }}
                                // >

                                <PassengerPopover
                                    passenger={clientMap[post.client_id]}
                                    position={popoverPos}
                                    onClose={() => setActivePostId(null)}
                                />

                                // </div>
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
                                onClick={() => {
                                    setPostToReject(post);      // 設定目前要處理的貼文
                                    setIsRejectModalOpen(true); // 打開彈窗
                                }}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                                ✖ 拒絕請求
                            </button>
                        </div>
                    )}
                </motion.div>
            ))
            }
        </motion.div >
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
            {/* 拒絕理由彈窗 */}
            <AnimatePresence>
                {isRejectModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-2">請輸入拒絕理由</h3>
                            <p className="text-sm text-gray-500 mb-4">這項理由將會傳送給發起請求的乘客。</p>
                            
                            <textarea
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition resize-none h-32"
                                placeholder="例如：行程臨時有變、車位已滿..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                            />

                            <div className="flex space-x-3 mt-6">
                                <button
                                    className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition"
                                    onClick={() => {
                                        setIsRejectModalOpen(false);
                                        setRejectReason("");
                                    }}
                                >
                                    取消
                                </button>
                                <button
                                    className={`flex-1 py-2.5 rounded-xl font-medium transition ${
                                        rejectReason.trim() 
                                        ? "bg-red-500 text-white hover:bg-red-600" 
                                        : "bg-red-200 text-white cursor-not-allowed"
                                    }`}
                                    disabled={!rejectReason.trim()}
                                    onClick={() => {
                                        rejectPost(postToReject, rejectReason);
                                        setIsRejectModalOpen(false);
                                        setRejectReason("");
                                    }}
                                >
                                    確認拒絕
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </motion.div>
    );
}

export default CurrentPost;
