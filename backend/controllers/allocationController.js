import Allocation from "../models/Allocation.js";
import mongoose from "mongoose";

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

/* GET ALL ALLOCATIONS */
export const getAll = async (req, res) => {
  const data = await Allocation
    .find()
    .populate("employee_id", "full_name")
    .populate("project_id", "project_name");

  res.json(data);
};


/* CREATE ALLOCATION */
export const create = async (req, res) => {
  try {

    const { employee_id, project_id, allocation_percentage } = req.body;

    const total = await Allocation.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(employee_id),
          project_id: new mongoose.Types.ObjectId(project_id)
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$allocation_percentage" }
        }
      }
    ]);

    const current = total[0]?.total || 0;

    if (current + allocation_percentage > 100) {
      return res.status(400).json({
        error: "Allocation exceeds 100% for this employee in this project"
      });
    }

    const data = await Allocation.create(req.body);

    res.status(201).json(data);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


/* GET EMPLOYEE ALLOCATIONS */
export const getByEmployee = async (req, res) => {
  const data = await Allocation
    .find({ employee_id: req.params.id })
    .populate("project_id", "project_name");

  res.json(data);
};


/* DELETE ALLOCATION */
export const remove = async (req, res) => {
  await Allocation.findByIdAndDelete(req.params.id);

  res.json({ message: "Allocation deleted" });
};
