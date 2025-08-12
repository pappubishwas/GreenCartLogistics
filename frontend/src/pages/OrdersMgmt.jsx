import React, { useEffect, useState } from 'react';
import api from '../services/api';

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
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Title */}
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        📦 Orders Management
      </h1>

      {/* Form */}
      <form
        onSubmit={create}
        className="bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto mb-8 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Order</h2>

        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Order ID"
          type="number"
          value={form.order_id}
          onChange={e => setForm({ ...form, order_id: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Value (₹)"
          type="number"
          value={form.value_rs}
          onChange={e => setForm({ ...form, value_rs: e.target.value })}
        />
        <input
          className="w-full mb-3 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Route ID"
          type="number"
          value={form.route_id}
          onChange={e => setForm({ ...form, route_id: e.target.value })}
        />
        <input
          className="w-full mb-4 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          placeholder="Delivery Time (HH:MM)"
          type="text"
          value={form.delivery_time}
          onChange={e => setForm({ ...form, delivery_time: e.target.value })}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          ➕ Create Order
        </button>
      </form>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map(o => (
          <div
            key={o._id}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
          >
            <div className="text-lg font-bold text-indigo-700">Order #{o.order_id}</div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Value:</span>{' '}
              <span className="text-green-600 font-bold">₹{o.value_rs}</span>
            </div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Route ID:</span> {o.route_id}
            </div>
            <div className="mt-1 text-gray-600">
              <span className="font-semibold">Delivery Time:</span> {o.delivery_time}
            </div>
            <button
              onClick={() => remove(o._id)}
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
