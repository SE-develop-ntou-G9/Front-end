import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext.jsx";
import PostClass from "../../models/PostClass";
import cityDistrictMap from "../../models/Cities";

function toApiJson(post, startAddress, destAddress, userName) {
    const fullStartAddress = [startAddress.city, startAddress.district, startAddress.street]
        .filter(Boolean)     // 移掉沒填的欄位
        .join("");
    const fullDestAddress = [destAddress.city, destAddress.district, destAddress.street]
        .filter(Boolean)     // 移掉沒填的欄位
        .join("");

    return {
        driver_id: userName || "Unknown",  // 使用傳入的 userName
        // starting_point: { Name: post.origin || "", Address: fullAddress || "" },
        starting_point: { Name: post.starting_point.Name || "", Address: fullStartAddress || "" },
        // destination: { Name: post.destination || "", Address: fullAddress || "" },
        destination: { Name: post.destination.Name || "", Address: fullDestAddress || "" },
        // meet_point: { Name: post.meetingPoint || "" },
        meet_point: { Name: post.meet_point?.Name || "" },
        departure_time: post.departure_time ? new Date(post.departure_time).toISOString() : null,
        notes: post.notes || "",
        description: "",
        helmet: !!post.helmet,
        // contact_info: { Contact: post.contact || "" },
        contact_info: {},
        leave: !!post.leave,

        vehicle_info: post.vehicle_info || "unknown",
        status: "open",                       // 他說不能是空的我也不知道怎麼辦
        timestamp: "2025-10-31T06:56:57.647Z" // 他說不能是空的我也不知道怎麼辦
    }
}

function UploadPost() {
    const { user } = useUser();  // 從 UserContext 取得使用者資料

    // 初始化 PostClass 實例
    const [post, setPost] = useState(
        new PostClass({
            driver_id: "",
            vehicle_info: null,
            status: "",
            timestamp: "",
            starting_point: {
                Name: "",
                Address: ""
            },
            destination: {
                Name: "",
                Address: ""
            },
            meet_point: {
                Name: "",
            },
            departure_time: "",
            notes: "",
            description: "",
            helmet: false,
            contact_info: {},
            leave: false
        })
    );

    const updateNestedField = (parentKey, childKey, value) => {
        setPost((prev) => ({
            ...prev,
            [parentKey]: {
                ...prev[parentKey],
                [childKey]: value,
            },
        }));
    };



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost({
            ...post,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const [startAddress, setStartAddress] = useState({
        city: "",
        district: "",
        street: ""
    });

    const [destAddress, setDestAddress] = useState({
        city: "",
        district: "",
        street: ""
    });

    const API = "https://ntouber-post.zeabur.app/api/posts/";
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 檢查是否已登入
        if (!user || !user.Name) {
            alert("請先登入才能上傳貼文！");
            return;
        }

        const payload = toApiJson(post, startAddress, destAddress, user.Name);
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
                console.log("送出的 payload：", payload);
                console.log("後端回傳內容：", data);
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
            setPost(new PostClass({}));
            setStartAddress({ city: "", district: "", street: "" });
            setDestAddress({ city: "", district: "", street: "" });

        } catch (err) {
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
                        name="starting_point"
                        value={post.starting_point.Name}
                        onChange={(e) =>
                            updateNestedField("starting_point", "Name", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">出發地址:</label>
                    <div className="flex gap-2">
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={startAddress.city}
                            onChange={(e) =>
                                setStartAddress({ city: e.target.value, district: "", street: startAddress.street })
                            }>
                            <option value="">選擇縣市</option>
                            {Object.keys(cityDistrictMap).map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={startAddress.district}
                            onChange={(e) =>
                                setStartAddress({ ...startAddress, district: e.target.value })
                            }
                            disabled={!startAddress.city}>
                            <option value="">選擇鄉鎮市區</option>
                            {(cityDistrictMap[startAddress.city] || []).map((district) => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="路名與門牌"
                            value={startAddress.street}
                            onChange={(e) =>
                                setStartAddress({ ...startAddress, street: e.target.value })
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
                        value={post.destination.Name}
                        onChange={(e) =>
                            updateNestedField("destination", "Name", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">目的地址:</label>
                    <div className="flex gap-2">
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={destAddress.city}
                            onChange={(e) =>
                                setDestAddress({ city: e.target.value, district: "", street: destAddress.street })
                            }>
                            <option value="">選擇縣市</option>
                            {Object.keys(cityDistrictMap).map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={destAddress.district}
                            onChange={(e) =>
                                setDestAddress({ ...destAddress, district: e.target.value })
                            }
                            disabled={!destAddress.city}>
                            <option value="">選擇鄉鎮市區</option>
                            {(cityDistrictMap[destAddress.city] || []).map((district) => (
                                <option key={district} value={district}>{district}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-2">
                        <input
                            type="text"
                            placeholder="路名與門牌"
                            value={destAddress.street}
                            onChange={(e) =>
                                setDestAddress({ ...destAddress, street: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>


                <div className="mb-4">
                    <label className="block mb-2">出發時間:</label>
                    <input
                        type="datetime-local"
                        name="departure_time"
                        value={post.departure_time}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">集合地點:</label>
                    <input
                        type="text"
                        name="meet_point"
                        value={post.meet_point.Name}
                        onChange={(e) =>

                            updateNestedField("meet_point", "Name", e.target.value)
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-2">備註:</label>
                    <textarea
                        name="notes"
                        value={post.notes}
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

                {/* <div className="mb-4">
                    <label className="block mb-2">聯絡方式:</label>
                    <input
                        type="text"
                        name="contact_info"
                        value={post.contact_info?.additionalProp1 || ""}
                        onChange={(e) =>
                            setPost((prev) => ({
                                ...prev,
                                contact_info: {
                                    ...prev.contact_info,
                                    additionalProp1: e.target.value,
                                },
                            }))
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div> */}

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