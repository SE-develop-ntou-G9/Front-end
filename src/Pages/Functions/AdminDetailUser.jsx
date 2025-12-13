import React, { useState } from "react"; 
import { useNavigate, useLocation } from "react-router-dom";
import useAdminUserActions from "../hooks/useAdminUserActions";

export default function AdminDetailUser() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blacklistReason, setBlacklistReason] = useState('');
    const userData = state?.user; 
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

    const { handleUserDelete, handleUserBlacklist } = useAdminUserActions(null, navigate);
    // console.log("email", userData.Email);
    // 處理確認黑名單
    const handleConfirmBlacklist = async () => {
        if (!blacklistReason.trim()) {
            alert('請務必填寫加入黑名單的理由！'); 
            return;
        }
        await handleUserBlacklist(userData, blacklistReason.trim());
        setIsModalOpen(false);
        setBlacklistReason('');
    };
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

               {/* 管理操作按鈕 */}
                <div className="mt-6 flex space-x-3">
                    <button
                        onClick={() => setIsModalOpen(true)} 
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
                        //  使用 Hook 提供的 handleDelete
                        onClick={() => handleUserDelete(userData)}
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
                                    setBlacklistReason(''); // 取消時清空輸入
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