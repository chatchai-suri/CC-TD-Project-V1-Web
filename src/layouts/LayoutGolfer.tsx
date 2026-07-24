// src/layouts/LayoutGolfer.tsx
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import HeaderMain from "./HeaderMain.tsx";
import NavBarMain from "./NavBarMain.tsx";
import NavBarGolfer from "./NavBarGolfer.tsx";
import { useGolfStore } from "../store/useGolfStore"; // 💡 สวมท่อเข้าหาคลังสมองกลจริงส่วนกลาง[cite: 34]

/**
 * 🎯 วัตถุประสงค์: กรอบโครงสร้างหน้าต่างส่วนกลางส่วนร่วมฝั่งนักกอล์ฟและแคดดี้ (Golfer Layout แม่)
 * @description ดึงสถานะ currentUser จาก Zustand คุมกลไกตัดกระแสไฟเซสชัน (Logout) ข้ามมิติ[cite: 34]
 */
export default function LayoutGolfer() {
  const navigate = useNavigate();

  // 💡 ดึงกระแสข้อมูลโปรไฟล์ผู้ใช้งานจริงและแอคชันเคลียร์ถังข้อมูลข้ามเครือข่ายจาก Zustand[cite: 34]
  const currentUser = useGolfStore((state: any) => state.currentUser);
  const logout = useGolfStore((state: any) => state.logout); //

  // 💡 แปลงโครงสร้าง Properties ให้สอดรับและไหลเข้าล็อกกับเครื่องยนต์ HeaderMain สปอตไลท์ขวาบน
  const dynamicUser = {
    nickname: currentUser?.nickname || currentUser?.username || "porn",
    role: currentUser?.global_role || "GOLFER",
    profile_icon: "🏌️‍♂️"
  };

  // 🚦 วาล์วสถานะควบคุมการ ปิด-เปิด แผง Sidebar ด้านข้างบนจอมือถือ[cite: 32]
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); //[cite: 32]

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900"> {/*[cite: 32] */}
      
      {/* 🟢 ส่งสัญญาณข้อมูลจริงเข้าบาร์หัวบนสุดน้ำเงินด่านนอก รองรับ Mobile-First[cite: 32] */}
      <HeaderMain 
        onToggleMenu={() => setIsSidebarOpen(!isSidebarOpen)} 
        user={dynamicUser} 
      />
      
      {/* 🔵 ส่งตัวแปรสิทธิ์จริงเข้าแถบเมนูแนวนอนหลักเพื่อจัดรูปแบบความกว้างหน้าจอ Desktop[cite: 32] */}
      <NavBarMain user={dynamicUser} />

      {/* 🗂️ พื้นที่จัดสรรแกนกลางแอปพลิเคชันแยกสัดส่วนเด็ดขาด[cite: 32] */}
      <div className="flex flex-1 relative overflow-hidden"> {/*[cite: 32] */}
        
        {/* 🟡 ส่งวาล์วสิทธิ์จริงและสถานะควบคุมเข้าแผงสไลด์ Sidebar ด้านข้าง[cite: 32] */}
        <NavBarGolfer 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          user={dynamicUser} 
        />

        {/* 🔷 พื้นที่ Body Area รูเจาะกลางระบบสำหรับดึงตารางผลแข่งมาเรนเดอร์[cite: 32] */}
        <main className="flex-1 w-full bg-white p-4 overflow-y-auto"> {/*[cite: 32] */}
          {/* 💡 แจ้งเตือนสัจจะสิงสถิต: ตัวเนื้อหาลูกภายในจะสับเปลี่ยนไปตามพาสของ AppRouter เคลียร์แถบดำล้นจอทิ้งถาวร[cite: 10, 22] */}
          <Outlet /> {/*[cite: 32] */}
        </main>

      </div>
    </div>
  );
}