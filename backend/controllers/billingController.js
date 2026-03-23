import Billing from "../models/Billing.js";
import Timesheet from "../models/Timesheet.js";

export const getProfile = (req, res) => {
  res.json({
    message: "Logged-in User Info",
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};

export const generateBilling = async (req, res) => {
  try {
    const { employee_id, project_id, month, rate } = req.body;

    const start = new Date(month);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const timesheets = await Timesheet.find({
      employee_id,
      project_id,
      work_date: { $gte: start, $lt: end },
      billable: true
    });

    const totalPoints = timesheets.reduce(
      (sum, t) => sum + t.story_points_completed,
      0
    );

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

export const getProjectBilling = async (req, res) => {
  const data = await Billing.find({ project_id: req.params.id });
  res.json(data);
};

export const getEmployeeBilling = async (req, res) => {
  const data = await Billing.find({ employee_id: req.params.id });
  res.json(data);
};

export const getTotalRevenue = async (req, res) => {
  const data = await Billing.aggregate([
    { $group: { _id: null, total: { $sum: "$total_revenue" } } }
  ]);

  res.json(data[0] || { total: 0 });
};