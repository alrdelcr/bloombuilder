const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');

// GET all flowers
router.get('/', async (req, res) => {
  const flowers = await Flower.find();
  res.json(flowers);
});

// POST a new flower
router.post('/', async (req, res) => {
  const flower = new Flower(req.body); // req.body is the flower info sent by the frontend
  await flower.save();
  res.json(flower);
});

// PUT (update) a flower
router.put('/:id', async (req, res) => {
  const updated = await Flower.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE a flower
router.delete('/:id', async (req, res) => {
  await Flower.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
