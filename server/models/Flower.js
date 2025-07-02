const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  name: { type: String, required: true },      // ✅ This triggers validation error
  type: String,
  color: String,
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  quantity: { type: Number, required: true, min: [0, 'Quantity cannot be negative']},
  imageUrl: String
});

const Flower = mongoose.model('Flower', FlowerSchema);
module.exports = Flower;
