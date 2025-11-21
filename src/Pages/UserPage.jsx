import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import PostClass from "../models/PostClass";
import { useNavigate } from "react-router-dom";

const API = "https://ntouber-post.zeabur.app/api/posts/all";

function UserPage({ setIsLoggedIn, isLoggedIn, userRole }) {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();

    // 測試資料集開始
    // const mockPosts = [
    //     {
    //         origin: "海大校門口",
    //         destination: "基隆火車站",
    //         time: "2025-10-20T09:00",
    //         meetingPoint: "圖書館前",
    //         contact: "0912-345-678",
    //         helmet: true,
    //         note: "順路上班,有安全帽可借",
    //     },
    //     {
    //         origin: "基隆夜市",
    //         destination: "海大宿舍",
    //         time: "2025-10-21T18:00",
    //         meetingPoint: "仁愛市場口",
    //         contact: "0987-654-321",
    //         helmet: false,
    //         note: "夜市逛完順路回宿舍",
    //     },
    //     {
    //         origin: "海大操場",
    //         destination: "八斗子",
    //         time: "2025-10-22T14:30",
    //         meetingPoint: "體育館門口",
    //         contact: "0900-112-233",
    //         helmet: true,
    //         note: "想去海邊看海!",
    //     },
    // ];
    // useEffect(() => {
    //     localStorage.setItem("posts", JSON.stringify(mockPosts));
    //     setPosts(mockPosts);
    // }, []);
    //測試資料集終點


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

    // const deletePost = () => {
    //     setPosts([]);
    //     localStorage.removeItem("posts");
    // }

    // 建立測試用的 post 物件
    // const post = new PostClass({
    //     driver_id: 'user123',
    //     vehicle_info: null,
    //     status: "open",
    //     timestamp: "2025-11-09T05:33:28.610Z",

    //     starting_point: {
    //         Name: "海大校門",
    //         Address: "基隆市中正區"
    //     },

    //     destination: {
    //         Name: "基隆火車站",
    //         Address: "基隆市仁愛區"
    //     },

    //     meet_point: {
    //         Name: "北門",
    //         Address: "基隆市北門"
    //     },

    //     departure_time: "2025-11-09T05:34:00.000Z",

    //     notes: "尋找同路人！",
    //     description: "路上可以一起聊聊天!",
    //     helmet: false,

    //     contact_info: {},

    //     leave: false
    // });

    return (
        <>
            {/* 測試用切換按鈕 */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setIsLoggedIn(false)}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                    {isLoggedIn ? "登出" : "登入"}
                </button>
            </div>

            {/* 灰灰白白的背板 */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 pb-16">

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

                        <div className="mt-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-gray-900">最新共乘邀請</h2>
                                <p className="text-xs text-gray-500 mt-0.5">查查看其他用戶的共乘請求</p>
                            </div>


                            {userRole === "車主" ? (
                                <button
                                    className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                                    onClick={() => navigate("/uploadPost")}
                                >
                                    + 發布共乘貼文
                                </button>
                            ) : (
                                <p className="text-xs text-gray-400 italic">
                                    升級成車主後可發布共乘邀請
                                </p>
                            )}
                        </div>

                    </div>

                    {/* 把卡片塞進來這下面 */}

                        <div className="grid grid-cols-2 gap-4">
                        {post.length === 0 ? (
                            <p className="text-sm text-gray-500">目前沒有共乘貼文</p>
                        ) : (
                            post.map((post) => (
                            <PostCard
                                key={post.driver_id} // 先用 id，沒有就用 driver_id 或 index
                                postData={post}// 傳給 PostCard
                            />
                            ))
                        )}
                        </div>
                    {/* 我的共乘紀錄 */}
                    <div className="mt-6">
                        <h2 className="text-base font-bold text-gray-900">我的共乘紀錄</h2>
                        <p className="text-xs text-gray-500 mt-0.5">查看你過去的共乘記錄</p>

                        {post.length === 0 ? (
                            <div className="mt-3 p-4 bg-white rounded-lg border shadow-sm text-center text-gray-500">
                                目前沒有共乘記錄
                            </div>
                        ) : (
                            <ul className="mt-3 space-y-3">
                                {/* 迴圈 */}
                                {post.map((post, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm"
                                    >
                                        <span className="text-2xl">🚗</span> {/*天竺鼠車車 */}
                                        <div className="text-sm text-gray-800 text-left flex-1">
                                            <div className="font-medium">
                                                {post.starting_point.Name} → {post.destination.Name} {/*哪裡到哪裡 */}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(post.time).toLocaleString('zh-TW')} {/*時間*/}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>


                </div>
            </div>

        </>
    )
}

export default UserPage;
