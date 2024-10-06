const Event = require("../models/eventModel");
const path = require("path");
const { sendEmail } = require("../nodemailer/Nodemailer");

// Create a new event
const createNewEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  // Validate required fields
  if (!title || !description || !date || !location || !maxAttendees) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    let eventImageUrl = "";
    if (req.file) {
      eventImageUrl = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      maxAttendees,
      imageUrl: eventImageUrl,
      createdBy: req.user._id,
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Retrieve all events
const fetchAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "username email")
      .populate("attendees", "username");
      
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Retrieve events created by the logged-in user
const fetchMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).populate(
      "attendees",
      "username email"
    );
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Delete an event
const removeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete this event" });
    }

    await event.deleteOne();
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Update an event
const modifyEvent = async (req, res) => {
  const { title, description, date, location, maxAttendees } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this event" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.maxAttendees = maxAttendees || event.maxAttendees;

    if (req.file) {
      event.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();
    return res.status(200).json(updatedEvent);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error during event update",
      error: error.message,
    });
  }
};

// Retrieve a specific event by ID
const fetchEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("attendees", "username");

    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error during event retrieval",
      error: error.message,
    });
  }
};

// RSVP to an event
const rsvpToEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).send({ message: "Event not found" });
    }

    if (event.attendees.includes(req.user._id)) {
      return res
        .status(400)
        .send({ message: "You have already RSVP'd to this event." });
    }

    if (event.attendees.length >= event.maxAttendees) {
      return res.status(400).send({ message: "This event is fully booked" });
    }

    event.attendees.push(req.user._id);
    await event.save();
    sendEmail(req.user.email, event);

    return res.status(200).send({ message: "RSVP successful", event });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error during RSVP",
      error: error.message,
    });
  }
};

module.exports = {
  createNewEvent,
  fetchAllEvents,
  fetchMyEvents,
  removeEvent,
  modifyEvent,
  fetchEventById,
  rsvpToEvent,
};
