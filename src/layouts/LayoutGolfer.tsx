// src/layouts/LayoutGolfer.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarGolfer from "./NavBarGolfer.tsx";

export default function LayoutGolfer() {
  // 🧠 1. จำลองข้อมูลสถานะและระดับสิทธิ์ผู้ใช้ข้ามฟาก (ตรงตามสัจจะดีไซน์ใน Excel ของป๋า)
  const [user, setUser] = useState({
    nickname: "ป๋าปู (Director)",
    
    // 🔥 ⚙️ ป๋าปูแก้คำในอัญประกาศตรงนี้คำเดียว จาก "SCORER" สลับร่างเป็น "TD" ได้เลยครับ!
    role: "TD", 
    
    profile_icon: "👑"
  });

  // 🚦 2. วาล์วสถานะควบคุมการ ปิด-เปิด แผง Sidebar ด้านข้างบนจอมือถือ
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* 🟢 ส่งสัญญาณฟังก์ชันเปิดปิด และตัวแปร user เข้าบาร์หัวบนสุด */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={user} 
      />
      
      {/* 🔵 ส่งตัวแปร user เข้าแถบเมนูแนวนอนหลัก (เพื่อเช็คสิทธิ์ซ่อน/แสดงเมนู) */}
      <NavBarMain user={user} />

      {/* 🗂️ พื้นที่จัดสรรแกนกลางแอปพลิเคชัน */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* 🟡 ส่งวาล์วควบคุมเข้าแผงสไลด์ Sidebar ด้านข้าง */}
        <NavBarGolfer 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user} 
        />

        {/* 🔷 พื้นที่ Body Area รูเจาะกลางระบบสำหรับดึงตารางมาพ่นแสดงผล */}
        <main className="flex-1 w-full bg-white p-4 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}