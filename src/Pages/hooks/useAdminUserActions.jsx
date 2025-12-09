import { useNavigate } from "react-router-dom";

// 定義您的 API 端點
const uAPI = "https://ntouber-user.zeabur.app/v1/users";
const dAPI = "https://ntouber-user.zeabur.app/v1/drivers";
const pAPI = "https://ntouber-post.zeabur.app/api/posts/delete/driver";
const cAPI = "https://ntouber-post.zeabur.app/api/posts/unmatch/client";
const adminAPI = "https://ntouber-admin.zeabur.app/admin/blacklist";

/**
 * 封裝管理員對用戶的操作（刪除、黑名單）。
 * @param {Function} setUser - (可選) 用於更新 AdminUsers 列表狀態的 setState 函數。
 * @param {Function} navigate - (可選) 用於導航的 navigate 函數。
 * @returns {object} 包含 handleDelete 和 handleBlacklist 函數的物件。
 */
export default function useAdminUserActions(setUser, navigate) {

    // 1. 刪除用戶的邏輯
    const handleDelete = async (userId) => {
        if (!window.confirm(`確定要刪除用戶 ID: ${userId} 嗎？此操作不可逆！`)) {
            return;
        }
        
        try {
            // 同時發送多個刪除請求
            const r = await fetch(`${uAPI}/delete/${userId}`, { method: "DELETE" }); // 刪除用戶
            const a = await fetch(`${dAPI}/delete/${userId}`, { method: "DELETE" }); // 刪除駕駛資料
            const b = await fetch(`${pAPI}/${userId}`, { method: "DELETE" });        // 刪除駕駛的貼文
            const c = await fetch(`${cAPI}/${userId}`, { method: "PATCH" });         // 解除用戶在客戶端的匹配
            console.log("r = ", r);
            if (!r.ok) {
                const errorData = await r.json();
                throw new Error(`刪除失敗 (${r.status}): ${errorData.error || '未知錯誤'}`);
            }

            // 成功後，如果傳入了 setUser，則更新列表
            if (setUser) {
                setUser(prevUsers => prevUsers.filter(u => u.ID !== userId));
            }
            
            console.log(`用戶 ${userId} 及其相關資料刪除成功`);
            alert(`用戶 ${userId} 及其相關資料已成功刪除！`);
            
            // 如果傳入了 navigate，則導航回上一頁 (適用於 AdminDetailUser)
            if (navigate) {
                navigate(-1);
            }

        } catch (err) {
            console.error("❌ 刪除用戶失敗：", err);
            alert(`刪除失敗：${err.message}`);
        }
    };

    // 2. 加入黑名單的邏輯
    const handleBlacklist = async (userId) => {
        if (!window.confirm(`確定要把用戶 ${userId} 加入黑名單嗎？`)) return;
        console.log("id:", userId)
        try {
            const r = await fetch(adminAPI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    reason: "violation", // TODO: 之後要用Put 修改
                }),
            });

            if (!r.ok) {
                const errorData = await r.json();
                throw new Error(`加入黑名單失敗 (${r.status}): ${errorData.error || '未知錯誤'}`);
            }

            const data = await r.json().catch(() => null);
            console.log(`✅ 用戶 ${userId} 加入黑名單成功:`, data);
            alert(`用戶 ${userId} 已成功加入黑名單！`);

        } catch (err) {
            console.error("❌ 加入黑名單失敗：", err);
            alert(`加入黑名單失敗：${err.message}`);
        }
    };

    return { handleDelete, handleBlacklist };
}