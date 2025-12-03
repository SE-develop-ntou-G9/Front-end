import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import UserClass from "../models/UserClass";

function RegisterPage() {
    const navigate = useNavigate();
    const { user: loggedUser, refreshUserData } = useUser();

    const [user, setUser] = useState(
        new UserClass("", "", "", "", "", "", false)
    );

    //駕照們
    const [frontFile, setFrontFile] = useState(null);

    const [frontPreview, setFrontPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleFileSelect = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (!file) return;

        setFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const uploadLicense = async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("https://ntouber-user.zeabur.app/v1/images/license", {
            method: "POST",
            body: formData,
        });


        if (!res.ok) throw new Error("駕照上傳失敗");
        const data = await res.json();

        return data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loggedUser || !loggedUser.ID) {
            alert("尚未登入");
            navigate("/login");
            return;
        }

        if (!user.carType.trim() || !user.licenseNum.trim()) {
            alert("請輸入車型與車牌！");
            return;
        }

        // 上傳駕照圖片
        let frontUrl = await uploadLicense(frontFile);

        console.log(frontUrl);

        const payload = {
            user_id: loggedUser.ID,
            driver_name: loggedUser.Name,
            contact_info: loggedUser.PhoneNumber,
            scooter_type: user.carType,
            plate_num: user.licenseNum.toUpperCase(),
            driver_license: frontUrl
        };

        console.log("送到後端的資料：", payload);

        try {
            const res = await fetch("https://ntouber-user.zeabur.app/v1/users/driver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.text();
                alert("申請失敗：" + err);
                return;
            }

            alert("成功升級成車主！");
            await refreshUserData();
            navigate("/Profile");

        } catch (err) {
            console.error("fetch 錯誤：", err);
            alert("發生錯誤，請稍後再試");
        }
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-md rounded-lg p-6 w-80 border border-gray-200">
                <h2 className="text-center text-xl font-bold text-gray-800 mb-4">
                    升級成為車主
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">車型</label>
                        <input
                            type="text"
                            name="carType"
                            value={user.carType}
                            onChange={handleChange}
                            placeholder="車型"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">車牌</label>
                        <input
                            type="text"
                            name="licenseNum"
                            value={user.licenseNum}
                            onChange={handleChange}
                            placeholder="車牌"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    {/* 駕照正面 */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">駕照正面</label>

                        <label className="cursor-pointer flex items-center gap-2 px-3 py-2 
                                bg-white border rounded-md shadow-sm hover:bg-gray-100 transition text-sm">
                            📄 上傳駕照正面
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileSelect(e, setFrontFile, setFrontPreview)}
                            />
                        </label>

                        {frontPreview && (
                            <img src={frontPreview} className="mt-2 rounded-md shadow" alt="front" />
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                    >
                        送出升級申請
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    <button
                        onClick={() => navigate("/")}
                        className="underline ml-1 hover:text-gray-800"
                    >
                        返回主畫面
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
