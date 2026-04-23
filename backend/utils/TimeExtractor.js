export function extractMonthYear(question) {
  const q = question.toLowerCase();
  const now = new Date();

  let month = now.getMonth() + 1;
  let year = now.getFullYear();

  if (q.includes("last month")) {
    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }

  if (q.includes("next month")) {
    month++;
    if (month === 13) {
      month = 1;
      year++;
    }
  }

  const monthMap = {
    jan: 1, feb: 2, mar: 3, apr: 4,
    may: 5, jun: 6, jul: 7, aug: 8,
    sep: 9, oct: 10, nov: 11, dec: 12
  };

  const monthMatch = q.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/);
  if (monthMatch) month = monthMap[monthMatch[0]];

  const yearMatch = q.match(/\b20\d{2}\b/);
  if (yearMatch) year = parseInt(yearMatch[0]);

  return { month, year };
}