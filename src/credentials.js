require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL);

  const existing = await User.findOne({ username: "admin" });
  if (existing) {
    console.log("Admin user already exists.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash("admin", 10);

  const adminUser = new User({
    username: "admin",
    password: hashedPassword,
    role: "admin"
  });

  await adminUser.save();
  console.log("Admin user created.");
  process.exit();
}

createAdmin();
