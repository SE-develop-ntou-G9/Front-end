import React, { useEffect, useState } from "react";
import DriverClass from "../models/DriverClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import useAdminDriverActions from "../Pages/hooks/useAdminDriverActions";

import { fetchUserById } from "./hooks/useUserFetcher.jsx";

const API = "https://ntouber-user.zeabur.app/v1/drivers";

const Avatar = ({ user }) => (
    <div className="w-10 h-10 rounded-full flex-shrink-0">
        {user?.AvatarURL ? (
            <img
                src={user.AvatarURL}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
            />
        ) : (
            <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold">
                {user?.Name ? user.Name.charAt(0) : "..."}
            </div>
        )}
    </div>
);

export default function AdminDrivers() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const { handleDriverDelete, handleBlacklist } =
        useAdminDriverActions(setDrivers);
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const r = await fetch(`${API}/getAll`, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map((driver) => new DriverClass(driver));
                const verifiedDrivers = mapped.filter(
                    (d) => d.status == "verified"
                );

                setDrivers(verifiedDrivers);

                const userIds = [
                    ...new Set(verifiedDrivers.map((d) => d.userID)),
                ];
                userIds.forEach(async (id) => {
                    if (!userMap[id]) {
                        const userData = await fetchUserById(id);
                        if (userData) {
                            setUserMap((prev) => ({ ...prev, [id]: userData }));
                        }
                    }
                });
            } catch (err) {
                console.error("抓取driver失敗：", err);
            }
        }

        fetchDrivers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 pb-16">
                {/* 返回貼文 */}
                <button
                    className="text-sm text-gray-600 mt-3"
                    onClick={() => navigate(-1)}
                >
                    ← 返回貼文
                </button>

                {/* 搜尋欄 */}
                <div className="mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for driver"
                            className="
                                w-full 
                                pl-4 pr-10 py-3 
                                rounded-2xl 
                                bg-purple-100/60 
                                placeholder-gray-500 
                                outline-none
                            "
                        />
                        <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
                    </div>
                </div>

                {/* 標題 */}
                <div className="mt-6">
                    <h2 className="text-base font-bold text-gray-900">
                        認證車主
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        查看系統中的所有認證車主
                    </p>
                </div>

                {/* 車主列表 */}
                <div className="mt-4 space-y-4">
                    {drivers.map((d) => {
                        const user = userMap[d.userID];
                        return (
                            <div
                                key={d.userID}
                                className="
                                bg-white 
                                rounded-lg 
                                p-4 
                                shadow-sm 
                                border 
                                text-sm 
                                text-gray-800
                                flex 
                                justify-between 
                                items-center
                            "
                            >
                                {/*  點擊導航到詳細頁面 */}
                                <div
                                    className="flex-1 cursor-pointer flex items-center space-x-3"
                                    onClick={() =>
                                        navigate("/admin/DetailDriver", {
                                            state: { driver: d },
                                        })
                                    }
                                >
                                    <Avatar user={user} />
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            用戶名：{d.name}
                                        </p>
                                        <p className="mt-1 text-gray-600 text-xs">
                                            車型：{d.scooterType} / 車牌：
                                            {d.plateNum}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleBlacklist(d)}
                                        className="
                                        px-3 py-1 
                                        bg-yellow-500 hover:bg-yellow-600 
                                        text-white text-xs 
                                        rounded-full 
                                        transition-colors
                                    "
                                    >
                                        黑名單
                                    </button>

                                    <button
                                        onClick={() => handleDriverDelete(d)}
                                        className="
                                        px-3 py-1 
                                        bg-red-500 hover:bg-red-600 
                                        text-white text-xs 
                                        rounded-full 
                                        transition-colors
                                    "
                                    >
                                        刪除
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
