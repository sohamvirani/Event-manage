const mongoose = require("mongoose");

// Define the Event Schema
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
    },
    maxAttendees: {
      type: Number,
      required: [true, "Maximum number of attendees is required"],
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    imageUrl: {
      type: String, // To store the URL of the uploaded event image
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator's user ID is required"],
    },
  },
  { timestamps: true }
);

// Create the Event model
const EventModel = mongoose.model("Event", eventSchema);
module.exports = EventModel;
