import React from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useUser } from "../contexts/UserContext.jsx";
import { jwtDecode } from "jwt-decode";


function LoginPage() {
    const navigate = useNavigate();
    const { login, refreshUserData } = useUser();

    async function isBlacklisted(userId) {
        try {
            const res = await fetch("https://ntouber-admin.zeabur.app/admin/blacklist", { method: "GET" });
            if (!res.ok) throw new Error(`黑名單 API 錯誤 (${res.status})`);
            const list = await res.json();

            if (!Array.isArray(list)) return false;

            return list.some((b) => String(b.userId) === String(userId));
        } catch (err) {
            console.error("檢查黑名單失敗：", err);
            return false;
        }
    }

    const handleGoogleSuccess = async (response) => {
        try {

            const credential = response.credential;

            const googleUser = jwtDecode(credential);
            const googlePicture = googleUser.picture;


            const res = await fetch("https://ntouber-user.zeabur.app/v1/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential })
            });

            if (!res.ok) throw new Error("驗證 Google 失敗");

            const data = await res.json();
            const user = data.user;

            const blocked = await isBlacklisted(user.id);
            if (blocked) {
                alert("此帳號已被加入黑名單，無法登入。");
                return;
            }

            const fullUser = await fetchFullUserInfo(user.id);

            const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

            console.log(googlePicture);
            await login({
                ...user,
                AvatarURL: fullUser.AvatarURL || googlePicture || DEFAULT_AVATAR || null
            });


            if (!fullUser) {
                alert("無法取得使用者資料");
                return;
            }

            if (fullUser.Admin == 1) {
                alert(`歡迎管理員 ${fullUser.Name}！`);
                navigate("/admin");
                window.location.reload();
                return;
            }

            if (!fullUser.PhoneNumber || fullUser.PhoneNumber.trim() === "") {
                alert(`歡迎 ${fullUser.Name || user.name} 第一次登入！請先設定聯絡方式～`);
                navigate("/EditProfile");
                window.location.reload();
                return;
            }

            alert(`歡迎回來，${fullUser.Name}！`)
            navigate("/");
            window.location.reload();

        } catch (error) {
            console.error("Google OAuth 發生錯誤：", error);
            alert("登入失敗，請稍後再試");
        }
    };

    async function fetchFullUserInfo(userId) {
        try {
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
        <div className="min-h-screen flex items-center justify-center
    bg-gradient-to-br from-gray-100 via-white to-gray-200">






            <div className="bg-white/90 backdrop-blur-md shadow-2xl 
            rounded-2xl px-10 py-8 w-[380px] border border-blue-100">

                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <img
                        src="data:image/png;base64,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"
                        className="w-20 h-20 object-contain drop-shadow-md"
                    />

                    <h1 className="text-2xl font-bold text-[#003D79] mt-3 tracking-wide">
                        NTOUber
                    </h1>

                    <p className="text-sm text-gray-600 mt-1">
                        使用 Google 帳號快速登入系統
                    </p>
                </div>

                {/* Google Button */}
                <div className="flex justify-center my-4">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => alert("Google 登入失敗")}
                    />
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 mt-4">
                    登入即代表您同意 NTOUber 系統使用條款與隱私政策
                </div>
            </div>
        </div>
    );

}

export default LoginPage;
