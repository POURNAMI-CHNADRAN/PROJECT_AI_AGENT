import jwt from "jsonwebtoken";
import User from "../models/User.js";

/** ---------------- PROTECT ---------------- */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.status !== "Active") {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    req.user = {
      userId: user._id,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

/** ---------------- AUTHORIZE ---------------- */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not Logged In" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access Denied" });
    }

    next();
  };
};