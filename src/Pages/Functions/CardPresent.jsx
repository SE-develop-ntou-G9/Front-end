import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostClass from "../../models/PostClass";

const API = "https://ntouber-post.zeabur.app/api/posts/all";

export default function CardPresent() {
    const [post, setPost] = useState([]);

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
        <div className="grid grid-cols-2 gap-4">
            {post.length === 0 ? (
                <p className="text-sm text-gray-500">目前沒有共乘貼文</p>
            ) : (
                post.map((p, index) => (
                    <PostCard
                        key={p.driver_id || index}
                        postData={p}
                    />
                ))
            )}
        </div>
    );
}
