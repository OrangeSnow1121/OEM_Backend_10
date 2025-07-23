const router = require("express").Router();
const jwt = require("jsonwebtoken");

// Dummy secret key — use a strong one in production
const SECRET_KEY = "your_secret_key";

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Route for testing
router.get("/", (req, res) => {
  res.send("Auth endpoint is working");
});

// Simulated login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "Lyb9172800915!@#") {
    const user = { username: "admin", role: "admin" };
    const token = jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
    return res.status(200).json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Export both
module.exports = {
  router,
  authenticateToken
};
