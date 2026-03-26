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

export const getAllBilling = async (req, res) => {
  const data = await Billing.find({})
    .populate("employee_id", "name")
    .populate("project_id", "name");

  res.json(data);
};

export const generateBilling = async (req, res) => {
  try {
    const { employee_id, project_id, month, rate } = req.body;

    // Convert month to start/end range
    const start = new Date(month);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // 1️⃣ Prevent duplicate billing for same employee + project + month
    const existingBilling = await Billing.findOne({
      employee_id,
      project_id,
      billing_month: start
    });

    if (existingBilling) {
      return res.status(400).json({
        message: "Billing already generated for this employee, project & month"
      });
    }

    // 2️⃣ Fetch APPROVED timesheets for this month (your system uses status)
    const timesheets = await Timesheet.find({
      employee_id,
      project_id,
      status: "Approved",
      work_date: { $gte: start, $lt: end }
    });

    // 3️⃣ Calculate story points
    const totalPoints = timesheets.reduce(
      (sum, t) => sum + (t.story_points_completed || 0),
      0
    );

    // 4️⃣ Calculate revenue
    const revenue = totalPoints * rate;

    // 5️⃣ Create billing record
    const billing = await Billing.create({
      employee_id,
      project_id,
      billing_month: start,
      story_points_completed: totalPoints,
      billing_rate_per_point: rate,
      total_revenue: revenue
    });

    return res.json(billing);

  } catch (err) {
    return res.status(500).json({ error: err.message });
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

export const regenerateBilling = async (req, res) => {
  try {
    const { employee_id, project_id, month, rate } = req.body;

    const start = new Date(month);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    // 1️⃣ Find existing billing for this month
    const existingBilling = await Billing.findOne({
      employee_id,
      project_id,
      billing_month: start
    });

    if (!existingBilling) {
      return res.status(404).json({
        message: "No billing found for this month. Generate billing first."
      });
    }

    // 2️⃣ Fetch APPROVED timesheets for this employee/project/month
    const timesheets = await Timesheet.find({
      employee_id,
      project_id,
      status: "Approved",
      work_date: { $gte: start, $lt: end }
    });

    // 3️⃣ Auto-calculate story points
    const totalPoints = timesheets.reduce(
      (sum, t) => sum + (t.story_points_completed || 0),
      0
    );

    // 4️⃣ Auto-calculate revenue
    const revenue = totalPoints * rate;

    // 5️⃣ Update existing billing record
    existingBilling.story_points_completed = totalPoints;
    existingBilling.billing_rate_per_point = rate;
    existingBilling.total_revenue = revenue;

    await existingBilling.save();

    return res.json({
      message: "Billing regenerated successfully",
      billing: existingBilling
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};