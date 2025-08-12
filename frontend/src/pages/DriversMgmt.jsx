import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function DriversMgmt() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', shift_hours: 8, past_week_hours: '' });

  async function load() {
    const res = await api.get('/drivers');
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    const payload = { ...form, past_week_hours: form.past_week_hours };
    await api.post('/drivers', payload);
    setForm({ name: '', shift_hours: 8, past_week_hours: '' });
    load();
  }

  async function remove(id) {
    await api.delete(`/drivers/${id}`);
    load();
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">🚚 Drivers Management</h1>

      {/* Form Section */}
      <form
        onSubmit={create}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto mb-8 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Driver</h2>
        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Driver Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Shift Hours"
          value={form.shift_hours}
          onChange={e => setForm({ ...form, shift_hours: e.target.value })}
        />
        <input
          className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          placeholder="Past week hours e.g. 6|7|8|6|6|7|8"
          value={form.past_week_hours}
          onChange={e => setForm({ ...form, past_week_hours: e.target.value })}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add Driver
        </button>
      </form>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map(d => (
          <div
            key={d._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
          >
            <div className="font-bold text-lg text-blue-700">{d.name}</div>
            <div className="text-gray-600 mt-1">Shift: <span className="font-semibold">{d.shift_hours} hrs</span></div>
            <div className="text-gray-600 mt-1">
              Past 7 days: <span className="font-mono">{d.past_week_hours.join(', ')}</span>
            </div>
            <button
              onClick={() => remove(d._id)}
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
