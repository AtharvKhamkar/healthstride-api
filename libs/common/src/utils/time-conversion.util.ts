import {DateTime} from 'luxon'
export class TimeConversionUtil {

  static nowUtc(): DateTime {
    return DateTime.utc();
  }

  static fromDate(date: Date | string): DateTime {
    return typeof date === 'string'
      ? DateTime.fromISO(date, { zone: 'utc' })
      : DateTime.fromJSDate(date, { zone: 'utc' });
  }

  static formatTime(
    date: Date | string,
    format = "yyyy-MM-dd HH:mm 'UTC'",
  ): string {
    return this.fromDate(date).toFormat(format);
  }

  static isExpired(date: Date | string): boolean {
    return this.fromDate(date) <= DateTime.utc();
  }
}
