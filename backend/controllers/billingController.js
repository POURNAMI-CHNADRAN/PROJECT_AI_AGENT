import Billing from "../models/Billing.js";
import Timesheet from "../models/Timesheet.js";

// ---------------------- GET ALL ----------------------
export const getAllBilling = async (req, res) => {
  try {
    const data = await Billing.find({})
      .populate("employee_id", "name")
      .populate("project_id", "name");

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- COMMON MONTH RANGE ----------------------
const getMonthRange = (month) => {
  const d = new Date(month);

  const start = new Date(Date.UTC(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    1
  ));

  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);

  return { start, end };
};

// ---------------------- GENERATE ----------------------
export const generateBilling = async (req, res) => {
  try {
    const { employee_id, project_id, month, rate } = req.body;

    const { start, end } = getMonthRange(month);

    // check existing billing
    const existingBilling = await Billing.findOne({
      employee_id,
      project_id,
      billing_month: { $gte: start, $lt: end }
    });

    if (existingBilling) {
      return res.status(400).json({
        message: "Billing already exists for this month"
      });
    }

    // approved timesheets only
    const timesheets = await Timesheet.find({
      employee_id,
      project_id,
      status: "Approved",
      work_date: { $gte: start, $lt: end }
    });

    const totalPoints = timesheets.reduce(
      (sum, t) => sum + (t.story_points_completed || 0),
      0
    );

    if (totalPoints === 0) {
      return res.status(400).json({
        message: "No approved timesheets found for this month"
      });
    }

    const revenue = totalPoints * rate;

    const billing = await Billing.create({
      employee_id,
      project_id,
      billing_month: start,
      story_points_completed: totalPoints,
      billing_rate_per_point: rate,
      total_revenue: revenue
    });

    res.json(billing);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- REGENERATE ----------------------
export const regenerateBilling = async (req, res) => {
  try {
    const { employee_id, project_id, month } = req.body;

    const { start, end } = getMonthRange(month);

    const existingBilling = await Billing.findOne({
      employee_id,
      project_id,
      billing_month: { $gte: start, $lt: end }
    });

    if (!existingBilling) {
      return res.status(404).json({
        message: "No Billing Found. Generate First."
      });
    }

    // use stored rate (prevent tampering)
    const rate = existingBilling.billing_rate_per_point;

    const timesheets = await Timesheet.find({
      employee_id,
      project_id,
      status: "Approved",
      work_date: { $gte: start, $lt: end }
    });

    const totalPoints = timesheets.reduce(
      (sum, t) => sum + (t.story_points_completed || 0),
      0
    );

    if (totalPoints === 0) {
      return res.status(400).json({
        message: "No Approved Timesheets found for this Month"
      });
    }

    const revenue = totalPoints * rate;

    existingBilling.story_points_completed = totalPoints;
    existingBilling.total_revenue = revenue;

    await existingBilling.save();

    res.json({
      message: "Billing Regenerated Successfully",
      billing: existingBilling
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- PROJECT BILLING ----------------------
export const getProjectBilling = async (req, res) => {
  try {
    const data = await Billing.find({ project_id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- EMPLOYEE BILLING ----------------------
export const getEmployeeBilling = async (req, res) => {
  try {
    const data = await Billing.find({ employee_id: req.params.id });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- TOTAL REVENUE ----------------------
export const getTotalRevenue = async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_revenue" }
        }
      }
    ]);

    res.json(data[0] || { total: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};