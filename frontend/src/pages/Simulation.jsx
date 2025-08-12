import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Simulation() {
  const [drivers, setDrivers] = useState(2);
  const [startTime, setStartTime] = useState('09:00');
  const [maxHours, setMaxHours] = useState(8);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function run(e) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.post('/simulation/run', {
        availableDrivers: Number(drivers),
        route_start_time: startTime,
        max_hours_per_driver: Number(maxHours)
      });
      setResult(res.data.kpis);
    } catch (err) {
      setErr(err?.response?.data?.error || 'Simulation failed');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Run Simulation</h1>

      {/* Form */}
      <form
        onSubmit={run}
        className="bg-white p-6 rounded-xl shadow max-w-lg border border-gray-200"
      >
        {err && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{err}</div>
        )}

        <div className="mb-2">
          <label className="block text-sm font-medium">Available Drivers</label>
          <input
            type="number"
            value={drivers}
            onChange={(e) => setDrivers(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-2">
          <label className="block text-sm font-medium">Route Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">
            Max Hours per Driver
          </label>
          <input
            type="number"
            value={maxHours}
            onChange={(e) => setMaxHours(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-2">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Run Simulation
          </button>
          <button
            type="button"
            className="px-4 py-2 border rounded hover:bg-gray-50"
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </button>
        </div>
      </form>

      {/* Results */}
      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Simulation Results
          </h2>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded shadow border border-green-200">
              <div className="text-sm text-green-700">Total Profit</div>
              <div className="text-2xl font-bold text-green-900">
                ₹ {result.total_profit}
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded shadow border border-blue-200">
              <div className="text-sm text-blue-700">Efficiency</div>
              <div className="text-2xl font-bold text-blue-900">
                {result.efficiency}%
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded shadow border border-yellow-200">
              <div className="text-sm text-yellow-700">On-time Deliveries</div>
              <div className="text-2xl font-bold text-yellow-900">
                {result.on_time_deliveries}/{result.total_deliveries}
              </div>
            </div>
          </div>

          {/* Detailed Order Table */}
          <div className="bg-white p-4 rounded-xl shadow border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b">Order ID</th>
                  <th className="px-3 py-2 border-b">On Time?</th>
                  <th className="px-3 py-2 border-b">Late Penalty</th>
                  <th className="px-3 py-2 border-b">Bonus</th>
                  <th className="px-3 py-2 border-b">Fuel Cost</th>
                  <th className="px-3 py-2 border-b">Profit</th>
                </tr>
              </thead>
              <tbody>
                {result.order_results.map((o) => (
                  <tr key={o.order_id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border-b">{o.order_id}</td>
                    <td
                      className={`px-3 py-2 border-b font-semibold ${
                        o.deliveredOnTime
                          ? 'text-green-700'
                          : 'text-red-600'
                      }`}
                    >
                      {o.deliveredOnTime ? 'Yes' : 'No'}
                    </td>
                    <td className="px-3 py-2 border-b">₹{o.latePenalty}</td>
                    <td className="px-3 py-2 border-b text-green-700">
                      ₹{o.bonus}
                    </td>
                    <td className="px-3 py-2 border-b text-yellow-700">
                      ₹{o.fuelCost}
                    </td>
                    <td
                      className={`px-3 py-2 border-b font-semibold ${
                        o.profit >= 0
                          ? 'text-green-800'
                          : 'text-red-700'
                      }`}
                    >
                      ₹{o.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
