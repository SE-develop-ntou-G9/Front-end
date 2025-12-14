import { useState, useEffect } from "react";

const userAPI = "https://ntouber-user.zeabur.app/v1/users";

/**
 * 獲取單個用戶資訊的通用函式
 * @param {string} userId - 要查詢的用戶ID
 * @returns {Promise<Object>} - 用戶物件
 */
export async function fetchUserById(userId) {
    if (!userId) return null;

    // 檢查快取 (可選的優化步驟)
    const cachedUser = localStorage.getItem(`user_${userId}`);
    if (cachedUser) {
        return JSON.parse(cachedUser);
    }

    try {
        const response = await fetch(`${userAPI}/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            // 可能是用戶不存在或其他 API 錯誤，我們返回 null
            console.error(`獲取用戶 ${userId} 失敗: ${response.status}`);
            return null;
        }

        const userData = await response.json();
        
        // 將獲取的用戶資料存入快取 
        localStorage.setItem(`user_${userId}`, JSON.stringify(userData));

        return userData;
    } catch (error) {
        console.error(`fetchUserById 錯誤 (${userId}):`, error);
        return null;
    }
}

