import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://ntouber-admin.zeabur.app/admin/blacklist";

export default function AdminBlacklist() {
  const navigate = useNavigate();
  const [blacklist, setBlacklist] = useState([]);

  useEffect(() => {
    async function fetchBlacklist() {
      try {
        const r = await fetch(API, { method: "GET" });
        if (!r.ok) throw new Error(`API 錯誤 (${r.status})`);
        const data = await r.json();
        setBlacklist(Array.isArray(data) ? data : []);
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
        
        {/* 標題 */}
        <div className="mt-6">
            <h2 className="text-base font-bold text-gray-900">所有黑名單</h2>
            <p className="text-xs text-gray-500 mt-0.5">查看系統中的所有黑名單</p>
        </div>

        {/* 黑名單列表 */}
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
                    cursor-pointer
                    hover:shadow
                    transition
                    "
                    onClick={() => navigate("/admin/DetailBlacklist", { state: { blacklist: b } })}
                >
                <p className="font-medium truncate">{b.userId}</p>
                </div>
          ))}
        </div>
      </div>
    </div>
  );
}