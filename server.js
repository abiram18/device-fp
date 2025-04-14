const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Simple check for hardcoded username and password
    if (username === 'abi' && password === 'abi18') {
        return res.status(200).send({ message: "Login successful" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Fingerprint route (for logging device info)
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

// Catch-all route to serve the login page (index.html)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, HOST, () => {
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
});