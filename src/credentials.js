const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdminUser() {
  const username = "admin";
  const plainPassword = "Lyb9172800915!@#";
  const existing = await User.findOne({ username });

  if (existing) {
    console.log("Admin user already exists.");
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const newUser = new User({
    username,
    password: hashedPassword,
    role: "admin",
  });

  await newUser.save();
  console.log("Admin user created successfully.");
  process.exit();
}

createAdminUser();
