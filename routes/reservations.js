const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).send("Access denied");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);  // Debug
    res.status(401).send("Invalid token");
  }
};

// GET reservations by site and date
router.get("/filter", async (req, res) => {
  try {
    const { site, date } = req.query;
    if (!site || !date) {
      return res.status(400).json({ error: "Missing site or date query parameters" });
    }
    const reservations = await Reservation.find({ site, date });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new reservation (admin-only)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id || req.user.role !== "admin") {
      console.error("Unauthorized request: insufficient privileges");
      return res.status(403).json({ error: "Only admins can create reservations" });
    }

    console.log("Reservation requested by admin:", req.user.username);
    console.log("Body received:", req.body);

    const newReservation = new Reservation({ ...req.body, user: req.user.id });
    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    console.error("Reservation failed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update note for a reservation (admin only)
router.patch("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  try {
    const { note } = req.body;
    const updated = await Reservation.findByIdAndUpdate(req.params.id, { note }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed" });
  }
});

// Delete a reservation (admin only)
router.delete("/:id", verifyToken, async (req, res) => {
  if (req.user.role !== "admin") return res.sendStatus(403);
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ message: "Delete failed" });
  }
});



// GET reservations by date
router.get("/:date", async (req, res) => {
  try {
    const reservations = await Reservation.find({ date: req.params.date });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
