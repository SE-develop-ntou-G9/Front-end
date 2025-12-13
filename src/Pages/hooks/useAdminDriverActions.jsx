import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext.jsx";
const driverAPI = "https://ntouber-user.zeabur.app/v1/drivers";
const postAPI = "https://ntouber-post.zeabur.app/api/posts/delete/driver";
const adminBlackAPI = "https://ntouber-admin.zeabur.app/admin/blacklist"; // 如果黑名單也針對駕駛，則保留

/**
 * 專門處理管理員對駕駛（Driver）的操作（刪除、黑名單）。
 * @param {Function} setDrivers - 用於更新 AdminDriver 列表狀態的 setState 函數。
 * @param {Function} navigate - (可選) 用於導航的 navigate 函數。
 * @returns {object} 包含 handleDriverDelete 和 handleBlacklist 函數的物件。
 */
export default function useAdminDriverActions(setDrivers, navigate) {
    
    const { updateDriver } = useUser();
    const getAvatarURL = {}
    const handleDriverDelete = async (driver) => {
        // ... (刪除邏輯與錯誤處理保持不變)
        const userId = driver.userID;
        const userName = driver.name || "未知駕駛";
        if (!window.confirm(`確定要刪除駕駛: ${userName} 嗎？此操作不可逆！`)) {
            return;
        }

        try {
            console.log(`開始併行刪除駕駛 ${userName} 及其相關資料...`);

            // 這裡不再需要刪除 userAPI 的資料，只刪除駕駛和貼文相關資料
            const requests = [
                fetch(`${driverAPI}/delete/${userId}`, { method: "DELETE" }),
                fetch(`${postAPI}/${userId}`, { method: "DELETE" }),
            ];

            const results = await Promise.allSettled(requests);

            let allSuccessful = true;
            const failedRequests = [];

            results.forEach((result, index) => {
                const endpoint = [
                    "駕駛資料刪除",
                    "貼文資料刪除",
                ][index];

                if (result.status === "fulfilled") {
                    const response = result.value;

                    if (response.ok) {
                        console.log(
                            `✅ [${endpoint}] 成功 (Status: ${response.status})`
                        );
                    }
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
            });

            if (!allSuccessful) {
                const errorMessage = failedRequests
                    .map(
                        (f) =>
                            `[${f.endpoint}] 失敗：狀態碼 ${f.status} (${f.message})`
                    )
                    .join("\n");

                throw new Error(`至少有一個關鍵刪除操作失敗:\n${errorMessage}`);
            }

            // 只使用 setDrivers 更新列表 (這裡的 setDrivers 肯定有值)
            if (setDrivers) { 
                setDrivers((prevDrivers) =>
                    prevDrivers.filter((d) => d.userID !== userId)
                );
            }

            console.log(` 駕駛 ${userName} 及其所有相關資料處理成功！`);
            alert(`駕駛 ${userName} 及其所有相關資料已成功處理/刪除！`);

            if (navigate) {
                navigate(-1);
            }
        } catch (err) {
            console.error("❌ 刪除駕駛失敗：", err);
            alert(`刪除失敗：${err.message}`);
        }
    };
    
    /**
     * 處理車主/待審核車主的審核操作 (通過或拒絕)
     */
    const handleVerify = useCallback(async (driverData, newStatus) => {
        const action = newStatus ;
        if (!window.confirm(`確定要對用戶: ${driverData.name} 執行 ${action} 操作嗎？`)) {
            return;
        }

        try {
            let successDriver = true;
            const driverUpdateData = {
                    user_id: driverData.userID,
                    driver_name: driverData.name,
                    contact_info: driverData.contactInfo,
                    scooter_type: driverData.scooterType ,
                    plate_num: driverData.plateNum.toUpperCase(),
                    driver_license: driverData.driverLicense, 
                    status: newStatus
            }
            successDriver = await updateDriver(driverUpdateData);
            if (!successDriver) {
                // const errorData = await res.json();
                // throw new Error(`${action}失敗 (${res.status}): ${errorData.error || '未知錯誤'}`);
                alert("更新失敗");
            }

            // 成功後，從列表中移除 (因為狀態變了)
            if (setDrivers) {
                setDrivers(prevDrivers => prevDrivers.filter(d => d.userID !== userId));
            }
            console.log(`用戶 ${driverData.userID} 狀態更新為 ${newStatus}`);
            alert(`${action}成功！`);

            // 審核成功或失敗後，導回列表
            if (navigate) navigate(-1);

        } catch (err) {
            console.error(`${action}失敗：`, err);
            alert(`${action}失敗：${err.message}`);
        }
    }, [setDrivers, navigate]);

    const handleBlacklist = useCallback((userId) => {
        alert(`黑名單功能：用戶 ${userId}`);
    }, []);

    return { handleDriverDelete, handleBlacklist, handleVerify };
}