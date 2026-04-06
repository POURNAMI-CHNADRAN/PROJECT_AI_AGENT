import Employee from "../models/Employee.js";
import Allocation from "../models/Allocation.js";
import { Next } from "../utils/Next.js"; 
import bcrypt from "bcryptjs";

export const createEmployee = async (req, res) => {
  try {
    const employeeId = await Next();

    // ✅ Generate default password if not provided
    const plainPassword = req.body.password || "123456";

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // ✅ Create employee
    const employee = new Employee({
      ...req.body,
      employeeId,
      password: hashedPassword, 
    });

    await employee.save();

    const employeeResponse = employee.toObject();
    delete employeeResponse.password;

    res.status(201).json(employeeResponse);

  } catch (error) {
    console.error("Create Employee Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL EMPLOYEES WITH ALLOCATIONS
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("departmentId", "name")
      .populate("skills", "name")
      .populate({
        path: "workCategoryId",
        select: "name",
        options: { strictPopulate: false }, 
      });

    const allocations = await Allocation.find().populate(
      "project",
      "name type"
    );

    const result = employees.map((emp) => {
      const empAlloc = allocations.filter(
        (a) => a.employee?.toString() === emp._id.toString()
      );

      const totalFTE = empAlloc.reduce(
        (sum, a) => sum + (a.fte || 0),
        0
      );

      let status = "Optimal";
      if (totalFTE < 160) status = "Underbilled";
      if (totalFTE > 160) status = "Overbilled";

      return {
        ...emp.toObject(),
        workCategoryName: emp.workCategoryId?.name || null, // ✅ flatten for UI
        allocations: empAlloc,
        totalFTE,
        utilizationStatus: status,
      };
    });

    res.status(200).json(result);
  } catch (err) {
    console.error("GET /api/employees failed:", err);
    res.status(200).json([]); // ✅ NEVER break frontend
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
    const emp = await req.user.employeeId.select("-password");

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

