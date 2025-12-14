import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import { motion, AnimatePresence } from "framer-motion";
function EditProfilePage() {
    const navigate = useNavigate();

    const { user, updateUser, userRole, setUser, driver, updateDriver } = useUser();
    const [name, setName] = useState(user?.Name || "");
    const [phone, setPhone] = useState(user?.PhoneNumber || "");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.AvatarURL || null);

    const [carType, setCarType] = useState(driver?.scooter_type || "");
    const [DriverLicense, setDriverLicense] = useState(driver?.driver_license || "");
    const [Status, setStatus] = useState(driver?.status || "");
    const [plateNum, setPlateNum] = useState(driver?.plate_num || "");
    const [phoneError, setPhoneError] = useState("");
    const [nameError, setNameError] = useState("");

    const isDriver = userRole === "車主";
    const isPhoneInvalid = !phone || !phone.trim() || !!phoneError;
    const isFormInvalid = !name.trim() || !!nameError || !phone.trim() || !!phoneError;

    const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const uploadAvatar = async () => {
        const formData = new FormData();
        formData.append("image", avatarFile);

        const res = await fetch("https://ntouber-user.zeabur.app/v1/images/avatar", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("頭像上傳失敗");

        const data = await res.json();
        const url = data.url;

        setUser(prev => ({
            ...prev,
            AvatarURL: url,
        }));

        return url;
    };

    const handleSave = async () => {
        try {
            if (!user?.ID) return alert("尚未登入");

            if (isFormInvalid) {
                alert("請先填寫正確的姓名與電話");
                return;
            }

            let avatarUrl = user.AvatarURL;
            if (avatarFile) avatarUrl = await uploadAvatar();

            // 更新使用者基本資料
            const updateData = {
                ID: user.ID,
                Name: name,
                PhoneNumber: phone,
                AvatarURL: avatarUrl,
            };

            const successUser = await updateUser(updateData);

            let successDriver = true;

            if (isDriver) {
                const driverUpdateData = {
                    user_id: user.ID,
                    driver_name: name,
                    contact_info: phone,
                    scooter_type: carType,
                    plate_num: plateNum.toUpperCase(),
                    driver_license: DriverLicense,
                    status: Status
                };
                console.log('Driver DriverLicense:',)
                console.log('Driver Data:', driverUpdateData)
                successDriver = await updateDriver(driverUpdateData);
            }

            if (successUser && successDriver) {
                alert("資料已更新！");
                navigate("/Profile");
            } else {
                alert("更新失敗");
            }
        } catch (err) {
            console.error("更新錯誤：", err);
            alert("更新失敗，請稍後再試");
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-gray-100 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    編輯個人資料
                </h1>

                <div className="flex flex-col items-center mb-6">
                    <label htmlFor="avatarInput" className="cursor-pointer">
                        <img
                            src={avatarPreview || "/default-avatar.png"}
                            alt="avatar"
                            className="w-28 h-28 rounded-full object-cover border shadow-sm hover:opacity-80 transition"
                        />
                    </label>

                    <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                    <p className="text-xs text-gray-400 mt-2">點擊圖片以更換頭像</p>
                </div>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            電子郵件（不可修改）
                        </label>
                        <input
                            type="text"
                            value={user?.Email || ""}
                            disabled
                            className="w-full bg-gray-100 text-gray-500 border border-gray-300 rounded-md px-3 py-2 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            姓名
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setName(value);

                                if (!value.trim()) {
                                    setNameError("姓名不得為空");
                                } else {
                                    setNameError("");
                                }
                            }}
                            placeholder="請輸入姓名"
                            className={`w-full border rounded-md px-3 py-2 outline-none transition
            ${nameError
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-black"
                                }`}
                        />

                        {nameError && (
                            <p className="text-sm text-red-500 mt-1">{nameError}</p>
                        )}
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            電話
                        </label>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPhone(value);

                                if (!value.trim()) {
                                    setPhoneError("電話號碼為必填");
                                } else if (!/^09\d{2}-?\d{3}-?\d{3}$/.test(value)) {
                                    setPhoneError("電話格式錯誤，請輸入 09xx-xxx-xxx");
                                } else {
                                    setPhoneError("");
                                }
                            }}
                            placeholder="09xx-xxx-xxx"
                            className={`w-full border rounded-md px-3 py-2 outline-none transition
            ${phoneError
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-black"
                                }`}
                        />

                        {phoneError && (
                            <p className="text-sm text-red-500 mt-1">{phoneError}</p>
                        )}
                    </div>

                    {isPhoneInvalid && (
                        <p className="text-sm text-red-500 mt-4 text-center">
                            ⚠️ 請正確填寫電話號碼後，才能儲存或離開此頁
                        </p>
                    )}

                </div>

                {/* 車主資料 */}
                {isDriver && (
                    <>
                        <div className="my-6 border-t border-gray-300"></div>

                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            車子資訊
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    車子型號
                                </label>
                                <input
                                    type="text"
                                    value={carType}
                                    onChange={(e) => setCarType(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    車牌號碼
                                </label>
                                <input
                                    type="text"
                                    value={plateNum}
                                    onChange={(e) => setPlateNum(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black outline-none"
                                />
                            </div>
                        </div>
                    </>
                )}

                {/* 按鈕區 */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={handleSave}
                        disabled={isFormInvalid}
                        className={`w-full py-3 rounded-md shadow font-medium transition
                        ${isFormInvalid
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-black hover:bg-gray-800 text-white"
                            }`}
                    >
                        儲存變更
                    </button>


                    <button
                        onClick={() => {
                            if (isFormInvalid) {
                                alert("請先填寫完整且正確的姓名與電話");
                                return;
                            }
                            navigate("/Profile");
                        }}
                        className={`w-full py-3 border rounded-md shadow font-medium transition
                        ${isFormInvalid
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                                : "bg-white text-gray-700 border-gray-400 hover:bg-gray-100"
                            }`}
                    >
                        取消
                    </button>


                </div>
            </div>
        </motion.div>
    );
}

export default EditProfilePage;
