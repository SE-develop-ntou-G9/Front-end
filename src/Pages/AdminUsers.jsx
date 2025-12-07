import React, { useEffect, useState } from "react";
import UserClass from "../models/UserClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

const uAPI = "https://ntouber-user.zeabur.app/v1/users";
const dAPI = "https://ntouber-user.zeabur.app/v1/drivers";
const pAPI = "https://ntouber-post.zeabur.app/api/posts/delete/";
// del user post 待實作

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUser] = useState([]);

    const handleDelete = async (userId) => {
        if (!window.confirm(`確定要刪除用戶 ID: ${userId} 嗎？此操作不可逆！`)) {
            return;
        }
        
        try {
            const r = await fetch(`${uAPI}/delete/${userId}`, { method: "DELETE" });
            const a = await fetch(`${dAPI}/delete/${userId}`, { method: "DELETE" })

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

        const handleBlacklist = async (userId) => {

        if (!window.confirm(`確定要把用戶 ${userId} 加入黑名單嗎？`)) return;

        try {
            const r = await fetch("https://ntouber-admin.zeabur.app/admin/blacklist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    reason: "violation",
                }),
            });

            if (!r.ok) {
                // 嘗試讀取錯誤訊息（如果後端有提供）
                const errorData = await r.json();
                throw new Error(`加入黑名單失敗 (${r.status}): ${errorData.error || '未知錯誤'}`);
            }

            const data = await r.json().catch(() => null);
            console.log(`用戶 ${userId} 加入黑名單成功:`, data);

        } catch (err) {
            console.error("加入黑名單失敗：", err);
            alert(`加入黑名單失敗：${err.message}`);
        }
    };

    useEffect(() => {
        async function fetchUsers() {
            try {
                const r = await fetch(`${uAPI}/getAll`, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(user => new UserClass(user));
                setUser(mapped);
            } catch (err) {
                console.error("抓取user失敗：", err);
            }
        }

        fetchUsers();
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
                    {users.map((u) => (
                        <div
                            key={u.ID} 
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
                                
                                <img 
                                    src={u.avatarUrl || '預設圖片路徑'} 
                                    alt={u.userName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />

                                <p className="font-medium">{u.userName}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                                
                                <button
                                    onClick={() => handleBlacklist(u.ID)} //尚未實作
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
                                    onClick={() => handleDelete(u.ID)}
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
