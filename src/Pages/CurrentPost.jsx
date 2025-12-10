import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext.jsx";
import PostCard from "./Functions/PostCard";

function CurrentPost() {
    const { user } = useUser();
    const [myPosts, setMyPosts] = useState([]);
    const [activeTab, setActiveTab] = useState("driver");

    async function fetchPosts() {
        try {
            const url = `https://ntouber-post.zeabur.app/api/posts/search/${user.ID}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error("搜尋貼文失敗");

            const posts = await res.json();

            posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setMyPosts(posts);
        } catch (err) {
            console.error("Posts fetch error:", err);
        }
    }

    useEffect(() => {
        if (user?.ID) fetchPosts();
    }, [user]);

    const driverPosts = myPosts.filter((p) => p.driver_id === user.ID);
    const passengerPosts = myPosts.filter((p) => p.client_id === user.ID);

    const StatusBadge = ({ status }) => {
        const colors = {
            open: "bg-green-200 text-green-700 border border-green-300",
            matched: "bg-yellow-200 text-yellow-700 border border-yellow-300",
            closed: "bg-gray-200 text-gray-700 border border-gray-300",
        };

        const text = {
            open: "開放中",
            matched: "已匹配",
            closed: "已關閉",
        };

        return (
            <span
                className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${colors[status]}`}
            >
                {text[status]}
            </span>
        );
    };

    async function acceptPost(post) {
        await fetch(`https://ntouber-post.zeabur.app/api/posts/driver_posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "closed" })
        });

        alert("已接受共乘，貼文已關閉！");
        fetchPosts();
    }



    async function rejectPost(post) {
        await fetch(`https://ntouber-post.zeabur.app/api/posts/driver_posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                client_id: "unknown",
                status: "open",
            })
        });



        alert("你已拒絕共乘，貼文已重新開放！");
        fetchPosts();
    }


    const renderPosts = (posts) => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="relative bg-white rounded-xl shadow-md transition transform hover:-translate-y-1 hover:shadow-xl p-3"
                >
                    <div className="absolute right-3 top-3 z-10">
                        <StatusBadge status={post.status} />
                    </div>

                    <PostCard postData={post} />

                    {activeTab === "driver" && post.status === "matched" && (
                        <div className="flex gap-2 mt-3 px-2">
                            <button
                                onClick={() => acceptPost(post)}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg shadow hover:bg-green-600 transition"
                            >
                                ✔ 接受
                            </button>
                            <button
                                onClick={() => rejectPost(post)}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg shadow hover:bg-red-600 transition"
                            >
                                ✖ 拒絕
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="p-5 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">目前貼文</h2>

            <div className="flex gap-10 mb-6 border-b border-gray-300 pb-2 text-lg font-medium">
                <button
                    className={`pb-2 transition ${activeTab === "driver"
                        ? "text-purple-600 border-b-4 border-purple-600 font-bold"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("driver")}
                >
                    🚗 車主貼文
                </button>

                <button
                    className={`pb-2 transition ${activeTab === "passenger"
                        ? "text-purple-600 border-b-4 border-purple-600 font-bold"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    onClick={() => setActiveTab("passenger")}
                >
                    🙋 乘客貼文
                </button>
            </div>

            {activeTab === "driver" ? renderPosts(driverPosts) : renderPosts(passengerPosts)}
        </div>
    );
}

export default CurrentPost;
