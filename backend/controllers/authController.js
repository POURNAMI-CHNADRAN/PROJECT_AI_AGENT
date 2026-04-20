import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/** ---------------- TOKEN ---------------- */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/** ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password Required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    if (user.status !== "Active") {
      return res.status(400).json({ message: "Account not Active" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/** ---------------- SET PASSWORD ---------------- */
export const setPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      inviteToken: token,
      inviteExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Link" });
    }

    // ✅ IMPORTANT FIX (HASH PASSWORD)
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.inviteToken = null;
    user.inviteExpires = null;
    user.status = "Active";
    user.isFirstLogin = false;

    await user.save();

    return res.json({
      message: "Password Set Successfully. You can now Login.",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};