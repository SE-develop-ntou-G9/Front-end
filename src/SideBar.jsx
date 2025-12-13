import React from "react";
import {
    HiX,
    HiHome,
    HiUser,
    HiClipboardList,
    HiUpload,
    HiLogout,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

function SideBar({ isOpen, onClose, sidebarRef }) {
    const navigate = useNavigate();
    const { isLoggedIn, userRole, user, logout, driver } = useUser();

    const handleLogout = () => {
        logout();
        navigate("/login");
        onClose();
    };

    return (
        <>
            {/* 🔹 Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* 🔹 Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        ref={sidebarRef}
                        className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-30 p-5"
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.AvatarURL || "https://placehold.co/200x200"}
                                    className="w-12 h-12 rounded-full shadow object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {user?.Name || "訪客"}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {userRole || "未登入"}
                                    </p>
                                </div>
                            </div>

                            <button onClick={onClose}>
                                <HiX className="text-2xl text-gray-600" />
                            </button>
                        </div>

                        {/* Nav */}
                        <nav className="flex flex-col space-y-4">
                            <MenuItem label="首頁" icon={<HiHome />} onClick={() => navigate("/")} onClose={onClose} />
                            <MenuItem label="個人頁面" icon={<HiUser />} onClick={() => navigate("/Profile")} onClose={onClose} />

                            {isLoggedIn && (
                                <>
                                    <MenuItem
                                        label="我的貼文"
                                        icon={<HiClipboardList />}
                                        onClick={() => navigate("/Current")}
                                        onClose={onClose}
                                    />

                                    {userRole === "乘客" && (
                                        <MenuItem
                                            label={driver?.status === "rejected" ? "重新申請成為車主" : "升級成車主"}
                                            icon={<HiUpload />}
                                            onClick={() => navigate("/Regist")}
                                            onClose={onClose}
                                            highlight
                                        />
                                    )}

                                    {userRole === "審核中" && (
                                        <MenuItem label="審核中（等待通過）" icon={<HiUpload />} disabled />
                                    )}

                                    {userRole === "車主" && (
                                        <MenuItem label="您已是車主" icon={<HiUpload />} disabled />
                                    )}
                                </>
                            )}

                            {!isLoggedIn ? (
                                <MenuItem
                                    label="登入 / 註冊"
                                    icon={<HiUser />}
                                    onClick={() => navigate("/login")}
                                    onClose={onClose}
                                />
                            ) : (
                                <MenuItem
                                    label="登出"
                                    icon={<HiLogout />}
                                    danger
                                    onClick={handleLogout}
                                    onClose={onClose}
                                />
                            )}
                        </nav>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}

/* 🔹 Menu Item */
function MenuItem({ label, icon, onClick, onClose, danger, disabled, highlight }) {
    return (
        <button
            disabled={disabled}
            onClick={() => {
                onClick?.();
                onClose?.();
            }}
            className={`
        w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all
        ${danger
                    ? "text-red-600 hover:bg-red-50"
                    : disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : highlight
                            ? "text-purple-700 bg-purple-100 hover:bg-purple-200"
                            : "text-gray-700 hover:bg-gray-100"}
      `}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

export default SideBar;
