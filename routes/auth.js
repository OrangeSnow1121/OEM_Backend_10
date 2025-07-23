const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Auth endpoint is working");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "Lyb9172800915!@#") {
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

module.exports = router;