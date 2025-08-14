import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { PlusCircle, Trash2, Package, Clock, MapPin, IndianRupee } from 'lucide-react';

export default function OrdersMgmt() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    order_id: '',
    value_rs: '',
    route_id: '',
    delivery_time: ''
  });

  async function load() {
    const res = await api.get('/orders');
    setItems(res.data);
  }

  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api.post('/orders', {
      order_id: Number(form.order_id),
      value_rs: Number(form.value_rs),
      route_id: Number(form.route_id),
      delivery_time: form.delivery_time
    });
    setForm({ order_id: '', value_rs: '', route_id: '', delivery_time: '' });
    load();
  }

  async function remove(id) {
    await api.delete(`/orders/${id}`);
    load();
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-100">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600">
        <Package className="inline-block w-8 h-8 mr-2" />
        Orders Management
      </h1>

      {/* Form */}
      <form
        onSubmit={create}
        className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg max-w-lg mx-auto mb-10 border border-gray-100 hover:shadow-xl transition-transform hover:scale-[1.01]"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">Add New Order</h2>

        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          placeholder="Order ID"
          type="number"
          value={form.order_id}
          onChange={e => setForm({ ...form, order_id: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          placeholder="Value (₹)"
          type="number"
          value={form.value_rs}
          onChange={e => setForm({ ...form, value_rs: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          placeholder="Route ID"
          type="number"
          value={form.route_id}
          onChange={e => setForm({ ...form, route_id: e.target.value })}
        />
        <input
          className="w-full mb-5 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 outline-none transition"
          placeholder="Delivery Time (HH:MM)"
          type="text"
          value={form.delivery_time}
          onChange={e => setForm({ ...form, delivery_time: e.target.value })}
        />
        <button
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
        >
          <PlusCircle className="w-5 h-5" /> Create Order
        </button>
      </form>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map(o => (
          <div
            key={o._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-2xl p-5 border border-gray-100 transition-all hover:-translate-y-1 hover:scale-[1.02]"
          >
            <div className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <Package className="w-5 h-5" /> Order #{o.order_id}
            </div>
            <div className="mt-3 text-gray-600 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <span className="font-semibold">Value:</span>
              <span className="text-green-600 font-bold">₹{o.value_rs}</span>
            </div>
            <div className="mt-2 text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-semibold">Route ID:</span> {o.route_id}
            </div>
            <div className="mt-2 text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">Delivery Time:</span> {o.delivery_time}
            </div>
            <button
              onClick={() => remove(o._id)}
              className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-xl font-medium hover:scale-105 hover:shadow-lg active:scale-95 transition-all"
            >
              <Trash2 className="w-5 h-5" /> Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
