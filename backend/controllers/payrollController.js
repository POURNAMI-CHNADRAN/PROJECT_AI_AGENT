import Payroll from "../models/Payroll.js";

export const getPayrollByEmployee = async (req, res) => {
  try {
    const result = await Payroll.findOne({ employee_id: req.params.id });

    if (!result) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};