import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";

function EditProfilePage() {
    const navigate = useNavigate();
    const { user, updateUser, userRole } = useUser();
    const { user: loggedUser, refreshUserData } = useUser();  // 改用 refreshUserData

    const [name, setName] = useState(user?.Name || "");
    const [phone, setPhone] = useState(user?.PhoneNumber || "");

    const isDriver = userRole === "車主";

    const handleSave = async () => {
        try {
            if (!user || !user.ID) {
                alert("尚未登入");
                return;
            }

            const updateData = {
                ID: user.ID,
                Name: name,
                PhoneNumber: phone,
            };

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
