// src/App.tsx
import AppRouter from "./routes/AppRouter";
import { useEffect } from "react";
import { useGolfStore } from "./store/useGolfStore"; // นำเข้าฟังก์ชันตรวจสอบสิทธิ์จาก Golf Store

function App() {
  const checkAuth = useGolfStore((state: any) => state.checkAuth);
  const isCheckingAuth = useGolfStore((state: any) => state.isCheckingAuth);

  useEffect(() => {
    // 🚀 ยิงตรวจตั๋วทันทีเมื่อแอปเริ่มโหลด
    checkAuth();
  }, [checkAuth]);

  // แสดง Loading เล็กน้อยระหว่างตรวจตั๋ว (ไม่ให้หน้าจอวาบหรือเด้งหลุดก่อนตรวจเสร็จ)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <span className="loading loading-spinner loading-lg text-emerald-400"></span>
      </div>
    );
  }

  // หากตรวจสอบสิทธิ์เสร็จแล้ว ให้แสดง Router ของแอป
  return (
  <AppRouter />
);
}

export default App;