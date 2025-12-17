import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

function ProfilePage() {
    const navigate = useNavigate();
    const { user, driver, isLoggedIn, userRole, loading, logout } = useUser();
    const [showAvatarPreview, setShowAvatarPreview] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        console.group("ProfilePage 載入");
        console.log("isLoggedIn:", isLoggedIn);
        console.log("user:", user);
        console.log("driver:", driver);
        console.log("userRole:", userRole);
        console.groupEnd();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">載入資料中...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            className="min-h-screen bg-gray-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
        >
            {/* Debug 資訊 */}
            {/* {showDebugInfo()} */}

            {/* ======== 未登入（訪客）畫面 ======== */}
            <AnimatePresence mode="wait">
                {!isLoggedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >

                        <motion.div
                            className="bg-black text-white py-10 px-6 flex flex-col items-center shadow-md"
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >

                            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
                                ?
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold">訪客</h1>
                            <p className="text-gray-300 text-sm">尚未登入帳號</p>
                        </motion.div>

                        <div className="max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 transform transition-all duration-300 hover:scale-[1.01]">
                            <div className="text-center mb-6">
                                <p className="text-gray-600 text-lg font-medium">
                                    登入以查看更多個人資料
                                </p>
                            </div>

                            <div className="space-y-4 mt-4">
                                <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                                <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                                <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                            </div>

                            <button
                                onClick={() => navigate("/login")}
                                className="mt-8 w-full py-3 bg-black text-white rounded-lg text-base hover:bg-gray-800 transition shadow-sm"
                            >
                                前往登入
                            </button>
                        </div>

                        <div className="text-center mt-6">
                            <button
                                onClick={() => navigate("/")}
                                className="text-gray-500 underline hover:text-gray-800 transition"
                            >
                                返回首頁
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ======== 已登入畫面 ======== */}
                {isLoggedIn && user && (
                    <>
                        <motion.div
                            className="bg-black text-white py-10 px-6 flex flex-col items-center shadow-md"
                            initial={{ opacity: 0, y: 24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.5,
                                ease: [0.22, 1, 0.36, 1], // 高級感關鍵
                            }}
                        >

                            <motion.div
                                className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center"
                                onClick={() => setShowAvatarPreview(true)}
                                initial={{ scale: 0.8, opacity: 0, filter: "blur(6px)" }}
                                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >

                                {user?.AvatarURL ? (
                                    <img
                                        src={user.AvatarURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold">
                                        {user?.Name?.charAt(0) || "?"}
                                    </span>
                                )}
                            </motion.div>

                            <h1 className="mt-4 text-2xl font-semibold">{user?.Name || "使用者"}</h1>
                            <p className="text-gray-300 text-sm">{user?.Email || "無Email"}</p>
                            <p className="text-gray-400 text-xs mt-1">
                                登入方式：{user?.Provider || "未知"}
                            </p>
                        </motion.div>

                        <motion.div
                            className="max-w-md mx-auto bg-white rounded-2xl shadow-md mt-6 p-6 space-y-5 border border-gray-200"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.4 }}
                        >
                            <div>
                                <label className="block text-sm text-gray-500">使用者 ID</label>
                                <p className="text-base font-semibold text-xs text-gray-400">
                                    {user?.ID || "無ID"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500">電話號碼</label>
                                <p className="text-base font-semibold">
                                    {user?.PhoneNumber || "尚未新增電話號碼"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500">車子型號</label>
                                <p className="text-base font-semibold">
                                    {driver?.scooter_type || "尚未新增車子型號"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500">車牌</label>
                                <p className="text-base font-semibold">
                                    {driver?.plate_num || "尚未新增車牌"}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-500">使用者角色</label>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${userRole === "車主"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {userRole || "乘客"}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => navigate("/EditProfile")}
                                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                                >
                                    編輯資料
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-3 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition"
                                >
                                    登出
                                </button>
                            </div>
                        </motion.div>

                        <div className="text-center mt-6">
                            <button
                                onClick={() => navigate("/")}
                                className="text-gray-500 underline hover:text-gray-800 transition"
                            >
                                返回首頁
                            </button>
                        </div>
                    </>
                )}

            </AnimatePresence >
            <AnimatePresence>
                {showAvatarPreview && user?.AvatarURL && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/70 overflow-auto"
                        style={{ overscrollBehavior: "contain" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setZoom(1);
                            setShowAvatarPreview(false);
                        }}
                    >

                        <div className="min-h-screen flex items-center justify-center p-10">
                            <motion.img
                                src={user.AvatarURL}
                                alt="Avatar Preview"
                                className="rounded-2xl shadow-2xl cursor-zoom-in select-none"
                                style={{
                                    width: "60vw",
                                    maxWidth: "600px",
                                    transform: `scale(${zoom})`,
                                    transformOrigin: "center center",
                                    transition: "transform 0.12s ease-out",
                                }}
                                onClick={(e) => e.stopPropagation()}
                                onWheelCapture={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setZoom(prev => {
                                        const delta = e.deltaY > 0 ? -0.15 : 0.15;
                                        return Math.min(Math.max(prev + delta, 0.5), 4);
                                    });
                                }}
                            />
                        </div>


                        <button
                            className="fixed top-6 right-6 text-white text-3xl hover:opacity-80"
                            onClick={() => {
                                setZoom(1);
                                setShowAvatarPreview(false);
                            }}
                        >
                            ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>


        </motion.div>

    );
}

export default ProfilePage;
