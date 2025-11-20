import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function SideBar({ isOpen, onClose, isLoggedIn, userRole, toggleRole }) {

    const navigate = useNavigate();

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
                                onClick={() => navigate("/")}
                            >首頁</button>

                            <button
                                className="hover:text-purple-600"
                                onClick={() => navigate("/Profile")}
                            >個人頁面</button>

                            <button className="hover:text-purple-600">目前貼文</button>
                            {isLoggedIn ? (
                                <>
                                    <p className="text-gray-500 text-sm mb-2">
                                        目前身分：{userRole}
                                    </p>

                                    {userRole === "乘客" ? (
                                        <button
                                            className="hover:text-purple-600"
                                            onClick={() => {
                                                // App.jsx的升級
                                                toggleRole();
                                                alert("升級成功！您現在是車主");
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
                                    onClick={() => navigate("/login")}
                                >
                                    登入 / 註冊
                                </button>
                            )}

                            {/* 測試用回去乘客的 */}
                            <button
                                className="hover:text-purple-600"
                                onClick={() => toggleRole()}
                            >
                                切換回乘客
                            </button>
                        </nav>
                    </aside>
                </>
            )
            }
        </>
    )

}
export default SideBar;