import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserClass from "../models/UserClass";

function RegisterPage() {
    const navigate = useNavigate();

    const [user, setUser] = useState(
        new UserClass("", "", "", "", "", "", false)
    );

    const [frontImage, setFrontImage] = useState(null); // 駕照正面
    const [backImage, setBackImage] = useState(null);   // 駕照反面

    // 預覽圖片
    // const [frontPreview, setFrontPreview] = useState(null);
    // const [backPreview, setBackPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // 讀取圖片成 Base64
    const handleImageUpload = (e, setImage, setPreview) => {
        const file = e.target.files[0];
        if (!file) return;

        //這是一個本來就可以直接用的東西
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result); // Base64 給後端
            setPreview(reader.result); // 用於預覽
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("jwtToken");
        const loggedUser = JSON.parse(localStorage.getItem("user"));

        if (!loggedUser || !loggedUser.id) {
            alert("尚未登入");
            return;
        }

        if (!user.carType.trim() || !user.licenseNum.trim()) {
            alert("請輸入車型與車牌！");
            return;
        }

        // if (!frontImage || !backImage) {
        //     alert("請上傳駕照正反面！");
        //     return;
        // }

        const payload = {
            user_id: loggedUser.id,
            driver_name: loggedUser.name || loggedUser.Name,
            contact_info: loggedUser.phoneNumber || loggedUser.PhoneNumber,
            scooter_type: user.carType,
            plate_num: user.licenseNum.toUpperCase()
        };


        console.log("送到後端的車主資料：", payload);

        try {
            const res = await fetch("https://ntouber-user.zeabur.app/v1/users/driver", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const err = await res.text();
                console.error("後端錯誤：", err);
                alert("申請失敗：" + err);
                return;
            }

            alert("成功升級成車主！");
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

                    {/* 駕照正面
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">駕照正面</label>
                        <label className="cursor-pointer flex items-center gap-2 px-2.5 py-1.5 
       bg-white/80 backdrop-blur border border-gray-300 
       shadow-sm text-gray-800 rounded-md hover:bg-gray-100 
       transition text-xs w-fit">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M6.75 7.5l-.625-1.25A1.125 1.125 0 017.125 5h9.75a1.125 1.125 0 011 .75L18.75 7.5H19.5A2.25 2.25 0 0121.75 9.75v7.5A2.25 2.25 0 0119.5 19.5H4.5A2.25 2.25 0 012.25 17.25v-7.5A2.25 2.25 0 014.5 7.5h2.25z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>

                            上傳駕照正面

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, setFrontImage, setFrontPreview)}
                            />
                        </label>



                        {frontPreview && (
                            <img src={frontPreview} alt="Front Preview" className="mt-2 rounded-md shadow" />
                        )}
                    </div> */}

                    {/* 駕照反面 */}
                    {/* <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">駕照反面</label>

                        <label className="cursor-pointer flex items-center gap-2 px-2.5 py-1.5 
       bg-white/80 backdrop-blur border border-gray-300 
       shadow-sm text-gray-800 rounded-md hover:bg-gray-100 
       transition text-xs w-fit">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M6.75 7.5l-.625-1.25A1.125 1.125 0 017.125 5h9.75a1.125 1.125 0 011 .75L18.75 7.5H19.5A2.25 2.25 0 0121.75 9.75v7.5A2.25 2.25 0 0119.5 19.5H4.5A2.25 2.25 0 012.25 17.25v-7.5A2.25 2.25 0 014.5 7.5h2.25z" />
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M12 15.75a3 3 0 100-6 3 3 0 000 6z" />
                            </svg>

                            上傳駕照反面

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, setBackImage, setBackPreview)}
                            />
                        </label>


                        {backPreview && (
                            <img src={backPreview} alt="Back Preview" className="mt-2 rounded-md shadow" />
                        )}
                    </div> */}


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
