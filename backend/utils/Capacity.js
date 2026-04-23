/**
 * Calculates monthly working capacity
 * Excludes Saturdays and Sundays
 *
 * @param {number} month - 1 to 12
 * @param {number} year - full year (e.g. 2026)
 * @param {number} hoursPerDay - default 8
 * @returns {number} total monthly capacity in hours
 */

export function getMonthlyCapacity(month, year, hoursPerDay = 8) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month - 1, d).getDay();
    if (day !== 0 && day !== 6) workingDays++;
  }

  return workingDays * hoursPerDay;
}
