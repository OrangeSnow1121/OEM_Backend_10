const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { router: authRoute } = require("../routes/auth");
const reservationRouter = require('../routes/reservations');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: "https://oem-reservation-frontend-26.vercel.app",
  credentials: true
}));

app.use(express.json());

// API routes
app.use("/api/auth", authRoute);              // Handles login
app.use("/api/reservations", reservationRouter); // Handles /api/reservations/*

app.get("/", (req, res) => {
  res.send("OEM Reservation Backend Running");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8800, () => {
      console.log("Backend server running");
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
