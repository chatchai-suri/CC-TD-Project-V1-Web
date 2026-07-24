// src/layouts/LayoutPublic.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarGuest from "./NavBarGuest.tsx"; 
import { useGolfStore } from "../store/useGolfStore"; // 💡 ผูกสัญญาณเข้าหาคลังสมองกลจริงส่วนกลาง[cite: 26]

/**
 * 🎯 วัตถุประสงค์: กรอบโครงสร้างหน้าต่างส่วนกลางฝั่งคนนอกและโหมดผู้มาเยือน (Public Layout แม่)[cite: 28]
 * @description ดึงสถานะโปรไฟล์จริงจาก Zustand ถมเข้าบาร์น้ำเงินส่วนหัวคุม Responsive แผงข้างบนจอมือถือ[cite: 21, 26]
 */
export default function LayoutPublic() {
  // 💡 ดึงกระแสข้อมูลโปรไฟล์ผู้ใช้งานจริงขาเข้าจาก Zustand Store[cite: 21]
  const currentUser = useGolfStore((state: any) => state.currentUser);
  
  // 💡 สร้าง Object แปลงไพ่สิทธิ์ให้สอดคล้องตรงตามสารบบ Properties ด้านใน HeaderMain[cite: 21]
  const dynamicUser = {
    profile_icon: "👑",
    nickname: currentUser?.nickname || currentUser?.username || "ผู้มาเยือนทั่วไป", //[cite: 21]
    role: currentUser?.global_role || "GUEST" //[cite: 21]
  };

  // 🚦 State วาล์วสลับเปิด/ปิด Sidebar แผงข้างบนจอมือถือ[cite: 21]
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); //[cite: 21]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900"> {/*[cite: 21] */}
      
      {/* 🟢 ส่วนหัวบาร์บนสุด: ส่งสัญญาณ Toggle และวัตถุข้อมูลจริงสลับร่างเข้าท่อสากล[cite: 21] */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={dynamicUser} 
      />
      
      {/* 🔵 บาร์เมนูแนวนอนหลัก: ส่องตรวจเช็คสิทธิ์ซ่อน/แสดงเมนูบน Desktop[cite: 21, 32] */}
      <NavBarMain user={dynamicUser} />

      {/* 🗂️ ส่วนจัดสรรพื้นที่ Core Layout แกนกลางแอปพลิเคชัน[cite: 21] */}
      <div className="flex flex-1 relative overflow-hidden"> {/*[cite: 21] */}
        
        {/* 🟡 ชิ้นส่วนเมนูด้านข้างเฉพาะสิทธิ์ GUEST รองรับ Mobile Responsive เต็มรูปแบบ[cite: 21] */}
        <NavBarGuest 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={dynamicUser} 
        />

        {/* 🔷 พื้นที่รูเจาะ Body Area แสดงผลเนื้อหาผ่านกลไกสลับหน้าลูก[cite: 21] */}
        <main className="flex-1 w-full bg-white p-6 overflow-y-auto"> {/*[cite: 21] */}
          <Outlet /> {/*[cite: 21] */}
        </main>

      </div>
    </div>
  );
}