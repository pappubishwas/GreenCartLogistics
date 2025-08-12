const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../utils/validators');
const { runSimulation } = require('../services/simulationService');

// POST /api/simulation/run
router.post('/run', authMiddleware, async (req, res) => {
  try {
    const { availableDrivers, route_start_time, max_hours_per_driver } = req.body;
    const kpis = await runSimulation({
      availableDrivers: Number(availableDrivers),
      route_start_time,
      max_hours_per_driver: Number(max_hours_per_driver)
    });
    res.json({ kpis });
  } catch (err) {
    console.error(err);
    if (err && err.status) return res.status(err.status).json({ error: err.message || err });
    res.status(400).json({ error: err.message || 'Simulation error' });
  }
});

// GET history
router.get('/history', authMiddleware, async (req, res) => {
  const SimulationResult = require('../models/SimulationResult');
  const items = await SimulationResult.find().sort({ createdAt: -1 }).lean();
  res.json(items);
});

module.exports = router;
