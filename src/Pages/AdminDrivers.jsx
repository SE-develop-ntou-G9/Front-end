import React, { useEffect, useState } from "react";
import DriverClass from "../models/DriverClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

const API = "https://ntouber-user.zeabur.app/v1/drivers";

export default function AdminDrivers() {
    const navigate = useNavigate();
    const [drivers, setdriver] = useState([]);

    const handleDelete = async (userId) => {
        // 刪除request貼文
        // 刪除車主
        if (!window.confirm(`確定要刪除用戶 ID: ${userId} 嗎？此操作不可逆！`)) {
            return;
        }
        
        try {
            const r = await fetch(`${API}/delete/${userId}`, { method: "DELETE" });

            if (!r.ok) {
                // 嘗試讀取錯誤訊息（如果後端有提供）
                const errorData = await r.json();
                throw new Error(`刪除失敗 (${r.status}): ${errorData.error || '未知錯誤'}`);
            }

            // 成功刪除後，更新前端 UI 狀態，移除該用戶
            setUser(prevUsers => prevUsers.filter(u => u.ID !== userId));
            console.log(`用戶 ${userId} 刪除成功`);

        } catch (err) {
            console.error("刪除用戶失敗：", err);
            alert(`刪除失敗：${err.message}`);
        }
    };

    useEffect(() => {
        async function fetchDrivers() {
            try {
                const r = await fetch(`${API}/getAll`, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(driver => new DriverClass(driver));
                setdriver(mapped);
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
                            placeholder="Search for user"
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
                    <h2 className="text-base font-bold text-gray-900">所有用戶</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看系統中的所有使用者</p>
                </div>

                {/* 用戶列表 */}
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
                                
                                // ✨ 新增 Flex 佈局類別
                                flex 
                                justify-between // 使左右內容分散對齊
                                items-center    // 使內容垂直居中
                            "
                        >
                            <div className="flex items-center space-x-3">
                                
                                {/* <img 
                                    src={u.avatarUrl || '預設圖片路徑'} 
                                    alt={u.name}
                                    className="h-10 w-10 rounded-full object-cover"
                                /> */}

                                <p className="font-medium">{d.name}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                                
                                <button
                                    onClick={() => handleBlacklist(d.userID)} //尚未實作
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
                                
                                {/* 2.2 刪除按鈕 */}
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
