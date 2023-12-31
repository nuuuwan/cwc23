import { START_WEEK } from "../constants/CWC23_DATETIME";
export default class DateX {
  constructor(date) {
    this.date = date;
  }

  get ut() {
    return this.date.getTime() / 1000.0;
  }

  get dut() {
    return this.ut - DateX.now().ut;
  }

  get weekAbsolute() {
    const SECONDS_IN_DAY = 86_400;
    return parseInt((this.ut + 3 * SECONDS_IN_DAY) / (7 * SECONDS_IN_DAY));
  }

  get week() {
    return this.weekAbsolute - START_WEEK + 1;
  }

  get isToday() {
    return this.date.toDateString() === DateX.now().date.toDateString();
  }

  get isCurrentWeek() {
    return this.week === DateX.now().week;
  }

  static now() {
    return new DateX(new Date());
  }
}
