import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch, HiRefresh } from "react-icons/hi";
import PostCard from "./Functions/PostCard.jsx";
import PostClass from "../models/PostClass";
import { useUser } from "../contexts/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
import CardPresent from "./Functions/CardPresent";
import PostSearch from "./Functions/PostSearch.jsx";
import PageMotion from "../components/PageMotion";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://ntouber-post.zeabur.app/api/posts/all";

function UserPage() {
    const [post, setPost] = useState([]);
    const navigate = useNavigate();
    const { user, userRole, isAdmin } = useUser();
    const [myHistoryPosts2, setMyHistoryPosts] = useState([]);
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
                const mapped = data.map(post => new PostClass(post));
                // console.log(mapped.driver_id);
                setPost(mapped);
            } catch (err) {
                console.error("抓取貼文失敗：", err);
            }
            finally {
                setLoadingPosts(false);
            }
        }

        fetchPosts();
    }, [refreshKey]
    );
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
    }, [user, refreshKey]);


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

                                {userRole === "車主" ? (
                                    <button className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm" onClick={() => navigate("/uploadPost")} >
                                        ＋ 發布共乘
                                    </button>
                                ) : (
                                    <p className="text-xs text-gray-400 italic mt-2">
                                        升級成車主後可發布
                                    </p>
                                )}
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



                        {/* 我的共乘紀錄 */}
                        <div className="mt-10">
                            <h2 className="text-lg font-bold text-gray-900">📜 我的共乘紀錄</h2>
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
                                            onClick={() =>
                                                navigate("/detailPost", {
                                                    state: { post: postItem },
                                                })
                                            }
                                            className="group flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm 
                                            hover:shadow-lg hover:-translate-y-1 
                                            transition-all duration-200"
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
                                                            ? "匹配中"
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
        </PageMotion >
    )
}

export default UserPage;
