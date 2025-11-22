import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage({ isLoggedIn, setIsLoggedIn }) {
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [driverData, setDriverData] = useState(null);
    const [loading, setLoading] = useState(true);

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    useEffect(() => {
        if (!isLoggedIn || !userId) {
            setLoading(false);
            return;
        }
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${userId}`);
            if (!res.ok) throw new Error("使用者資料取得失敗");

            const data = await res.json();
            setUserData(data);

            fetchDriverData();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function fetchDriverData() {
        try {
            const res = await fetch(`https://ntouber-user.zeabur.app/v1/drivers/user/${userId}`);

            if (res.ok) {
                const driver = await res.json();
                setDriverData(driver);
                localStorage.setItem("userRole", "車主");
            } else {
                setDriverData(null);
                localStorage.setItem("userRole", "乘客");
            }
        } catch (err) {
            console.error("driver error:", err);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("driver");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");

        setIsLoggedIn(false);
        navigate("/login");
    };

    const storedRole = localStorage.getItem("userRole") || "乘客";

    if (loading) {
        return (
            <div className="text-center py-20 text-gray-500 text-lg">
                讀取資料中...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            {/* ======== 未登入（訪客）畫面 ======== */}
            {!isLoggedIn && (
                <div className="animate-fadeIn">
                    {/* 上方黑色 Header */}
                    <div className="bg-black text-white py-10 px-6 flex flex-col items-center shadow-md">
                        <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
                            ?
                        </div>
                        <h1 className="mt-4 text-2xl font-semibold">訪客</h1>
                        <p className="text-gray-300 text-sm">尚未登入帳號</p>
                    </div>

                    {/* 白色浮動卡片 */}
                    <div className="
            max-w-md mx-auto mt-8 bg-white rounded-2xl shadow-xl 
            p-6 border border-gray-100
            transform transition-all duration-300 hover:scale-[1.01]
        ">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-lg font-medium">
                                登入以查看更多個人資料
                            </p>
                        </div>

                        {/* Skeleton 灰色三條 */}
                        <div className="space-y-4 mt-4">
                            <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                            <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                            <div className="h-4 bg-gray-200/70 rounded-lg shimmer"></div>
                        </div>

                        <button
                            onClick={() => navigate("/login")}
                            className="mt-8 w-full py-3 bg-black text-white rounded-lg text-base 
                hover:bg-gray-800 transition shadow-sm"
                        >
                            前往登入
                        </button>
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
            )}


            {/* ======== 已登入畫面 ======== */}
            {isLoggedIn && userData && (
                <>
                    {/* 上方黑色卡片 */}
                    <div className="bg-black text-white py-10 px-6 flex flex-col items-center shadow-md">
                        <div className="w-20 h-20 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                            {userData?.picture ? (
                                <img
                                    src={userData.picture}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-3xl font-bold">
                                    {userData?.Name?.charAt(0) || "?"}
                                </span>
                            )}
                        </div>

                        <h1 className="mt-4 text-2xl font-semibold">{userData?.Name}</h1>

                        <p className="text-gray-300 text-sm">{userData?.Email}</p>
                        <p className="text-gray-400 text-xs mt-1">
                            登入方式：{userData?.Provider || "未知"}
                        </p>
                    </div>

                    {/* 白色卡片 */}
                    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md mt-6 p-6 space-y-5 border border-gray-200">

                        <div>
                            <label className="block text-sm text-gray-500">電話號碼</label>
                            <p className="text-base font-semibold">
                                {userData?.PhoneNumber || "尚未新增電話號碼"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500">車子型號</label>
                            <p className="text-base font-semibold">
                                {driverData?.scooter_type || "尚未新增車子型號"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500">車牌</label>
                            <p className="text-base font-semibold">
                                {driverData?.plate_num || "尚未新增車牌"}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500">使用者角色</label>
                            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${storedRole === "車主"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                                }`}>
                                {storedRole}
                            </span>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <button
                                onClick={() => navigate("/EditProfile")}
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
                    </div>

                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 underline hover:text-gray-800 transition"
                        >
                            返回首頁
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default ProfilePage;
