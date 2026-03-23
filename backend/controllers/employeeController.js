import Employee from "../models/Employee.js";
import mongoose from "mongoose";
import { Next } from "../utils/Next.js";


// =============================
// GET LOGGED-IN PROFILE (Basic)
// =============================
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


// ======================================
// GET ALL EMPLOYEES (Admin / HR / Manager)
// ======================================
export const getAllEmployees = async (req, res) => {
  try {
    let employees;

    if (req.user.role === "Manager") {
      employees = await Employee.find({ managerId: req.user.id });
    }
    else if (req.user.role === "Admin" || req.user.role === "HR") {
      employees = await Employee.find()
        .populate("departmentId", "name")
        .select("-password");
    }
    else {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =============================
// CREATE EMPLOYEE
// =============================
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      departmentId,
      location,
      joiningDate,
      costPerMonth
    } = req.body;

    // --- Validate ---
    if (!name || !email || !password || !departmentId || !location || !joiningDate || costPerMonth === undefined) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    if (!mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid DepartmentId" });
    }

    if (req.user.role === "HR" && role === "Admin") {
      return res.status(403).json({ message: "HR Cannot Create Admin Users" });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee Already Exists" });
    }

    // --- Generate EMP ID ---
    const employeeId = await Next();

    // --- Create employee ---
    const employee = await Employee.create({
      employeeId,
      name,
      email,
      password,
      role,
      departmentId,
      location,
      joiningDate,
      costPerMonth
    });

    // Remove password before sending
    const employeeObj = employee.toObject();
    delete employeeObj.password;

    res.status(201).json({
      message: "Employee Created Successfully",
      data: employeeObj
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// ===================================================
// GET EMPLOYEES WITH ROLE-BASED ACCESS (USED BY /me)
// ===================================================
// GET EMPLOYEES WITH ROLE-BASED ACCESS (USED FOR /me)
export const getEmployees = async (req, res) => {
  try {
    // 1. Admin / HR -> See ALL Active Employees
    if (req.user.role === "Admin" || req.user.role === "HR") {
      const employees = await Employee.find({ status: "Active" })
        .populate("departmentId", "name")
        .select("-password");

      return res.status(200).json({ data: employees });
    }

    // 2. Manager -> See Own Team (you can modify this later)
    if (req.user.role === "Manager") {
      const employees = await Employee.find({ managerId: req.user._id })
        .populate("departmentId", "name")
        .select("-password");

      return res.status(200).json({ data: employees });
    }

    // 3. Employee -> ALWAYS see own profile (Active or Inactive)
    const employee = await Employee.findOne({ _id: req.user.id })
      .populate("departmentId", "name")
      .select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee not Found" });
    }

    return res.status(200).json({ data: employee });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =============================
// GET SINGLE EMPLOYEE
// =============================
export const getOne = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("departmentId", "name")
      .select("-password");

    if (!employee) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    const user = req.user;

    if (user.role === "Admin" || user.role === "HR") {
      return res.status(200).json({ data: employee });
    }

    if (user.role === "Employee") {
      if (employee._id.toString() !== user.id) {
        return res.status(403).json({ message: "Access Denied" });
      }
      return res.status(200).json({ data: employee });
    }

    if (user.role === "Manager") {
      if (employee.managerId?.toString() !== user.id) {
        return res.status(403).json({ message: "Access Denied" });
      }
      return res.status(200).json({ data: employee });
    }

    return res.status(403).json({ message: "Access Denied" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =============================
// UPDATE EMPLOYEE
// =============================
export const update = async (req, res) => {
  try {
    const { departmentId, email } = req.body;

    if (departmentId && !mongoose.Types.ObjectId.isValid(departmentId)) {
      return res.status(400).json({ message: "Invalid departmentId" });
    }

    const targetEmployee = await Employee.findById(req.params.id);
    if (!targetEmployee) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    if (req.user.role === "HR" && targetEmployee.role === "Admin") {
      return res.status(403).json({ message: "HR cannot update Admin" });
    }

    if (req.user.role === "Employee" && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access Denied" });
    }

    if (req.user.role === "Employee") {
      const allowed = ["name", "location"];
      const updates = Object.keys(req.body);
      if (!updates.every((f) => allowed.includes(f))) {
        return res.status(403).json({ message: "You can only Update your Profile" });
      }
    }

    if (email) {
      const exists = await Employee.findOne({
        email,
        _id: { $ne: req.params.id }
      });
      if (exists) {
        return res.status(400).json({ message: "Email Already in Use" });
      }
    }

    Object.assign(targetEmployee, req.body);
    await targetEmployee.save();

    const updatedEmployee = await Employee.findById(req.params.id)
      .populate("departmentId", "name")
      .select("-password");

    res.status(200).json({
      message: "Employee Updated Successfully",
      data: updatedEmployee
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// =============================
// SOFT DELETE EMPLOYEE
// =============================
export const remove = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { status: "Inactive" },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    res.status(200).json({
      message: "Employee Deactivated",
      data: employee
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};