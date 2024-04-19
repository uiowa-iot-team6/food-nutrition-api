import express from "express";
import { DeviceModel } from "../models/device";
import { UserModel } from "../models/user";
const router = express.Router();

// Create a new device
router.post("/create", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { code } = req.fields;
  if (!code) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  req.log.info({ code }, "Creating device with provided information.");

  // Create a new device instance and save it to the database
  const newDevice = new DeviceModel({
    code,
  });
  await newDevice.save();
  return res.status(201).json({ message: "Device successfully created" }); // Use HTTP status code 201 for created
});

router.get("/get-by-code", async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { code } = req.query;
  if (typeof code === "string") {
    const device = await DeviceModel.findOne({ code });
    if (!device) {
      return res.status(401).json({ message: "Invalid device" });
    }
    return res.status(200).json({ device });
  } else {
    return res.status(400).json({ message: "Invalid code" });
  }
});

// Get Connected user
router.get("/get-connected-user", async (req, res) => {
  if (!req.query) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { code } = req.query;
  if (typeof code === "string") {
    const device = await DeviceModel.findOne({ code });
    if (!device) {
      return res.status(401).json({ message: "Invalid device" });
    }
    return res.status(200).json({ connectedUser: device.connectedUser });
  } else {
    return res.status(400).json({ message: "Invalid code" });
  }
});

// Connect user to device
router.put("/connect-user", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request query is missing" });
  }
  const { code, username } = req.fields;
  const device = await DeviceModel.findOne({ code });
  if (!device) {
    return res.status(401).json({ message: "Invalid device" });
  }
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }
  await DeviceModel.findOneAndUpdate({ code }, { connectedUser: user._id });
  res.status(201).json({ message: "User connected successfully" });
});
export { router as deviceRouter };
