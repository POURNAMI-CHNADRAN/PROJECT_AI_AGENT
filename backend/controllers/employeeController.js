import Employee from "../models/Employee.js";
import Allocation from "../models/Allocation.js";
import { Next } from "../utils/Next.js"; 

// ✅ CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {
    // 🔥 Generate employeeId automatically
    const employeeId = await Next();

    const employee = new Employee({
      ...req.body,
      employeeId
    });

    await employee.save();

    res.status(201).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL EMPLOYEES WITH ALLOCATIONS
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("departmentId", "name");

    const allocations = await Allocation.find()
      .populate("project", "name type");

    const result = employees.map((emp) => {
      const empAlloc = allocations.filter(
        (a) => a.employee.toString() === emp._id.toString()
      );

      const totalFTE = empAlloc.reduce((sum, a) => sum + a.fte, 0);

      let status = "Optimal";
      if (totalFTE < 160) status = "Underbilled";
      if (totalFTE > 160) status = "Overbilled";

      return {
        ...emp.toObject(),
        allocations: empAlloc,
        totalFTE,
        utilizationStatus: status,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE EMPLOYEE
export const getOne = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id)
      .populate("departmentId", "name");

    if (!emp) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET LOGGED-IN USER PROFILE
export const getProfile = async (req, res) => {
  try {
    const emp = await Employee.findById(req.user.id).select("-password");

    if (!emp) {
      return res.status(404).json({ message: "User NOT Found" });
    }

    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE EMPLOYEE
export const update = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(emp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ DELETE (SOFT DELETE → INACTIVE)
export const remove = async (req, res) => {
  try {
    await Employee.findByIdAndUpdate(req.params.id, {
      status: "Inactive",
    });

    res.json({ message: "Employee Deactivated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};