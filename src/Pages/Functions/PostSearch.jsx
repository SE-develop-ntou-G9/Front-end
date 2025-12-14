import React, { useState, useEffect } from "react";
import { HiSwitchVertical, HiSearch } from "react-icons/hi";
import { FaMapMarkerAlt, FaRegCircle, FaRegCalendarAlt } from "react-icons/fa";

const API_BASE = "https://ntouber-post.zeabur.app/api/posts";

const PostSearch = ({ onResult, resetTrigger, onSearchStart }) => {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [meetTime, setMeetTime] = useState("");
    const isSearchDisabled = !from.trim() && !to.trim() && !meetTime;
    

    useEffect(() => {
        // 判斷 > 0 是為了避免網頁剛載入時就執行 (看需求，通常沒差)
        if (resetTrigger > 0) {
            setFrom("");
            setTo("");
            setMeetTime("");
        }
    }, [resetTrigger]);

    const handleSwap = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    const handleSearch = async () => {
        if (onSearchStart) {
            onSearchStart(); 
        }
        const params = new URLSearchParams();

        if (from) params.append("start_point", from);
        if (to) params.append("end_point", to);
        if (meetTime) params.append("time", meetTime);

        params.append("partial", "true");
        params.append("limit", "50");
        params.append("offset", "0");

        const url = `${API_BASE}/search?${params.toString()}`;

        try {
            const r = await fetch(url);
            const data = await r.json();
            console.log("搜尋結果：", data);

            onResult && onResult(data);

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <div className="mt-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full">
                <div className="flex gap-4">
                    {/* 左側輸入區 */}
                    <div className="flex-1 space-y-4">
                        {/* 起點 */}
                        <div className="flex items-center gap-3">
                            <FaRegCircle className="text-green-500 text-base" />
                            <input
                                type="text"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder="起點：海大正門"
                                className="flex-1 h-11 bg-gray-100 text-gray-800 text-sm px-3 rounded-xl
                                           border border-transparent focus:bg-white focus:border-green-500 
                                           focus:ring-2 focus:ring-green-100 outline-none transition placeholder-gray-400"
                            />
                        </div>

                        {/* 交換按鈕 */}
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

                        {/* 終點 */}
                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-red-500 text-base" />
                            <input
                                type="text"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="終點：基隆火車站"
                                className="flex-1 h-11 bg-gray-100 text-gray-800 text-sm px-3 rounded-xl
                                           border border-transparent focus:bg-white focus:border-red-500 
                                           focus:ring-2 focus:ring-red-100 outline-none transition placeholder-gray-400"
                            />
                        </div>

                        {/* 集合時間 */}
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

                    {/* 右側搜尋按鈕 */}
                    <div className="w-14 flex items-center justify-center">
                        <button
                            onClick={handleSearch}
                            disabled={isSearchDisabled}
                            className={`p-3 rounded-full transition-all duration-300 shadow-md flex items-center justify-center
                                ${isSearchDisabled 
                                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"  // Disabled 樣式
                                    : "p-3 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 active:scale-95 transition shadow-md"
                                    }
                            `}
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
