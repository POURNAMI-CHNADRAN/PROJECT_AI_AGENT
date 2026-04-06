import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 1️⃣ Authenticate via JWT (USER-based, not Employee)
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Always load USER (auth entity)
    const user = await User.findById(decoded.userId || decoded.id);
    if (!user || user.status !== "Active") {
      return res.status(401).json({ message: "User NOT Found or Inactive" });
    }

    // ✅ Attach ONLY what downstream needs
    req.user = {
      userId: user._id,
      role: user.role,
      employeeId: user.employeeId || null
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or Expired Token" });
  }
};

/**
 * 2️⃣ Role-based authorization
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access Denied : Insufficient Permissions" });
    }

    next();
  };
};

/**
 * 3️⃣ Generic role allow-list (optional helper)
 */
export const allowRoles = (...allowed) => {
  return (req, res, next) => {
    if (!req.user || !allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

/**
 * 4️⃣ Employee self-update restriction
 * (USED ONLY in Employee routes)
 */
export const allowEmployeeStatusUpdate = (req, res, next) => {
  const role = req.user.role;

  if (role === "Employee") {
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

/**
 * 5️⃣ Admin / Finance only
 */
export const adminOrHROnly = (req, res, next) => {
  if (["Admin", "Finance"].includes(req.user.role)) return next();
  return res.status(403).json({ message: "Admin/Finance Only" });
};

/**
 * 6️⃣ Employee only
 */
export const employeeOnly = (req, res, next) => {
  if (req.user.role === "Employee") return next();
  return res.status(403).json({ message: "Employees Only" });
};