// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GUTEN_CRUST_URL || 'http://localhost:8000/api/guten',
});

export default api;
