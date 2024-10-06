const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authenticateUser = async (req, res, next) => {
  let token;

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      // Extract the token
      token = authHeader.split(" ")[1];
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Find the user without the password
      req.user = await User.findById(decoded.id).select("-password");
      return next(); // Proceed to the next middleware
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  }

  // If no token is present
  return res.status(401).json({ message: "Please log in first" });
};

module.exports = { authenticateUser };
