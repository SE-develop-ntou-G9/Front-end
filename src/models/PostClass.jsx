export default class PostClass {
  constructor(user, origin, destination, originAddress, desAddress, time, meetingPoint,description, note, helmet, leave, contact) {
    this.user = user;                   // 使用者*
    this.origin = origin;               // 出發地
    this.destination = destination;     // 目的地
    this.originAddress = originAddress;   // 地址(起點)
    this.desAddress = desAddress;         // 地址(終點)
    this.time = time;                   // 出發時間
    this.meetingPoint = meetingPoint;   // 集合地點
    this.description = description;     // 簡述*
    this.note = note;                   // 備註
    this.helmet = helmet;               // 是否有安全帽
    this.leave = leave;                 // 是否中途下車
    this.contact = contact;             // 聯絡方式
  }
}