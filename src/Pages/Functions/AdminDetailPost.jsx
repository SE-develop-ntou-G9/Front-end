import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import PostClass from "../../models/PostClass.jsx";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext.jsx";

function AdminDetailPost() {
    const { user, driver, isLoggedIn, userRole, loading, logout } = useUser();
    // useEffect(() => {
    //     // 只在組件 mount 時執行一次，用於 debug
    //     console.group("ProfilePage 載入");
    //     console.log("isLoggedIn:", isLoggedIn);
    //     console.log("user:", user);
    //     console.log("driver:", driver);
    //     console.log("userRole:", userRole);
    //     console.groupEnd();
    // }, []);

    const navigate = useNavigate();
    const { state } = useLocation();
    const postData = state?.post;
    if (!postData) return <p>沒有收到貼文資料</p>;

    const tags = [];
    if (postData.helmet) tags.push("自備安全帽");
    if (postData.leave) tags.push("中途下車");
    // console.log("postData.id", postData.id);
    
    const handleDelete = async () => {


        if (!postData || !postData.id) {
            console.error("無法取得貼文 ID 進行刪除。");
            console.log("postData.id:", postData.id);
            alert("無法取得貼文 ID 進行刪除。");
            return;
        }


        const isConfirmed = window.confirm(`確定要刪除這篇貼文嗎？\n貼文 ID: ${postData.id}`);
        if (!isConfirmed) {
            return;
        }
        

        const post_id = postData.id; 
        const url = `https://ntouber-post.zeabur.app/api/posts/delete/post/${post_id}`;
        console.log("發送刪除請求 URL:", url);

        try {
            const res = await fetch(url, {
                method: "DELETE", 
            });


            const data = await res.json().catch(() => ({}));
            
            if (!res.ok) {
                console.error("刪除貼文失敗：", data);
                throw new Error(data.message || `API 錯誤 (${res.status})`);
            }

            console.log("刪除貼文成功：", data);
            alert("貼文已成功刪除！");
            
            // 刪除成功後，導回上一頁或貼文列表頁面
            navigate(-1); 
            
        } catch (err) {
            console.error("刪除貼文發生錯誤：", err);
            alert(`刪除貼文失敗：${err.message}`);
        }
    };


    return (
        <div className="flex justify-center">
            <article className='postCard m-4 w-3/4'>
                <div className="flex h-50 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    <div className="flex">
                        <img src="https://placehold.co/200x150?text=Demo+Image&font=roboto" alt="demo" className="rounded-xl shadow" />
                    </div>
                </div>

                <div className="space-y-3 text-sm text-center font-bold">
                    {postData.starting_point.Name} {"→"} {postData.destination.Name}
                </div>

                <div className="space-y-3 text-xs">
                    起點: {postData.starting_point.Address}
                </div>

                <div className="space-y-3 text-xs">
                    終點: {postData.destination.Address}
                </div>

                <div className="space-y-3 text-xs">
                    集合時間: {dayjs(postData.departure_time).format("YYYY-MM-DD HH:mm")}
                </div>

                <div className="space-y-3 text-xs">
                    集合地點: {postData.meet_point.Name}
                </div>

                {/* <div className="space-y-3 text-xs">
                聯絡方式: 
                <p>{postData.contact}</p>
            </div> */}
                <div className="space-y-3 text-xs">
                    備註:
                    <div className="border border-gray-400 rounded-md p-4">
                        {postData.description}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-lg bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center h-5">
                    <div className="mr-1 h-5 w-5 overflow-hidden rounded-full bg-gray-100 font">
                        <img
                            src="https://placehold.co/80x80"
                            alt="driver"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <p className="text-xs">{postData.driver_id}</p>
                </div>
                
                <div className="mt-6 flex justify-between gap-4">

                    {/* 封鎖駕駛 */}
                    <button
                        className="
                            flex-1 
                            bg-black 
                            text-white 
                            py-3 
                            rounded-full 
                            shadow-md 
                            hover:bg-gray-900 
                            active:bg-gray-800
                            transition-all 
                            text-sm 
                            font-semibold
                        "
                    >
                        封鎖駕駛
                    </button>

                    {/* 刪除貼文 */}
                    <button
                        onClick={handleDelete}
                        className="
                            flex-1 
                            bg-black 
                            text-white 
                            py-3 
                            rounded-full 
                            shadow-md 
                            hover:bg-gray-900 
                            active:bg-gray-800
                            transition-all 
                            text-sm 
                            font-semibold
                        "
                    >
                        刪除貼文
                    </button>

                </div>
            
            </article>
        </div>

    );
}

export default AdminDetailPost;
