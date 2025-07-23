const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoute = require("../routes/auth");
const reservationRouter = require('./routes/reservations')

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", reservationRouter); // where reservationRouter handles /reservations/:date

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
  res.send("OEM Reservation Backend Running");
});

app.get('/api/reservations/:date', authenticateToken, async (req, res) => {
  const date = req.params.date;
  const reservations = await Reservation.find({ date });
  res.json(reservations);
});



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 8800, () => {
      console.log("Backend server running");
    });
  })
  .catch(err => console.error(err));
