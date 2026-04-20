import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
    type: String,
    required: true,
    },
    
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Finance", "Manager", "Employee"],
      required: true,
    },

    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
      validate: {
        validator: function (value) {
          return this.role !== "Employee" || value != null;
        },
        message: "Employee Role must have EmployeeId"
      }
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Inactive",
    },

    // 🔐 INVITE FLOW FIELDS (NEW)
    inviteToken: {
      type: String,
      default: null,
    },

    inviteExpires: {
      type: Date,
      default: null,
    },

    isFirstLogin: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.inviteToken;
    delete ret.inviteExpires;
    return ret;
  }
});


export default mongoose.model("User", userSchema);