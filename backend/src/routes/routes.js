const express = require('express');
const router = express.Router();
const RouteModel = require('../models/Route');
const { authMiddleware } = require('../utils/validators');

router.get('/', authMiddleware, async (req, res) => {
  const items = await RouteModel.find().lean();
  res.json(items);
});

router.post('/', authMiddleware, async (req, res) => {
  const { route_id, distance_km, traffic_level, base_time_min } = req.body;
  if ([route_id, distance_km, base_time_min].some(v => v == null)) return res.status(400).json({ error: 'Missing fields' });
  const r = new RouteModel({ route_id, distance_km, traffic_level, base_time_min });
  await r.save();
  res.status(201).json(r);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const doc = await RouteModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Route not found' });
  res.json(doc);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await RouteModel.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
