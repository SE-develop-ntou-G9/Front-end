import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import PostClass from "../../models/PostClass";
import dayjs from "dayjs";
import { useUser } from "../../contexts/UserContext.jsx";


function detailPost() {
    const { user, isLoggedIn, userRole, loading, logout } = useUser();
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { state } = useLocation();
    const postData = state?.post;
    if (!postData) return <p>沒有收到貼文資料</p>;

    const tags = [];
    if (postData.helmet) tags.push("自備安全帽");
    if (postData.leave) tags.push("中途下車");
    // console.log("postData.id", postData.id);
    
    const [driver, setDriver] = useState(null);
    const User_id = postData.driver_id;
    useEffect(() => {
        async function fetchDriver() {
            try {
                const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${User_id}`);

                if (!res.ok) throw new Error("取得使用者資料失敗");

                const data = await res.json();


                setDriver(data);

                console.log(data);

            } catch (err) {
                console.error("❌ 載入車主資料失敗:", err);
            }
        }

        console.log(postData.image_url);
        fetchDriver();
    }, [User_id]);

    const handleRequest = async () => {

        const postParams = new URLSearchParams({
            post_id: postData.id,
        });
        const postUrl = `https://ntouber-post.zeabur.app/api/posts/getpost/${postData.id}`; 

        const postRes = await fetch(postUrl, {
                method: "GET",
            });

        const newPostData = await postRes.json().catch(() => ({}));
        if (!postRes.ok) {
            console.error("發送請求失敗：", newPostData);
            throw new Error(newPostData.message || `API 錯誤 (${postRes.status})`);
        }

        if (isSubmitting) return;
        if (!isLoggedIn || !user) {
            alert("請先登入再發送請求");
            return;
        }

        const params = new URLSearchParams({

            post_id: newPostData.id,
            client_id: user.ID,

        });

        console.log(newPostData);

        if(user.ID == newPostData.driver_id){
            alert("不能向自己發送請求");
            return;
        };

        if(newPostData.status == "matched"){
            alert("此請求已被匹配");
            navigate("/")
            return;
        };

        const url = `https://ntouber-post.zeabur.app/api/posts/request?${params.toString()}`;
        console.log("發送請求 URL:", url);
        setIsSubmitting(true);// 開始發送 (避免連點)

        try {
            console.log(newPostData.timestamp);
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
            navigate('/');

        } catch (err) {
            console.error("發送請求發生錯誤：", err);
            alert(`發送請求失敗：${err.message}`);
        } finally {
        // 恢復狀態
            setIsSubmitting(false);
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

                <div className="space-y-3 text-xs">

                    手機: {driver?.PhoneNumber}
                </div>

                <div className="space-y-3 text-xs">

                    車型: {postData.vehicle_info}
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
                            src={driver?.AvatarURL || "https://placehold.co/80x80"}
                            alt="driver"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <p className="text-xs">{driver?.Name || "載入中…"}</p>
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
