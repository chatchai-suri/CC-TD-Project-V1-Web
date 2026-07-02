// src/layouts/NavBarGolfer.tsx
import { Link, useLocation } from "react-router-dom";

/**
 * 🎯 Component เมนูด้านข้างเฉพาะสิทธิ์ GOLFER และ SCORER (Private Side Navigation)
 * @param isOpen สถานะ Boolean สั่งสไลด์แผงกางเข้า/ซ่อนออกบน Mobile Responsive
 * @param onClose ฟังก์ชัน Callback สำหรับสั่งพับปิดแผง Sidebar คืนพื้นที่หน้าจอ
 * @param user ข้อมูลวัตถุผู้ใช้งานในการคุมลอจิก Role-Based Rendering และการเปิดช่องทางด่วนข้ามสิทธิ์
 */
export default function NavBarGolfer({ isOpen, onClose, user }: any) {
  const location = useLocation();

  // 🎨 Function คำนวณ CSS Class สำหรับ Active State ไฮไลต์สีปุ่มนำทางสโมสร
  const getSidebarClass = (path: string) => {
    return location.pathname === path
      ? "px-4 py-2.5 bg-slate-800 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-2 border-l-4 border-yellow-400"
      : "px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm flex items-center gap-2 transition-colors";
  };

  return (
    <>
      {/* Backdrop เลเยอร์มืดโปร่งแสง ดักการนิ้วจิ้มนอกขอบจอเพื่อสั่งพับปิดเมนูบน Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* แท็ก <aside> บล็อกโครงร่างแถบข้าง ปลุกกลไกสลับร่างระหว่าง Desktop และ Mobile */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:border-r md:border-slate-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}>
        
        {/* ปุ่มกากบาทกู้คืนพื้นที่จอโหมด Mobile */}
        <div className="p-4 flex justify-end md:hidden border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 focus:outline-none">✕</button>
        </div>

        {/* 🛠️ ท่อรวมคุมการกระจายกลุ่มปุ่ม 4 ท่อนหลัก ตามโครงสร้างสัจจะดีไซน์ของป๋าปู */}
        <nav className="p-3 flex flex-col gap-1 flex-1">
          
          {/* =========================================================
              🟢 ส่วนที่ 1: จาก Public route แสดงใน Hamburger ทุกหน้าบน Mobile
              ========================================================= */}
          <div className="md:hidden flex flex-col gap-1 pb-2 border-b border-slate-800 mb-2">
            <Link to="/" onClick={onClose} className={getSidebarClass("/")}>🏠 Home</Link>
            <Link to="/about" onClick={onClose} className={getSidebarClass("/about")}>ℹ️ About Us</Link>
          </div>

          {/* =========================================================
              🔵 ส่วนที่ 2: จาก Private Role (กลุ่มสิทธิ์นักเล่นและแคดดี้หน้างาน)
              ========================================================= */}
          {/* 2.1 แสดงชื่อหัวข้อ Role Menus แบบ Dynamic ตามระดับสิทธิ์จริง */}
          <span className="text-[11px] text-slate-500 font-bold px-4 uppercase tracking-wider my-1">
            {user.role === "SCORER" ? "⛳ Scorer Menus" : "🏌️‍♂️ Golfer Menus"}
          </span>

          {/* 2.2 แสดง Link Menus สายตรงกลุ่มผู้เล่นในสนาม */}
          <div className="flex flex-col gap-1 pl-1 mb-2">
            <Link to="/golfer/tournaments" onClick={onClose} className={getSidebarClass("/golfer/tournaments")}>🏆 Tournament List</Link>
            <Link to="/golfer/leaderboard" onClick={onClose} className={getSidebarClass("/golfer/leaderboard")}>📊 Leader Board</Link>
            
            {/* ดักเปิดปุ่ม Scoring Panel ให้สิทธิ์เฉพาะ Scorer, TD และ Admin เท่านั้น */}
            {(user.role === "SCORER" || user.role === "TD" || user.role === "ADMIN") && (
              <Link to="/golfer/scoringPanel" onClick={onClose} className={getSidebarClass("/golfer/scoringPanel")}>📝 Scoring Panel</Link>
            )}
          </div>

          {/* =========================================================
              💛 ส่วนที่ 3: จาก NavbarMain Link menu วิ่งเจาะเข้าท่อด่วนไปหน้า Home แต่ละ Role
              ========================================================= */}
          {(user.role === "TD" || user.role === "ADMIN") && (
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-1">
              <span className="text-[11px] text-slate-500 font-bold px-4 uppercase tracking-wider my-1">⚙️ Management Links</span>
              
              {/* สิทธิ์ TD และ Admin จะมองเห็นปุ่มด่วนวิ่งไปคุมทัศนศึกษาแมตช์การแข่งขัน */}
              <Link to="/td/tournaments" onClick={onClose} className={getSidebarClass("/td/tournaments")}>🛠️ Tournament Mgmt</Link>
              
              {/* ล็อกสิทธิ์ขั้นสูงสุด เฉพาะ ADMIN เท่านั้นถึงจะผุดปุ่มคุมบัญชีผู้ใช้ออกมาโชว์ */}
              {user.role === "ADMIN" && (
                <Link to="/admin/accounts" onClick={onClose} className={getSidebarClass("/admin/accounts")}>👥 User Management</Link>
              )}
            </div>
          )}

          {/* =========================================================
              🔴 ส่วนที่ 4: Logout ปุ่มกดออกจากระบบ ดีดลงใต้สุดเว้นระยะปลอดภัย
              ========================================================= */}
          {/* ปลุก CSS Flex-Grow ดันปุ่มนี้แยกขาดออกจากกลุ่มเมนูด้านบนอย่างเด็ดขาด */}
          <div className="flex-1" /> 
          
          <button 
            onClick={() => { onClose(); alert("ออกจากระบบสำเร็จ"); }}
            className="mt-8 px-4 py-2.5 text-left text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg text-sm flex items-center gap-2 font-medium border border-red-900/20 transition-colors shadow-inner"
          >
            🚪 Logout
          </button>

        </nav>
      </aside>
    </>
  );
}