const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authMiddleware } = require('../utils/validators');

router.get('/', authMiddleware, async (req, res) => {
  const items = await Order.find().lean();
  res.json(items);
});

router.post('/', authMiddleware, async (req, res) => {
  const { order_id, value_rs, route_id, delivery_time } = req.body;
  if ([order_id, value_rs, route_id, delivery_time].some(v => v == null)) return res.status(400).json({ error: 'Missing fields' });
  const o = new Order({ order_id, value_rs, route_id, delivery_time });
  await o.save();
  res.status(201).json(o);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const doc = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Order not found' });
  res.json(doc);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
