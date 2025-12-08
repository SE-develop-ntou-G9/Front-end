import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import PostClass from "../../models/PostClass";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext.jsx";

function detailPost() {
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
    

    const handleRequest = async () => {
        if (!isLoggedIn || !user) {
            alert("請先登入再發送請求");
            return;
        }

        // 後端需要的三個參數
        const time = postData.timestamp;      // 或 postData.departure_time 亦可

        const params = new URLSearchParams({

            post_id: postData.id,
            client_id: user.ID,

        });

        const url = `https://ntouber-post.zeabur.app/api/posts/request?${params.toString()}`;
        console.log("發送請求 URL:", url);

        try {
            console.log(postData.timestamp);
            const res = await fetch(url, {
                method: "PATCH",
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                console.error("發送請求失敗：", data);
                throw new Error(data.message || `API 錯誤 (${res.status})`);

            }

            console.log("發送請求成功：", data);
            alert("已發送請求給車主！");
        } catch (err) {
            console.error("發送請求發生錯誤：", err);
            alert(`發送請求失敗：${err.message}`);
        }
    };

   


    return (
        <div className="flex justify-center">
            <article className='postCard m-4 w-3/4'>
                {/* <div className="flex h-50 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400"> */}
                <div className="w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden h-64 mb-4">
                    <img
                        src={postData?.image_url || "https://placehold.co/200x150?text=Demo+Image&font=roboto"}
                        alt="demo"
                        className="max-w-full max-h-full object-contain rounded-xl"
                    />
                </div>
                {/* </div> */}
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
                
              
                <div className="flex items-center justify-end text-gray-500">
                    {isLoggedIn ? (
                        <button className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm"
                            onClick={handleRequest} >
                            發送請求
                        </button>
                    ) : null}
                </div>
           
               
            </article>
        </div>

    );
}

export default detailPost;
