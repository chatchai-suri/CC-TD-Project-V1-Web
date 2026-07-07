// src/layouts/NavBarAdmin.tsx
import { Link, useLocation } from "react-router-dom";

/**
 * 🎯 Component เมนูด้านข้างเฉพาะสิทธิ์ ADMIN (Contextual Admin Side Navigation)
 */
export default function NavBarAdmin({ isOpen, onClose, user }: any) {
  const location = useLocation();

  const getSidebarClass = (path: string) => {
    return location.pathname.startsWith(path)
      ? "px-4 py-2.5 bg-slate-800 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-2 border-l-4 border-yellow-400"
      : "px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm flex items-center gap-2 transition-colors";
  };

  return (
    <>
      {/* 1. Backdrop เลเยอร์โปร่งแสงบน Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* 2. บล็อกโครงร่างแถบข้างแนวตั้งสีกรมท่าเข้ม */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:border-r md:border-slate-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}>
        
        <div className="p-4 flex justify-end md:hidden border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 focus:outline-none">✕</button>
        </div>

        <nav className="p-3 flex flex-col gap-1 flex-1">
          
          {/* 🟢 ส่วนที่ 1: Mobile Public Links */}
          <div className="md:hidden flex flex-col gap-1 pb-2 border-b border-slate-800 mb-2">
            <Link to="/" onClick={onClose} className={getSidebarClass("/")}>🏠 Home</Link>
            <Link to="/about" onClick={onClose} className={getSidebarClass("/about")}>ℹ️ About Us</Link>
          </div>

          {/* =========================================================
              🔵 ส่วนที่ 2: Role Based Menus List (ทางด่วน 3 มิติสลับคุมได้ทุก Role)
              ========================================================= */}
          <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-800 mb-2">
            <span className="text-[10px] text-red-400 font-bold px-1 uppercase tracking-wider">
              ⚡ SuperAdmin Cross-Links
            </span>
            {/* ไฮไลต์สีส้ม ตรึงสิทธิ์ตัวเอง ณ ฐานแอดมินคุมบัญชี */}
            <Link to="/admin/accounts" onClick={onClose} className="px-3 py-2 bg-slate-800 text-yellow-400 rounded-lg text-xs font-bold border border-yellow-400/30 text-left flex items-center gap-2">
              🛡️ User Management [Admin]
            </Link>
            {/* ทางด่วนมุดเข้าท่อผู้จัดการแข่งขันสโมสร */}
            <Link to="/td/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-950/40 text-slate-400 hover:text-white rounded-lg text-xs font-medium text-left flex items-center gap-2 transition-colors">
              ⚙️ Tournament Management
            </Link>
            {/* ทางด่วนมุดสลับฟากไปส่องกระดานผลผู้นำฝั่งนักกอล์ฟ */}
            <Link to="/golfer/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-950/40 text-slate-400 hover:text-white rounded-lg text-xs font-medium text-left flex items-center gap-2 transition-colors">
              📊 Score / Leader Viewer
            </Link>
          </div>

          {/* =========================================================
              🟡 ส่วนที่ 3: Role Sub-Menus (ปุ่มย่อยสายตรงของแอดมิน)
              ========================================================= */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[11px] text-red-400/80 font-bold px-3 uppercase tracking-wide mb-1">
              🛠️ Admin Sub-Menus
            </span>
            <Link to="/admin/accounts" onClick={onClose} className={getSidebarClass("/admin/accounts")}>👥 Account Directories</Link>
            <div className="px-4 py-2 text-xs text-slate-500 italic">🔒 System Logs (Coming)</div>
          </div>

          {/* 🔴 ส่วนที่ 4: Logout */}
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