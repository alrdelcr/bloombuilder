const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error(err));

// Routes
const flowerRoutes = require('./routes/flowers');
app.use('/api/flowers', flowerRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Bloombuilder API is running 🌸');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
