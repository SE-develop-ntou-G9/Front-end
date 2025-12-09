import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard.jsx";
import PostClass from "../models/PostClass";
import { useUser } from "../contexts/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
import CardPresent from "./Functions/CardPresent";
import PostSearch from "./Functions/PostSearch.jsx";

const API = "https://ntouber-post.zeabur.app/api/posts/all";

function UserPage() {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const { user, userRole, isAdmin } = useUser();
    const [myHistoryPosts2, setMyHistoryPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const r = await fetch(API, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }
                const data = await r.json();
                const mapped = data.map(post => new PostClass(post));
                // console.log(mapped.driver_id);
                setPost(mapped);
            } catch (err) {
                console.error("抓取貼文失敗：", err);
            }
        }

        fetchPosts();
    }, []
    );
    useEffect(() => {
        if (!user?.ID) return;

        async function fetchMyHistory() {
            try {
                const url = `https://ntouber-post.zeabur.app/api/posts/search/${user.ID}`;
                const res = await fetch(url);

                if (!res.ok) throw new Error("搜尋歷史紀錄失敗");

                const posts = await res.json();

                posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                setMyHistoryPosts(posts);
            } catch (err) {
                console.error("歷史紀錄抓取失敗：", err);
            }
        }

        fetchMyHistory();
    }, [user]);


    const handleSearchResult = (resultArray) => {
        const mapped = resultArray.map(p => new PostClass(p));
        setPost(mapped);
    };



    return (
        <>

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 pb-16">

                    {/* 搜尋欄 */}
                    {/* <div className="mt-4">
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
                    </div> */}

                    <PostSearch onResult={handleSearchResult} />

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
                    <CardPresent post={post} isAdmin={isAdmin} />


                    {/* 我的共乘紀錄 */}
                    <div className="mt-10">
                        <h2 className="text-lg font-bold text-gray-900">我的共乘紀錄</h2>
                        <p className="text-xs text-gray-500 mt-0.5">查看你過去的共乘記錄</p>

                        {myHistoryPosts2.length === 0 ? (
                            <div className="mt-4 p-6 bg-white rounded-xl border shadow-sm text-center text-gray-500">
                                🗂️ 目前沒有任何共乘紀錄
                            </div>
                        ) : (
                            <ul className="mt-4 space-y-4">
                                {myHistoryPosts2.map((postItem, index) => (
                                    <li
                                        key={index}
                                        className="group flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm 
                               hover:shadow-md hover:-translate-y-1 transition-transform cursor-pointer"
                                    >
                                        {/* Icon 區 */}
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-600 text-xl">
                                            🏍️
                                        </div>

                                        {/* 內文區 */}
                                        <div className="flex-1">
                                            <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition">
                                                {postItem.starting_point.Name} → {postItem.destination.Name}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md">
                                                    {postItem.driver_id === user.ID ? "車主" : "乘客"}
                                                </span>
                                                <span>{new Date(postItem.departure_time).toLocaleString("zh-TW")}</span>
                                            </div>
                                        </div>

                                        {/* 狀態 Badge */}
                                        <div>
                                            <span
                                                className={`
                                text-xs px-3 py-1 rounded-full border font-medium
                                ${postItem.status === "closed"
                                                        ? "bg-gray-200 text-gray-700 border-gray-300"
                                                        : postItem.status === "matched"
                                                            ? "bg-yellow-200 text-yellow-700 border-yellow-300"
                                                            : "bg-green-200 text-green-700 border-green-300"
                                                    }
                            `}
                                            >
                                                {postItem.status === "closed"
                                                    ? "已完成"
                                                    : postItem.status === "matched"
                                                        ? "已匹配"
                                                        : "開放中"}
                                            </span>
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
