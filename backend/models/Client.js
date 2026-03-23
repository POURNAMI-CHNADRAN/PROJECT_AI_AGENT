import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    client_name: { type: String, required: true, unique: true },

    industry: { type: String },
    country: { type: String },

    email: { type: String },
    phone: { type: String },
    address: { type: String },

    // Soft delete
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);