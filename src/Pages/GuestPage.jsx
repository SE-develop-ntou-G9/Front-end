import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";
import { HiSearch, HiRefresh } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import PostClass from "../models/PostClass";
import CardPresent from "./Functions/CardPresent";
import PostSearch from "./Functions/PostSearch";

const API = "https://ntouber-post.zeabur.app/api/posts/all";
function GuestPage({ setIsLoggedIn, isLoggedIn }) {
    const [post, setPost] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);

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
    }, [refreshKey]);

    const handleSearchResult = (resultArray) => {
        const mapped = resultArray.map(p => new PostClass(p));
        setPost(mapped);
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);// 修改 Key，強迫 useEffect 重跑
        
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
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
                    <PostSearch 
                        onResult={handleSearchResult} 
                        resetTrigger={refreshKey}
                        // 當搜尋開始時，把 post 清空
                        onSearchStart={() => setPost([])} 
                    />


                    {/* 標題區 */}
                    <div className="mt-5">
                        <h2 className="text-base font-bold text-gray-900">最新共乘邀請</h2>
                        <p className="text-xs text-gray-500 mt-0.1">查查看其他用戶的共乘請求</p>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing} // 防止重複點擊
                            className="group flex items-center gap-1.5 px-3 py-1.5 
                                    bg-white border border-gray-200 rounded-lg 
                                    text-xs font-medium text-gray-600 
                                    hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 
                                    active:scale-95 transition-all shadow-sm"
                            title="清除搜尋條件並重新載入列表"
                        >
                            <HiRefresh
                                className={`text-sm transform transition-transform duration-700 
                                ${isRefreshing ? "animate-spin text-purple-600" : "group-hover:rotate-180"}`}
                            />
                            <span>清除並重新整理</span>
                        </button>
                    </div>

                    {/* 把卡片塞進來這下面 */}

                    <CardPresent post={post} />

                </div>
            </div>

        </>
    )
}

export default GuestPage;
