import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "./SideBar";
import { HiMenu } from "react-icons/hi";
import { IoNotificationsOutline, IoCloseCircle } from "react-icons/io5";
import { useUser } from "./contexts/UserContext.jsx";
import { fetchUserById } from "./Pages/hooks/useUserFetcher.jsx";

const BASE_URL = "https://ntouber-user.zeabur.app/v1";

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isLoggedIn, userRole, isAdmin } = useUser();
    const isAdminPage =
        location.pathname.startsWith("/admin") ||
        location.pathname.startsWith("/AdminDetailPost");

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const [notifications, setNotifications] = useState([]); // 儲存通知列表
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // 控制通知選單顯示
    const notificationRef = useRef(null); // 用於判斷點擊是否在通知選單外部
    const [senderUsers, setSenderUsers] = useState({});

    const fetchNotifications = async (userId) => {
        // console.log("嘗試獲取通知，userId:", userId);
        if (!userId) return;

        try {
            const url = `${BASE_URL}/notifications/${userId}`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `獲取通知 API 錯誤: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            // console.log("data:", data);
            const fetchedNotifications = data.notifications || data || [];
            setNotifications(fetchedNotifications);

            const senderIds = [
                ...new Set(fetchedNotifications.map((n) => n.SenderID)),
            ].filter((id) => id && !senderUsers[id]); // 過濾掉已有的 ID

            senderIds.forEach(async (id) => {
                const senderData = await fetchUserById(id);
                if (senderData) {
                    // 更新 senderUsers 狀態
                    setSenderUsers((prev) => ({
                        ...prev,
                        [id]: senderData,
                    }));
                }
            });
        } catch (error) {
            console.error("抓取通知失敗：", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn && user?.ID) {
            fetchNotifications(user.ID);
        } else {
            setNotifications([]);
        }
    }, [isLoggedIn, user?.ID]);

    const deleteNotification = async (notificationId) => {
        try {
            setNotifications((prev) =>
                prev.filter((n) => n.ID !== notificationId)
            );

            const url = `${BASE_URL}/notifications/${notificationId}`;

            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(
                    `刪除通知 API 錯誤: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            console.error("刪除通知失敗，請手動刷新或重試。", error);
        }
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                isSidebarOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
            if (
                isNotificationOpen &&
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen, isNotificationOpen]); // 監聽兩個狀態
    // 計算未讀通知數量，這裡假設所有收到的都是未讀。
    // 如果要依賴 Status 欄位，可以改為：notifications.filter(n => n.Status === 'unread').length
    const unreadCount = notifications.length;

    return (
        <>
            <header className="fixed top-0 left-0 w-full bg-white border-b flex justify-between items-center px-4 py-3 z-10 h-15">
                {/* 左邊的選單 */}
                <button
                    className="text-gray-600 text-2xl"
                    onClick={() => {
                        if (!isAdminPage) setIsSidebarOpen(true);
                    }}
                    // disabled={isAdmin}
                >
                    <HiMenu />
                </button>

                {/* 中間的標題 */}
                <button
                    onClick={() => {
                        {
                            isAdminPage ? navigate("/admin") : navigate("/");
                        }
                    }}
                    className="absolute left-1/2 -translate-x-1/2 text-xl font-bold text-gray-80"
                >
                    {isAdminPage ? "管理員" : "NTOUber"}
                </button>

                {/* 右邊的登入/登出和通知 */}
                <div className="flex items-center gap-4 relative">
                    {/* 通知圖示 (只在登入時顯示) */}
                    {isLoggedIn && (
                        <div ref={notificationRef} className="relative">
                            <button
                                className="text-gray-600 text-2xl relative p-1 hover:text-gray-900 transition"
                                onClick={() =>
                                    setIsNotificationOpen((prev) => !prev)
                                }
                            >
                                <IoNotificationsOutline />
                                {/* 未讀通知數量標記 */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* 通知下拉選單 */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
                                    <div className="p-3 font-bold border-b">
                                        通知 ({unreadCount} 則)
                                    </div>
                                    {notifications.length > 0 ? (
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map(
                                                (notification) => {
                                                    // 🔔 獲取發送者資料
                                                    const sender =
                                                        senderUsers[
                                                            notification
                                                                .SenderID
                                                        ];
                                                    const senderName =
                                                        sender?.Name ||
                                                        "系統/未知用戶";
                                                    const senderAvatar =
                                                        sender?.AvatarURL;

                                                    return (
                                                        <div
                                                            key={
                                                                notification.ID
                                                            }
                                                            className="flex justify-between items-start p-3 border-b hover:bg-gray-50 transition"
                                                        >
                                                            <div className="flex items-start">
                                                                {/* 🔔 顯示發送者頭像 */}
                                                                <div className="w-8 h-8 rounded-full flex-shrink-0 mr-3 overflow-hidden">
                                                                    {senderAvatar ? (
                                                                        <img
                                                                            src={
                                                                                senderAvatar
                                                                            }
                                                                            alt="Sender Avatar"
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                                                                            {senderName.charAt(
                                                                                0
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <p className="text-sm flex-1 mr-2 leading-relaxed">
                                                                    <span className="font-semibold block">
                                                                        {/* 🔔 顯示發送者名稱 */}
                                                                        {
                                                                            senderName
                                                                        }
                                                                    </span>
                                                                    <span className="text-gray-600">
                                                                        {notification.Message ||
                                                                            "無內容"}
                                                                    </span>
                                                                    <span className="text-xs text-gray-400 mt-1 block">
                                                                        {notification.TimeStamp
                                                                            ? new Date(
                                                                                  notification.TimeStamp
                                                                              ).toLocaleString()
                                                                            : "未知時間"}
                                                                        {notification.Status ===
                                                                            "unread" && (
                                                                            <span className="ml-2 text-red-500 font-bold">
                                                                                ●
                                                                            </span>
                                                                        )}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <button
                                                                className="text-gray-400 hover:text-red-600 transition flex-shrink-0"
                                                                onClick={() =>
                                                                    deleteNotification(
                                                                        notification.ID
                                                                    )
                                                                }
                                                                title="刪除通知"
                                                            >
                                                                <IoCloseCircle className="text-xl" />
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            目前沒有新的通知
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 右邊的個人檔案/登入登出按鈕 */}
                    <div>
                        {isLoggedIn && user ? (
                            <button
                                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition"
                                onClick={() => navigate("/Profile")}
                            >
                                {/* ... 現有的頭像/使用者名稱邏輯 ... */}
                                <div className="w-10 h-10 bg-white-700 rounded-full flex items-center justify-center text-xl font-bold">
                                    {user.AvatarURL ? (
                                        <img
                                            src={user.AvatarURL}
                                            alt="User Avatar"
                                            className="w-8 h-8 rounded-full border"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold">
                                            {user.Name
                                                ? user.Name.charAt(0)
                                                : "?"}
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
