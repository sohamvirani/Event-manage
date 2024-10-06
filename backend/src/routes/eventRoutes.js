const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createNewEvent,
  fetchAllEvents,
  fetchUserEvents,
  removeEvent,
  modifyEvent,
  fetchEventById,
  rsvpToEvent,
} = require("../controllers/eventController");
const { authenticate } = require("../middlewares/authMiddleware");

const eventRouter = express.Router();

// Configure Multer for handling file uploads
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsDir = path.join(__dirname, "../uploads/");

    // Ensure the upload directory exists, create if it doesn't
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadMiddleware = multer({
  storage: storageConfig,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are permitted!"), false);
    }
  },
});

// Define routes for event management
eventRouter.get("/my-events", authenticate, fetchUserEvents);
eventRouter.post("/create", authenticate, uploadMiddleware.single("image"), createNewEvent);
eventRouter.get("/all", fetchAllEvents);
eventRouter.delete("/:id", authenticate, removeEvent);
eventRouter.put("/:id", authenticate, uploadMiddleware.single("image"), modifyEvent);
eventRouter.get("/:id", fetchEventById);
eventRouter.post("/:id/rsvp", authenticate, rsvpToEvent);

module.exports = eventRouter;
