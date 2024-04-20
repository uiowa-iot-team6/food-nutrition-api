import express from "express";
import { UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const router = express.Router();

// Define a constant for the bcrypt salt rounds for consistency
const SALT_ROUNDS = 10;

// Register API
router.post("/register", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { username, email, password, firstname, lastname } = req.fields;
  if (!username || !email || !password || !firstname || !lastname) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  req.log.info(
    { username, email, password, firstname, lastname },
    "Creating user with provided information.",
  );

  // Check if the user already exists in the database
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" }); // Use HTTP status code 409 for conflict
  }
  // Hash the password with a predefined number of salt rounds for consistency
  if (typeof password === "string") {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // Create a new user instance and save it to the database
    const newUser = new UserModel({
      username,
      password: hashedPassword,
      firstname,
      lastname,
      email,
    });
    await newUser.save();
    return res.status(201).json({ message: "User successfully created" }); // Use HTTP status code 201 for created
  } else {
    return res.status(400).json({ message: "Password must be a string" });
  }
});

// Login API
router.post("/login", async (req, res) => {
  if (!req.fields) {
    return res.status(400).json({ message: "Request body is missing" });
  }
  const { username, password } = req.fields;
  // Find the user by username
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User does not exist" }); // Use HTTP status code 404 for not found
  }
  // Compare the provided password with the hashed password in the database
  if (typeof password === "string") {
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username or Password incorrect" }); // Use HTTP status code 401 for unauthorized
    }
    // Generate a token for the user
    const token = jwt.sign({ id: user?._id }, "secret", { expiresIn: "365d" }); // Added expiration time of 365 days
    res.status(200).json({ token, user }); // Use HTTP status code 200 for OK
  } else {
    return res.status(400).json({ message: "Password must be a string" });
  }
});

export { router as authRouter };
