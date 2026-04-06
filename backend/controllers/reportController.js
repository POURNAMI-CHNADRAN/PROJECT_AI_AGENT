import Timesheet from "../models/Timesheet.js";
import Billing from "../models/Billing.js";
import Allocation from "../models/Allocation.js";
import Employee from "../models/Employee.js";

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
// ✅ 1. UTILIZATION REPORT (FIXED & CORRECT)
export const getUtilization = async (req, res) => {
  try {
    const data = await Allocation.aggregate([
      {
        $group: {
          _id: "$employee",
          totalFTE: { $sum: "$fte" },
          billableFTE: {
            $sum: {
              $cond: [{ $eq: ["$isBillable", true] }, "$fte", 0]
            }
          }
        }
      },

      // 👤 JOIN EMPLOYEE COLLECTION
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },

      // 📊 CALCULATE UTILIZATION
      {
        $project: {
          employee_id: "$_id",
          employee_name: "$employee.name",
          billable_percent: {
            $cond: [
              { $eq: ["$totalFTE", 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$billableFTE", "$totalFTE"] },
                      100
                    ]
                  },
                  0
                ]
              }
            ]
          },
          non_billable_percent: {
            $cond: [
              { $eq: ["$totalFTE", 0] },
              0,
              {
                $round: [
                  {
                    $subtract: [
                      100,
                      {
                        $multiply: [
                          { $divide: ["$billableFTE", "$totalFTE"] },
                          100
                        ]
                      }
                    ]
                  },
                  0
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
  const data = await Billing.aggregate([
    {
      $lookup: {
        from: "projects",
        localField: "project_id",
        foreignField: "_id",
        as: "project"
      }
    },
    { $unwind: "$project" },
    {
      $group: {
        _id: "$project.name",
        revenue: { $sum: "$total_revenue" }
      }
    }
  ]);

  res.json(data);
};

// ✅ 4. BENCH EMPLOYEES (0 billable work)
export const benchEmployees = async (req, res) => {
  try {
    const data = await Allocation.aggregate([
      {
        $group: {
          _id: "$employee",
          billableFTE: {
            $sum: {
              $cond: [{ $eq: ["$isBillable", true] }, "$fte", 0]
            }
          }
        }
      },

      { $match: { billableFTE: 0 } },

      // 👤 JOIN EMPLOYEE
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      { $unwind: "$employee" },

      {
        $project: {
          employee_id: "$_id",
          name: "$employee.name"
        }
      }
    ]);

    res.json({
      count: data.length,
      employees: data
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};