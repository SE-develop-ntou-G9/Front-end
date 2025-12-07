import React from "react";
import {
    HiMenu,
    HiX,
    HiHome,
    HiUser,
    HiClipboardList,
    HiUpload,
    HiShieldCheck,
    HiLogout,
} from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext.jsx";

function SideBar({ isOpen, onClose, sidebarRef }) {
    const navigate = useNavigate();
    const { isLoggedIn, userRole, user, refreshUserData, logout } = useUser();

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleToggleRole = async () => {
        alert("降級功能需要後端 API 支援");
        await refreshUserData();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
        onClose();
    };

    return (
        <>
            {/* 🔹 Black Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
                    onClick={onClose}
                ></div>
            )}

            {/* 🔹 Drawer SideBar */}
            <aside
                ref={sidebarRef}
                className={`fixed left-0 top-0 h-full w-72 bg-white 
                            shadow-2xl z-30 p-5 
                            transform transition-transform duration-300 ease-in-out
                            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >

                {/* 🔸 Header：User Info */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={user?.AvatarURL || "https://placehold.co/200x200"}
                            className="w-12 h-12 rounded-full shadow object-cover"
                        />
                        <div>
                            <p className="font-semibold text-gray-900">{user?.Name || "訪客"}</p>
                            <p className="text-xs text-gray-500">
                                {userRole || "未登入"}
                            </p>
                        </div>
                    </div>

                    <button onClick={onClose}>
                        <HiX className="text-2xl text-gray-600" />
                    </button>
                </div>

                {/* 🔸 Nav Section */}
                <nav className="flex flex-col space-y-4">

                    <MenuItem label="首頁" icon={<HiHome />} onClick={() => navigate("/")} onClose={onClose} />

                    <MenuItem label="個人頁面" icon={<HiUser />} onClick={() => navigate("/Profile")} onClose={onClose} />



                    {/* 車主功能 */}
                    {isLoggedIn && (
                        <>
                            <MenuItem label="目前貼文" icon={<HiClipboardList />} onClick={() => navigate("/Current")} onClose={onClose} />
                            {userRole === "乘客" ? (
                                <MenuItem
                                    label="升級成車主"
                                    icon={<HiUpload />}
                                    onClick={() => navigate("/Regist")}
                                    onClose={onClose}
                                    highlight
                                />
                            ) : (
                                <MenuItem
                                    label="您已是車主"
                                    icon={<HiUpload />}
                                    disabled={true}
                                />
                            )}
                            {isAdmin &&
                                <MenuItem
                                    label="(測試) 管理者後台"
                                    icon={<HiShieldCheck />}
                                    onClick={() => navigate("/admin")}
                                    onClose={onClose}
                                />
                            }
                            <MenuItem
                                label={isAdmin ? "切換回一般用戶" : "切換為管理員"}
                                icon={<HiShieldCheck />}
                                onClick={() => {
                                    if (isAdmin) {
                                        localStorage.removeItem("isAdmin");
                                    } else {
                                        localStorage.setItem("isAdmin", "true");
                                    }
                                    window.location.reload();
                                }}
                                onClose={onClose}
                            />
                        </>

                    )}

                    {/* (測試功能) 切換車主 & 管理員 */}
                    {/* {userRole === "車主" && (
                        <MenuItem
                            label="(測試) 切換回乘客"
                            icon={<HiUpload />}
                            onClick={handleToggleRole}
                            onClose={onClose}
                        />
                    )} */}



                    {/* 登入 / 登出 */}
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
            </aside>
        </>
    );
}

/* 🔸 抽出選單元件 */
function MenuItem({ label, icon, onClick, onClose, danger, disabled, highlight }) {
    return (
        <button
            disabled={disabled}
            onClick={() => {
                if (onClick) onClick();
                if (onClose) onClose();
            }}
            className={`
                w-full flex items-center gap-3 p-3 rounded-xl text-left
                transition-all
                ${danger ? "text-red-600 hover:bg-red-50" :
                    disabled ? "text-gray-400 cursor-not-allowed" :
                        highlight ? "text-purple-700 bg-purple-100 hover:bg-purple-200" :
                            "text-gray-700 hover:bg-gray-100"
                }
            `}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

export default SideBar;
