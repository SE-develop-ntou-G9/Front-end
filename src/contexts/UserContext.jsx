import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

const authHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};

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
    const [isAdmin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);  // 防止重複請求

    useEffect(() => {
        async function init() {
            try {
                const token = localStorage.getItem("jwtToken");
                const userId = localStorage.getItem("userId");

                if (token && userId) {
                    await fetchUserData(userId);   // ← 一定要 await
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error("Init failed", err);
                logout();
            } finally {
                setLoading(false);
            }
        }

        init();
    }, []);

    // 初始化：檢查是否有 token
    // useEffect(() => {
    //     const token = localStorage.getItem("jwtToken");
    //     if (token) {
    //         const storedUserId = localStorage.getItem("userId");
    //         if (storedUserId) {
    //             fetchUserData(storedUserId);
    //         } else {
    //             setLoading(false);
    //         }
    //     } else {
    //         setLoading(false);
    //     }
    // }, []);

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
            const res = await fetch(`https://ntouber-gateway.zeabur.app/v1/users/${userId}`,
                {
                    headers: {
                        ...authHeader(),
                    },
                });

            if (!res.ok) {
                throw new Error("取得使用者資料失敗");
            }

            const userData = await res.json();
            console.log("✅ fetchUserData 成功:", userData);

            // const picture = localStorage.getItem("userPicture"); 

            setUser({
                ...userData,
                AvatarURL: userData.avatarURL || userData.avatar_url || userData.AvatarURL || null
            });
            setIsLoggedIn(true);

            // 檢查是否為車主
            await checkStatus(userId);
        } catch (err) {
            console.error("fetchUserData error:", err);
            logout();
        } finally {
            setLoading(false);
            setIsFetching(false);
        }
    };

    const checkStatus = async (userId) => {
        await checkDriverStatus(userId);
        await checkAdminStatus(userId);
    }

    // 檢查車主&admin狀態（不帶 Authorization header）
    const checkDriverStatus = async (userId) => {
        try {
            const res = await fetch(`https://ntouber-gateway.zeabur.app/v1/drivers/user/${userId}`,
                {
                    headers: {
                        ...authHeader(),
                    },
                });

            if (res.ok) {
                const driverData = await res.json();
                if (driverData && Object.keys(driverData).length > 0) {
                    if (driverData.status == "verified") {
                        console.log("✅ 檢測到車主資料:", driverData);
                        setDriver(driverData);
                        setUserRole("車主");
                    }
                    else if (driverData.status == "checking") {
                        setDriver(driverData);
                        setUserRole("審核中");
                    }
                    else if (driverData.status == "rejected") {
                        console.log("✅ 檢測到車主資料但不是車主:", driverData);
                        setDriver(driverData);
                        setUserRole("乘客");
                    }
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

    const checkAdminStatus = async (userId) => {
        try {
            const res = await fetch(`https://ntouber-gateway.zeabur.app/v1/users/${userId}`,
                {
                    headers: {
                        ...authHeader(),
                    },
                });

            if (res.ok) {
                const Data = await res.json();
                if (Data && Object.keys(Data).length > 0) {
                    console.log("✅ 檢測到user資料:");
                    console.log("name:", Data.Name)
                    console.log("id:", Data.ID)
                    console.log("Admin:", Data.Admin)
                    if (Data.Admin) {
                        setAdmin("1");
                    } else {
                        setAdmin("0");
                    }
                } else {
                    console.log("ℹ️ 無user資料，設為乘客");
                    setAdmin("0");
                }

            } else if (res.status === 404 || res.status === 500) {
                console.log("ℹ️ 怪怪的（狀態碼: " + res.status + "）");
                setAdmin("0");
            } else {
                console.log("⚠️ 無法檢查狀態");
                setAdmin("0");
            }
        } catch (err) {
            console.log("ℹ️ checkAdminStatus 異常，設為乘客:", err.message);
            setAdmin("0");
        }
    };

    // 登入
    const login = async (userData, token) => {
        try {
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userId", userData.id);

            const googleAvatar = userData.AvatarURL;

            const res = await fetch(`https://ntouber-gateway.zeabur.app/v1/users/${userData.id}`,
                {
                    headers: {
                        ...authHeader(),
                    },
                });
            const dbUser = res.ok ? await res.json() : {};

            const finalAvatar =
                dbUser.avatarURL ||
                dbUser.avatar_url ||
                googleAvatar ||
                null;

            const merged = {
                ...dbUser,
                ...userData,
                AvatarURL: finalAvatar
            };

            setUser(merged);
            setIsLoggedIn(true);
            localStorage.setItem("user", JSON.stringify(merged));

        } catch (err) {
            console.error("login error:", err);
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
            const res = await fetch("https://ntouber-gateway.zeabur.app/v1/users/mod", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", ...authHeader(),
                },
                body: JSON.stringify(updateData),
            });

            const text = await res.text();
            console.log("後端回傳原始內容：", text);
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
            const res = await fetch("https://ntouber-gateway.zeabur.app/v1/drivers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", ...authHeader(),
                },
                body: JSON.stringify(driverData),
            });

            if (!res.ok) {
                throw new Error("升級為車主失敗");
            }

            // 重新檢查車主狀態
            await checkStatus(user.ID);
            return true;
        } catch (err) {
            console.error("upgradeToDriver error:", err);
            return false;
        }
    };

    const updateDriver = async (driverData) => {
        try {
            const res = await fetch("https://ntouber-gateway.zeabur.app/v1/drivers/mod", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json", ...authHeader(),
                },
                body: JSON.stringify(driverData),
            });

            if (!res.ok) throw new Error("更新車主資料失敗");

            await checkStatus(driverData.user_id);
            return true;

        } catch (err) {
            console.error("updateDriver error:", err);
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
        isAdmin,
        loading,
        login,
        logout,
        updateUser,
        upgradeToDriver,
        refreshUserData,
        fetchUserData,
        setUser,
        updateDriver,
        checkStatus,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
