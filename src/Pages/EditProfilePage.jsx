import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

function EditProfilePage() {
    const navigate = useNavigate();
    const { user, updateUser, userRole, setUser } = useUser();

    const [name, setName] = useState(user?.Name || "");
    const [phone, setPhone] = useState(user?.PhoneNumber || "");


    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.AvatarURL || null);

    const isDriver = userRole === "車主";

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
            if (!user || !user.ID) {
                alert("尚未登入");
                return;
            }

            let avatarUrl = user.AvatarURL;

            if (avatarFile) {
                avatarUrl = await uploadAvatar();
            }

            const updateData = {
                ID: user.ID,
                Name: name,
                PhoneNumber: phone,
                AvatarURL: avatarUrl,
            };
            console.log("送給後端的資料 : ", updateData);

            const success = await updateUser(updateData);

            if (success) {
                alert("資料已更新！");
                navigate("/profile");
            } else {
                alert("更新失敗");
            }

        } catch (err) {
            console.error("更新錯誤：", err);
            alert("更新失敗，請稍後再試");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md border border-gray-200">
                <h1 className="text-xl font-bold mb-6 text-center">編輯個人資料</h1>

                <div className="space-y-4">
                    <div className="relative flex flex-col items-center">
                        <label htmlFor="avatarInput" className="cursor-pointer">
                            <img
                                src={avatarPreview || "/default-avatar.png"}
                                alt="avatar"
                                className="w-28 h-28 rounded-full object-cover border hover:opacity-80 transition"
                            />
                        </label>

                        <input
                            id="avatarInput"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />
                    </div>


                    <div>
                        <label className="block text-sm text-gray-500 mb-1">姓名</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="輸入姓名"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">電話</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="輸入電話"
                        />
                    </div>

                    {/* <label>機車類型</label>
                    <input
                        type="text"
                        value={carInfo}
                        onChange={(e) => setCarInfo(e.target.value)}
                        className="border p-2 w-full"
                    />

                    <label>車牌號碼</label>
                    <input
                        type="text"
                        value={carNumber}
                        onChange={(e) => setCarNumber(e.target.value)}
                        className="border p-2 w-full"
                    /> */}

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">電子郵件 (不可修改)</label>
                        <input
                            type="text"
                            value={user?.Email || ""}
                            disabled
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">登入方式 (不可修改)</label>
                        <input
                            type="text"
                            value={user?.Provider || ""}
                            disabled
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <button
                        onClick={handleSave}
                        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
                    >
                        儲存
                    </button>
                    <button
                        onClick={() => navigate("/Profile")}
                        className="w-full border border-gray-400 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
