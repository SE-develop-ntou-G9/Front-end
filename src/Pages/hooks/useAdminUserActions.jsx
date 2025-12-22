import { useNavigate } from "react-router-dom";
const userAPI = "https://ntouber-gateway.zeabur.app/v1/users";
const driverAPI = "https://ntouber-gateway.zeabur.app/v1/drivers";
const postAPI = "https://ntouber-gateway.zeabur.app/api/posts/delete/driver";
const clientAPI = "https://ntouber-gateway.zeabur.app/api/posts/unmatch/client";
const adminBlackAPI = "https://ntouber-gateway.zeabur.app/admin/blacklist";

/**
 * 專門處理管理員對一般用戶（User）的操作（刪除、黑名單）。
 * @param {Function} setUser - 用於更新 AdminUsers 列表狀態的 setState 函數。
 * @param {Function} navigate - (可選) 用於導航的 navigate 函數。
 * @returns {object} 包含 handleUserDelete 和 handleBlacklist 函數的物件。
 */

const authHeader = () => {
    const token = localStorage.getItem("jwtToken");
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};


export default function useAdminUserActions(setUser, navigate) {

    const handleUserDelete = async (user) => {
        // console.log("driver:",user);
        // console.log("id:",user.ID);
        // console.log("name:",user.userName);
        const userId = user.ID;
        const userName = user.userName || "未知用戶";
        if (!window.confirm(`確定要刪除用戶: ${userName} 嗎？此操作不可逆！`)) {
            return;
        }

        try {
            console.log(`開始併行刪除用戶 ${userName} 及其相關資料...`);

            const requests = [
                fetch(`${userAPI}/delete/${userId}`, {
                    headers: {
                        ...authHeader(),
                    },
                    method: "DELETE"
                }),
                fetch(`${driverAPI}/delete/${userId}`, {
                    headers: {
                        ...authHeader(),
                    },
                    method: "DELETE"
                }),
                fetch(`${postAPI}/${userId}`, {
                    headers: {
                        ...authHeader(),
                    },
                    method: "DELETE"
                }),
                fetch(`${clientAPI}/${userId}`, {
                    headers: {
                        ...authHeader(),
                    },
                    method: "PATCH"
                }),
            ];

            const results = await Promise.allSettled(requests);

            let allSuccessful = true;
            const failedRequests = [];

            results.forEach((result, index) => {
                const endpoint = [
                    "核心用戶刪除",
                    "駕駛資料刪除",
                    "貼文資料刪除",
                    "客戶端匹配解除",
                ][index];

                if (result.status === "fulfilled") {
                    const response = result.value;

                    if (response.ok) {
                        console.log(
                            `✅ [${endpoint}] 成功 (Status: ${response.status})`
                        );
                    }
                    // 檢查是否為 404 狀態，如果是則沒差
                    else if (response.status === 404) {
                        console.warn(
                            `⚠️ [${endpoint}] 警告：收到 404，視為目標已不存在，操作成功。`
                        );
                    } else {
                        allSuccessful = false;
                        failedRequests.push({
                            endpoint: endpoint,
                            status: response.status,
                            message: `伺服器錯誤或其他非 404 錯誤`,
                        });
                    }
                } else if (result.status === "rejected") {
                    allSuccessful = false;
                    failedRequests.push({
                        endpoint: endpoint,
                        status: "網路/連線錯誤",
                        message: result.reason.message,
                    });
                }
            }); // End of results.forEach

            if (!allSuccessful) {
                const errorMessage = failedRequests
                    .map(
                        (f) =>
                            `[${f.endpoint}] 失敗：狀態碼 ${f.status} (${f.message})`
                    )
                    .join("\n");

                throw new Error(`至少有一個關鍵刪除操作失敗:\n${errorMessage}`);
            }

            if (setUser) {
                setUser((prevUsers) =>
                    prevUsers.filter((u) => u.ID !== userId)
                );
            }

            console.log(` 用戶 ${userName} 及其所有相關資料處理成功！`);
            alert(`用戶 ${userName} 及其所有相關資料已成功處理/刪除！`);

            if (navigate) {
                navigate(-1);
            }
        } catch (err) {
            console.error("❌ 刪除用戶失敗：", err);
            alert(`刪除失敗：${err.message}`);
        }
    };

    const handleUserBlacklist = async (user, reason) => {
        const userId = user.ID;
        const userName = user.userName || "未知用戶";
        try {
            const r = await fetch(adminBlackAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader(), },
                body: JSON.stringify({
                    userId: userId,
                    reason: reason,
                }),
            });

            if (!r.ok) {
                const errorData = await r.json();
                throw new Error(
                    `加入黑名單失敗 (${r.status}): ${errorData.error || "未知錯誤"
                    }`
                );
            }

            const data = await r.json().catch(() => null);
            // console.log(`✅ 用戶 ${userName} 加入黑名單成功:`, data);
            alert(`用戶 ${userName} 已成功加入黑名單！`);
        } catch (err) {
            console.error("❌ 加入黑名單失敗：", err);
            alert(`加入黑名單失敗：${err.message}`);
        }
    };

    const handleUserDeleteFromBlacklist = async (user, setBlacklist) => {
        const userId = user.userId;
        const userName = user.userName || "未知用戶";
        if (!window.confirm(`確定要將用戶: ${userName} 從黑名單中移除嗎？`)) {
            return;
        }

        try {
            const r = await fetch(`${adminBlackAPI}/${userId}`, {
                method: "DELETE",
                headers: {
                    ...authHeader(),
                },
            });

            if (!r.ok) {
                const errorData = await r.json().catch(() => ({}));
                throw new Error(
                    `移除黑名單失敗 (${r.status}): ${errorData.error || "未知錯誤"
                    }`
                );
            }

            // console.log(`✅ 用戶: ${userName} 已從黑名單中移除！`);
            alert(`用戶: ${userName} 已成功從黑名單中移除！`);

            if (setBlacklist) {
                setBlacklist((prevList) =>
                    // 注意：userId 可能是數字或字串，保險起見統一轉成字串比較
                    prevList.filter((b) => String(b.userId) !== String(userId))
                );
            }
        } catch (err) {
            console.error("❌ 移除黑名單失敗：", err);
            alert(`移除黑名單失敗：${err.message}`);
        }
    };

    return {
        handleUserDelete,
        handleUserBlacklist,
        handleUserDeleteFromBlacklist
    };
}