import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function FuelBreakdownChart({ orderResults }) {
  // group by traffic level maybe not present here; use fuelCost per order
  const labels = orderResults.map(o=>`Order ${o.order_id}`);
  const data = {
    labels,
    datasets: [{ label: 'Fuel Cost (₹)', data: orderResults.map(o=>o.fuelCost) }]
  };
  return <div>
    <h3 className="mb-2 font-semibold">Fuel Cost per Order</h3>
    <Bar data={data} />
  </div>;
}
