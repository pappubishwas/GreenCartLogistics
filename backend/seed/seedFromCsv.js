require('dotenv').config();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parse');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Driver = require('../src/models/Driver');
const RouteModel = require('../src/models/Route');
const Order = require('../src/models/Order');

async function parseCSV(file) {
  const text = fs.readFileSync(file, 'utf8');
  return new Promise((resolve, reject) => {
    csv.parse(text, { columns: true, trim: true }, (err, records) => {
      if (err) reject(err);
      else resolve(records);
    });
  });
}

async function run() {
  await connectDB();
  // clear
  await Driver.deleteMany({});
  await RouteModel.deleteMany({});
  await Order.deleteMany({});

  const base = path.join(__dirname);
  const drivers = await parseCSV(path.join(base, 'data', 'drivers.csv'));
  const routes = await parseCSV(path.join(base, 'data', 'routes.csv'));
  const orders = await parseCSV(path.join(base, 'data', 'orders.csv'));

  
  for (const d of drivers) {
    const past = typeof d.past_week_hours === 'string' ? d.past_week_hours.split('|').map(Number) : [];
    await new Driver({
      name: d.name,
      shift_hours: Number(d.shift_hours),
      past_week_hours: past
    }).save();
  }

  for (const r of routes) {
    await new RouteModel({
      route_id: Number(r.route_id),
      distance_km: Number(r.distance_km),
      traffic_level: r.traffic_level,
      base_time_min: Number(r.base_time_min)
    }).save();
  }

  for (const o of orders) {
    await new Order({
      order_id: Number(o.order_id),
      value_rs: Number(o.value_rs),
      route_id: Number(o.route_id),
      delivery_time: o.delivery_time
    }).save();
  }

  console.log('Seeding complete');
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
