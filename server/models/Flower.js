const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  name: String,       // e.g., "Rose"
  type: String,       // e.g., "focal", "filler", "foliage"
  color: String,      // e.g., "red"
  price: Number,      // price per stem
  quantity: Number,   // how many you have in stock
  imageUrl: String    // optional image link
});

module.exports = mongoose.model('Flower', FlowerSchema);