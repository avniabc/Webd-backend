require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Create a .env file (copy .env.example) with MONGO_URI and JWT_SECRET.");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true }
}));

app.post("/register", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: "Enter a valid email." });
    if (password.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered." });
    const passwordHash = await bcrypt.hash(password, 10);
    await new User({ email, passwordHash }).save();
    res.status(201).json({ message: "Registered! Now log in." });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const user = await User.findOne({ email });
    const ok = user && await bcrypt.compare(String(req.body.password || ""), user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful.", token });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

function auth(req, res, next) {
  const h = req.headers.authorization || "";
  if (!h.startsWith("Bearer ")) return res.status(401).json({ message: "Please log in first." });
  try {
    req.userId = jwt.verify(h.split(" ")[1], process.env.JWT_SECRET).userId;
    next();
  } catch (e) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ message: "Protected route accessed.", email: user.email });
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
  })
  .catch(err => { console.error("MongoDB connection failed:", err.message); process.exit(1); });
