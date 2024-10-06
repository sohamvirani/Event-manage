const express = require("express");
const path = require("path");
const initializeDatabase = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const APPLICATION_PORT = process.env.PORT || 5500;

// Middleware setup for handling JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// Connect to the database
initializeDatabase();

// Set up API endpoints
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);

// Launch the server
app.listen(APPLICATION_PORT, () => {
  console.log(`Server is listening at: http://localhost:${APPLICATION_PORT}`);
});
