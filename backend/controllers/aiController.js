import axios from "axios";
import Allocation from "../models/Allocation.js";
import Employee from "../models/Employee.js";
import Billing from "../models/Billing.js";

export const askAI = async (req, res) => {
  try {
    const { question } = req.body;

    const q = question.toLowerCase();

    /* ================= UNDERUTILIZED ================= */
    if (q.includes("underutilized") || q.includes("low utilization")) {
      const data = await Allocation.aggregate([
        {
          $group: {
            _id: "$employee",
            totalFTE: { $sum: "$fte" }
          }
        },
        {
          $match: {
            totalFTE: { $lt: 50 } // < 50% = underutilized
          }
        },
        {
          $lookup: {
            from: "employees",
            localField: "_id",
            foreignField: "_id",
            as: "emp"
          }
        },
        { $unwind: "$emp" }
      ]);

      return res.json({
        answer: `Found ${data.length} underutilized employees`,
        insights: data.map(d => ({
          employee: d.emp.name,
          allocation: `${d.totalFTE}%`,
          recommendation: "Assign to billable project"
        }))
      });
    }

    /* ================= REVENUE ================= */
    if (q.includes("revenue")) {
      const data = await Billing.aggregate([
        {
          $group: {
            _id: "$project_id",
            revenue: { $sum: "$total_revenue" }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      return res.json({
        answer: "Top revenue generating projects",
        insights: data.map(d => ({
          project: d._id,
          revenue: d.revenue
        }))
      });
    }

    /* ================= BENCH ================= */
    if (q.includes("bench")) {
      const data = await Allocation.aggregate([
        {
          $group: {
            _id: "$employee",
            billable: {
              $sum: {
                $cond: [{ $eq: ["$isBillable", true] }, "$fte", 0]
              }
            }
          }
        },
        { $match: { billable: 0 } },
        {
          $lookup: {
            from: "employees",
            localField: "_id",
            foreignField: "_id",
            as: "emp"
          }
        },
        { $unwind: "$emp" }
      ]);

      return res.json({
        answer: `Bench employees: ${data.length}`,
        insights: data.map(d => ({
          employee: d.emp.name,
          recommendation: "Allocate to project"
        }))
      });
    }

    /* ================= FALLBACK TO OLLAMA ================= */
    const ollamaRes = await axios.post("http://127.0.0.1:11434/api/generate", {
      model: "llama3",
      prompt: `You are an enterprise resource management AI.
      Answer this clearly: ${question}`,
      stream: false
    });

    res.json({
      answer: ollamaRes.data.response,
      insights: []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};