import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostClass from "../../models/PostClass";

const API = "https://ntouber-gateway.zeabur.app/api/posts/all";

export default function CardPresent({ post, isAdmin }) {

    return (
        <div className="grid grid-cols-2 gap-4">
            {post.length === 0 ? (
                <p className="text-sm text-gray-500">目前沒有共乘貼文</p>
            ) : (
                post.map((p) => (
                    <PostCard
                        key={p.id}
                        postData={p}
                        isAdmin={isAdmin}
                    />
                ))
            )}
        </div>
    );
}
