import axios from 'axios';
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: BASE,
});

export function setToken(token) {
  instance.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';
}

export default instance;
