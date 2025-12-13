import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useUser } from "../contexts/UserContext.jsx";
import cityDistrictMap from "../models/Cities";
import { motion, AnimatePresence } from "framer-motion";
function splitTaiwanAddress(address = "") {
    const cityMatch = address.match(/^(.*?[市縣])/);
    const districtMatch = address.match(/(.*?[區鄉鎮市])/);

    const city = cityMatch ? cityMatch[0] : "";
    const district = districtMatch
        ? districtMatch[0].replace(city, "")
        : "";

    const street = address
        .replace(city, "")
        .replace(district, "");

    return { city, district, street };
}

const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 " +
    "focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none transition";

function EditPostPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useUser();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    const [post, setPost] = useState({
        starting_point: { Name: "", Address: "" },
        destination: { Name: "", Address: "" },
        meet_point: { Name: "" },
        departure_time: "",
        vehicle_info: "",
        notes: "",
        description: "",
        helmet: false,
        leave: false,
        image_url: "",
    });

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

    // 圖片狀態
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");


    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(
                    `https://ntouber-post.zeabur.app/api/posts/getpost/${postId}`
                );
                if (!res.ok) throw new Error("取得貼文失敗");

                const data = await res.json();

                // 權限檢查
                if (!isLoggedIn || user?.ID !== data.driver_id) {
                    alert("你沒有權限編輯這篇貼文");
                    navigate("/");
                    return;
                }

                setStartAddress(splitTaiwanAddress(data.starting_point?.Address));
                setDestAddress(splitTaiwanAddress(data.destination?.Address));

                setPost({
                    starting_point: data.starting_point,
                    destination: data.destination,
                    meet_point: data.meet_point,
                    departure_time: dayjs(data.departure_time).format("YYYY-MM-DDTHH:mm"),
                    vehicle_info: data.vehicle_info || "",
                    notes: data.notes || "",
                    description: data.description || "",
                    helmet: !!data.helmet,
                    leave: !!data.leave,
                    image_url: data.image_url || "",
                });

                setPreviewUrl(data.image_url || "");
            } catch (err) {
                console.error(err);
                alert("載入貼文失敗");
                navigate("/");
            } finally {
                setLoading(false);
            }
        }

        fetchPost();
    }, [postId, isLoggedIn, user, navigate]);


    const updateNested = (parent, key, value) => {
        setPost(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [key]: value,
            },
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPost(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };


    async function handleSubmit(e) {
        e.preventDefault();
        if (saving) return;
        setSaving(true);

        const fullStartAddress = [
            startAddress.city,
            startAddress.district,
            startAddress.street,
        ].filter(Boolean).join("");

        const fullDestAddress = [
            destAddress.city,
            destAddress.district,
            destAddress.street,
        ].filter(Boolean).join("");

        try {
            // 1️⃣ 更新貼文資料
            const payload = {
                starting_point: {
                    ...post.starting_point,
                    Address: fullStartAddress,
                },
                destination: {
                    ...post.destination,
                    Address: fullDestAddress,
                },
                meet_point: post.meet_point,
                departure_time: new Date(post.departure_time).toISOString(),
                vehicle_info: post.vehicle_info,
                notes: post.notes,
                description: post.description,
                helmet: post.helmet,
                leave: post.leave,
            };

            const res = await fetch(
                `https://ntouber-post.zeabur.app/api/posts/driver_posts/${postId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) throw new Error("更新貼文失敗");

            // 2️⃣ 若有新圖片 → 上傳
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);

                const imgRes = await fetch(
                    `https://ntouber-post.zeabur.app/api/posts/upload_image?post_id=${postId}`,
                    {
                        method: "PATCH",
                        body: formData,
                    }
                );

                if (!imgRes.ok) throw new Error("圖片上傳失敗");
            }

            alert("✅ 貼文已成功更新");
            navigate(`/post/${postId}`);
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                ⏳ 載入貼文中…
            </div>
        );
    }


    return (
        <motion.div
            className="max-w-2xl mx-auto my-10 bg-white rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >

            <div className="px-8 py-6">
                <h2 className="text-2xl font-bold text-gray-800">編輯貼文</h2>
                <p className="text-sm text-gray-500 mt-1">
                    修改你的共乘資訊，儲存後將立即生效
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">

                    {/* ===== 變更貼文圖片 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            變更貼文圖片
                        </label>

                        <div className="relative w-full bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden h-64 mb-4">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="preview"
                                    className="max-w-full max-h-full object-contain rounded-xl"
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">
                                    尚未上傳圖片
                                </div>
                            )}

                            {/* 浮在圖片上的按鈕 */}
                            <label className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-2 rounded-lg cursor-pointer hover:bg-black transition">
                                變更圖片
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>



                    {/* ===== 起點名稱 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更出發地名稱
                        </label>
                        <input
                            className={inputClass}
                            value={post.starting_point.Name}
                            onChange={(e) =>
                                updateNested("starting_point", "Name", e.target.value)
                            }
                            placeholder="例如：海大校門口"
                        />
                    </div>

                    {/* ===== 起點地址 ===== */}
                    <AddressEditor
                        label="變更起點地址"
                        address={startAddress}
                        setAddress={setStartAddress}
                    />

                    {/* ===== 目的地名稱 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更目的地名稱
                        </label>
                        <input
                            className={inputClass}
                            value={post.destination.Name}
                            onChange={(e) =>
                                updateNested("destination", "Name", e.target.value)
                            }
                            placeholder="例如：台北車站"
                        />
                    </div>

                    {/* ===== 目的地地址 ===== */}
                    <AddressEditor
                        label="變更目的地地址"
                        address={destAddress}
                        setAddress={setDestAddress}
                    />

                    {/* ===== 集合地點 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更集合地點
                        </label>
                        <input
                            className={inputClass}
                            value={post.meet_point.Name}
                            onChange={(e) =>
                                updateNested("meet_point", "Name", e.target.value)
                            }
                            placeholder="例如：7-11 門口"
                        />
                    </div>

                    {/* ===== 出發時間 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更出發時間
                        </label>
                        <input
                            type="datetime-local"
                            name="departure_time"
                            value={post.departure_time}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </div>

                    {/* ===== 車型 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更車型
                        </label>
                        <input
                            name="vehicle_info"
                            value={post.vehicle_info}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="例如：Gogoro VIVA"
                        />
                    </div>

                    {/* ===== 貼文簡述 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更貼文簡述
                        </label>
                        <textarea
                            name="notes"
                            value={post.notes}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[70px]`}
                            placeholder="簡短說明這趟共乘"
                        />
                    </div>

                    {/* ===== 備註 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            變更備註
                        </label>
                        <textarea
                            name="description"
                            value={post.description}
                            onChange={handleChange}
                            className={`${inputClass} min-h-[90px]`}
                            placeholder="可補充其他注意事項"
                        />
                    </div>

                    {/* ===== 其他設定 ===== */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            變更其他設定
                        </label>

                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="helmet"
                                    checked={post.helmet}
                                    onChange={handleChange}
                                />
                                提供安全帽
                            </label>

                            <label className="flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="leave"
                                    checked={post.leave}
                                    onChange={handleChange}
                                />
                                允許中途下車
                            </label>
                        </div>
                    </div>

                    {/* ===== 按鈕 ===== */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
                        >
                            取消
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 rounded-lg 
               bg-black text-white 
               hover:bg-gray-900 
               disabled:opacity-50 
               transition"
                        >
                            {saving ? "儲存中…" : "儲存修改"}
                        </button>

                    </div>
                </form>
            </div>
        </motion.div>
    );

}


function AddressEditor({ label, address, setAddress }) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                {label}
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                    className={inputClass}
                    value={address.city}
                    onChange={(e) =>
                        setAddress({
                            city: e.target.value,
                            district: "",
                            street: address.street,
                        })
                    }
                >
                    <option value="">選擇縣市</option>
                    {Object.keys(cityDistrictMap).map(city => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>

                <select
                    className={inputClass}
                    value={address.district}
                    onChange={(e) =>
                        setAddress({ ...address, district: e.target.value })
                    }
                    disabled={!address.city}
                >
                    <option value="">選擇鄉鎮區</option>
                    {(cityDistrictMap[address.city] || []).map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            <input
                className={`${inputClass} mt-3`}
                placeholder="路名與門牌"
                value={address.street}
                onChange={(e) =>
                    setAddress({ ...address, street: e.target.value })
                }
            />
        </div>
    );
}

export default EditPostPage;
