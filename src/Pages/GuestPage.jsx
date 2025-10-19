import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PrePost from "./Functions/prepost";
import UploadPost from "./Functions/UploadPost";

function GuestPage({ setIsLoggedIn, isLoggedIn }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts(storedPosts);
    }, []);

    const deletePost = () => {
        setPosts([]);
        localStorage.removeItem("posts");
    }

    return (
        <>
            {/* 測試用切換按鈕 */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={() => setIsLoggedIn(true)}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                    {isLoggedIn ? "登出" : "登入"}
                </button>
            </div>

            {/* 預設彈性，大螢幕(md)換grid */}
            <div className="flex flex-col md:grid md:grid-cols-5 md:h-screen">
                <div className="col-span-1 bg-blue-100 ">
                    <h1>Tool</h1>
                    <Link to="/upload" className="text-blue-500 hover:underline">
                        傳你媽B
                    </Link>
                </div>
                <div className="col-span-3 bg-green-100 text-center">
                    <h1>Post</h1>
                    <Routes>
                        <Route path="/" element={<div>
                            <button className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={deletePost}>清空貼文</button>
                            {posts.map((post, index) => (
                                <PrePost key={index} {...post} />
                            ))}
                        </div>} />
                        <Route path="/upload" element={<UploadPost />} />
                    </Routes>
                </div>
                <div className="col-span-1 bg-yellow-100 ">
                    <h1>don't know</h1>
                </div>
            </div>
        </>
    )
}

export default GuestPage;