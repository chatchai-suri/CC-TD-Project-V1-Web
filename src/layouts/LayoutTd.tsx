// src/layouts/LayoutTd.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarTd from "./NavBarTd.tsx"; // 🔥 นำเข้าคอมโพเนนต์เมนูข้างฝั่ง TD

export default function LayoutTd() {
  // 🧠 จำลองบทบาทสิทธิ์เป็นผู้บริหารระดับสูง TD เพื่อคุมการทดสอบ
  const [user, setUser] = useState({
    nickname: "ป๋าปู (Director)",
    role: "TD", 
    profile_icon: "👑"
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* 🟢 ส่วนหัวบาร์บนสุดส่งสัญญาณตามมาตรฐาน */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={user} 
      />
      
      {/* 🔵 บาร์เมนูแนวนอนหลักชิดซ้าย-ชิดขวาของ Desktop */}
      <NavBarMain user={user} />

      {/* 🗂️ พื้นที่จัดสรรแกนกลางแอปพลิเคชัน */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* 🟡 ติดตั้งแผงเมนูด้านข้างเฉพาะสิทธิ์ฝั่ง TD เจาะจงสายตรง */}
        <NavBarTd 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user} 
        />

        {/* 🔷 พื้นที่รูเจาะ Body Area แสดงตารางและข้อมูลดิบ */}
        <main className="flex-1 w-full bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}