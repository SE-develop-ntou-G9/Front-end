import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard.jsx";
import PostClass from "../models/PostClass";
import { useUser } from "../contexts/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
import CardPresent from "./Functions/cardPresent";


const API = "https://ntouber-post.zeabur.app/api/posts/all";

function AdminPage() {
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
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-2xl mx-auto px-4 pb-16">

                    {/* 我留著標題 搜尋欄 和一些東西 要用就自己解開註解 */}

                    {/* 搜尋欄 */}
                    {/* <div className="mt-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for a ride"
                                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-purple-100/60 placeholder-gray-500 outline-none"
                            />
                            <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
                        </div>
                    </div> */}

                    {/* 標題那些的 */}
                    {/* <div className="mt-5">
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
                    </div> */}
                    <div className="flex gap-4 mt-6 mb-4">
                        <button
                            className="
                                px-5 py-2 
                                rounded-full
                                bg-gradient-to-r from-purple-50 to-purple-100
                                text-gray-700 font-medium shadow-sm
                                border border-purple-200
                                hover:from-purple-100 hover:to-purple-200
                                hover:shadow 
                                transition-all
                            "
                            onClick={() => navigate("/admin/users")}
                        >
                            用戶列表
                        </button>

                        <button
                            className="
                                px-5 py-2 
                                rounded-full
                                bg-gradient-to-r from-purple-50 to-purple-100
                                text-gray-700 font-medium shadow-sm
                                border border-purple-200
                                hover:from-purple-100 hover:to-purple-200
                                hover:shadow 
                                transition-all
                            "
                            onClick={() => navigate("/admin/drivers")}
                        >
                            車主列表
                        </button>


                        <button
                            className="
                                px-5 py-2 
                                rounded-full
                                bg-gradient-to-r from-purple-50 to-purple-100
                                text-gray-700 font-medium shadow-sm
                                border border-purple-200
                                hover:from-purple-100 hover:to-purple-200
                                hover:shadow 
                                transition-all
                            "
                            onClick={() => navigate("/admin/RegistDrivers")}
                        >
                            審核車主
                        </button>
                    </div>
                    {/* 把卡片塞進來這下面 */}
                    <CardPresent post={post} />


                </div>
            </div>
        </>
    )
}

export default AdminPage;