import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext.jsx";
import PostClass from "../../models/PostClass";
import cityDistrictMap from "../../models/Cities";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const authHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};


// 統一的輸入框樣式
const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 " +
    "focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition";

function toApiJson(post, startAddress, destAddress, userName, vehicle_info) {
    const fullStartAddress = [startAddress.city, startAddress.district, startAddress.street]
        .filter(Boolean)
        .join("");
    const fullDestAddress = [destAddress.city, destAddress.district, destAddress.street]
        .filter(Boolean)
        .join("");

    return {
        driver_id: userName || "Unknown",
        starting_point: { Name: post.starting_point.Name || "", Address: fullStartAddress || "" },
        destination: { Name: post.destination.Name || "", Address: fullDestAddress || "" },
        meet_point: { Name: post.meet_point?.Name || "" },
        departure_time: post.departure_time ? new Date(post.departure_time).toISOString() : null,
        notes: post.notes || "",
        description: post.description,
        helmet: !!post.helmet,
        contact_info: {},
        leave: !!post.leave,
        vehicle_info: vehicle_info || "unknown",
        status: "open",
    };
}

function UploadPost() {
    const navigate = useNavigate();
    const { user, driver } = useUser();

    // 圖片狀態
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const [post, setPost] = useState(
        new PostClass({
            driver_id: "",
            vehicle_info: null,
            status: "",
            starting_point: { Name: "", Address: "" },
            destination: { Name: "", Address: "" },
            meet_point: { Name: "" },
            departure_time: "",
            notes: "",
            description: "",
            helmet: false,
            contact_info: {},
            leave: false,
        })
    );

    const [startAddress, setStartAddress] = useState({
        city: "",
        district: "",
        street: "",
    });

    const [destAddress, setDestAddress] = useState({
        city: "",
        district: "",
        street: "",
    });

    const API = "https://ntouber-gateway.zeabur.app/api/posts/";
    const [isSubmitting, setSubmitting] = useState(false);

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

        // --- 限制 notes (貼文簡述) 字數 < 20 ---
        if (name === "notes" && value.length > 20) {
            return;
        }

        setPost({
            ...post,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!user || !user.Name) {
            alert("請先登入才能上傳貼文！");
            return;
        }

        const payload = toApiJson(post, startAddress, destAddress, user.ID, driver?.scooter_type);
        setSubmitting(true);

        try {
            const r = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify(payload),
            });

            const data = await r.json().catch(() => ({}));
            if (!r.ok) {
                throw new Error(data.message || `API 錯誤（${r.status})`);
            }

            const postId = data;

            if (imageFile && postId) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadUrl = `https://ntouber-gateway.zeabur.app/api/posts/upload_image?post_id=${postId}`;

                const imgRes = await fetch(uploadUrl, {
                    method: "PATCH",
                    headers: {
                        ...authHeader(),
                    },
                    body: formData,
                });

                if (!imgRes.ok) {
                    const imgData = await imgRes.json().catch(() => ({}));
                    console.error("圖片上傳失敗：", imgData);
                }
            }

            setPost(new PostClass({}));
            setStartAddress({ city: "", district: "", street: "" });
            setDestAddress({ city: "", district: "", street: "" });
            setImageFile(null);
            setPreviewUrl("");

            alert("送出成功！");
            navigate("/");

        } catch (err) {
            console.error(err);
            alert(`送出失敗：${err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto my-10 bg-white rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="px-8 py-6">
                <h2 className="text-2xl font-bold text-gray-800">上傳貼文</h2>
                <p className="text-sm text-gray-500 mt-1">
                    填寫你的共乘資訊，發布後其他人將可以看到你的行程
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">

                    {/* ===== 圖片上傳區塊 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            貼文圖片
                        </label>
                        <div className="relative w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden h-64 mb-4 border border-dashed border-gray-300">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="max-w-full max-h-full object-contain rounded-xl"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm flex flex-col items-center">
                                    <span>尚未選擇圖片</span>
                                </div>
                            )}

                            <label className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-2 rounded-lg cursor-pointer hover:bg-black transition">
                                {previewUrl ? "更換圖片(上限5MB)" : "選擇圖片(上限5MB)"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* ===== 出發地名稱 (限 10 字) ===== */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                出發地名稱
                            </label>
                            <span className={`text-xs ${post.starting_point.Name.length === 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {post.starting_point.Name.length}/10
                            </span>
                        </div>
                        <input
                            type="text"
                            value={post.starting_point.Name}
                            onChange={(e) => {
                                if (e.target.value.length <= 10) {
                                    updateNestedField("starting_point", "Name", e.target.value);
                                }
                            }}
                            className={inputClass}
                            placeholder="例如：海大校門口"
                            required
                        />
                    </div>

                    {/* ===== 出發地址 (路名與門牌 限 20 字) ===== */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            出發地址
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <select
                                className={inputClass}
                                value={startAddress.city}
                                onChange={(e) =>
                                    setStartAddress({
                                        city: e.target.value,
                                        district: "",
                                        street: startAddress.street,
                                    })
                                }
                            >
                                <option value="">選擇縣市</option>
                                {Object.keys(cityDistrictMap).map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                className={inputClass}
                                value={startAddress.district}
                                onChange={(e) =>
                                    setStartAddress({ ...startAddress, district: e.target.value })
                                }
                                disabled={!startAddress.city}
                            >
                                <option value="">選擇鄉鎮市區</option>
                                {(cityDistrictMap[startAddress.city] || []).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* 路名與門牌輸入框 (含字數統計) */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500 font-medium ml-1">詳細地址 (路名/門牌)</span>
                                <span className={`text-xs ${startAddress.street.length === 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {startAddress.street.length}/20
                                </span>
                            </div>
                            <input
                                className={inputClass}
                                placeholder="例如：北寧路2號"
                                value={startAddress.street}
                                onChange={(e) => {
                                    if (e.target.value.length <= 20) {
                                        setStartAddress({ ...startAddress, street: e.target.value })
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* ===== 目的地名稱 (限 10 字) ===== */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                目的地名稱
                            </label>
                            <span className={`text-xs ${post.destination.Name.length === 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {post.destination.Name.length}/10
                            </span>
                        </div>
                        <input
                            type="text"
                            value={post.destination.Name}
                            onChange={(e) => {
                                if (e.target.value.length <= 10) {
                                    updateNestedField("destination", "Name", e.target.value);
                                }
                            }}
                            className={inputClass}
                            placeholder="例如：台北車站"
                            required
                        />
                    </div>

                    {/* ===== 目的地地址 (路名與門牌 限 20 字) ===== */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            目的地地址
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                            <select
                                className={inputClass}
                                value={destAddress.city}
                                onChange={(e) =>
                                    setDestAddress({
                                        city: e.target.value,
                                        district: "",
                                        street: destAddress.street,
                                    })
                                }
                            >
                                <option value="">選擇縣市</option>
                                {Object.keys(cityDistrictMap).map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>

                            <select
                                className={inputClass}
                                value={destAddress.district}
                                onChange={(e) =>
                                    setDestAddress({ ...destAddress, district: e.target.value })
                                }
                                disabled={!destAddress.city}
                            >
                                <option value="">選擇鄉鎮市區</option>
                                {(cityDistrictMap[destAddress.city] || []).map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        {/* 路名與門牌輸入框 (含字數統計) */}
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500 font-medium ml-1">詳細地址 (路名/門牌)</span>
                                <span className={`text-xs ${destAddress.street.length === 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                    {destAddress.street.length}/20
                                </span>
                            </div>
                            <input
                                className={inputClass}
                                placeholder="例如：北平西路3號"
                                value={destAddress.street}
                                onChange={(e) => {
                                    if (e.target.value.length <= 20) {
                                        setDestAddress({ ...destAddress, street: e.target.value })
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* ===== 集合地點 (限 10 字) ===== */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                集合地點
                            </label>
                            <span className={`text-xs ${post.meet_point.Name.length === 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                {post.meet_point.Name.length}/10
                            </span>
                        </div>
                        <input
                            type="text"
                            value={post.meet_point.Name}
                            onChange={(e) => {
                                if (e.target.value.length <= 10) {
                                    updateNestedField("meet_point", "Name", e.target.value);
                                }
                            }}
                            className={inputClass}
                            placeholder="例如：7-11 門口"
                            required
                        />
                    </div>

                    {/* ===== 出發時間 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            出發時間
                        </label>
                        <input
                            type="datetime-local"
                            name="departure_time"
                            value={post.departure_time}
                            onChange={handleChange}
                            className={inputClass}
                            required
                        />
                    </div>

                    {/* ===== 貼文簡述 (限 20 字) ===== */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-semibold text-gray-700">
                                貼文簡述
                            </label>
                            <span className={`text-xs ${(post.notes || "").length === 20 ? 'text-red-500' : 'text-gray-400'}`}>
                                {(post.notes || "").length}/20
                            </span>
                        </div>
                        <textarea
                            name="notes"
                            value={post.notes}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[70px] resize-none`}
                            placeholder="簡短說明這趟共乘 (限20字)"
                        />
                    </div>

                    {/* ===== 備註 (無限制) ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            備註
                        </label>
                        <textarea
                            name="description"
                            value={post.description}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[90px]`}
                            placeholder="可補充其他注意事項 (不限字數)"
                        />
                    </div>

                    {/* ===== 其他設定 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            其他設定
                        </label>

                        <div className="flex gap-3">
                            <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${post.helmet ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    name="helmet"
                                    checked={post.helmet}
                                    onChange={handleChange}
                                    className="accent-blue-500"
                                />
                                <span className={post.helmet ? "text-blue-700" : "text-gray-600"}>提供安全帽</span>
                            </label>

                            <label className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition ${post.leave ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    name="leave"
                                    checked={post.leave}
                                    onChange={handleChange}
                                    className="accent-blue-500"
                                />
                                <span className={post.leave ? "text-blue-700" : "text-gray-600"}>允許中途下車</span>
                            </label>
                        </div>
                    </div>

                    {/* ===== 按鈕區塊 ===== */}
                    <div className="flex justify-between items-center pt-6 border-t mt-8">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                        >
                            取消
                        </button>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-900 disabled:opacity-50 transition shadow-md"
                        >
                            {isSubmitting ? "發布中..." : "發布貼文"}
                        </button>
                    </div>

                </form>
            </div>
        </motion.div>
    );
}

export default UploadPost;