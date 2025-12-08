export default class UserClass {
  // 構造函式現在只接收一個參數：來自 API 的資料物件
  constructor(data) {
    if (!data) {
      // 處理 data 為空的情況
      return;
    }
    
    // 將後端 (Go) 的大寫屬性轉換為前端 (JS) 的小寫駝峰屬性
    this.ID = data.ID;                       // ID
    this.Provider = data.Provider;           // 認證提供者
    this.ProviderUserID = data.ProviderUserID; // 認證提供者 ID
    
    this.Email = data.Email;               // 名字 (Go: Name -> JS: userName)
    this.userName = data.Name;                 // 電子郵件 (Go: Email -> JS: email)
    this.phone = data.PhoneNumber;           // 電話 (Go: PhoneNumber -> JS: phone)
    this.avatarUrl = data.AvatarURL;         // 頭像 URL
    this.role = null; 
  }
}