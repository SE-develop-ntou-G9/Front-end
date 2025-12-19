import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAdminDriverActions from "../hooks/useAdminDriverActions";
import { fetchUserById } from "../hooks/useUserFetcher.jsx";

const Avatar = ({ user }) => (
    <div className="w-20 h-20 rounded-full flex-shrink-0">
        {user?.AvatarURL ? (
            <img
                src={user.AvatarURL}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
            />
        ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg font-bold">
                {user?.Name ? user.Name.charAt(0) : "..."}
            </div>
        )}
    </div>
);

export default function AdminDetailDriver() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const driverData = state?.driver;
    const [driverUser, setDriverUser] = useState(null);

    useEffect(() => {
        if (driverData?.userID) {
            fetchUserById(driverData.userID).then(setDriverUser);
        }
    }, [driverData]);

    if (!driverData) {
        return (
            <div className="p-4">
                <p className="text-red-500">沒有收到車主資料</p>
                <button
                    className="text-sm text-gray-600 mt-3"
                    onClick={() => navigate(-1)}
                >
                    ← 返回車主列表
                </button>
            </div>
        );
    }

    const { handleDriverDelete, handleBlacklist } = useAdminDriverActions(
        null,
        navigate
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <button
                className="text-sm text-gray-600 mt-3 mb-6"
                onClick={() => navigate(-1)}
            >
                ← 返回車主列表
            </button>

            <h2 className="text-xl font-bold mb-4">
                車主詳細資料 - {driverData.name}
            </h2>

            <div className="bg-white p-6 rounded-lg shadow space-y-3">
                <div className="flex items-center space-x-4">
                    {/* 這裡應該使用 driverData.avatarUrl 或其他圖片欄位 */}
                    <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                        <Avatar user={driverUser} />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-lg font-bold">{driverData.name}</p>
                        <p className="text-sm text-gray-500">
                            用戶 ID: {driverData.userID}
                        </p>
                    </div>
                </div>

                <hr className="my-3" />

                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">
                        聯絡資訊:
                    </span>
                    {driverData.contactInfo || "未提供"}
                </p>
                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">
                        車型:
                    </span>
                    {driverData.scooterType || "未提供"}
                </p>
                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">
                        車牌號碼:
                    </span>
                    {driverData.plateNum || "未提供"}
                </p>
                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">
                        駕駛執照:
                    </span>
                    <a
                        href={driverData.driverLicense}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                    >
                        查看圖片
                    </a>
                </p>
                <p className="text-sm">
                    <span className="font-semibold w-24 inline-block">
                        審核狀態:
                    </span>
                    <span className="text-green-600 font-bold">
                        {driverData.status}
                    </span>
                </p>

                {/* 管理操作按鈕 */}
                <div className="mt-6 flex space-x-3">
                    <button
                        onClick={() => handleBlacklist(driverData)}
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
                        onClick={() => handleDriverDelete(driverData)}
                        className="
                            flex-1 
                            px-3 py-2 
                            bg-red-500 hover:bg-red-600 
                            text-white text-sm 
                            rounded-lg 
                            transition-colors
                        "
                    >
                        刪除車主
                    </button>
                </div>
            </div>
        </div>
    );
}
