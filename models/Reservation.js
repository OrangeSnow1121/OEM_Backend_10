const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  site: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    default: "",
  },
  user: {
    type: String, // Changed from ObjectId to String
    required: true,
  },
});

module.exports = mongoose.model("Reservation", reservationSchema);
