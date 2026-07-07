// src/layouts/LayoutAdmin.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarAdmin from "./NavBarAdmin.tsx";

export default function LayoutAdmin() {
  // 🧠 จำลองบทบาทผู้ดูแลระบบสูงสุด (Super Admin) ถือค้อนล็อกสิทธิ์สูงสุดของแอป
  const [user, setUser] = useState({
    nickname: "ป๋าปู (SuperAdmin)",
    role: "ADMIN", 
    profile_icon: "⚡"
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* 🟢 ส่วนหัวบาร์บนสุดส่งสัญญาณตามมาตรฐาน */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={user} 
      />
      
      {/* 🔵 เมนูบาร์แนวนอนตรึงสเกล Desktop */}
      <NavBarMain user={user} />

      {/* 🗂️ พื้นที่จัดสรรสารบบแกนกลางแอปพลิเคชัน */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* 🟡 ติดตั้งแถบเมนูสไลด์ข้างเฉพาะสิทธิ์ระดับ ADMIN */}
        <NavBarAdmin 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user} 
        />

        {/* 🔷 พื้นที่รูเจาะแสดงกระดานข้อมูลตารางบัญชีรายชื่อยูสเซอร์ */}
        <main className="flex-1 w-full bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}