// Pages/hooks/useUserNotify.jsx (新檔案)

import { useState } from "react";

// 通知 API 的基礎 URL
const BASE_URL = "https://ntouber-gateway.zeabur.app/v1";

const authHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

export function useUserNotify() {
    
    /**
     * 發送通知給指定用戶
     * @param {string} receiverId - 接收通知的用戶ID (Post Driver ID)
     * @param {string} senderId - 發送通知的用戶ID (Current Client ID)
     * @param {string} message - 通知內容
     * @returns {Promise<boolean>} - 是否發送成功
     */
    const sendNotification = async ({ receiverId, senderId, message }) => {
        if (!receiverId || !senderId || !message) {
            console.error("發送通知失敗: 缺少必要的 ID 或訊息。");
            return false;
        }

        try {
            const url = `${BASE_URL}/notifications`; // POST API
            // console.log("receiverId",receiverId);
            // console.log("senderId",senderId);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader(),
                },
                body: JSON.stringify({
                    RecieverID: receiverId, 
                    SenderID: senderId,     
                    Message: message,      
                    Status: "unread",  
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("發送通知 API 錯誤:", errorData.message || response.statusText);
                // 即使通知發送失敗，也不中斷主要請求流程
                return false;
            }

            console.log("通知發送成功。");
            return true;

        } catch (error) {
            console.error("發送通知發生網路錯誤:", error);
            return false;
        }
    };
    
    /**
     * 將指定通知標記為已讀
     * @param {string} id - 通知 ID
     */
    const readed = async (id) => {
        if (!id) return false;

        try {
            const url = `${BASE_URL}/notifications/${id}`;
            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...authHeader(),
                },
                body: JSON.stringify({
                    Status: "read" // 將狀態更新為 read
                }),
            });

            if (!response.ok) {
                console.error(`更新通知 ${id} 狀態失敗`);
                return false;
            }
            return true;
        } catch (error) {
            console.error("更新通知已讀時發生網路錯誤:", error);
            return false;
        }
    };

    return { sendNotification, readed };
}