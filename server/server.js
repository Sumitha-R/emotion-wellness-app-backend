require('dotenv').config();
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Adjusted path for server/config/db
const journalRoutes = require('./routes/journal');
const userRoutes = require('./routes/user'); // ✅ Correct path
const cors = require('cors');
const soundRoutes = require('./routes/sound');
const bookRoutes = require('./routes/book');
const podcastRoutes = require('./routes/podcast');
const path = require('path');
const challengeRoutes = require('./routes/challenge');

// Connect to MongoDB
connectDB();

const app = express();

app.use(cors());
// Middleware
app.use(express.json());
app.use('/user', userRoutes);
app.use('/journal', journalRoutes);
app.use('/dashboard', require('./routes/dashboard'));
app.use('/sound', soundRoutes);
app.use('/books', bookRoutes);
app.use('/podcasts', podcastRoutes);
app.use('/challenge', challengeRoutes);
app.use('/sounds', express.static(path.join(__dirname, '..', 'public', 'sounds')));

// Example route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});