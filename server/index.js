const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load .env file

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
const flowerRoutes = require('./routes/flowers'); // Adjusted to relative path
app.use('/api/flowers', flowerRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Bloombuilder API is running 🌸');
});

// ✅ Error-handling middleware — make sure this is before app.listen
app.use((err, req, res, next) => {
  console.error('--- ERROR HANDLER HIT ---');
  console.error(err.name);
  console.error(err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
