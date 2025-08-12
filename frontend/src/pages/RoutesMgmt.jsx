import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function RoutesMgmt() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    route_id: '',
    distance_km: '',
    traffic_level: 'Low',
    base_time_min: ''
  });

  async function load() {
    const res = await api.get('/routes');
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api.post('/routes', {
      route_id: Number(form.route_id),
      distance_km: Number(form.distance_km),
      traffic_level: form.traffic_level,
      base_time_min: Number(form.base_time_min)
    });
    setForm({ route_id: '', distance_km: '', traffic_level: 'Low', base_time_min: '' });
    load();
  }

  async function remove(id) {
    await api.delete(`/routes/${id}`);
    load();
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Title */}
      <h1 className="text-3xl font-extrabold text-blue-800 mb-6 text-center">
        🛣 Routes Management
      </h1>

      {/* Form Section */}
      <form
        onSubmit={create}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto mb-8 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Route</h2>

        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Route ID"
          type="number"
          value={form.route_id}
          onChange={e => setForm({ ...form, route_id: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Distance (km)"
          type="number"
          value={form.distance_km}
          onChange={e => setForm({ ...form, distance_km: e.target.value })}
        />
        <select
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          value={form.traffic_level}
          onChange={e => setForm({ ...form, traffic_level: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Base Time (min)"
          type="number"
          value={form.base_time_min}
          onChange={e => setForm({ ...form, base_time_min: e.target.value })}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Route
        </button>
      </form>

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map(r => (
          <div
            key={r._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
          >
            <div className="text-lg font-bold text-blue-700">Route #{r.route_id}</div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Distance:</span> {r.distance_km} km
            </div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Traffic:</span>{' '}
              <span
                className={
                  r.traffic_level === 'Low'
                    ? 'text-green-600 font-bold'
                    : r.traffic_level === 'Medium'
                    ? 'text-yellow-600 font-bold'
                    : 'text-red-600 font-bold'
                }
              >
                {r.traffic_level}
              </span>
            </div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Base Time:</span> {r.base_time_min} min
            </div>
            <button
              onClick={() => remove(r._id)}
              className="mt-4 w-full bg-red-500 text-white py-1.5 rounded-lg hover:bg-red-600 transition"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
