import React, { useEffect, useState } from "react";
import UserClass from "../models/UserClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import useAdminUserActions from "../Pages/hooks/useAdminUserActions";

const uAPI = "https://ntouber-user.zeabur.app/v1/users";

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUser] = useState([]);
    const [userData, setTmpUser] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blacklistReason, setBlacklistReason] = useState('');
    const { handleUserDelete, handleUserBlacklist } = useAdminUserActions(setUser);
    
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

    // 處理確認黑名單
    const handleConfirmBlacklist = async () => {
        if (!blacklistReason.trim()) {
            alert('請務必填寫加入黑名單的理由！'); 
            return;
        }
        await handleUserBlacklist(userData, blacklistReason.trim());
        setIsModalOpen(false);
        setBlacklistReason('');
        setTmpUser(null);
    };
    

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
                            <div 
                                className="flex items-center space-x-3 cursor-pointer" 
                                onClick={() => navigate("/admin/DetailUser", { state: { user: u } })}
                            >
                                
                                <img 
                                    src={u.avatarUrl || '預設圖片路徑'} 
                                    alt={u.userName}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                
                                <p className="font-medium">{u.userName}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                                
                                <button
                                    onClick={() => {setIsModalOpen(true);setTmpUser(u)}} 
                                    className="
                                        px-3 py-1 
                                        bg-yellow-500 hover:bg-yellow-600 
                                        text-white text-xs 
                                        rounded-full 
                                        transition-colors
                                    "
                                >
                                    加入黑名單
                                </button>
                                
                                {/* 2.2 刪除按鈕 */}
                                <button
                                    onClick={() => handleUserDelete(u)}
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
             {/*黑名單理由輸入彈窗*/}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">加入黑名單：輸入理由</h3>
                        
                        <div className="mb-4">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                                用戶 {userData.userName} (ID: {userData.ID})
                            </label>
                            <textarea
                                id="reason"
                                rows="4"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                placeholder="請填寫加入黑名單的具體理由，此為必填項目。"
                                value={blacklistReason}
                                onChange={(e) => setBlacklistReason(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setBlacklistReason(''); 
                                    setTmpUser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleConfirmBlacklist}
                                className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
                            >
                                確認加入黑名單
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
