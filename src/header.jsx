import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import { HiMenu } from "react-icons/hi";
import { useUser } from "./contexts/UserContext.jsx";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, userRole } = useUser();

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
          {isLoggedIn && user ? (
            <button
              className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
              onClick={() => navigate("/Profile")}
            >
              <div className="w-10 h-10 bg-white-700 rounded-full flex items-center justify-center text-xl font-bold">
                {user.picture ? (
                  <img
                    src={user.picture}
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
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
      />
    </>
  );
}

export default Header;
