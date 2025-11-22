import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../contexts/UserContext.jsx";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useUser();

    const handleGoogleSuccess = async (response) => {
        try {
            const credential = response.credential;

            const res = await fetch("https://ntouber-user.zeabur.app/v1/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential })
            });

            if (!res.ok) throw new Error("驗證 Google 失敗");

            const data = await res.json();
            const user = data.user;
            const token = data.token;

            console.log("登入成功:", data);

            // 使用 Context 的 login 方法（這會自動 fetchUserData）
            await login(user, token);

            // login 完成後，Context 中的 user 已經更新
            // 但我們需要再次查詢以確保有最新資料
            const fullUser = await fetchFullUserInfo(user.id);

            if (!fullUser) {
                alert("無法取得使用者資料");
                return;
            }

            // 檢查是否需要補充資料
            if (!fullUser.PhoneNumber || fullUser.PhoneNumber.trim() === "") {
                alert(`歡迎 ${fullUser.Name || user.name} 第一次登入！請先設定聯絡方式～`);
                navigate("/EditProfile");
                return;
            }

            alert(`歡迎回來，${fullUser.Name}！`);
            navigate("/");

        } catch (error) {
            console.error("Google OAuth 發生錯誤：", error);
            alert("登入失敗，請稍後再試");
        }
    };

    async function fetchFullUserInfo(userId) {
        try {
            // 不帶 Authorization header
            const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${userId}`);

            if (!res.ok) {
                console.error("取得使用者資料失敗", await res.text());
                return null;
            }

            const data = await res.json();
            return data;

        } catch (err) {
            console.error("fetchFullUserInfo error:", err);
            return null;
        }
    }

    const handleGoogleError = () => {
        alert("Google 登入失敗，請重試。");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
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

                <button
                    className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                >
                    log in
                </button>

                <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="px-2 text-gray-500 text-sm">或使用</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                <div className="flex justify-center">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                    />
                </div>

                <div className="mt-3 text-sm flex justify-between text-gray-600">
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
