import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    monthlySalary: {
      type: Number,
      required: true,
    },

    allowances: {
      type: Number,
      default: 0,
    },

    deductions: {
      type: Number,
      default: 0,
    },

    netPay: {
      type: Number,
      required: true,
    },

    month: {
      type: String, // "Mar-2026"
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payroll", payrollSchema);