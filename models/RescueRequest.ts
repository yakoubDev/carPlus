// models/RescueRequest.ts
import mongoose from "mongoose";

const RescueRequestSchema = new mongoose.Schema({
  driverName: String,
  driverPhone: String,
  driverEmail: String,
  rescuerEmail: String,
  location: {
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.models.RescueRequest || mongoose.model("RescueRequest", RescueRequestSchema);
