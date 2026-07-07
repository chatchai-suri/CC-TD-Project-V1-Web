// src/layouts/NavBarTd.tsx
import { Link, useLocation } from "react-router-dom";

/**
 * 🎯 Component เมนูด้านข้างแปรสภาพสิทธิ์ฝั่ง TD (Contextual Side Navigation)
 * @param isOpen สถานะ Boolean สั่งสไลด์แผงกางเข้า/ซ่อนออกบน Mobile Responsive
 * @param onClose ฟังก์ชัน Callback สำหรับสั่งพับปิดแผง Sidebar คืนพื้นที่หน้าจอ
 * @param user ข้อมูลวัตถุผู้ใช้งานในการคุมลอจิกสิทธิ์เริ่มต้น
 */
export default function NavBarTd({ isOpen, onClose, user }: any) {
  const location = useLocation();
  
  // 🎨 Function คำนวณ CSS Class สำหรับ Active State ไฮไลต์สีปุ่มนำทางสโมสร
  const getSidebarClass = (path: string) => {
    return location.pathname.startsWith(path)
      ? "px-4 py-2.5 bg-slate-800 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-2 border-l-4 border-yellow-400"
      : "px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm flex items-center gap-2 transition-colors";
  };

  return (
    <>
      {/* 1. Backdrop เลเยอร์มืดโปร่งแสง ดักปิดเมนูยามนิ้วจิ้มนอกแผงบน Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* 2. แท็ก <aside> บล็อกโครงร่างแถบข้างสลับสเกลแปลงร่างตามขนาดหน้าจอ */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:border-r md:border-slate-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}>
        
        {/* ปุ่มกากบาทปิดเมนูโหมด Mobile */}
        <div className="p-4 flex justify-end md:hidden border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 focus:outline-none">✕</button>
        </div>

        {/* 🛠️ ท่อรวมควบคุมปุ่มกระจายการแบ่งกลุ่มออกเป็น 4 ส่วนหลัก ตามแผนป๋าปู */}
        <nav className="p-3 flex flex-col gap-1 flex-1">
          
          {/* =========================================================
              🟢 ส่วนที่ 1: จาก Public route แสดงใน Hamburger ทุกหน้าบน Mobile
              ========================================================= */}
          <div className="md:hidden flex flex-col gap-1 pb-2 border-b border-slate-800 mb-2">
            <Link to="/" onClick={onClose} className={getSidebarClass("/")}>🏠 Home</Link>
            <Link to="/about" onClick={onClose} className={getSidebarClass("/about")}>ℹ️ About Us</Link>
          </div>

          {/* =========================================================
              🔵 ส่วนที่ 2: Role Based Menus List (ปุ่มทางด่วนสลับระดับสิทธิ์ด้านบนสุด)
              ========================================================= */}
          <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-800 mb-2">
            <span className="text-[10px] text-slate-500 font-bold px-1 uppercase tracking-wider">
              👥 Role Based Menus
            </span>
            {/* ไฮไลต์สีส้มเข้ม บ่งบอกว่าปัจจุบันกำลังประจำการอยู่ฝั่งบริหารจัดการแมตช์ TD */}
            <Link to="/td/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-800 text-yellow-400 rounded-lg text-xs font-bold border border-yellow-400/30 text-left flex items-center gap-2">
              ⚙️ Tournament Management [TD]
            </Link>
            {/* 🔗 ปุ่มทางด่วนข้ามฟาก: กดแล้วกระชากพาส URL เปลี่ยนไส้กลางจอวิ่งข้ามไปฝั่งผู้เล่นทันที */}
            <Link to="/golfer/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-950/40 text-slate-400 hover:text-white rounded-lg text-xs font-medium text-left flex items-center gap-2 transition-colors">
              📊 Score / Leader Viewer
            </Link>
          </div>

          {/* =========================================================
              🟡 ส่วนที่ 3: Role Sub-Menus (กางชุดปุ่มลูกสำหรับผู้จัดการแข่งขัน)
              ========================================================= */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[11px] text-yellow-500/80 font-bold px-3 uppercase tracking-wide mb-1">
              📁 Director Menus
            </span>
            <Link to="/td/tournaments" onClick={onClose} className={getSidebarClass("/td/tournaments")}>🏆 Tournaments</Link>
            <Link to="/td/flights" onClick={onClose} className={getSidebarClass("/td/flights")}>🏌️‍♂️ Grouping (Flights)</Link>
            <div className="px-4 py-2 text-xs text-slate-500 italic">⛳ Course set (Coming)</div>
          </div>

          {/* =========================================================
              🔴 ส่วนที่ 4: Logout ปุ่มกดออกจากระบบ ปักหมุดถาวรท้ายขอบล่างสุด
              ========================================================= */}
          <button 
            onClick={() => { onClose(); alert("ออกจากระบบสำเร็จ"); }}
            className="mt-auto px-4 py-2.5 text-left text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg text-sm flex items-center gap-2 font-medium border border-red-900/20 transition-colors shadow-inner"
          >
            🚪 Logout
          </button>

        </nav>
      </aside>
    </>
  );
}