import React from "react";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext.jsx";

function SideBar({ isOpen, onClose, sidebarRef }) {
    const navigate = useNavigate();
    const { isLoggedIn, userRole, refreshUserData } = useUser();

    //先用來測試管理員
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    const handleToggleRole = async () => {
        alert("降級功能需要後端 API 支援");
        await refreshUserData();
    };

    return (
        <>
            <aside
                // 🌟 將 Ref 綁定到 <aside> 元素上
                ref={sidebarRef} 
                className={`
                    fixed top-0 left-0 h-full bg-white shadow-lg z-20 p-4
                    transform transition-transform duration-300 ease-in-out
                    w-full md:w-64
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-center border-b pb-2 relative h-11">
                    <button
                        className="absolute left-0 text-gray-600 text-2xl"
                        onClick={onClose}
                    >
                        <HiMenu />
                    </button>

                    <h1 className="font-bold text-gray-800 text-center text-xl md:hidden">
                        NTOUber
                    </h1>
                </div>

                {/* Nav */}
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
                                <button className="text-gray-400 cursor-not-allowed" disabled>
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

                    {userRole === "車主" && (
                        <button
                            className="hover:text-purple-600 text-sm text-gray-500"
                            onClick={handleToggleRole}
                        >
                            (測試) 切換回乘客
                        </button>
                    )}

                    <button
                        className="hover:text-purple-600 text-sm text-gray-500"
                        onClick={() => {
                            navigate("/admin");
                            onClose();
                        }}
                    >
                        (測試)管理者後台
                    </button>

                    <button
                        className="hover:text-purple-600 text-sm text-gray-500"
                        onClick={() => {
                            if (isAdmin) {
                                localStorage.removeItem("isAdmin");
                            } else {
                                localStorage.setItem("isAdmin", "true");
                            }
                            window.location.reload();  // 立即更新 UI
                        }}
                    >
                        {isAdmin ? "切換回一般用戶" : "切換為管理員"}
                    </button>

                </nav>
            </aside >
        </>
    );
}

export default SideBar;
