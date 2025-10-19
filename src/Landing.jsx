import React from "react";
import { HiSearch } from "react-icons/hi";

function RideCard({ title, subtitle, tags }) {
  return (
    <div className="bg-white rounded-lg shadow p-3 border">
      <div className="h-28 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm mb-3">
        地圖
      </div>
      <div className="text-sm text-gray-800">
        <div className="font-medium truncate" title={title}>{title}</div>
        <div className="text-gray-500 text-xs">⋯⋯</div>
      </div>
      <div className="mt-3">
        <div className="text-xs text-gray-600 mb-1">尋找同路人！</div>
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 border rounded-full text-xs text-gray-700">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-gray-700">
        <span className="inline-block w-3 h-3 bg-gray-300 rounded-full" />
        用戶A
      </div>
      <div className="mt-2 text-gray-400 text-sm">👍 🔗</div>
    </div>
  );
}

export default function Landing() {
  const demoCards = [
    {
      title: "海大校門 -> 基隆火車站",
      subtitle: "最新共乘邀請",
      tags: ["自備安全帽", "中途下車"],
    },
    {
      title: "海大校門 -> 基隆火車站",
      subtitle: "最新共乘邀請",
      tags: ["不可抽菸", "提供安全帽"],
    },
    {
      title: "海大校門 -> 基隆火車站",
      subtitle: "最新共乘邀請",
      tags: ["中途下車", "提供安全帽"],
    },
    {
      title: "海大校門 -> 龍崗社區",
      subtitle: "慢個兩分鐘!",
      tags: ["中途下車", "自備安全帽"],
    },
  ];

  return (
    <div className="px-4 pb-6 max-w-screen-sm mx-auto">
      {/* Search */}
      <div className="mt-4">
        <div className="flex items-center gap-2 bg-gray-100 border rounded-full px-4 py-3">
          <HiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for a ride"
            className="bg-transparent outline-none text-sm w-full placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Section title */}
      <div className="mt-5">
        <div className="text-base font-semibold">最新共乘邀請</div>
        <div className="text-xs text-gray-500 mt-1">查看其他使用者的共乘邀請</div>
      </div>

      {/* Cards */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {demoCards.map((c, idx) => (
          <RideCard key={idx} {...c} />
        ))}
      </div>
    </div>
  );
}

