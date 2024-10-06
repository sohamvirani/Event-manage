const express = require("express");
const { registerNewUser, loginExistingUser, fetchUserProfile } = require("../controllers/userControllers");
const { authenticate } = require("../middlewares/authMiddleware");

const userRouter = express.Router();

// Route for user registration
userRouter.post("/register", registerNewUser);

// Route for user login
userRouter.post("/login", loginExistingUser);

// Route for fetching user profile, protected by authentication middleware
userRouter.get("/profile", authenticate, fetchUserProfile);

module.exports = userRouter;
