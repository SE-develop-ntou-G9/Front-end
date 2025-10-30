import React, { useState } from "react";
import { useNavigate, BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SideBar from "./SideBar"
import { HiMenu } from "react-icons/hi"; // Side Bar的import
import { HiUser } from "react-icons/hi"; //人頭import

function Header({ isLoggedIn, setIsLoggedIn }) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();


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
          onClick={() => navigate("/")}
          className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-gray-80"
        >
          NTOUber
        </button>

        {/* 右邊的登入登出 */}
        <div>
          {isLoggedIn ? (
            // 這個是那個人頭的功能 要加
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="個人頁面"
              onClick={() => navigate("/Profile")}
            >
              <HiUser className="text-2xl text-gray-700" />
            </button>
          ) : (
            <>
              <button
                className="px-3 py-1 bg-black text-white border border-gray-400 rounded-full text-sm hover:bg-gray-100 "
                onClick={() => navigate("/login")} //按下去到login
              >
                Login / SignOn
              </button>
            </>
          )}
        </div>

      </header>

      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggleLogin={() => setIsLoggedIn(!isLoggedIn)}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
export default Header;