import mongoose from "mongoose";
import Equivalent from "../models/Equivalent.js";

/* ================= CREATE ================= */
export const create = async (req, res) => {
  try {
    const {
      project_id,
      title,
      description = "",
      effort_type = "FTE",
      effort_value,
      assigned_employee = null,
      status = "TO_DO",
    } = req.body;

    if (!project_id || !title || effort_value === undefined) {
      return res.status(400).json({
        error: "project_id, title and effort_value are required",
      });
    }

    if (Number(effort_value) < 0.25) {
      return res.status(400).json({
        error: "effort_value must be ≥ 0.25",
      });
    }

    const item = await Equivalent.create({
      project_id,
      title,
      description,
      effort_type,
      effort_value,
      assigned_employee,
      status,
    });

    const populated = await Equivalent.findById(item._id)
      .populate("project_id", "name")
      .populate("assigned_employee", "name");

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL ================= */
export const getAll = async (req, res) => {
  const data = await Equivalent.find()
    .populate("project_id", "name")
    .populate("assigned_employee", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: data.length, data });
};

/* ================= EMPLOYEE ASSIGNED ================= */
export const getAssignedStories = async (req, res) => {
  const employeeId = new mongoose.Types.ObjectId(req.user.id);

  const data = await Equivalent.find({
    assigned_employee: employeeId,
  })
    .populate("project_id", "name")
    .populate("assigned_employee", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: data.length, data });
};

/* ================= GET ONE ================= */
export const getOne = async (req, res) => {
  const item = await Equivalent.findById(req.params.id)
    .populate("project_id", "name")
    .populate("assigned_employee", "name");

  if (!item) {
    return res.status(404).json({ error: "Record Not Found" });
  }

  if (
    req.user.role === "Employee" &&
    String(item.assigned_employee?._id) !== String(req.user.id)
  ) {
    return res.status(403).json({ error: "Forbidden" });
  }

  res.json({ success: true, data: item });
};

/* ================= UPDATE ================= */
export const update = async (req, res) => {
  const item = await Equivalent.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ error: "Record Not Found" });
  }

  if (req.user.role === "Employee") {
    const assignedId = String(item.assigned_employee);
    if (assignedId !== String(req.user.id)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    // Employee can only update status
    item.status = req.body.status;
  } else {
    Object.assign(item, req.body);
  }

  await item.save(); // ✅ triggers hours calculation

  const updated = await Equivalent.findById(item._id)
    .populate("project_id", "name")
    .populate("assigned_employee", "name");

  res.json({ success: true, data: updated });
};

/* ================= DELETE ================= */
export const remove = async (req, res) => {
  const item = await Equivalent.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Record Not Found" });
  }

  // ✅ Admin bypass
  if (
    req.user.role === "Finance" &&
    item.status !== "TO_DO"
  ) {
    return res.status(403).json({
      error: "Finance can delete only TO_DO items",
    });
  }

  await item.deleteOne();
  res.json({ success: true, message: "Deleted Successfully" });
};