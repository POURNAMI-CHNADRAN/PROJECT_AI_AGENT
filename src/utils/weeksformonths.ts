export function generateWeeksForMonth(month: number, year: number) {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);

  const weeks = [];
  let current = new Date(first);

  let index = 0;
  while (current <= last) {
    weeks.push({
      index,
      label: `W${index + 1}`,
      start: new Date(current),
    });
    current.setDate(current.getDate() + 7);
    index++;
  }

  return weeks;
}