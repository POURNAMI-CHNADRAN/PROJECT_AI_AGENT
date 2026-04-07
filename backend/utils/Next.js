import Counter from "../models/Counter.js";

export const getNextEmployeeCode = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "employee" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `EMP-${String(counter.seq).padStart(4, "0")}`;
};