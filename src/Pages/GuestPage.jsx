import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";
import { HiSearch, HiRefresh } from "react-icons/hi";
import PostCard from "./Functions/PostCard";
import { useUser } from "../contexts/UserContext.jsx";
import PostClass from "../models/PostClass";
import CardPresent from "./Functions/CardPresent";
import PostSearch from "./Functions/PostSearch";
import PageMotion from "../components/PageMotion";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://ntouber-post.zeabur.app/api/posts/all";
function GuestPage({ setIsLoggedIn, isLoggedIn }) {
    const [post, setPost] = useState([]);
    const { user, userRole, isAdmin } = useUser();
    const [refreshKey, setRefreshKey] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoadingPosts(true);
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
            }finally {
                setLoadingPosts(false);
            }
        }

        fetchPosts();
    }, [refreshKey]);

    function SkeletonPostCard() {
        return (
            <article className="postCard m-4 animate-pulse ">

                <div
                    className="
                w-full
                h-40
                rounded-xl
                bg-gray-200
                flex items-center justify-center
                overflow-hidden
                mb-3
                relative
        "
                >
                    <div className="absolute left-0 top-0 h-full w-6 bg-gray-100" />
                    <div className="absolute right-0 top-0 h-full w-6 bg-gray-100" />
                </div>

                <div className="space-y-3 text-sm text-center font-bold mb-3">
                    <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto" />
                </div>

                <div className="space-y-3 text-xs mb-3">
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="h-3 w-10 bg-gray-200 rounded-lg" />
                    <span className="h-3 w-10 bg-gray-200 rounded-lg" />
                </div>

                <div className="flex items-center h-5">
                    <div className="mr-1 h-5 w-5 rounded-full bg-gray-200" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>

                <div className="flex items-center justify-between text-gray-500" />
            </article>
        );
    }

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
        <PageMotion>
            <>

                <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="max-w-2xl mx-auto px-4 pb-16">

                        <PostSearch
                            onResult={handleSearchResult}
                            resetTrigger={refreshKey}
                            // 當搜尋開始時，把 post 清空
                            onSearchStart={() => setPost([])}
                        />

                        {/* 標題區 */}
                        <div className="mt-5">
                            <div className="mt-8 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        🚀 最新共乘邀請
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-1">
                                        查查看其他用戶的共乘請求
                                    </p>

                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="mt-2 group flex items-center gap-1.5 px-3 py-1.5 
                                    bg-white border border-gray-200 rounded-lg 
                                    text-xs font-medium text-gray-600 
                                    hover:bg-gray-50 hover:text-purple-600 hover:border-purple-200 
                                    active:scale-95 transition-all shadow-sm"
                                    >
                                        <HiRefresh
                                            className={`text-sm transition-transform duration-700 
                                            ${isRefreshing ? "animate-spin text-purple-600" : "group-hover:rotate-180"}`}
                                        />
                                        <span>清除並重新整理</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                        {loadingPosts ? (
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <SkeletonPostCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="mt-6"
                            >
                                <CardPresent post={post} isAdmin={isAdmin} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </>
        </PageMotion >
    )
}

export default GuestPage;
