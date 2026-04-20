import crypto from "crypto";
import User from "../models/User.js";
import Employee from "../models/Employee.js";

export const inviteUser = async (req, res) => {
  try {
    const { employeeId, role } = req.body;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "Employee NOT Found" });
    }

    const existingUser = await User.findOne({ email: employee.email });

    if (existingUser) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.create({
      email: employee.email,
      role,
      employeeId: employee._id,
      password: "TEMP_PASSWORD",
      status: "Inactive",
      inviteToken: token,
      inviteExpires: Date.now() + 24 * 60 * 60 * 1000
    });

    const inviteLink = `http://localhost:5173/set-password/${token}`;

    console.log("📧 INVITE LINK:", inviteLink);

    res.json({
      message: "User Invited Successfully",
      inviteLink
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};