import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import PostClass from "../../models/PostClass";

function detailPost({ isLoggedIn }) {
    const navigate = useNavigate();
    const { state } = useLocation();
    const postData = state?.post;
    if (!postData) return <p>沒有收到貼文資料</p>;
    // const postData = new PostClass({
    //     driver_id: 'user123',
    //     vehicle_info: null,
    //     status: "open",
    //     timestamp: "2025-11-09T05:33:28.610Z",

    //     starting_point: {
    //         Name: "海大校門",
    //         Address: "基隆市中正區"
    //     },

    //     destination: {
    //         Name: "基隆火車站",
    //         Address: "基隆市仁愛區"
    //     },

    //     meet_point: {
    //         Name: "北門",
    //         Address: "基隆市北門"
    //     },

    //     departure_time: "2025-11-09T05:34:00.000Z",

    //     notes: "尋找同路人！",
    //     description: "路上可以一起聊聊天!",
    //     helmet: false,

    //     contact_info: {},

    //     leave: false
    // });

    const tags = [];
    if (postData.helmet) tags.push("自備安全帽");
    if (postData.leave) tags.push("中途下車");

    //這是假裝有Admin
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    return (
        <div className="flex justify-center">
            <article className='postCard m-4 w-3/4'>
                <div className="flex h-50 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                    <div className="flex">
                        <img src="https://placehold.co/200x150?text=Demo+Image&font=roboto" alt="demo" className="rounded-xl shadow" />
                    </div>
                </div>

                <div className="space-y-3 text-sm text-center font-bold">
                    {/* 文字或顯示區塊 */}
                    {postData.starting_point.Name} {"→"} {postData.destination.Name}
                </div>

                <div className="space-y-3 text-xs">
                    {/* 文字或顯示區塊 */}
                    起點: {postData.starting_point.Address}
                </div>

                <div className="space-y-3 text-xs">
                    {/* 文字或顯示區塊 */}
                    終點: {postData.destination.Address}
                </div>

                <div className="space-y-3 text-xs">
                    {/* 文字或顯示區塊 */}
                    集合時間: {postData.departure_time}
                </div>

                <div className="space-y-3 text-xs">
                    {/* 文字或顯示區塊 */}
                    集合地點: {postData.meet_point.Name}
                </div>

                {/* <div className="space-y-3 text-xs">
                聯絡方式: 
                <p>{postData.contact}</p>
            </div> */}
                <div className="space-y-3 text-xs">
                    備註:
                    <div className="border border-gray-400 rounded-md p-4">
                        {/* 文字或顯示區塊 */}
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
                        <button className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">
                            發送請求
                        </button>
                    ) : null}
                </div>
                {isAdmin && (
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
                )}
            </article>
        </div>

    );
}

export default detailPost;
