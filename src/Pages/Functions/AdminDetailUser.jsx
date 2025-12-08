
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAdminUserActions from "../hooks/useAdminUserActions";

export default function AdminDetailUser() {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    // 從 state 中取得傳遞過來的用戶資料
    const userData = state?.user; 

    // 如果沒有資料，顯示錯誤訊息並提供返回按鈕
    if (!userData) {
        return (
            <div className="p-4">
                <p className="text-red-500">沒有收到用戶資料</p>
                <button
                    className="text-sm text-gray-600 mt-3"
                    onClick={() => navigate(-1)}
                >
                    ← 返回用戶列表
                </button>
            </div>
        );
    }

    const { handleDelete, handleBlacklist } = useAdminUserActions(null, navigate);
    // console.log("email", userData.Email);
    // 實作 handleDeleteUser 或 handleBlacklist 邏輯（可參考 AdminUsers.jsx）
    // ...

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            
            {/* 返回按鈕 */}
            <button
                className="text-sm text-gray-600 mt-3 mb-6"
                onClick={() => navigate(-1)}
            >
                ← 返回用戶列表
            </button>

            <h2 className="text-xl font-bold mb-4">用戶詳細資料 - {userData.userName}</h2>
            
            <div className="bg-white p-6 rounded-lg shadow space-y-3">
                
                <div className="flex items-center space-x-4">
                    <img 
                        src={userData.avatarUrl || '預設圖片路徑'} 
                        alt={userData.userName}
                        className="h-20 w-20 rounded-full object-cover border border-gray-200"
                    />
                    <div className="flex flex-col">
                        <p className="text-lg font-bold">{userData.userName}</p>
                        <p className="text-sm text-gray-500">用戶 ID: {userData.ID}</p>
                    </div>
                </div>

                <hr className="my-3"/>

                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">電子郵件:</span> 
                    {userData.Email || "未提供"}
                </p>

                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">電話:</span> 
                    {userData.phone || "未提供"}
                </p>

                {/* <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">建立時間:</span> 
                    {new Date(userData.createdAt).toLocaleDateString()}
                </p> */}
                
                {/* * 這裡可以新增更多詳細資訊，例如：
                  * 帳號狀態 (是否黑名單)、駕駛/乘客身份、發文數量等。
                */}

                {/* 管理操作按鈕 */}
                <div className="mt-6 flex space-x-3">
                    <button
                        // 🚀 使用 Hook 提供的 handleBlacklist
                        onClick={() => handleBlacklist(userData.ID)} 
                        className="
                            flex-1 
                            px-3 py-2 
                            bg-yellow-500 hover:bg-yellow-600 
                            text-white text-sm 
                            rounded-lg 
                            transition-colors
                        "
                    >
                        加入黑名單
                    </button>
                    <button
                        // 🚀 使用 Hook 提供的 handleDelete
                        onClick={() => handleDelete(userData.ID)}
                        className="
                            flex-1 
                            px-3 py-2 
                            bg-red-500 hover:bg-red-600 
                            text-white text-sm 
                            rounded-lg 
                            transition-colors
                        "
                    >
                        刪除用戶
                    </button>
                </div>

            </div>
        </div>
    );
}