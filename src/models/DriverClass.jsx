export default class DriverClass {
  constructor(data = {}) {
    // 這樣寫可以同時支援前端的 camelCase 和後端的 snake_case
    this.userID = data.userID || data.user_id;
    this.name = data.name || data.driver_name;
    this.contactInfo = data.contactInfo || data.contact_info;
    this.scooterType = data.scooterType || data.scooter_type;
    this.plateNum = data.plateNum || data.plate_num;
    this.driverLicense = data.driverLicense || data.driver_license;
    this.status = data.status;
  }
}