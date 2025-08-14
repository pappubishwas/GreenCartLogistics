import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusCircle, Trash2 } from 'lucide-react'; 

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

  const trafficBadge = (level) => {
    const colors = {
      Low: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      High: 'bg-red-100 text-red-800'
    };
    return `px-3 py-1 rounded-full text-sm font-semibold ${colors[level] || ''}`;
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 drop-shadow-sm">
        🛣 Routes Management
      </h1>

      {/* Form Section */}
      <form
        onSubmit={create}
        className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-lg mx-auto mb-10 border border-gray-100 hover:shadow-xl transition-transform hover:scale-[1.01]"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Add New Route</h2>

        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Route ID"
          type="number"
          value={form.route_id}
          onChange={e => setForm({ ...form, route_id: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Distance (km)"
          type="number"
          value={form.distance_km}
          onChange={e => setForm({ ...form, distance_km: e.target.value })}
        />
        <select
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition cursor-pointer"
          value={form.traffic_level}
          onChange={e => setForm({ ...form, traffic_level: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          className="w-full mb-5 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Base Time (min)"
          type="number"
          value={form.base_time_min}
          onChange={e => setForm({ ...form, base_time_min: e.target.value })}
        />

        {/* Add Button */}
        <button
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Add Route
        </button>
      </form>

      {/* Routes List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map(r => (
          <div
            key={r._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-5 border border-gray-100 transition-all hover:-translate-y-1 hover:scale-[1.02]"
          >
            <div className="text-xl font-bold text-blue-700">Route #{r.route_id}</div>
            <div className="mt-2 text-gray-600">
              <span className="font-semibold">Distance:</span> {r.distance_km} km
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold text-gray-600">Traffic:</span>
              <span className={trafficBadge(r.traffic_level)}>
                {r.traffic_level}
              </span>
            </div>
            <div className="mt-2 text-gray-600">
              <span className="font-semibold">Base Time:</span> {r.base_time_min} min
            </div>

            {/* Delete Button */}
            <button
              onClick={() => remove(r._id)}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-xl font-medium hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
