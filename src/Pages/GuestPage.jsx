import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import PostClass from "../models/PostClass";

const API = "https://ntouber-post.zeabur.app/api/posts/all";
function GuestPage({ setIsLoggedIn, isLoggedIn }) {
    const [post, setPost] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const r = await fetch(API, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                // data 應該是一個貼文陣列（後端回傳的那種結構）
                // 如果你希望每筆都變成 PostClass：
                const mapped = data.map(post => new PostClass(post));
                setPost(mapped);
            } catch (err) {
                console.error("抓取貼文失敗：", err);
            }
        }

        fetchPosts();
    }, []);

// const post = new PostClass({
//         driver_id: 'user123',
//         vehicle_info: null,
//         status: "open",
//         timestamp: "2025-11-09T05:33:28.610Z",

//         starting_point: {
//             Name: "海大校門",
//             Address: "基隆市中正區"
//         },

//         destination: {
//             Name: "基隆火車站",
//             Address: "基隆市仁愛區"
//         },

//         meet_point: {
//             Name: "北門",
//             Address: "基隆市北門"
//         },

//         departure_time: "2025-11-09T05:34:00.000Z",

//         notes: "尋找同路人！",
//         description: "路上可以一起聊聊天!",
//         helmet: false,

//         contact_info: {},

//         leave: false
//     });


    return (     
        <>
            {/* 測試用切換按鈕 */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setIsLoggedIn(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                    {isLoggedIn ? "登出" : "登入"}
                </button>
            </div>

            {/* 灰灰白白的背板 */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-xl mx-auto px-4 pb-16">

                    {/* 搜尋欄 */}
                    <div className="mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a ride"
                                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-purple-100/60 placeholder-gray-500 outline-none"
                            />
                            <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
                        </div>
                    </div>

                    {/* 標題區 */}
                    <div className="mt-5">
                        <h2 className="text-base font-bold text-gray-900">最新共乘邀請</h2>
                        <p className="text-xs text-gray-500 mt-0.1">查查看其他用戶的共乘請求</p>
                    </div>

                    {/* 把卡片塞進來這下面 */}
                    {post.length === 0 ? (
                        <p className="text-sm text-gray-500">目前沒有共乘貼文</p>
                    ) : (
                        post.map((post) => (
                        <PostCard
                            key={post.id} // 先用 id，沒有就用 driver_id 或 index
                            postData={post}// 傳給 PostCard
                        />
                        ))
                    )}



                </div>
            </div>

        </>
    )
}

export default GuestPage;
