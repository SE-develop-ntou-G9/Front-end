import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import DriverClass from "../models/DriverClass";
import useAdminDriverActions from "../Pages/hooks/useAdminDriverActions";
import { fetchUserById } from "./hooks/useUserFetcher.jsx";

const authHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

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

const API = "https://ntouber-gateway.zeabur.app/v1/drivers";

export default function AdminRegistDrivers() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]); // <--- 修正狀態初始化
    const [rdrivers, setRDrivers] = useState([]); // tmp reject driver
    const { handleVerify } = useAdminDriverActions(setDrivers); // <--- 被我拔掉了
    const [userMap, setUserMap] = useState({});

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const r = await fetch(`${API}/getAll`, {
                    headers: {
                        ...authHeader(),
                    }, method: "GET"
                });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(driver => new DriverClass(driver));

                // 篩選出待審核 (checking) 的車主
                const checkingDrivers = mapped.filter(d => d.status == "checking");
                const rDrivers = mapped.filter(c => c.status == "rejected");
                // console.log("drivers", checkingDrivers)
                setDrivers(checkingDrivers);
                setRDrivers(rDrivers);

                const allDriverIds = [...new Set([...checkingDrivers, ...rDrivers].map(d => d.userID))];
                allDriverIds.forEach(async (id) => {
                    if (!userMap[id]) {
                        const userData = await fetchUserById(id);
                        if (userData) {
                            setUserMap(prev => ({ ...prev, [id]: userData }));
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

                <button
                    className="text-sm text-gray-600 mt-3"
                    onClick={() => navigate(-1)}
                >
                    ← 返回貼文
                </button>

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

                <div className="mt-6">
                    <h2 className="text-base font-bold text-gray-900">審核車主 ({drivers.length})</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看申請車主資格的使用者</p>
                </div>

                <div className="mt-4 space-y-4">
                    {drivers.map((d) => {
                        const user = userMap[d.userID];
                        return (
                            <div
                                key={d.userID} // <--- 修正 key
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
                                {/*  點擊導航到詳細審核頁面 */}
                                <div
                                    className="flex-1 cursor-pointer flex items-center space-x-3"
                                    onClick={() => navigate("/admin/DetailRegistDriver", { state: { driver: d } })}
                                >
                                    <Avatar user={user} />
                                    <div>
                                        <p className="font-medium">用戶名：{d.name}</p>
                                        <p className="mt-1 text-gray-600 text-xs">車型：{d.scooterType} / 車牌：{d.plateNum}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {/* <div className="mt-6">
                    <h2 className="text-base font-bold text-gray-900">重新審核車主 ({drivers.length})</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看重新申請車主資格的使用者</p>
                </div> */}

            </div>
        </div>
    );
}