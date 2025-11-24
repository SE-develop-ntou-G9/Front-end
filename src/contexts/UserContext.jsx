import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser 必須在 UserProvider 內使用");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [driver, setDriver] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);  // 防止重複請求

    // 初始化：檢查是否有 token
    useEffect(() => {
        const token = localStorage.getItem("jwtToken");
        if (token) {
            const storedUserId = localStorage.getItem("userId");
            if (storedUserId) {
                fetchUserData(storedUserId);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    // 從後端獲取使用者資料（不帶 Authorization header）
    const fetchUserData = async (userId) => {
        // 防止重複請求
        if (isFetching) {
            console.log("⏸️ fetchUserData 已在執行中，跳過");
            return;
        }

        try {
            setIsFetching(true);
            setLoading(true);

            // 不帶 Authorization header，因為後端 CORS 不允許
            const res = await fetch(`https://ntouber-user.zeabur.app/v1/users/${userId}`);

            if (!res.ok) {
                throw new Error("取得使用者資料失敗");
            }

            const userData = await res.json();
            console.log("✅ fetchUserData 成功:", userData);
            setUser(userData);
            setIsLoggedIn(true);

            // 檢查是否為車主
            await checkDriverStatus(userId);
        } catch (err) {
            console.error("fetchUserData error:", err);
            logout();
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    // 檢查車主狀態（不帶 Authorization header）
    const checkDriverStatus = async (userId) => {
        try {
            const res = await fetch(`https://ntouber-user.zeabur.app/v1/drivers/user/${userId}`);

            if (res.ok) {
                const driverData = await res.json();
                if (driverData && Object.keys(driverData).length > 0) {
                    console.log("✅ 檢測到車主資料:", driverData);
                    setDriver(driverData);
                    setUserRole("車主");
                } else {
                    console.log("ℹ️ 無車主資料，設為乘客");
                    setDriver(null);
                    setUserRole("乘客");
                }
            } else if (res.status === 404 || res.status === 500) {
                // 404 或 500 表示用戶不是車主
                console.log("ℹ️ 用戶不是車主（狀態碼: " + res.status + "）");
                setDriver(null);
                setUserRole("乘客");
            } else {
                console.log("⚠️ 無法檢查車主狀態，預設為乘客");
                setDriver(null);
                setUserRole("乘客");
            }
        } catch (err) {
            console.log("ℹ️ checkDriverStatus 異常，設為乘客:", err.message);
            setDriver(null);
            setUserRole("乘客");
        }
    };

    // 登入
    const login = async (userData, token) => {
        try {
            // 只儲存 token 和 userId
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userId", userData.id);

            // 從後端獲取完整資料
            await fetchUserData(userData.id);
        } catch (err) {
            console.error("login error:", err);
            throw err;
        }
    };

    // 登出
    const logout = () => {
        setUser(null);
        setDriver(null);
        setIsLoggedIn(false);
        setUserRole(null);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userId");
    };

    // 更新使用者資料（不帶 Authorization header）
    const updateUser = async (updateData) => {
        try {
            const res = await fetch("https://ntouber-user.zeabur.app/v1/users/mod", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData),
            });

            if (!res.ok) {
                throw new Error("更新失敗");
            }

            // 重新獲取使用者資料
            await fetchUserData(user.ID);
            return true;
        } catch (err) {
            console.error("updateUser error:", err);
            return false;
        }
    };

    // 升級為車主（不帶 Authorization header）
    const upgradeToDriver = async (driverData) => {
        try {
            const res = await fetch("https://ntouber-user.zeabur.app/v1/drivers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(driverData),
            });

            if (!res.ok) {
                throw new Error("升級為車主失敗");
            }

            // 重新檢查車主狀態
            await checkDriverStatus(user.ID);
            return true;
        } catch (err) {
            console.error("upgradeToDriver error:", err);
            return false;
        }
    };

    // 重新整理使用者資料
    const refreshUserData = async () => {
        if (user?.ID) {
            await fetchUserData(user.ID);
        }
    };

    const value = {
        user,
        driver,
        isLoggedIn,
        userRole,
        loading,
        login,
        logout,
        updateUser,
        upgradeToDriver,
        refreshUserData,
        fetchUserData,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
