export default class PostClass {
  constructor(user, origin, destination, time, meetingPoint,description, note, helmet, contact) {
    this.user = user;                   // 使用者
    this.origin = origin;               // 出發地
    this.destination = destination;     // 目的地
    this.time = time;                   // 出發時間
    this.meetingPoint = meetingPoint;   // 集合地點
    this.description = description;     // 簡述
    this.note = note;                   // 備註
    this.helmet = helmet;               // 是否有安全帽
    this.contact = contact;             // 聯絡方式
  }
}