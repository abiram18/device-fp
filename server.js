const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API to log fingerprint
app.post('/fingerprint', (req, res) => {
  const { fingerprint, deviceInfo } = req.body;
  const entry = {
    timestamp: new Date().toISOString(),
    fingerprint,
    deviceInfo
  };

  fs.appendFile('fingerprint_logs.json', JSON.stringify(entry) + '\n', (err) => {
    if (err) {
      console.error("❌ Error writing to file:", err);
      return res.status(500).send("Error saving data");
    }
    console.log("✅ Fingerprint logged:", entry);
    res.status(200).send("Fingerprint received");
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'abi' && password === 'abi18') {
    return res.status(200).send("Login successful");
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});