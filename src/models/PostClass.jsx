export default class PostClass {
  constructor(origin, destination, time, meetingPoint, note, helmet, contact) {
    this.origin = origin;               // 出發地
    this.destination = destination;     // 目的地
    this.time = time;                   // 出發時間
    this.meetingPoint = meetingPoint;   // 集合地點
    this.note = note;                   // 備註
    this.helmet = helmet;               // 是否有安全帽
    this.contact = contact;             // 聯絡方式
  }
}
