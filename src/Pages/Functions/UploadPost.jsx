import React, { useState } from "react";
import PostClass from "../../models/PostClass";
import cityDistrictMap from "../../models/Cities";

function toApiJson(post, address){
    const fullAddress = [address.city, address.district, address.street]
        .filter(Boolean)     // 移掉沒填的欄位
        .join("");
    return {
        driver_id: "Jackie",
        starting_point:{ Name: post.origin || "", Address: fullAddress || ""},
        destination: { Name: post.destination || "", Address: fullAddress || ""},
        meet_point: {Name: post.meetingPoint || ""},
        departure_time: post.time ? new Date(post.time).toISOString(): null,
        notes: post.note || "",
        description: "",
        helmet: !!post.helmet,
        contact_info: {Contact: post.contact || ""},
        leave: !!post.leave,
    }
}

function UploadPost() {
  // 初始化 PostClass 實例
    const [post, setPost] = useState(
        new PostClass("", "", "", "", "", "", "", "", "", false, false, "")
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost({
        ...post,
        [name]: type === "checkbox" ? checked : value,
        });
    };

    const [address, setAddress] = useState({
            city: "",
            district: "",
            street: ""
    });

    const API = "http://ntouber-post.zeabur.app/api/posts";
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = toApiJson(post, address);
        setSubmitting(true);

        // const fullAddress = [address.city, address.district, address.street]
        // .filter(Boolean)     // 移掉沒填的欄位
        // .join("");
        try {
            const r = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            // 若需要帶 token： headers: { "Content-Type":"application/json", "Authorization": "Bearer xxx" }
            });

            const data = await r.json().catch(() => ({}));
            if (!r.ok) {
                // 後端若有 message 就顯示
                throw new Error(data.message || `API 錯誤（${r.status})`);
            }

            // // 從 localStorage 取得現有的資料陣列
            // const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];

            // // 將新的 post 加入陣列，並串聯address
            // const updatedPosts = [...existingPosts,  { ...post, desAddress: fullAddress }];

            // // 將更新後的陣列存回 localStorage
            // localStorage.setItem("posts", JSON.stringify(updatedPosts));

            // alert(`資料已儲存到 localStorage：
            //     出發地: ${post.origin}
            //     目的地: ${post.destination}
            //     出發時間: ${post.time}
            //     集合地點: ${post.meetingPoint}
            //     備註: ${post.note}
            //     是否有安全帽: ${post.helmet ? "是" : "否"}
            //     聯絡方式: ${post.contact}
            // `);

            // 清空表單
            setPost(new PostClass("", "", "", "", "", "", "", "", "", false, false, ""));
            setAddress({ city: "", district: "", street: "" });

        }catch (err) {
            console.error(err);
            // 失敗時，你可以選擇同時備份到 localStorage，避免表單遺失
            // const fallback = JSON.parse(localStorage.getItem("posts") || "[]");
            // localStorage.setItem("posts", JSON.stringify([...fallback, payload]));
            alert(`送出失敗：${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md mx-auto my-4">
            <h1 className="text-2xl font-bold mb-4">上傳貼文</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">出發地:</label>
                    <input
                        type="text"
                        name="origin"
                        value={post.origin}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">出發地址:</label>
                    <div className="flex gap-2">
                        <select 
                            className="w-full p-2 border border-gray-300 rounded"
                            value={address.city}
                            onChange={(e) =>
                                setAddress({ city: e.target.value, district: "", street: address.street })
                            }>
                            <option value="">選擇縣市</option>
                            {Object.keys(cityDistrictMap).map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={address.district}
                            onChange={(e) =>
                                setAddress({ ...address, district: e.target.value })
                            }
                            disabled={!address.city}>
                            <option value="">選擇鄉鎮市區</option>
                            {(cityDistrictMap[address.city] || []).map((district) => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="路名與門牌"
                            value={address.street}
                            onChange={(e) =>
                                setAddress({ ...address, street: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">目的地:</label>
                    <input
                        type="text"
                        name="destination"
                        value={post.destination}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">出發時間:</label>
                    <input
                        type="datetime-local"
                        name="time"
                        value={post.time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">集合地點:</label>
                    <input
                        type="text"
                        name="meetingPoint"
                        value={post.meetingPoint}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">備註:</label>
                    <textarea
                        name="note"
                        value={post.note}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">
                        <input
                        type="checkbox"
                        name="helmet"
                        checked={post.helmet}
                        onChange={handleChange}
                        className="mr-2"
                        />
                        是否提供安全帽
                    </label>
                    <label className="block mb-2">
                        <input
                        type="checkbox"
                        name="leave"
                        checked={post.leave}
                        onChange={handleChange}
                        className="mr-2"
                        />
                        是否允許中途下車
                    </label>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">聯絡方式:</label>
                    <input
                        type="text"
                        name="contact"
                        value={post.contact}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        提交貼文
                    </button>
                    
                    <button>
                        <a href="./" className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 ml-4">
                        返回
                        </a>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UploadPost;