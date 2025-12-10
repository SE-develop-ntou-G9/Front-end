import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import PostClass from "../models/PostClass";
import CardPresent from "./Functions/cardPresent";
import PostSearch from "./Functions/PostSearch";

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

    const handleSearchResult = (resultArray) => {
        const mapped = resultArray.map(p => new PostClass(p));
        setPost(mapped);
    };


    return (
        <>
            {/* 測試用切換按鈕
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setIsLoggedIn(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                    {isLoggedIn ? "登出" : "登入"}
                </button>
            </div> */}

            {/* 灰灰白白的背板 */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-xl mx-auto px-4 pb-16">

                    {/* 搜尋欄 */}
                    <PostSearch onResult={handleSearchResult} />

                    {/* 標題區 */}
                    <div className="mt-5">
                        <h2 className="text-base font-bold text-gray-900">最新共乘邀請</h2>
                        <p className="text-xs text-gray-500 mt-0.1">查查看其他用戶的共乘請求</p>
                    </div>

                    {/* 把卡片塞進來這下面 */}

                    <CardPresent post={post} />

                </div>
            </div>

        </>
    )
}

export default GuestPage;
