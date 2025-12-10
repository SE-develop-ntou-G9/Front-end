export default class DriverClass {
  constructor(data) {
    if (!data) {
      return;
    }

    this.userID = data.user_id;        // 司機對應的使用者 ID (Go: UserID -> JS: userID)
    
    // 司機個人資訊
    this.name = data.driver_name;            // 司機名稱 (Go: Name -> JS: name)
    this.contactInfo = data.contact_info; // 聯繫資訊 (Go: ContactInfo -> JS: contactInfo)

    // 車輛資訊
    this.scooterType = data.scooter_type; // 車型 (Go: ScooterType -> JS: scooterType)
    this.plateNum = data.plate_num;      // 車牌號碼 (Go: PlateNum -> JS: plateNum)
    this.driverLicense = data.driver_license; // 駕照號碼 (Go: DriverLicense -> JS: driverLicense)
    this.status = data.status
    
    this.role = 'Driver'; 
  }
}