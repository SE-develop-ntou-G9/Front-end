// ./Pages/EditProfilePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfilePage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    const [name, setName] = useState(storedUser.name || "");
    const [phone, setPhone] = useState(storedUser.phone || "");
    const [carInfo, setCarInfo] = useState(storedUser.carInfo || "");
    const [carNumber, setCarNumber] = useState(storedUser.carNumber || "");

    const handleSave = async () => {
        if (!phone.trim()) {
            alert("請輸入電話號碼！");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            alert("未登入，請重新登入！");
            return;
        }

        const body = {
            userName: name,
            phone: phone,
            carType: carInfo,
            licenseNum: carNumber,
            email: storedUser.email//  保持原本 email
        };

        try {
            const res = await fetch("https://ntouber-user.zeabur.app/v1/users/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                throw new Error("後端更新失敗");
            }

            const data = await res.json();

            // 更新 localStorage
            const updatedUser = {
                ...storedUser,
                ...data.user  // 後端回傳最新 user
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            alert("資料已成功更新！");
            navigate("/Profile");

        } catch (error) {
            console.error(error);
            alert("更新失敗，請稍後再試！");
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

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">車子型號</label>
                        <input
                            type="text"
                            value={carInfo}
                            onChange={(e) => setCarInfo(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="輸入車子型號"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-500 mb-1">車牌</label>
                        <input
                            type="text"
                            value={carNumber}
                            onChange={(e) => setCarNumber(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="輸入車牌"
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
