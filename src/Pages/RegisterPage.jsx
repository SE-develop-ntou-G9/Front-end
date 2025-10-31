import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserClass from "../models/UserClass";

function RegisterPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(
        new UserClass("", "", "", "", "", "")
    );

    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser({
        ...user,
        [name]: value
        })
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const normalized = new UserClass(
            user.userName.trim(),
            user.password,
            user.phone,
            user.carType.trim(),
            user.licenseNum.trim().toUpperCase(),
            user.email
        )
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
        const updatedUsers = [...existingUsers, normalized];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        
        alert(`註冊成功！
                姓名：${normalized.userName}
                Email：${normalized.email}
                電話：${normalized.phone || "-"}
                車型：${normalized.carType || "-"}
                車牌：${normalized.licenseNum || "-"}`
        );

    // 清空表單
    setUser(new UserClass("", "", "", "", "", ""));
    // if(navigate) navigate("/login");
  };




    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-6 w-80 border border-gray-200">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                    註冊帳號
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">使用者名稱</label>
                        <input
                            type="text"
                            name="userName"
                            value={user.userName}
                            onChange={handleChange}
                            placeholder="User Name"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">電子郵件</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
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
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>


                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">車型</label>
                        <input
                            type="text"
                            name="carType"
                            value={user.carType}
                            onChange={handleChange}
                            placeholder="車型"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">車牌</label>
                        <input
                            type="text"
                            name="licenseNum"
                            value={user.licenseNum}
                            onChange={handleChange}
                            placeholder="車牌"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>


                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                        >
                        註冊帳號
                    </button>

                </form>
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
