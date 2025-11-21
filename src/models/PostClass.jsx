// export default class PostClass {
//   constructor(driver_id, vehicle_info, status, timestamp, starting_point, destination, meet_point, time, notes, description, helmet, contact_info, leave) {
//     this.driver_id = driver_id;          // 使用者*
//     this.vehicle_info = vehicle_info;    // vehicle的資訊 
//     this.status = status;
//     this.timestamp = timestamp;
//     this.starting_point = starting_point;// 出發地
//     this.destination = destination;      // 目的地
//     this.meet_point = meet_point;        // 集合地點
//     this.time = time;                    // 出發時間
//     this.notes = notes;                  // 備註
//     this.description = description;      // 簡述*
//     this.helmet = helmet;                // 是否有安全帽
//     this.contact_info = contact_info;    // 聯絡方式
//     this.leave = leave;                  // 是否中途下車
    
//   }
// }

export default class PostClass {
  constructor({
    driver_id,
    vehicle_info,
    status,
    timestamp,
    starting_point,
    destination,
    meet_point,
    departure_time,
    notes,
    description,
    helmet,
    contact_info,
    leave
  }) {
    this.driver_id = driver_id;
    this.vehicle_info = vehicle_info;
    this.status = status;
    this.timestamp = timestamp;

    // 巢狀起點物件
    this.starting_point = {
      Name: starting_point?.Name ?? "",
      Address: starting_point?.Address ?? ""
    };

    // 巢狀目的地物件
    this.destination = {
      Name: destination?.Name ?? "",
      Address: destination?.Address ?? ""
    };

    // 可選的 meet_point（後端有可能只有 Name）
    this.meet_point = {
      Name: meet_point?.Name ?? "",
      Address: meet_point?.Address ?? ""
    };

    this.departure_time = departure_time;
    this.notes = notes;
    this.description = description;
    this.helmet = helmet;

    // 巢狀聯絡資訊
    this.contact_info = contact_info || {};

    this.leave = leave;
  }
}
