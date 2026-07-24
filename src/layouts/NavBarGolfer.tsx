// src/layouts/NavBarGolfer.tsx
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"; 
import { useGolfStore } from "../store/useGolfStore"; 

/**
 * 🎯 Component เมนูด้านข้างแปรสภาพสิทธิ์ฝั่งผู้เล่น (Contextual Golfer Side Navigation)
 * @param isOpen Status Boolean สั่งสไลด์แผงกางเข้า/ซ่อนออกบน Mobile Responsive
 * @param onClose ฟังก์ชัน Callback สำหรับสั่งพับปิดแผง Sidebar คืนพื้นที่หน้าจอ
 * @param user ข้อมูลวัตถุผู้ใช้งานในการคุมลоจิก Role-Based Rendering
 */
export default function NavBarGolfer({ isOpen, onClose, user }: any) {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // 💡 ดึงกระแสข้อมูลโปรไฟล์ผู้ใช้งานจริงและแอคชันเคลียร์ถังข้อมูลข้ามเครือข่ายจาก Zustand[cite: 34]
  const logout = useGolfStore((state: any) => state.logout); 

  // 📥 แอบแกะรอยพารามิเตอร์แมตช์ที่กำลังค้างอยู่บน URL ปัจจุบันมาสแตนด์บายใน Sidebar
  const tournamentId = searchParams.get("id") || "t2";
  const currentStatus = searchParams.get("status") || "live";

  /**
   * 🎯 วัตถุประสงค์: สับท่อพาผู้เล่นกลับบอร์ดผู้นำสดรายการเดิมพ่วงพารามิเตอร์ครบวงจร ป้องกันระบบหลงทิศ
   */
  const handleLeaderboardNav = () => {
    onClose(); // สั่งพับปิดบานหน้าต่างสไลด์ Sidebar ลงตู้เซฟ
    navigate(`/golfer/leaderboard?id=${tournamentId}&status=${currentStatus}`);
  };


  // 🎨 Function คำนวณ CSS Class สำหรับ Active State ไฮไลต์สีปุ่มนำทางสโมสร
  const getSidebarClass = (path: string) => {
    return location.pathname === path
      ? "px-4 py-2.5 bg-slate-800 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-2 border-l-4 border-yellow-400"
      : "px-4 py-2.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm flex items-center gap-2 transition-colors";
  };

  /**
   * 🎯 วัตถุประสงค์: สับรางระเบิดเซสชันสิทธิ์ และสั่งอพยพผู้ใช้ดิ่งกลับสู่หน้าแรก
   * @description ล้างประวัติในคลัง Zustand ดับหน้าต่างแผงข้าง และ Navigate พารถพุ่งตรงไปที่พากรากหลัก /
   */
  const handleLogoutAction = () => {
    logout(); // 💡 ข้อ 1. เคลียร์ค่าความทรงจำกลางในสเตตให้แปรสภาพกลับเป็น null
    
    if (onClose) {
      onClose(); // 💡 ข้อ 2. สั่งพับปิดแผง Sidebar บนหน้าจอ iPhone SE ให้สนิท
    }
    
    alert("ออกจากระบบสำเร็จ"); // 💡 ข้อ 3. ป๊อปอัปแจ้งเตือนผู้ใช้งาน
    
    navigate("/"); // 👑 ข้อ 4. ล็อกคาถาดีดตัวนำทางหันหัวรถดิ่งกลับสู่หน้า Landing Page ทันที!
  };

  return (
    <>
      {/* 1. Backdrop เลเยอร์มืดโปร่งแสง ดักปิดเมนูยามนิ้วจิ้มนอกแผงบน Mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* 2. แท็ก <aside> บล็อกโครงร่างแถบข้าง ปลุกกลไกสลับร่างตามสเกลความกว้างจอ */}
      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none md:border-r md:border-slate-800 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 md:static md:flex md:flex-col`}>
        
        {/* ปุ่มกากบาทปิดเมนูโหมด Mobile */}
        <div className="p-4 flex justify-end md:hidden border-b border-slate-800">
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl p-1 focus:outline-none">✕</button>
        </div>

        {/* 🛠️ ท่อรวมคุมการกระจายกลุ่มปุ่ม 4 ท่อนหลัก แบบแปรสภาพบริบทฝั่งผู้เล่น */}
        <nav className="p-3 flex flex-col gap-1 flex-1">
          
          {/* =========================================================
              🟢 ส่วนที่ 1: จาก Public route แสดงใน Hamburger ทุกหน้าบน Mobile
              ========================================================= */}
          <div className="md:hidden flex flex-col gap-1 pb-2 border-b border-slate-800 mb-2">
            <Link to="/" onClick={onClose} className={getSidebarClass("/")}>🏠 Home</Link>
            <Link to="/about" onClick={onClose} className={getSidebarClass("/about")}>ℹ️ About Us</Link>
          </div>

          {/* =========================================================
              🔵 ส่วนที่ 2: Role Based Menus List (ปุ่มทางด่วนสลับระดับสิทธิ์ด้านบนสุดขากลับ)
              ========================================================= */}
          {/* 🔗 ดักเปิดปุ่มควบคุมขากลับให้สิทธิ์เฉพาะผู้ใช้ระดับบริหาร (TD หรือ ADMIN) เท่านั้นถึงจะผุดปุ่มทางด่วนออกมาโชว์ */}
          {(user.role === "TD" || user.role === "ADMIN") && (
            <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-800 mb-2">
              <span className="text-[10px] text-slate-500 font-bold px-1 uppercase tracking-wider">
                👥 Role Based Menus
              </span>
              {/* ปุ่มทางด่วนขากลับ: กดแล้วกระชากพาส URL ดีดตัวกลับสู่ฐานบัญชาการของ TD ทันที */}
              <Link to="/td/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-950/40 text-slate-400 hover:text-white rounded-lg text-xs font-medium text-left flex items-center gap-2 transition-colors">
                ⚙️ Tournament Management
              </Link>
              {/* ไฮไลต์สีส้มเข้ม บ่งบอกว่ากำลังส่องกระดานผลแต้มสดในโหมดคนดูอยู่ */}
              <Link to="/golfer/tournaments" onClick={onClose} className="px-3 py-2 bg-slate-800 text-yellow-400 rounded-lg text-xs font-bold border border-yellow-400/30 text-left flex items-center gap-2">
                📊 Score / Leader Viewer [Golfer]
              </Link>
            </div>
          )}

          {/* =========================================================
              🟡 ส่วนที่ 3: Role Sub-Menus (กางชุดปุ่มลูกสายตรงกลุ่มผู้เล่นในสนาม)
              ========================================================= */}
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-[11px] text-emerald-400 font-bold px-3 uppercase tracking-wider mb-1">
              {user.role === "SCORER" ? "⛳ Scorer Sub-Menus" : "🏌️‍♂️ Golfer Sub-Menus"}
            </span>

            <Link to="/golfer/tournaments" onClick={onClose} className={getSidebarClass("/golfer/tournaments")}>🏆 Tournament List</Link>
            {/* 🔗 ปุ่มทางด่วนขากลับ: กดแล้วกระชากพาส URL ดีดตัวกลับสู่หน้าบอร์ดผู้นำสดทันที */}
            {/* 
            
            <Link to="/golfer/leaderboard" onClick={onClose} className={getSidebarClass("/golfer/leaderboard")}>📊 Leader Board</Link>
            
            */}
            <button
              onClick={handleLeaderboardNav}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 font-bold transition-all text-slate-300 hover:text-white"
            >
              📊 Leader Board
            </button>
            {/* ดักเปิดปุ่ม Scoring Panel ให้สิทธิ์เฉพาะ Scorer, TD และ Admin เท่านั้น */}
            {(user.role === "SCORER" || user.role === "TD" || user.role === "ADMIN") && (
              <Link to="/golfer/scoringPanel" onClick={onClose} className={getSidebarClass("/golfer/scoringPanel")}>📝 Scoring Panel</Link>
            )}
          </div>

          {/* =========================================================
              🔴 ส่วนที่ 4: Logout ปุ่มกดออกจากระบบ ดีดลงใต้สุดเว้นระยะปลอดภัย
              ========================================================= */}
          <button 
            onClick={handleLogoutAction} // 💡 สวมสายสัญญาณคำสั่งพารถพุ่งนำทางฉบับปรับปรุงใหม่
            className="mt-auto px-4 py-2.5 text-left text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg text-sm flex items-center gap-2 font-medium border border-red-900/20 transition-colors shadow-inner"
          >
            🚪 Logout
          </button>

        </nav>
      </aside>
    </>
  );
}