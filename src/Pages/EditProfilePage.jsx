// ./Pages/EditProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    const [name, setName] = useState(storedUser.Name || "");
    const [phone, setPhone] = useState(storedUser.PhoneNumber || "");


    const handleSave = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(JSON.parse(localStorage.getItem("user")));


            if (!user || !user.id) {
                alert("尚未登入");
                return;
            }

            // 只傳送要修改的欄位
            const updateData = {
                ID: user.id,
                Name: name,
                PhoneNumber: phone,
            };

            console.log(updateData);
            const res = await fetch("https://ntouber-user.zeabur.app/v1/users/mod", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                const errorData = await res.text();
                console.error("更新失敗:", errorData);
                alert("更新失敗");
                return;
            }

            // 更新 localStorage 中的使用者資料
            const updatedUser = {
                ...user,
                Name: name,
                PhoneNumber: phone
            };

            console.log(updatedUser);
            console.log("更新後的使用者資料:", updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("資料已更新！");
            navigate("/profile");

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

                    {/* 顯示不可編輯的資訊 */}
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">電子郵件 (不可修改)</label>
                        <input
                            type="text"
                            value={storedUser.Email || ""}
                            disabled
                            className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">登入方式 (不可修改)</label>
                        <input
                            type="text"
                            value={storedUser.Provider || ""}
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
