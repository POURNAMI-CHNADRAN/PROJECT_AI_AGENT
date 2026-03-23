import Timesheet from "../models/Timesheet.js";
import Billing from "../models/Billing.js";
import Allocation from "../models/Allocation.js";

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


// ✅ 1. UTILIZATION REPORT
export const getUtilization = async (req, res) => {
  try {
    const data = await Timesheet.aggregate([
      {
        $group: {
          _id: "$employee_id",
          totalPoints: { $sum: "$story_points_completed" },
          billablePoints: {
            $sum: {
              $cond: [
                { $eq: ["$billable", true] },
                "$story_points_completed",
                0
              ]
            }
          }
        }
      },
      {
        $project: {
          employee_id: "$_id",

          billable_percent: {
            $cond: [
              { $eq: ["$totalPoints", 0] },
              0,
              {
                $multiply: [
                  { $divide: ["$billablePoints", "$totalPoints"] },
                  100
                ]
              }
            ]
          },

          non_billable_percent: {
            $cond: [
              { $eq: ["$totalPoints", 0] },
              0,
              {
                $multiply: [
                  {
                    $divide: [
                      { $subtract: ["$totalPoints", "$billablePoints"] },
                      "$totalPoints"
                    ]
                  },
                  100
                ]
              }
            ]
          }
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ 2. DASHBOARD SUMMARY
export const dashboardSummary = async (req, res) => {
  try {
    const totalRevenue = await Billing.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$total_revenue" }
        }
      }
    ]);

    const totalAllocations = await Allocation.countDocuments();

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalAllocations
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ 3. REVENUE BY PROJECT
export const revenueByProject = async (req, res) => {
  try {
    const data = await Billing.aggregate([
      {
        $group: {
          _id: "$project_id",
          revenue: { $sum: "$total_revenue" }
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ 4. BENCH EMPLOYEES (0 billable work)
export const benchEmployees = async (req, res) => {
  try {
    const data = await Timesheet.aggregate([
      {
        $group: {
          _id: "$employee_id",
          billablePoints: {
            $sum: {
              $cond: [
                { $eq: ["$billable", true] },
                "$story_points_completed",
                0
              ]
            }
          }
        }
      },
      {
        $match: {
          billablePoints: 0
        }
      }
    ]);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};