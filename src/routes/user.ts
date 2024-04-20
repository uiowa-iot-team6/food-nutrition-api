import express from "express";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
const router = express.Router();

const SALT_ROUNDS = 10;

// Get all users api
router.get("/get-all", async (req, res) => {
  const users = await UserModel.find({});
  return res.status(200).json({ users });
});

// Get user by username api
router.get("/get-by-username", async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username } = req.query;
  if (typeof username === "string") {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    return res.status(200).json({ user });
  } else {
    return res.status(400).json({ message: "Invalid username" });
  }
});
router.put("/update-weight", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { weight, date, username } = req.body;
  // Find the user by userId
  if (typeof username === "string") {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user) {
      // Push new weight data to weightHistory array
      user.weightHistory.push({ weight, date });
      // Update the user's weightKg
      user.weightKg = weight;
      // Save the updated user
      await user.save();
      res.status(200).json({ message: "Weight updated successfully", user });
    }
  } else {
    return res.status(400).json({ message: "Invalid username" });
  }
});
//update goals
router.put("/update-goals", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username, weightGoal, carbsGoal, proteinGoal, fatGoal } = req.fields;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  await UserModel.findOneAndUpdate(
    { username },
    { weightGoal, carbsGoal, proteinGoal, fatGoal },
  );
  return res.status(201).json({ user, message: "User updated successfully" });
});

//Update rmr
router.put("/update-rmr", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username, rmr } = req.fields;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  await UserModel.findOneAndUpdate({ username }, { rmr });
  return res.status(201).json({ user, message: "User updated successfully" });
});

//update password
router.put("/update-password", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  await UserModel.findOneAndUpdate({ username }, { password: hashedPassword });
  return res.status(201).json({ user, message: "User updated successfully" });
});

//name
router.put("/update-names", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { username, firstname, lastname } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  await UserModel.findOneAndUpdate({ username }, { firstname, lastname });
  return res.status(201).json({ user, message: "User updated successfully" });
});

export { router as UserRouter };
