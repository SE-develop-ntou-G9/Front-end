import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../contexts/UserContext.jsx";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import { HiArrowRight, HiOutlineLocationMarker, HiOutlineCalendar, HiOutlinePhone, HiOutlineUser } from "react-icons/hi";
import { MdEdit, MdSend, MdTwoWheeler, MdClose } from "react-icons/md";
import { useUserNotify } from "../hooks/useUserNotify.jsx";
import DriverPopover from "../../components/DriverPopover.jsx";

function DetailPost() {
    const driverCardRef = useRef(null);

    const { user, isLoggedIn, userRole, loading, logout } = useUser();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { sendNotification } = useUserNotify();
    const [showDriverCard, setShowDriverCard] = useState(false);

    // 控制圖片放大
    const [isImageOpen, setIsImageOpen] = useState(false);
    const { state } = useLocation();

    const postData = state?.post;
    if (!postData) return (
        <div className="flex justify-center items-center h-screen text-gray-500">
            <p>沒有收到貼文資料</p>
        </div>
    );

    const tags = [];
    if (postData.helmet) tags.push("提供安全帽");
    if (postData.leave) tags.push("中途下車");
    const [driver, setDriver] = useState(null);
    const User_id = postData.driver_id;
    const [client, setClient] = useState(null);


    async function acceptPost() {
        await fetch(
            `https://ntouber-post.zeabur.app/api/posts/driver_posts/${postData.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "closed" })
            }
        );

        if (postData.client_id && user?.ID) {
            const message = `您的共乘請求 ${postData.starting_point.Name} > ${postData.destination.Name}
            已被車主 ${user.Name || "已匹配"} 接受！
            請去「我的貼文」查看 :)`;

            await sendNotification({
                receiverId: postData.client_id,
                senderId: user.ID,
                message,
            });
        }

        alert("已接受共乘，貼文已關閉！");
        navigate("/current-post");
    }

    async function rejectPost() {
        await fetch(
            `https://ntouber-post.zeabur.app/api/posts/driver_posts/${postData.id}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: "unknown",
                    status: "open",
                })
            }
        );

        if (postData.client_id && user?.ID) {
            const message = `很抱歉，您的共乘請求 ${postData.starting_point.Name} > ${postData.destination.Name}
            被車主 ${user.Name || "拒絕"} 拒絕了。
            貼文已重新開放。`;

            await sendNotification({
                receiverId: postData.client_id,
                senderId: user.ID,
                message,
            });
        }

        alert("你已拒絕共乘，貼文已重新開放！");
        navigate("/current-post");
    }
    useEffect(() => {
        if (!postData.client_id || postData.client_id === "unknown") {
            setClient(null);
            return;
        }

        async function fetchClient() {
            try {
                const res = await fetch(
                    `https://ntouber-user.zeabur.app/v1/users/${postData.client_id}`
                );
                if (!res.ok) throw new Error("取得乘客資料失敗");
                const data = await res.json();
                setClient(data);
            } catch (err) {
                console.error("❌ 載入乘客資料失敗:", err);
            }
        }

        fetchClient();
    }, [postData.client_id]);
    const postStatusMap = {
        open: {
            text: "尚未匹配",
            className: "text-gray-500",
        },
        matched: {
            text: "等待車主確認",
            className: "text-yellow-600",
        },
        closed: {
            text: "已確認",
            className: "text-green-600",
        },
    };


    useEffect(() => {
        async function fetchDriver() {
            try {
                const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${User_id}`);
                if (!res.ok) throw new Error("取得使用者資料失敗");
                const data = await res.json();
                setDriver(data);
                // console.log(User_id);
                // console.log("DriverDATA: " + data.Phone);
            } catch (err) {
                console.error("❌ 載入車主資料失敗:", err);
            }
        }
        console.log(postData.image_url);
        fetchDriver();
    }, [User_id]);
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                showDriverCard &&
                driverCardRef.current &&
                !driverCardRef.current.contains(e.target)
            ) {
                setShowDriverCard(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDriverCard]);



    const handleRequest = async () => {
        const postParams = new URLSearchParams({
            post_id: postData.id,
        });
        const postUrl = `https://ntouber-post.zeabur.app/api/posts/getpost/${postData.id}`;

        try {
            const postRes = await fetch(postUrl, { method: "GET" });
            const newPostData = await postRes.json().catch(() => ({}));

            if (!postRes.ok) {
                console.error("發送請求失敗：", newPostData);
                throw new Error(newPostData.message || `API 錯誤 (${postRes.status})`);
            }

            if (isSubmitting) return;
            if (!isLoggedIn || !user) {
                alert("請先登入再發送請求");
                return;
            }

            const params = new URLSearchParams({
                post_id: newPostData.id,
                client_id: user.ID,
            });

            if (user.ID == newPostData.driver_id) {
                alert("不能向自己發送請求");
                return;
            };

            if (newPostData.status == "matched") {
                alert("此請求已被匹配");
                navigate("/")
                return;
            };

            const url = `https://ntouber-post.zeabur.app/api/posts/request?${params.toString()}`;
            setIsSubmitting(true);

            const res = await fetch(url, { method: "PATCH" });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("發送請求失敗：", data);
                throw new Error(data.message || `API 錯誤 (${res.status})`);
            }

            console.log("發送請求成功：", data);
            const senderName = user?.Name || "某位用戶";
            const message = `${senderName} 向您的行程:
            ${newPostData.starting_point.Name} > ${newPostData.destination.Name} 發送了共乘請求。
            請去"我的貼文"查看 :)`;
            //  console.log("driver_id",newPostData.driver_id);
            //  console.log("user?.ID",user?.ID);

            await sendNotification({
                receiverId: newPostData.driver_id, // 接收方: 車主 ID
                senderId: user?.ID,                  // 發送方: 當前登入用戶 ID
                message: message,
            });
            // ----------------------------------------------------
            alert("已發送請求給車主！");
            navigate('/');

        } catch (err) {
            console.error("發送請求發生錯誤：", err);
            alert(`發送請求失敗：${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canSendRequest = isLoggedIn && user?.ID !== postData.driver_id && postData.status === "open";
    const canEditPost = isLoggedIn && user?.ID === postData.driver_id && postData.status === "open";

    // 動畫設定
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="flex justify-center min-h-screen bg-gray-50 py-8 px-4">
            <motion.article
                className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* 圖片區塊 */}
                <div
                    className="relative w-full h-64 bg-gray-200 cursor-zoom-in group"
                    onClick={() => setIsImageOpen(true)} // 點擊大容器會放大
                >
                    <img
                        src={postData?.image_url || "https://placehold.co/600x400?text=No+Image"}
                        alt="Route view"
                        className="w-full h-full object-cover transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* 提示文字 */}
                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        點擊放大
                    </div>

                    <div
                        ref={driverCardRef}
                        className="absolute bottom-4 left-4 z-10 flex items-center gap-3 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDriverCard(prev => !prev);
                        }}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                            <img
                                src={driver?.AvatarURL || "https://placehold.co/80x80"}
                                alt="driver avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex flex-col leading-tight text-white">
                            <span className="text-xs opacity-80">駕駛</span>
                            <span className="text-base font-semibold whitespace-nowrap">
                                {driver?.Name || "載入中..."}
                            </span>
                        </div>

                        {showDriverCard && (
                            <DriverPopover
                                driver={driver}
                                onClose={() => setShowDriverCard(false)}
                            />
                        )}
                    </div>
                </div>


                {/* 內容區塊 */}
                <div className="p-6 md:p-8 space-y-8">

                    {/* 路線標題 */}
                    <div className="flex flex-col items-center justify-center space-y-2 pb-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3 text-2xl font-black text-gray-800 tracking-tight">
                            <span>{postData.starting_point.Name}</span>
                            <HiArrowRight className="text-gray-400" />
                            <span>{postData.destination.Name}</span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                            {dayjs(postData.departure_time).format("YYYY/MM/DD HH:mm")} 出發
                        </span>
                    </div>

                    {/* 詳細資訊 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoItem
                            icon={<HiOutlineLocationMarker className="w-5 h-5 text-indigo-500" />}
                            label="起點地址"
                            value={postData.starting_point.Address}
                        />
                        <InfoItem
                            icon={<HiOutlineLocationMarker className="w-5 h-5 text-red-500" />}
                            label="終點地址"
                            value={postData.destination.Address}
                        />
                        <InfoItem
                            icon={<HiOutlineLocationMarker className="w-5 h-5 text-green-500" />}
                            label="集合地點"
                            value={postData.meet_point.Name}
                        />
                        <InfoItem
                            icon={<MdTwoWheeler className="w-5 h-5 text-blue-500" />}
                            label="車型資訊"
                            value={postData.vehicle_info}
                        />
                        <InfoItem
                            icon={<HiOutlinePhone className="w-5 h-5 text-gray-500" />}
                            label="聯絡電話"
                            value={driver?.PhoneNumber || "---"}
                        />
                    </div>

                    {/* 備註區塊 */}
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-600 mb-2">行程備註</h3>
                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${!postData.description ? "text-gray-400 italic" : "text-gray-600"}`}>
                            {postData.description || "暫無備註"}
                        </p>
                    </div>
                    {/* 車主Use Only：乘客Info */}
                    {userRole === "車主" && user?.ID === postData.driver_id && (
                        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">乘客請求</h3>

                            {!client && (
                                <p className="text-sm text-gray-400">目前尚無乘客請求</p>
                            )}

                            {client && (
                                <div className="flex items-center gap-4 border rounded-lg p-4">
                                    <img
                                        src={client?.AvatarURL || "https://placehold.co/80x80"}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-semibold">{client?.Name}</p>
                                        <p className="text-sm text-gray-500">{"電話號碼 : " + client?.PhoneNumber}</p>
                                        <p className="text-sm text-gray-500">{"Email : " + client?.Email}</p>
                                        <p
                                            className={`text-xs ${postStatusMap[postData.status]?.className || "text-gray-400"
                                                }`}
                                        >
                                            狀態：{postStatusMap[postData.status]?.text || "未知狀態"}
                                        </p>

                                    </div>

                                    {postData.status === "matched" && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={acceptPost}
                                                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                ✔ 確認
                                            </button>
                                            <button
                                                onClick={rejectPost}
                                                className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                ✖ 拒絕
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}



                    {/* 按鈕 */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                        {canEditPost && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                                onClick={() => navigate(`/edit-post/${postData.id}`)}
                            >
                                <MdEdit /> 編輯貼文
                            </motion.button>
                        )}

                        {canSendRequest && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-2 px-6 py-2.5 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30 transition-all ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                    }`}
                                onClick={handleRequest}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    "處理中..."
                                ) : (
                                    <>
                                        <MdSend /> 發送請求
                                    </>
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>
            </motion.article>

            {/* 圖片放大燈箱 */}
            <AnimatePresence>
                {isImageOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setIsImageOpen(false)}
                    >
                        <button
                            className="absolute top-5 right-5 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
                            onClick={() => setIsImageOpen(false)}
                        >
                            <MdClose size={24} />
                        </button>

                        <motion.img
                            src={postData?.image_url || "https://placehold.co/600x400?text=No+Image"}
                            alt="Full view"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
// 輔助組件
const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 p-2 bg-gray-50 rounded-lg shrink-0">
            {icon}
        </div>
        <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-700 break-words">{value}</p>
        </div>
    </div>
);

export default DetailPost;