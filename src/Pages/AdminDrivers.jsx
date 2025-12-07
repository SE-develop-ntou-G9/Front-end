// fileName: AdminDrivers.jsx (重構)

import React, { useEffect, useState } from "react";
import DriverClass from "../models/DriverClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import useAdminDriverActions from "../Pages/hooks/useAdminDriverActions"; // <--- 導入 Hook

const API = "https://ntouber-user.zeabur.app/v1/drivers";

export default function AdminDrivers() {
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]); // <--- 修正變數名稱
    const { handleDelete, handleBlacklist } = useAdminDriverActions(setDrivers); // <--- 使用 Hook

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const r = await fetch(`${API}/getAll`, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(driver => new DriverClass(driver));
                
                //  篩選出已通過審核 (verified) 的車主
                const verifiedDrivers = mapped.filter(d => d.status == 'verified');
                
                setDrivers(verifiedDrivers); // <--- 修正變數名稱
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
                    <h2 className="text-base font-bold text-gray-900">認證車主</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看系統中的所有認證車主</p>
                </div>

                {/* 車主列表 */}
                <div className="mt-4 space-y-4">
                    {drivers.map((d) => (
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
                            {/* 🚀 點擊導航到詳細頁面 */}
                            <div 
                                className="flex items-center space-x-3 cursor-pointer"
                                onClick={() => navigate("/admin/DetailDriver", { state: { driver: d } })}
                            >
                                <p className="font-medium">{d.name}</p>
                                <p className="text-gray-500 text-xs">({d.plateNum})</p>
                            </div>
                            
                            <div className="flex space-x-2">
                                
                                <button
                                    onClick={() => handleBlacklist(d.userID)}
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
                                    onClick={() => handleDelete(d.userID)}
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
                    ))}
                </div>

            </div>
        </div>
    );
}