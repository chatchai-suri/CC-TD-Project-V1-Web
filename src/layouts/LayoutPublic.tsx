// src/layouts/LayoutPublic.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarGuest from "./NavBarGuest.tsx"; // 🔥 สลับสายสัญญาณ Import ชิ้นส่วนคอมโพเนนต์ที่ Refactor ใหม่

export default function LayoutPublic() {
  // 🧠 1. จำลองข้อมูลสถานะผู้ใช้ด่านหน้า (สิทธิ์แกนหลักเริ่มต้นเป็น GUEST)
  const [user, setUser] = useState({
    nickname: "ผู้มาเยือนทั่วไป",
    role: "GUEST", // สิทธิ์สำหรับทดสอบด่าน Public: GUEST
    profile_icon: "👤"
  });

  // 🚦 2. State วาล์วสลับเปิด/ปิด Sidebar แผงข้างบนจอมือถือ
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* 🟢 ส่วนหัวบาร์บนสุด: ส่งสัญญาณ Toggle และข้อมูล user เข้าท่อสากล */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={user} 
      />
      
      {/* 🔵 บาร์เมนูแนวนอนหลัก: จัดกลุ่มปุ่มชิดซ้าย-ชิดขวาตามระดับสิทธิ์บน Desktop */}
      <NavBarMain user={user} />

      {/* 🗂️ ส่วนจัดสรรพื้นที่ Core Layout แกนกลางแอปพลิเคชัน */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* 🟡 ชิ้นส่วนเมนูด้านข้างเฉพาะสิทธิ์ GUEST รองรับ Mobile Responsive เต็มรูปแบบ */}
        <NavBarGuest 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={user} 
        />

        {/* 🔷 พื้นที่รูเจาะ Body Area แสดงผลเนื้อหา Landing Page */}
        <main className="flex-1 w-full bg-white p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}