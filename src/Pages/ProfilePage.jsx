import React from "react";
import { useNavigate } from "react-router-dom";
import PostClass from "../models/PostClass";

function ProfilePage({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const user = {
        name: "馬小眼",
        email: "ming@example.com",
        phone: "0912-345-678",
        role: "乘客",
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 上方黑色那陀*/}
            <div className="bg-black text-white py-10 px-6 flex flex-col items-center shadow-md">
                {/* 那顆頭 */}
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
                    {isLoggedIn ? user.name.charAt(0) : "?"}
                </div>
                <h1 className="mt-4 text-2xl font-semibold">
                    {isLoggedIn ? user.name : "訪客"}
                </h1>
                <p className="text-gray-300 text-sm">
                    {isLoggedIn ? user.email : "尚未登入帳號"}
                </p>
            </div>

            {/* 下方白色內容卡 */}
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md mt-6 p-6 space-y-5 border border-gray-200">
                {isLoggedIn ? (
                    <>
                        {/* 使用者的資料 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500">電話號碼</label>
                            <p className="text-base font-semibold">{user.phone}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-500">使用者角色</label>
                            <span
                                className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${user.role === "駕駛"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {user.role}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => alert("編輯功能沒做")}
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
                    </>
                ) : (
                    <>
                        {/* 未登入狀態 */}
                        <div className="text-center">
                            <p className="text-gray-500">請先登入以查看個人資料</p>
                            <button
                                onClick={() => navigate("/login")}
                                className="mt-4 w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                            >
                                前往登入
                            </button>
                        </div>

                        {/* 下面那三條 */}
                        <div className="mt-6 space-y-3">
                            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </>
                )}
            </div>

            {/* 返回首頁 */}
            <div className="text-center mt-6">
                <button
                    onClick={() => navigate("/")}
                    className="text-gray-500 underline hover:text-gray-800 transition"
                >
                    返回首頁
                </button>
            </div>
        </div>
    );
}

export default ProfilePage;
