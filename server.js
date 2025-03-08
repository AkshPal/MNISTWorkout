const express = require("express");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const session = require("express-session");
const FormData = require("form-data");

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Enable sessions
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Serve static files
app.use(express.static("public"));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Serve frontend
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Handle file upload and prediction request
app.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    try {
        // Prepare file data for Flask API
        const formData = new FormData();
        formData.append("file", req.file.buffer, { filename: req.file.originalname });

        // Send to Flask API
        const response = await axios.post("http://localhost:5000/predict", formData, {
            headers: formData.getHeaders()
        });

        const prediction = response.data.prediction;

        // Store history in session
        if (!req.session.history) {
            req.session.history = [];
        }
        req.session.history.push({
            filename: req.file.originalname,
            prediction: prediction
        });

        res.json({ prediction: prediction });
    } catch (error) {
        console.error("Error sending to Flask API:", error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

// Get session history
app.get("/history", (req, res) => {
    res.json({ history: req.session.history || [] });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
