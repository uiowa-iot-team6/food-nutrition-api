import mongoose, { Schema } from "mongoose";

const DeviceSchema = new mongoose.Schema({
  code: { type: String, required: true },
  connectedUser: { type: Schema.Types.ObjectId, default: null, ref: "users" },
  connectedHistory: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

export const DeviceModel = mongoose.model("device", DeviceSchema);
