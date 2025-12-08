import { useState, useEffect } from "react";
import PostClass from '../../models/PostClass';
import { HiArrowRight } from "react-icons/hi";
import DetailPost from './DetailPost';
import { Routes, Route, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function postCard({ postData , isAdmin}) {
    const navigate = useNavigate();
    if (!postData) return null;
    const tags = [];
    if (postData.helmet) tags.push("提供安全帽");
    if (postData.leave) tags.push("中途下車");

    const [driver, setDriver] = useState(null);

    const User_id = postData.driver_id;

    const dst = isAdmin === "1" ? "/AdminDetailPost" : "/detailPost";
    

    useEffect(() => {
        async function fetchDriver() {
            try {
                const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${User_id}`);

                if (!res.ok) throw new Error("取得使用者資料失敗");

                const data = await res.json();

                setDriver(data);

            } catch (err) {
                console.error("❌ 載入車主資料失敗:", err);
            }
        }


        fetchDriver();
    }, [User_id]);

        
    return (
        <article className='postCard m-4' onClick={() => navigate(`${dst}`, { state: { post: postData } })}>
            <div className="flex h-24 items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400">
                <div className="flex">
                    <img src="https://placehold.co/100x50?text=Demo+Image&font=roboto" alt="demo" className="rounded-xl shadow" />
                </div>

            </div>

            <div className="space-y-3 text-sm text-center font-bold">
                {/* 文字或顯示區塊 */}
                {postData.starting_point.Name} {"→"} {postData.destination.Name}
            </div>

            <div className="space-y-3 text-xs">
                {/* 文字或顯示區塊 */}
                {postData.notes}
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
            <div className="flex items-center justify-between text-gray-500">
                {/* 底部資訊或按鈕 */}
            </div>

        </article>
    );
}

export default postCard;