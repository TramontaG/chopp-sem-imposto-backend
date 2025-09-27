"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDateBR = parseDateBR;
function parseDateBR(dateStr) {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
}
//# sourceMappingURL=Date.js.map