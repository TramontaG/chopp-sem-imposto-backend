"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDateBR = parseDateBR;
const BRAZIL_UTC_OFFSET_IN_HOURS = 3;
const BRAZIL_UTC_OFFSET_IN_MS = BRAZIL_UTC_OFFSET_IN_HOURS * 60 * 60 * 1000;
const BR_DATE_TIME_REGEX = /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/;
const invalidDate = () => new Date(Number.NaN);
function parseDateBR(dateStr) {
  const match = BR_DATE_TIME_REGEX.exec(dateStr.trim());
  if (!match) {
    return invalidDate();
  }
  const [, dayStr, monthStr, yearStr, hoursStr = "00", minutesStr = "00", secondsStr = "00"] = match;
  const day = Number(dayStr);
  const month = Number(monthStr);
  const year = Number(yearStr);
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);
  const seconds = Number(secondsStr);
  const parsedDate = new Date(Date.UTC(year, month - 1, day, hours + BRAZIL_UTC_OFFSET_IN_HOURS, minutes, seconds));
  const normalizedDate = new Date(parsedDate.getTime() - BRAZIL_UTC_OFFSET_IN_MS);
  if (normalizedDate.getUTCFullYear() !== year || normalizedDate.getUTCMonth() !== month - 1 || normalizedDate.getUTCDate() !== day || normalizedDate.getUTCHours() !== hours || normalizedDate.getUTCMinutes() !== minutes || normalizedDate.getUTCSeconds() !== seconds) {
    return invalidDate();
  }
  return parsedDate;
}
//# sourceMappingURL=Date.js.map
