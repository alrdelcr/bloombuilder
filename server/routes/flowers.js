const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower.js');

// GET all flowers
router.get('/', async (req, res, next) => {
  try {
    const flowers = await Flower.find();
    res.json(flowers);
  } catch (err) {
    next(err);
  }
});

// POST a new flower
router.post('/', async (req, res, next) => {
  try {
    const flower = new Flower(req.body);
    await flower.save();
    res.status(201).json(flower);
  } catch (err) {
    next(err); // ✅ Handles validation errors
  }
});

// PUT (update) a flower
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Flower.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ error: 'Flower not found' });
    }

    res.json(updated);
  } catch (err) {
    next(err); // ✅ Handles invalid ObjectId or validation errors
  }
});

// DELETE a flower
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Flower.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Flower not found' });
    }
    res.json({ success: true });
  } catch (err) {
    next(err); // ✅ Handles invalid ObjectId errors
  }
});

module.exports = router;
