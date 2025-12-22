import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";
import PostCard from "./Functions/PostCard.jsx";
import PostClass from "../models/PostClass";
import { useUser } from "../contexts/UserContext.jsx";
// import { useNavigate } from "react-router-dom";
import CardPresent from "./Functions/CardPresent";


const API = "https://ntouber-post.zeabur.app/api/posts/allpost";

function AdminPage() {
    const [post, setPost] = useState([]);
    const [openCount, setOpenCount] = useState(null);
	const [matchedCount, setMatchedCount] = useState(null);
    const navigate = useNavigate();
    const { userRole, isAdmin } = useUser();
    // console.log("Admin:", isAdmin);

    useEffect(() => {
        if (isAdmin !== undefined && isAdmin !== '1') {
            navigate("/");
        }
    }, [isAdmin, navigate]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const r = await fetch(API, { method: "GET" });
                const [rOpen, rMatched] = await Promise.all([
					fetch("https://ntouber-post.zeabur.app/api/posts/count/open", { method: "GET" }),
					fetch("https://ntouber-post.zeabur.app/api/posts/count/matched", { method: "GET" }),
				]);
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }
                if (!rOpen.ok){
                     throw new Error(`開放數量 API 錯誤 (${rOpen.status})`);
                }
				if (!rMatched.ok){ 
                    throw new Error(`已匹配數量 API 錯誤 (${rMatched.status})`);
                }

                const data = await r.json();
                const mapped = data.map(post => new PostClass(post));
                setPost(mapped);

                const openData = await rOpen.json();
				const matchedData = await rMatched.json();

				const open = typeof openData === "number" ? openData : openData?.count;
				const matched = typeof matchedData === "number" ? matchedData : matchedData?.count;

				setOpenCount(Number.isFinite(open) ? open : 0);
				setMatchedCount(Number.isFinite(matched) ? matched : 0);
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
                            onClick={() => navigate("/admin/Blacklist")}
                        >
                            黑名單列表
                        </button>
                        </div>

                        <div className="bg-white rounded-xl border shadow-sm p-4 mb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-gray-900">貼文統計</p>
                                <p className="text-xs text-gray-500 mt-0.5">目前系統貼文狀態概況</p>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-3">
                            <div className="flex-1 rounded-lg bg-purple-50 border border-purple-100 p-3">
                                <p className="text-xs text-gray-500">目前開放</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {openCount === null ? "-" : openCount}
                                </p>
                            </div>

                            <div className="flex-1 rounded-lg bg-purple-50 border border-purple-100 p-3">
                                <p className="text-xs text-gray-500">目前已匹配</p>
                                <p className="text-xl font-bold text-gray-900">
                                    {matchedCount === null ? "-" : matchedCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 把卡片塞進來這下面 */}
                    <CardPresent post={post} isAdmin={isAdmin} />


                </div>
            </div>
        </>
    )
}

export default AdminPage;