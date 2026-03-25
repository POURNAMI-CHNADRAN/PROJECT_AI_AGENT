export const validateTimesheetDate = (dateString) => {
  const tsDate = new Date(dateString);
  const today = new Date();

  // Normalize times to midnight for comparison
  tsDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // 1️⃣ Check if date is valid
  if (isNaN(tsDate.getTime())) {
    return { valid: false, message: "Invalid Date Format" };
  }

  // 2️⃣ No future dates allowed
  if (tsDate > today) {
    return { valid: false, message: "Future Dates are NOT Allowed" };
  }

  // 3️⃣ ✔ Past dates + today allowed
  return { valid: true };
};