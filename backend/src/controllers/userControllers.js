const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Function to generate JWT
const createToken = (userId, username) => {
  return jwt.sign({ id: userId, username }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// User Registration
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Check for required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already registered" });
  }

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password,
  });

  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token: createToken(newUser._id, newUser.username),
    });
  } else {
    return res.status(400).json({ message: "User creation failed" });
  }
};

// User Login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  
  // Verify user and password
  if (user && (await user.matchPassword(password))) {
    return res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: createToken(user._id, user.username),
    });
  } else {
    return res.status(401).json({ message: "Incorrect email or password" });
  }
};

// Retrieve User Profile
const fetchUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  // Send user data
  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
};

module.exports = { register, login, fetchUserProfile };
