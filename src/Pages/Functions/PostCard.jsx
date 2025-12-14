import { useState, useEffect } from "react";
import PostClass from '../../models/PostClass.jsx';
import { HiArrowRight } from "react-icons/hi";
import DetailPost from './DetailPost.jsx';
import { Routes, Route, Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

function PostCard({ postData, isAdmin }) {
    const navigate = useNavigate();
    if (!postData) return null;
    const tags = [];
    if (postData.helmet) tags.push("提供安全帽");
    if (postData.leave) tags.push("中途下車");

    const [driver, setDriver] = useState(null);

    const User_id = postData.driver_id;

    const dst = isAdmin === "1" ? "/AdminDetailPost" : "/detailPost";
    const Admin = isAdmin === "1" ? true : false;


    useEffect(() => {
        async function fetchDriver() {
            try {
                const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${User_id}`);

                if (!res.ok) throw new Error("取得使用者資料失敗");

                const data = await res.json();

                setDriver(data);

            } catch (err) {
                console.error(" 載入車主資料失敗:", err);
            }
        }


        fetchDriver();
    }, [User_id]);


    return (
        <article className='postCard m-4' onClick={() => navigate(`${dst}`, { state: { post: postData } })}>
            <div
                className="
                    w-full 
                    h-40              /* 調高外框高度，可依需求改成 h-44 h-48 */
                    rounded-xl 
                    bg-gray-100 
                    flex items-center justify-center
                    overflow-hidden   /* 超出就裁掉，不會蓋到下面文字 */
                    mb-3
                "
            >
                <img
                    src={postData?.image_url || "https://placehold.co/400x250?text=Demo+Image&font=roboto"}
                    alt="demo"
                    className="
                        w-full 
                        h-full 
                        object-contain  /* 等比例縮放，塞在框內，多餘留灰底 */
                        rounded-xl
                    "
                />
            </div>

            <div className="space-y-3 text-sm text-center font-bold">
                {postData.starting_point.Name} {"→"} {postData.destination.Name}
            </div>

            <div className="space-y-3 text-xs">
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
            
            {Admin && (
                <p 
                    className={`
                        text-xs 
                        p-1 
                        rounded 
                        ml-auto 
                        text-white 
                        font-semibold 
                        ${
                            postData?.status === "open"
                                ? "bg-green-500"
                                : postData?.status === "matched"
                                ? "bg-amber-500" // 亮橘色
                                : postData?.status === "closed"
                                ? "bg-red-500"
                                : "bg-gray-400" // 預設/載入中 顏色
                        }
                    `}
                >
                    {postData?.status || "載入中…"}
                </p>
            )}
            </div>
            <div className="flex items-center justify-between text-gray-500">
            </div>

        </article>
    );
}

export default PostCard;