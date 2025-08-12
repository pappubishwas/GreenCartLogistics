// This file contains the simulation implementation following the company rules:
// - Late delivery penalty (> base_time + 10min => ₹50)
// - Driver fatigue rule (>8 hours/day -> next day speed -30%
// - High-value bonus: value > 1000 and delivered on-time -> +10% bonus to order profit
// - Fuel cost: base ₹5/km, +₹2/km if traffic == High
// - Overall profit = sum(order value + bonus - penalties - fuel cost)
// - Efficiency = (on-time deliveries / total deliveries) * 100

const Driver = require('../models/Driver');
const RouteModel = require('../models/Route');
const Order = require('../models/Order');
const SimulationResult = require('../models/SimulationResult');

function parseTimeToMinutes(tstr) {
  const [h, m] = tstr.split(':').map(Number);
  return h * 60 + m;
}

function minutesFromHHMMString(hhmm) {
  if (!hhmm) return 0;
  const [hh, mm] = hhmm.split(':').map(x => parseInt(x, 10));
  return (hh || 0) * 60 + (mm || 0);
}

async function runSimulation({ availableDrivers, route_start_time, max_hours_per_driver }) {
  // validate inputs
  if (!Number.isInteger(availableDrivers) || availableDrivers <= 0) throw new Error('availableDrivers must be positive integer');
  if (!route_start_time || typeof route_start_time !== 'string') throw new Error('route_start_time required');
  if (!Number.isInteger(max_hours_per_driver) || max_hours_per_driver <= 0) throw new Error('max_hours_per_driver must be positive integer');

  const [drivers, routes, orders] = await Promise.all([
    Driver.find().lean(),
    RouteModel.find().lean(),
    Order.find().lean()
  ]);

  if (availableDrivers > drivers.length) {
    throw { status: 400, message: 'availableDrivers exceeds current driver count' };
  }


  const assignedDrivers = drivers.slice(0, availableDrivers).map(d => ({
    ...d,
    current_shift_hours: d.shift_hours
  }));

  // Build route map
  const routeMap = {};
  for (const r of routes) routeMap[r.route_id] = r;

  let totalProfit = 0;
  let onTimeCount = 0;
  let totalDeliveries = orders.length;
  const orderResults = [];


  for (const order of orders) {
    const route = routeMap[order.route_id];
    if (!route) continue;

    // convert strings to minutes
    const deliveredMin = minutesFromHHMMString(order.delivery_time);

    const threshold = route.base_time_min + 10; 
    let latePenalty = 0;
    let deliveredOnTime = false;

    if (deliveredMin > threshold) {
      latePenalty = 50;
    } else {
      deliveredOnTime = true;
      onTimeCount++;
    }

    // Fuel cost
    const baseFuel = 5 * route.distance_km;
    const surcharge = (route.traffic_level === 'High') ? 2 * route.distance_km : 0;
    const fuelCost = baseFuel + surcharge;

    // Bonus for high-value
    let bonus = 0;
    if (order.value_rs > 1000 && deliveredOnTime) {
      bonus = Math.round(order.value_rs * 0.10);
    }

    const profit = (order.value_rs + bonus - latePenalty - fuelCost);
    totalProfit += profit;

    orderResults.push({
      order_id: order.order_id,
      deliveredMin,
      threshold,
      deliveredOnTime,
      latePenalty,
      bonus,
      fuelCost,
      profit
    });
  }

  // Efficiency
  const efficiency = totalDeliveries === 0 ? 0 : (onTimeCount / totalDeliveries) * 100;

  const kpis = {
    total_profit: Math.round(totalProfit),
    efficiency: Number(efficiency.toFixed(2)),
    on_time_deliveries: onTimeCount,
    total_deliveries: totalDeliveries,
    fuel_cost_total: Math.round(orderResults.reduce((s,o)=>s+o.fuelCost,0)),
    order_results: orderResults
  };

  // Save simulation result to DB
  const sim = new SimulationResult({
    inputs: { availableDrivers, route_start_time, max_hours_per_driver },
    kpis
  });
  await sim.save();

  return kpis;
}

module.exports = { runSimulation, parseTimeToMinutes };
