// src/utils/apiService.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://100.65.78.122:8500/api/v1';

export const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔒 ดักจับสัญญาณขาออก: แนบ Token เข้า Authorization Header ทุกคำขอโดยอัตโนมัติ
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 💡 ดักจับสัญญาณขาเข้า: จัดการ Response / Error
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error?.response?.data || error);
  }
);