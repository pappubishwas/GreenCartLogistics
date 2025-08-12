const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const { authMiddleware } = require('../utils/validators');

// GET all drivers
router.get('/', authMiddleware, async (req, res) => {
  const drivers = await Driver.find().lean();
  res.json(drivers);
});

// POST create
router.post('/', authMiddleware, async (req, res) => {
  const { name, shift_hours, past_week_hours } = req.body;
  if (!name || shift_hours == null) return res.status(400).json({ error: 'Missing name or shift_hours' });

  const past = Array.isArray(past_week_hours)
    ? past_week_hours
    : (typeof past_week_hours === 'string' ? past_week_hours.split('|').map(Number) : []);
  const driver = new Driver({ name, shift_hours, past_week_hours: past });
  await driver.save();
  res.status(201).json(driver);
});

// PUT update
router.put('/:id', authMiddleware, async (req, res) => {
  const doc = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Driver not found' });
  res.json(doc);
});

// DELETE
router.delete('/:id', authMiddleware, async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
