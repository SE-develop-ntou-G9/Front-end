import React, { useState, useRef, useEffect } from "react"; // 🌟 引入 useRef 和 useEffect
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import { HiMenu } from "react-icons/hi";
import { useUser } from "./contexts/UserContext.jsx";

function Header() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, userRole } = useUser();
  const isAdminPage = (location.pathname.startsWith("/admin") || location.pathname.startsWith("/AdminDetailPost"));

  // 🌟 1. 創建一個 Ref 來指向 SideBar 內部實際的 DOM 元素
  const sidebarRef = useRef(null);

  // 🌟 2. 使用 useEffect 來監聽所有點擊事件
  useEffect(() => {

    function handleClickOutside(event) {
      // 如果側邊欄是開啟的 且
      // 點擊的目標不在側邊欄 DOM 元素內
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false); // 關閉側邊欄
      }
    }

    // 將事件監聽器添加到整個 document
    document.addEventListener("mousedown", handleClickOutside);

    // 清除函式：組件卸載時移除事件監聽器
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]); // 僅在 isSidebarOpen 改變時重新執行

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b flex justify-between items-center px-4 py-3 z-10 h-15">
        {/* 左邊的選單 */}
        <button
          className="text-gray-600 text-2xl"
          onClick={() => setIsSidebarOpen(true)}
        >
          <HiMenu />
        </button>

        {/* 中間的標題 */}
        <button
          onClick={() => {
            {isAdminPage ? navigate("/admin") : navigate("/")}
          }}
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-gray-80"
        >
          {isAdminPage ? "管理員" : "NTOUber"}
        </button>

        {/* 右邊的登入登出 */}
        <div>
          {isLoggedIn && user ? (
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => navigate("/Profile")}
            >
              <div className="w-10 h-10 bg-white-700 rounded-full flex items-center justify-center text-xl font-bold">
                {user.AvatarURL ? (
                  <img
                    src={user.AvatarURL}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                    {user.Name ? user.Name.charAt(0) : "?"}
                  </div>
                )}
              </div>
              <span className="hidden md:block text-sm"></span>
            </button>
          ) : (
            <>
              <button
                className="px-3 py-1 bg-black text-white border border-gray-400 rounded-full text-sm hover:bg-gray-100"
                onClick={() => navigate("/login")}
              >
                Login / SignOn
              </button>
            </>
          )}
        </div>
      </header>

      <SideBar
        sidebarRef={sidebarRef} // 傳入 Ref
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
    </>
  );
}

export default Header;