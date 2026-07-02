// src/layouts/NavBarMain.tsx
import { Link, useLocation } from "react-router-dom";

export default function NavBarMain({ user }: any) {
  const location = useLocation();
  
  // 🎨 ฟังก์ชันคำนวณสไตล์สี Active คลีน ๆ ตรงไปตรงมา
  const getLinkClass = (path: string) => {
    const baseClass = "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap";
    return location.pathname === path 
      ? `${baseClass} bg-blue-800 text-yellow-400 border border-blue-700`
      : `${baseClass} text-blue-200 hover:bg-blue-800 hover:text-white`;
  };

  return (
    /* hidden md:flex = ซ่อนบนมือถือ กางออกบนจอใหญ่ | justify-between = ผลักกลุ่มเมนูแยกออกจากกันซ้าย-ขวา */
    <nav className="hidden md:flex bg-blue-950 text-white px-6 py-2 border-b border-blue-900 justify-between items-center shadow-sm">
      
      {/* ⬅️ [กลุ่มฝั่งซ้าย] เมนูข้อมูลแบรนด์ / ข้อมูลทั่วไปสากลนิยม */}
      <div className="flex items-center gap-2">
        <Link to="/" className={getLinkClass("/")}>Home</Link>
        <Link to="/about" className={getLinkClass("/about")}>About Us</Link>
      </div>

      {/* ➡️ [กลุ่มฝั่งขวา] เมนูเจาะจงเฉพาะตัวตามระดับสิทธิ์สลับร่าง Role-Based */}
      <div className="flex items-center gap-2">
        {/* ด่านคุมสิทธิ์: สิทธิ์นักกอล์ฟและแคดดี้ทั่วไป */}
        {user.role !== "GUEST" && (
          <Link to="/golfer/tournaments" className={getLinkClass("/golfer/tournaments")}>Score / Leader Viewer</Link>
        )}
        
        {/* ด่านคุมสิทธิ์: ผู้จัดการแข่งขัน (TD) หรือ Admin หลังบ้าน */}
        {(user.role === "TD" || user.role === "ADMIN") && (
          <Link to="/td/tournaments" className={getLinkClass("/td/tournaments")}>Tournament Management</Link>
        )}
        
        {/* ด่านคุมสิทธิ์: แผงคุมบัญชีของสูงสุดแอดมิน */}
        {user.role === "ADMIN" && (
          <Link to="/admin/accounts" className={getLinkClass("/admin/accounts")}>User Management</Link>
        )}

        {/* 🔥 ปุ่มทางเลือกสุดท้าย: แสดงปุ่มเข้าสู่ระบบ หรือปุ่มออกจากระบบตามกลยุทธ์ของป๋าปู */}
        {user.role === "GUEST" ? (
          <Link to="/login" className="px-3 py-1.5 rounded-md text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors border border-emerald-700">
            Login / Register
          </Link>
        ) : (
          <button 
            onClick={() => alert("ออกจากระบบสำเร็จ")}
            className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-950/40 text-red-300 hover:bg-red-900/60 hover:text-white transition-colors border border-red-900/40"
          >
            Logout
          </button>
        )}
      </div>

    </nav>
  );
}