import React from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-6 w-80 border border-gray-200">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                    註冊帳號
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">使用者名稱</label>
                    <input
                        type="text"
                        placeholder="User Name"
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">電子郵件</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* 電話號碼 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                        電話號碼
                    </label>
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">密碼</label>
                    <input
                        type="password"
                        placeholder="Password"
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">再次輸入密碼</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>


                <button
                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                >
                    註冊帳號
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/login")}
                        className="underline ml-1 hover:text-gray-800"
                    >
                        返回登入
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
