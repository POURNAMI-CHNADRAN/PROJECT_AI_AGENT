import Employee from "../models/Employee.js";
import { getNextEmployeeCode } from "../utils/Next.js";
import Allocation from "../models/Allocation.js";

/* ================= CREATE ================= */
export const createEmployee = async (req, res) => {
  try {
    const {
      name,
      email,
      departmentId,
      primaryWorkCategoryId,
      skills,
      hourlyCost,
      status,
      joiningDate,
      location,
    } = req.body;

    const employeeCode = await getNextEmployeeCode();

    const employee = await Employee.create({
      employeeCode,
      name,
      email,
      departmentId,
      primaryWorkCategoryId,
      skills: skills || [],
      hourlyCost,
      status,
      joiningDate,
      location,
    });

    res.status(201).json({
      success: true,
      data: employee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= READ (ALL) ================= */
export const getEmployees = async (req, res) => {
  try {
    const { month, year } = req.query;

    const employees = await Employee.find()
      .populate("primaryWorkCategoryId")
      .populate("skills");

    const employeeIds = employees.map(e => e._id);

    // ✅ pull allocations for requested month/year
    const allocations = await Allocation.find({
      employeeId: { $in: employeeIds },
      ...(month && year && {
        month: Number(month),
        year: Number(year),
      }),
    }).populate("projectId", "name");

    // ✅ group allocations by employee
    const allocationMap = allocations.reduce((acc, a) => {
      const key = a.employeeId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    }, {});

    // ✅ attach allocations to employees
    const enrichedEmployees = employees.map(e => ({
      ...e.toObject(),
      allocations: allocationMap[e._id.toString()] || [],
    }));

    res.json(enrichedEmployees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --------------------------------------------------------------------
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("primaryWorkCategoryId")
      .populate("skills");

    const employeeIds = employees.map(e => e._id);

    const allocations = await Allocation.find({
      employeeId: { $in: employeeIds },
      month: Number(req.query.month),
      year: Number(req.query.year),
    }).populate("projectId", "name");

    const allocationMap = allocations.reduce((map, a) => {
      const key = a.employeeId.toString();
      if (!map[key]) map[key] = [];
      map[key].push(a);
      return map;
    }, {});

    const result = employees.map(e => ({
      ...e.toObject(),
      allocations: allocationMap[e._id.toString()] || []
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= READ (ONE) ================= */

export const getEmployeeById = async (req, res) => {
  const emp = await Employee.findById(req.params._id)
    .populate("departmentId", "name")
    .populate("primaryWorkCategoryId", "name")
    .populate("skills", "name category");

  if (!emp) {
    return res.status(404).json({ message: "Employee NOT Found" });
  }

  res.json({ success: true, data: emp });
};

/* ================= UPDATE ================= */

export const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= DELETE ================= */
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params._id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee NOT Found"
      });
    }

    // ✅ Check remaining employees
    const remaining = await Employee.countDocuments();

    if (remaining === 0) {
      await Counter.findByIdAndUpdate(
        { _id: "employee" },
        { seq: 0 },
        { upsert: true }
      );
    }

    res.json({
      success: true,
      message: "Employee Deleted Successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};