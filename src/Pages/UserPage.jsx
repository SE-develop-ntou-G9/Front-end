import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import PostClass from "../models/PostClass";
import { useUser } from "../contexts/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
import CardPresent from "./Functions/cardPresent";

const API = "https://ntouber-post.zeabur.app/api/posts/all";

function UserPage() {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const { userRole, logout } = useUser();


    useEffect(() => {
        async function fetchPosts() {
            try {
                const r = await fetch(API, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(post => new PostClass(post));
                setPost(mapped);
            } catch (err) {
                console.error("抓取貼文失敗：", err);
            }
        }

        fetchPosts();
    }, []);



    return (
        <>
            {/* 測試用登出按鈕
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                    登出
                </button>
            </div> */}

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 pb-16">

                    {/* 搜尋欄 */}
                    <div className="mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="搜尋共乘、路線、地點…"
                                className="w-full pl-4 pr-11 py-3 
                                       rounded-2xl 
                                       bg-white/60 backdrop-blur-sm 
                                       shadow-sm border border-gray-200
                                       placeholder-gray-500 focus:ring-2 focus:ring-purple-300 
                                       transition"
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
                    <CardPresent post={post} />

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
                                {post.map((postItem, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm"
                                    >
                                        <span className="text-2xl">🚗</span>
                                        <div className="text-sm text-gray-800 text-left flex-1">
                                            <div className="font-medium">
                                                {postItem.starting_point.Name} → {postItem.destination.Name}
                                            </div>
                                            <div className="text-gray-500 text-xs">
                                                {new Date(postItem.departure_time).toLocaleString('zh-TW')}
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
