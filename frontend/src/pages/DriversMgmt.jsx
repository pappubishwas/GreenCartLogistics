import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusCircle, Trash2, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
 

export default function DriversMgmt() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', shift_hours: 8, past_week_hours: '' });
  const [message, setMessage] = useState('');

  async function load() {
    const res = await api.get('/drivers');
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api.post('/drivers', form);
    setForm({ name: '', shift_hours: 8, past_week_hours: '' });
    setMessage('✅ Driver added successfully!');
    setTimeout(() => setMessage(''), 2000);
    load();
  }

  async function remove(id) {
    await api.delete(`/drivers/${id}`);
    load();
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-600 drop-shadow-sm">
        🚚 Drivers Management
      </h1>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="max-w-lg mx-auto mb-4 bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium shadow"
        >
          {message}
        </motion.div>
      )}

      {/* Form Section */}
      <motion.form
        onSubmit={create}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-lg mx-auto mb-10 border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
          <PlusCircle className="w-5 h-5" />
          Add New Driver
        </h2>
        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Driver Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Shift Hours"
          value={form.shift_hours}
          onChange={e => setForm({ ...form, shift_hours: e.target.value })}
        />
        <input
          className="w-full mb-5 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-400 outline-none transition"
          placeholder="Past week hours e.g. 6|7|8|6|6|7|8"
          value={form.past_week_hours}
          onChange={e => setForm({ ...form, past_week_hours: e.target.value })}
        />
        <button
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
        >
          ➕ Add Driver
        </button>
      </motion.form>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <AnimatePresence>
          {items.map(d => (
            <motion.div
              key={d._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-5 border border-gray-100 transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-2 text-blue-700 font-bold text-lg">
                <User className="w-5 h-5" />
                {d.name}
              </div>
              <div className="text-gray-600 mt-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                Shift: <span className="font-semibold">{d.shift_hours} hrs</span>
              </div>
              <div className="text-gray-600 mt-2">
                Past 7 days: <span className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">{d.past_week_hours.join(', ')}</span>
              </div>
              <button
                onClick={() => remove(d._id)}
                className="mt-5 w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-xl flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
