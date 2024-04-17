import mongoose from "mongoose";

const WeightHistorySchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  date: { type: Date, required: true },
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  heightCm: { type: Number, required: false },
  weightKg: { type: Number, required: false },
  age: { type: Number, required: false },
  gender: { type: String, required: false },
  rmr: { type: Number, required: false },
  carbsGoal: { type: Number, required: false },
  proteinGoal: { type: Number, required: false },
  fatGoal: { type: Number, required: false },
  weightGoal: { type: Number, required: false },
  profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  weightHistory: [WeightHistorySchema],
});

export const UserModel = mongoose.model("users", UserSchema);
