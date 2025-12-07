import React, { useEffect, useState } from "react";
import UserClass from "../models/UserClass";
import { useNavigate } from "react-router-dom";
import { HiSearch } from "react-icons/hi";

const API = "https://ntouber-post.zeabur.app/api/users/all";

export default function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUser] = useState([]);
    // 先假裝一下
    // const [users] = useState([
    //     { id: 1, name: "淤蛇萬" },
    //     { id: 2, name: "瓜騎兔" },
    //     { id: 3, name: "Tony9737" }
    // ]);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const r = await fetch(API, { method: "GET" });
                if (!r.ok) {
                    throw new Error(`API 錯誤 (${r.status})`);
                }

                const data = await r.json();
                const mapped = data.map(post => new UserClass(post));
                setUser(mapped);
            } catch (err) {
                console.error("抓取user失敗：", err);
            }
        }

        fetchUsers();
    }, []);
    

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto px-4 pb-16">

                {/* 返回貼文 */}
                <button
                    className="text-sm text-gray-600 mt-3"
                    onClick={() => navigate(-1)}
                >
                    ← 返回貼文
                </button>

                {/* 搜尋欄 */}
                <div className="mt-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for user"
                            className="
                                w-full 
                                pl-4 pr-10 py-3 
                                rounded-2xl 
                                bg-purple-100/60 
                                placeholder-gray-500 
                                outline-none
                            "
                        />
                        <HiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xl" />
                    </div>
                </div>

                {/* 標題 */}
                <div className="mt-6">
                    <h2 className="text-base font-bold text-gray-900">所有用戶</h2>
                    <p className="text-xs text-gray-500 mt-0.5">查看系統中的所有使用者</p>
                </div>

                {/* 用戶列表 */}
                <div className="mt-4 space-y-4">
                    {users.map((u) => (
                        <div
                            key={u.id}
                            className="
                                bg-white 
                                rounded-lg 
                                p-4 
                                shadow-sm 
                                border 
                                text-sm 
                                text-gray-800
                            "
                        >
                            <p className="font-medium">用戶名：{u.name}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
