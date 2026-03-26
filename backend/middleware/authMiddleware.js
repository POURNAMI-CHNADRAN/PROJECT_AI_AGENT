import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

// 1️⃣ Authenticate the user via JWT
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded); // ✅ move here

    // 🔥 IMPORTANT FIX (support both id and _id)
    const user = await Employee.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User NOT Found" });
    }

    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

// 2️⃣ Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied : Insufficient Permissions" });
    }

    next();
  };
};

// req.user.role is assumed to be set by your auth middleware (JWT)

export const allowRoles = (...allowed) => {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

// Employee-specific: only allow updating certain fields
export const allowEmployeeStatusUpdate = (req, res, next) => {
  const role = req.user.role;

  if (role === "Employee") {
    // Only allow {status: "..."}
    const allowedFields = ["status"];

    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(403).json({
        error: "Employees can update Status only"
      });
    }
  }

  next();
};


export const adminOrHROnly = (req, res, next) => {
  if (["Admin", "HR"].includes(req.user.role)) return next();
  return res.status(403).json({ message: "Admin/HR Only" });
};

export const employeeOnly = (req, res, next) => {
  if (req.user.role === "Employee") return next();
  return res.status(403).json({ message: "Employees Only" });
};