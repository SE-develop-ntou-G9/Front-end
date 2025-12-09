// AdminDetailBlacklist.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminDetailBlacklist() {
	const navigate = useNavigate();
	const { state } = useLocation();

	// navigate("/admin/DetailBlacklist", { state: { blacklist: b } })
	const b = state?.blacklist;

	if (!b) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-2xl mx-auto px-4 pb-16">
					<button
						className="text-sm text-gray-600 mt-3"
						onClick={() => navigate(-1)}
					>
						← 返回
					</button>

					<div className="mt-6 bg-white rounded-lg p-4 shadow-sm border text-sm text-gray-700">
						沒有收到黑名單資料（可能是重新整理或直接開網址）。
						請回黑名單列表重新點一次。
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-2xl mx-auto px-4 pb-16">
				<button
					className="text-sm text-gray-600 mt-3"
					onClick={() => navigate(-1)}
				>
					← 返回列表
				</button>

				<div className="mt-4 bg-white rounded-lg p-4 shadow-sm border text-sm text-gray-800 space-y-3">
					<div>
						<div className="text-xs text-gray-500">userId</div>
						<div className="font-medium break-all">{b.userId}</div>
					</div>

					<div>
						<div className="text-xs text-gray-500">createdAt</div>
						<div className="break-all">{b.createdAt}</div>
					</div>

					<div>
						<div className="text-xs text-gray-500">reason</div>
						<div className="break-all">{b.reason}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
