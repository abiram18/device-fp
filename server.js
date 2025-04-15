const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb+srv://abiram:abi18@cluster0.tklkrqn.mongodb.net/deviceFP?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema
const Fingerprint = mongoose.model("Fingerprint", new mongoose.Schema({
  username: String, // Store username
  timestamp: String,
  fingerprint: String,
  deviceInfo: Object,
}));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/", async (req, res) => {
  const { username, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const fp = new Fingerprint({
      username,
      timestamp,
      fingerprint,
      deviceInfo,
    });
    await fp.save();
    res.json({ message: "Fingerprint saved to DB" });
  } catch (err) {
    console.error("❌ Error saving fingerprint:", err);
    res.status(500).json({ error: "Failed to save fingerprint" });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Simple login check (can replace with DB logic)
  if (username === "admin" && password === "password") {
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});