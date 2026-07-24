// src/utils/apiService.ts
import axios from 'axios';

/**
 * 🎯 วัตถุประสงค์: สถานีรวมศูนย์เครื่องมือยิงสัญญาณ Axios ส่วนกลางของโครงการ Golf-TD
 * @description ลากสายสัญญาณเชื่อมต่อข้ามมิติไปยัง Express Server ผ่านไอพีอุโมงค์ Tailscale
 */

// ดึงพิกัดสายส่งจากระบบ หากไม่พบให้ถอยกลับมาที่ไอพีอุโมงค์ Dev หลักของป๋าปู
const BASE_URL = import.meta.env.VITE_API_URL || 'http://100.65.78.122:8500/api/v1';

export const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // ดักจับเอเรอร์สัญญานขาดหายภายใน 10 วินาที
  headers: {
    'Content-Type': 'application/json',
  },
});

// 💡 ดักจับสัญญาณขาเข้า-ขาออกเพื่อจัดการ Error ส่วนกลางในอนาคต (Response Interceptor)
apiService.interceptors.response.use(
  (response) => response,
  (error) => {
    // ส่งต่อข้อผิดพลาดไปให้ด่านตรวจระบบ หรือ SweetAlert2 จัดการพ่นสีแดงหน้าจอ
    return Promise.reject(error?.response?.data || error);
  }
);