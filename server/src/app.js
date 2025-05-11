const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Aquí importas las rutas
// const moodRoutes = require('./routes/moodRoutes');
// app.use('/api/moods', moodRoutes);

module.exports = app;
