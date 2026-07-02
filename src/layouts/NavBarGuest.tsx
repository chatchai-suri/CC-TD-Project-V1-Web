// src/layouts/NavBarGuest.tsx
import { Link, useLocation } from "react-router-dom";

/**
 * 🎯 Component เมนูด้านข้างเฉพาะสิทธิ์ GUEST (Guest Side Navigation)
 * @param isOpen สถานะ Boolean สั่งสไลด์กางเข้า/ซ่อนออก (Mobile เฉพาะเมื่อกด Hamburger)
 * @param onClose ฟังก์ชัน Callback ยิงสัญญาณกลับไปสั่งปิดแถบเมนูข้าง
 * @param user ข้อมูลสถานะและสิทธิ์ผู้ใช้งานปัจจุบัน
 */
export default function NavBarGuest({ isOpen, onClose, user }: any) {
  const location = useLocation();

  // 🎨 Function คำนวณ CSS Class สำหรับ Active State ไฮไลต์สีปุ่มนำทาง
  const getSidebarClass = (path: string) => {
    return location.pathname === path
      ? "px-4 py-2.5 bg-slate-800 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-2 border-l-4 border-yellow-400"
      : "px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm flex items-center gap-2 transition-colors";
  };

  return (
    <>
      {/* 1. Backdrop เลเยอร์สีดำโปร่งแสงดักฉากหลัง ปรากฏเฉพาะโหมด Mobile ยามกางเมนู */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* 2. แท็ก <aside> บล็อกโครงร่างแถบข้าง จัดระเบียบ Responsive สลับร่างตามขนาดหน้าจอ */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:border-r md:border-slate-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}>
        
        {/* ปุ่มกากบาท (Close Button) แสดงเฉพาะโหมด Mobile เพื่อทวงคืนพื้นที่หน้าจอ */}
        <div className="p-4 flex justify-end md:hidden border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 focus:outline-none">✕</button>
        </div>

        {/* 3. แผงควบคุมรายชื่อปุ่มนำทาง (Navigation Links Area) */}
        <nav className="p-3 flex flex-col gap-1 flex-1">
          
          {/* 📱 เมนูหลักทั่วไป (แสดงเพิ่มเติมใน Hamburger เมื่อ NavBarMain แนวนอนซ่อนตัวบนมือถือ) */}
          <div className="md:hidden flex flex-col gap-1 pb-2 border-b border-slate-800 mb-2">
            <Link to="/" onClick={onClose} className={getSidebarClass("/")}>🏠 Home</Link>
            <Link to="/about" onClick={onClose} className={getSidebarClass("/about")}>ℹ️ About Us</Link>
          </div>

          {/* 🔒 ด่านตรวจสอบสิทธิ์เฉพาะ: พ่นปุ่มเข้าสู่ระบบเฉพาะบทบาท GUEST เท่านั้น */}
          {user.role === "GUEST" && (
            <div className="flex flex-col gap-1">
              <Link to="/login" onClick={onClose} className={getSidebarClass("/login")}>🔑 Login / Register</Link>
            </div>
          )}

        </nav>
      </aside>
    </>
  );
}