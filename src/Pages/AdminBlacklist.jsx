import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminUserActions from "../Pages/hooks/useAdminUserActions"; 

const BL_API = "https://ntouber-admin.zeabur.app/admin/blacklist";
const USER_API = "https://ntouber-user.zeabur.app/v1/users";


export default function AdminBlacklist() {
	const navigate = useNavigate();
	const [blacklist, setBlacklist] = useState([]);
    
    // ⭐ 取得新的操作函數。這裡不需要傳入 setUser 或 navigate。
    const { handleDeleteFromBlacklist } = useAdminUserActions();
	useEffect(() => {
		async function fetchBlacklist() {
			try {
				const r = await fetch(BL_API, { method: "GET" });
				if (!r.ok) throw new Error(`API 錯誤 (${r.status})`);
				const data = await r.json();
				const list = Array.isArray(data) ? data : [];

				const uniqueUserIds = [...new Set(list.map((b) => String(b.userId)))];

				const userMap = {};
				await Promise.all(
					uniqueUserIds.map(async (id) => {
						try {
							const ur = await fetch(`${USER_API}/${id}`, { method: "GET" });
							if (!ur.ok) return;

							const u = await ur.json();
							userMap[id] = u;
						} catch (e) {
							console.error("抓 user 失敗：", id, e);
						}
					})
				);

				const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

				const enriched = list.map((b) => {
					const u = userMap[String(b.userId)];
					const userName =
						u?.userName ||
						u?.UserName ||
						u?.Name ||
						String(b.userId);

					const avatarUrl =
						u?.avatarUrl ||
						u?.AvatarURL ||
						DEFAULT_AVATAR;

					return {
						...b,
						userName,
						avatarUrl
					};
				});

				setBlacklist(enriched);
			} catch (err) {
				console.error("抓取黑名單失敗：", err);
			}
		}

		fetchBlacklist();
	}, []);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-2xl mx-auto px-4 pb-16">
				<button
					className="text-sm text-gray-600 mt-3"
					onClick={() => navigate(-1)}
				>
					← 返回
				</button>

				<div className="mt-6">
					<h2 className="text-base font-bold text-gray-900">所有黑名單</h2>
					<p className="text-xs text-gray-500 mt-0.5">查看系統中的所有黑名單</p>
				</div>

				<div className="mt-4 space-y-4">
					{blacklist.map((b, idx) => (
						<div
							key={`${b.userId}-${b.createdAt}-${idx}`}
							className="
								bg-white
								rounded-lg
								p-4
								shadow-sm
								border
								text-sm
								text-gray-800
								flex
								justify-between
								items-center
							"
						>
							<div
								className="flex items-center space-x-3 cursor-pointer"
								onClick={() => navigate("/admin/DetailBlacklist", { state: { blacklist: b } })}
							>
								<img
									src={b.avatarUrl}
									alt={b.userName}
									className="h-10 w-10 rounded-full object-cover"
								/>
								<p className="font-medium">{b.userName}</p>
							</div>

                            {/* 新增從黑名單移除按鈕 */}
                            <button
                                onClick={() => handleDeleteFromBlacklist(b, setBlacklist)}
                                className="
                                    px-3 py-1 
                                    bg-green-500 hover:bg-green-600 
                                    text-white text-xs 
                                    rounded-full 
                                    transition-colors
                                "
                            >
                                移出黑名單
                            </button>

						</div>
					))}
				</div>

			</div>
		</div>
	);
}