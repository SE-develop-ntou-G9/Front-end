import React from "react";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext.jsx";

function SideBar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { isLoggedIn, userRole, user, refreshUserData } = useUser();

    // 測試用：降級回乘客（僅用於開發測試）
    const handleToggleRole = async () => {
        // 這裡應該要有降級的 API，暫時不實作
        alert("降級功能需要後端 API 支援");
        await refreshUserData();
    };

    return (
        <>
            {isOpen && (
                <>
                    {/* SideBar */}
                    <aside
                        className={`
                            fixed top-0 left-0 h-full bg-white shadow-lg z-20 p-4
                            transform transition-transform duration-300 ease-in-out
                            w-full md:w-64
                            ${isOpen ? "translate-x-0" : "-translate-x-full"}
                        `}
                    >
                        {/* SideBar 的 Header */}
                        <div className="flex items-center justify-center border-b pb-2 relative h-11">
                            <button
                                className="absolute left-0 text-gray-600 text-2xl"
                                onClick={onClose}
                            >
                                <HiMenu />
                            </button>

                            <h1 className="font-bold text-gray-800 text-center text-xl md:hidden">NTOUber</h1>
                        </div>

                        <nav className="flex flex-col items-center mt-6 space-y-6 text-lg">
                            <button
                                className="hover:text-purple-600"
                                onClick={() => {
                                    navigate("/");
                                    onClose();
                                }}
                            >
                                首頁
                            </button>

                            <button
                                className="hover:text-purple-600"
                                onClick={() => {
                                    navigate("/Profile");
                                    onClose();
                                }}
                            >
                                個人頁面
                            </button>

                            <button
                                className="hover:text-purple-600"
                                onClick={onClose}
                            >
                                目前貼文
                            </button>

                            {isLoggedIn ? (
                                <>
                                    <p className="text-gray-500 text-sm mb-2">
                                        目前身分：{userRole || "乘客"}
                                    </p>

                                    {userRole === "乘客" ? (
                                        <button
                                            className="hover:text-purple-600"
                                            onClick={() => {
                                                navigate("/Regist");
                                                onClose();
                                            }}
                                        >
                                            升級成車主
                                        </button>
                                    ) : (
                                        <button
                                            className="text-gray-400 cursor-not-allowed"
                                            disabled
                                        >
                                            您已是車主
                                        </button>
                                    )}
                                </>
                            ) : (
                                <button
                                    className="hover:text-purple-600"
                                    onClick={() => {
                                        navigate("/login");
                                        onClose();
                                    }}
                                >
                                    登入 / 註冊
                                </button>
                            )}

                            {/* 測試用：切換回乘客 */}
                            {userRole === "車主" && (
                                <button
                                    className="hover:text-purple-600 text-sm text-gray-500"
                                    onClick={handleToggleRole}
                                >
                                    (測試) 切換回乘客
                                </button>
                            )}
                        </nav>
                    </aside>
                </>
            )}
        </>
    );
}

export default SideBar;
