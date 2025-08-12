import React, { useState } from 'react';
import api, { setToken } from '../services/api';

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    try {
      setErr(null);
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      localStorage.setItem('gc_token', token);
      setToken(token);
      onLogin();
    } catch (err) {
      setErr(err?.response?.data?.error || 'Login error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Manager Login</h2>

      {err && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded mb-4">
          {err}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition duration-200 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
