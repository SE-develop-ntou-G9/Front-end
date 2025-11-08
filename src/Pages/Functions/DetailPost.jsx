import React from "react";
import { useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import PostClass from "../../models/PostClass";

function detailPost({isLoggedIn}) {
    const navigate = useNavigate();
    const postData = new PostClass(
        'user123',
        '海大校門',
        '基隆火車站',
        '基隆市中正區北寧路2號',
        '基隆市中正區中正路236號',
        '2025-10-10 17:30',
        '北門集合',
        '尋找同路人！',
        '路上可以一起聊聊天!',
        false,
        false,
        'Line: user123'
    );

    return (
        <div className="flex justify-center">
        <article className='postCard m-4 w-3/4'>
            <div className = "flex h-50 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                <div className="flex">
                    <img src="https://placehold.co/200x150?text=Demo+Image&font=roboto" alt="demo" className="rounded-xl shadow" />
                </div>
            </div>

            <div className="space-y-3 text-sm text-center font-bold">
                {/* 文字或顯示區塊 */}
                {postData.origin} {"→"} {postData.destination}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                起點: {postData.originAddress}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                終點: {postData.desAddress}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                集合時間: {postData.time}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                集合地點: {postData.meetingPoint}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                聯絡方式: 
                <p>{postData.contact}</p>
            </div>
            <div className="space-y-3 text-xs">
                備註:
                <div className="border border-gray-400 rounded-md p-4">
                    {/* 文字或顯示區塊 */}
                    {postData.note}
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {/* {tags.map((tag) => (
                    <span
                    key={tag}
                    className="rounded-lg bg-gray-100 px-1.5 py-0.5 text-[8px] font-medium text-gray-700"
                    >
                    {tag}
                    </span>
                ))} */}
            </div>

            <div className="flex items-center h-5">
                <div className="mr-1 h-5 w-5 overflow-hidden rounded-full bg-gray-100 font">
                    <img
                        src="https://placehold.co/80x80"
                        alt="driver"
                        className="h-full w-full object-cover"
                        />
                </div>
                <p className="text-xs">{postData.user}</p>
            </div>

            <div className="flex items-center justify-end text-gray-500">
                {isLoggedIn ? (
                    <button className="px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm">
                        發送請求
                    </button>
                ) : null}
            </div>
        </article>
        </div>
    );
}

export default detailPost;
