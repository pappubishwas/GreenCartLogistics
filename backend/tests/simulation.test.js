require('dotenv').config();
const { runSimulation } = require('../src/services/simulationService');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Driver = require('../src/models/Driver');
const RouteModel = require('../src/models/Route');
const Order = require('../src/models/Order');

beforeAll(async () => {
  await connectDB();
  await Driver.deleteMany({});
  await RouteModel.deleteMany({});
  await Order.deleteMany({});

  // seed small dataset
  await new Driver({ name: 'A', shift_hours: 8, past_week_hours: [6,7,8,6,6,7,8] }).save();
  await new Driver({ name: 'B', shift_hours: 8, past_week_hours: [6,7,8,6,6,7,8] }).save();

  await new RouteModel({ route_id: 1, distance_km: 10, traffic_level: 'Low', base_time_min: 30 }).save();
  await new RouteModel({ route_id: 2, distance_km: 5, traffic_level: 'High', base_time_min: 20 }).save();

  // Order 1: delivered on time (25 min vs base 30 + 10 = 40), high value
  await new Order({ order_id: 1, value_rs: 2000, route_id: 1, delivery_time: '00:25' }).save();
  // Order 2: late (55 min vs base 40)
  await new Order({ order_id: 2, value_rs: 500, route_id: 1, delivery_time: '00:55' }).save();
  // Order 3: high traffic
  await new Order({ order_id: 3, value_rs: 1200, route_id: 2, delivery_time: '00:22' }).save();

});

afterAll(async () => {
  await mongoose.connection.close();
});

test('simulation throws on invalid inputs', async () => {
  await expect(runSimulation({ availableDrivers: -1, route_start_time: '09:00', max_hours_per_driver: 8 })).rejects.toThrow();
  await expect(runSimulation({ availableDrivers: 1, route_start_time: null, max_hours_per_driver: 8 })).rejects.toThrow();
});

test('simulation computes totals and efficiency', async () => {
  const kpis = await runSimulation({ availableDrivers: 2, route_start_time: '09:00', max_hours_per_driver: 8 });
  expect(kpis.total_deliveries).toBe(3);
  expect(kpis.on_time_deliveries).toBeGreaterThanOrEqual(1);
  expect(typeof kpis.total_profit).toBe('number');
});

test('high-value bonus applied when on-time', async () => {
  const kpis = await runSimulation({ availableDrivers: 2, route_start_time: '09:00', max_hours_per_driver: 8 });
  const order1 = kpis.order_results.find(o=>o.order_id===1);
  expect(order1.bonus).toBeGreaterThan(0);
});

test('late orders get penalty', async () => {
  const kpis = await runSimulation({ availableDrivers: 2, route_start_time: '09:00', max_hours_per_driver: 8 });
  const order2 = kpis.order_results.find(o=>o.order_id===2);
  expect(order2.latePenalty).toBe(50);
});

test('fuel surcharge applied for High traffic', async () => {
  const kpis = await runSimulation({ availableDrivers: 2, route_start_time: '09:00', max_hours_per_driver: 8 });
  const order3 = kpis.order_results.find(o=>o.order_id===3);
  // distance 5 km => base 5/km * 5 = 25, surcharge 2/km * 5 = 10 => fuel 35
  expect(order3.fuelCost).toBe(35);
});
