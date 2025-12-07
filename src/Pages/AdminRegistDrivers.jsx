import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

export default function AdminRegistDrivers() {
    const navigate = useNavigate();

    // 假裝一下
    const [drivers] = useState([
        {
            id: 1,
            name: "淤蛇萬",
            scooter: "Yamaha BWS",
            plate: "ABC-1234"
        },
        {
            id: 2,
            name: "瓜騎兔",
            scooter: "Kymco GP",
            plate: "XYZ-5678"
        },
        {
            id: 3,
            name: "Tony9737",
            scooter: "Gogoro S2",
            plate: "EEE-9527"
        },
    ]);

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
                    <h2 className="text-base font-bold text-gray-900">審核車主</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看申請車主資格的使用者</p>
                </div>

                <div className="mt-4 space-y-4">
                    {drivers.map((d) => (
                        <div
                            key={d.id}
                            className="
                                bg-white 
                                rounded-lg 
                                p-4 
                                shadow-sm 
                                border 
                                text-sm 
                                text-gray-800
                            "
                        >
                            <p className="font-medium">用戶名：{d.name}</p>
                            <p className="mt-1 text-gray-600">車型：{d.scooter}</p>
                            <p className="text-gray-600">車牌：{d.plate}</p>

                            <div className="flex gap-3 mt-4">

                                <button
                                    className="
                                        flex-1 py-2 
                                        bg-green-600 text-white 
                                        rounded-full shadow-sm 
                                        hover:bg-green-700 
                                        transition text-sm
                                    "
                                >
                                    通過審核
                                </button>

                                <button
                                    className="
                                        flex-1 py-2 
                                        bg-red-600 text-white 
                                        rounded-full shadow-sm 
                                        hover:bg-red-700 
                                        transition text-sm
                                    "
                                >
                                    拒絕
                                </button>

                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
