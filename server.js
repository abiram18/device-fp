const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/", (req, res) => {
  console.log("📥 Device Data Received:", req.body);
  res.json({ message: "📬 Data received successfully" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  // Just a mock login for now
  if (username === "abi" && password === "abi18") {
    res.json({ message: "✅ Login successful" });
  } else {
    res.status(401).json({ message: "❌ Invalid credentials" });
  }
});

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});