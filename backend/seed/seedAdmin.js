import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = "admin@test.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin Already Exists");
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const adminUser = await User.create({
      name: "System Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
      status: "Active"
    });

    console.log("✅ Admin User Created:");
    console.log({
      email: adminUser.email,
      role: adminUser.role
    });

    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Admin:", error);
    process.exit(1);
  }
};

seedAdmin();