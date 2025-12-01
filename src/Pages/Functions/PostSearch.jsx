import React, { useState } from "react";
import { HiSwitchVertical, HiSearch } from "react-icons/hi";
import { FaMapMarkerAlt, FaRegCircle, FaRegCalendarAlt } from "react-icons/fa";

const PostSearch = () => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [meetTime, setMeetTime] = useState("");

    const handleSwap = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    const handleSearch = () => {
        console.log("搜尋條件：", { from, to, meetTime });
    };

    return (
        <div className="mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full">

                {/* 整體：左邊內容 + 右邊獨立搜尋容器 */}
                <div className="flex gap-4">

                    {/* ===== 左側：起點 / 交換 / 終點 / 集合時間 ===== */}
                    <div className="flex-1 space-y-4">

                        {/* 第一行：起點 */}
                        <div className="flex items-center gap-3">
                            <FaRegCircle className="text-green-500 text-base" />

                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="起點例子：海大正門 / INS201"
                                className="flex-1 h-11 bg-gray-100 text-gray-800 text-sm px-3 rounded-xl
                                           border border-transparent focus:bg-white focus:border-green-500 
                                           focus:ring-2 focus:ring-green-100 outline-none transition placeholder-gray-400"
                            />
                        </div>

                        {/* 第二行：交換（獨立一層置中） */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSwap}
                                className="p-3 rounded-full bg-white hover:bg-gray-100 text-gray-600 
                                           hover:text-purple-600 transition active:scale-95 shadow-sm"
                                title="交換起點與終點"
                            >
                                <HiSwitchVertical className="text-xl" />
                            </button>
                        </div>

                        {/* 第三行：終點 */}
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-red-500 text-base" />

                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="終點例子：宿舍 / ECG301"
                                className="flex-1 h-11 bg-gray-100 text-gray-800 text-sm px-3 rounded-xl
                                           border border-transparent focus:bg-white focus:border-red-500 
                                           focus:ring-2 focus:ring-red-100 outline-none transition placeholder-gray-400"
                            />
                        </div>

                        {/* 第四行：集合時間 */}
                        <div className="flex items-center gap-3">
                            <FaRegCalendarAlt className="text-blue-500 text-base" />

                            <input
                                type="datetime-local"
                                value={meetTime}
                                onChange={(e) => setMeetTime(e.target.value)}
                                className="flex-1 h-11 bg-gray-100 text-gray-800 text-sm px-3 rounded-xl
                                           border border-transparent focus:bg-white focus:border-blue-500 
                                           focus:ring-2 focus:ring-blue-100 outline-none transition placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* ===== 右側：獨立搜尋容器（上下都不貼任何一行） ===== */}
                    <div className="w-14 flex items-center justify-center">
                        <button
                            onClick={handleSearch}
                            className="p-3 rounded-full bg-gray-100 text-gray-500
                                       hover:bg-gray-200 active:scale-95 transition shadow-md"
                            title="搜尋"
                        >
                            <HiSearch className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostSearch;
