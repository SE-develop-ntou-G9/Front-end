import React from "react";
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function LoginPage() {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">

            {/* 登入的那個框框 */}
            <div className="bg-white shadow-md rounded-lg p-6 w-80 border border-gray-200">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                    登入畫面
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">帳號</label>
                    <input
                        type="text"
                        placeholder="User Name"
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

                {/* 登入按鈕 */}
                <button
                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                >
                    log in
                </button>

                {/* 註冊帳號 記密碼那個 */}
                <div className="mt-3 text-sm flex justify-between text-gray-600">
                    <button
                        onClick={() => navigate("/Regist")}
                        className="underline hover:text-gray-800"
                    >
                        建立帳號?
                    </button>

                    <div className="flex gap-4">
                        <a href="#" className="underline hover:text-gray-800">
                            忘記密碼？
                        </a>
                        <a href="#" className="underline hover:text-gray-800">
                            管理員？
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
