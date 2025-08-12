import React, { useEffect, useState } from 'react';
import api from '../services/api';
import OnTimeChart from '../components/charts/OnTimeChart';
import FuelBreakdownChart from '../components/charts/FuelBreakdownChart';

export default function Dashboard() {
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/simulation/history');
        if (res.data && res.data.length) setLatest(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  if (!latest) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 text-lg font-medium">
        🚀 No simulation run yet. Please go to the Simulation page.
      </div>
    );
  }

  const k = latest.kpis;

  const statCards = [
    { label: 'Total Profit', value: `₹ ${k.total_profit}`, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Efficiency Score', value: `${k.efficiency}%`, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'On-time vs Late', value: `${k.on_time_deliveries}/${k.total_deliveries}`, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
        📊 Dashboard Overview
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 rounded-xl shadow-md ${stat.bg} transition-transform transform hover:scale-105 hover:shadow-lg`}
          >
            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            <div className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">📦 On-Time Deliveries</h2>
          <OnTimeChart orderResults={k.order_results} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">⛽ Fuel Breakdown</h2>
          <FuelBreakdownChart orderResults={k.order_results} />
        </div>
      </div>
    </div>
  );
}
