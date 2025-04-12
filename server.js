// server.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});