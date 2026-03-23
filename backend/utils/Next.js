import { Counter } from "../models/Counter.js";

export const Next = async () => {
  // Increment the counter atomically
  const counter = await Counter.findOneAndUpdate(
    { name: "employee" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // create if doesn't exist
  );

  // Pad the number to 3 digits: 001, 002, 003
  const sequence = String(counter.seq).padStart(3, "0");

  return `EMP-${sequence}`;
};