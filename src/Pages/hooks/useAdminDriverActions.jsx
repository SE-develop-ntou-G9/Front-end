import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../../contexts/UserContext.jsx";

const API = "https://ntouber-user.zeabur.app/v1/drivers";
const POST_API = "https://ntouber-post.zeabur.app/api/posts/delete/driver";

// 審核API
const VERIFY_API = `${API}/mod`; 

export default function useAdminDriverActions(setDriverList, navigate) {
    const defaultNavigate = useNavigate();
    const finalNavigate = navigate || defaultNavigate;
    const { updateDriver } = useUser();
    const getAvatarURL = {}

    /**
     * 處理車主/待審核車主的刪除
     */
    const handleDelete = useCallback(async (userId) => {
        if (!window.confirm(`確定要刪除用戶 ID: ${userId} 嗎？此操作不可逆！`)) {
            return;
        }
        
        try {
            // 1. 刪除車主資料
            const r = await fetch(`${API}/delete/${userId}`, { method: "DELETE" });
            // 2. 刪除相關貼文
            const b = await fetch(`${POST_API}/${userId}`, { method: "DELETE" })

            if (!r.ok) {
                const errorData = await r.json();
                throw new Error(`刪除失敗 (${r.status}): ${errorData.error || '未知錯誤'}`);
            }

            // 成功刪除後，更新前端 UI 狀態
            if (setDriverList) {
                setDriverList(prevDrivers => prevDrivers.filter(d => d.userID !== userId));
            }
            console.log(`車主 ${userId} 刪除成功`);
            alert("車主已成功刪除！");

            // 如果是在詳細頁面，導航回列表
            if (finalNavigate) finalNavigate(-1);


        } catch (err) {
            console.error("刪除車主失敗：", err);
            alert(`刪除失敗：${err.message}`);
        }
    }, [setDriverList, finalNavigate]);
    
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
            if (setDriverList) {
                setDriverList(prevDrivers => prevDrivers.filter(d => d.userID !== userId));
            }
            console.log(`用戶 ${driverData.userID} 狀態更新為 ${newStatus}`);
            alert(`${action}成功！`);

            // 審核成功或失敗後，導航回列表
            if (finalNavigate) finalNavigate(-1);

        } catch (err) {
            console.error(`${action}失敗：`, err);
            alert(`${action}失敗：${err.message}`);
        }
    }, [setDriverList, finalNavigate]);

    // 黑名單操作暫時留空或根據實際 API 實作
    const handleBlacklist = useCallback((userId) => {
        alert(`黑名單功能：用戶 ${userId}`);
        // 實際呼叫黑名單 API
    }, []);

    return { handleDelete, handleBlacklist, handleVerify };
}