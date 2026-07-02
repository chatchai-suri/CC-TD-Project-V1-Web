import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function MainLayout() {
  // 🧠 1. จำลองข้อมูลสถานะผู้ใช้และสิทธิ์การใช้งาน (รอเชื่อม Zustand ในเฟสถัดไป)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({
    nickname: "ป๋าปู",
    role: "SCORER", // สิทธิ์ทดสอบ: USER, SCORER, TD, ADMIN
    profile_icon: "🏌️‍♂️"
  });

  // 🚦 2. สถานะเปิด/ปิดของ Sidebar นำทาง (Hamburger Toggle)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // 🚪 ฟังก์ชันออกจากระบบแบบง่าย
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans text-gray-900">
      
      {/* =========================================================
          🟢 STATUS BAR (TOP HEADER) - สลักข้อมูลผู้ใช้และปุ่มแฮมเบอร์เกอร์
          ========================================================= */}
      <header className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* ปุ่ม Hamburger (3 ขีด) กดเปิด/ปิดเมนูด้านข้าง */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-blue-800 rounded-lg transition-colors focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="font-bold text-lg tracking-wider">GOLF-TD</span>
        </div>

        {/* ข้อมูลโปรไฟล์มุมขวาบน (User Information Box) */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 bg-blue-950 px-3 py-1.5 rounded-full text-sm">
            <span className="text-base">{user.profile_icon}</span>
            <span className="font-medium">{user.nickname}</span>
            <span className="bg-yellow-500 text-blue-950 font-bold px-1.5 py-0.2 rounded text-[10px]">
              {user.role}
            </span>
          </div>
        ) : (
          <Link to="/login" className="bg-emerald-600 hover:bg-emerald-500 font-medium px-4 py-1.5 rounded-lg text-sm transition-colors">
            Login
          </Link>
        )}
      </header>

      {/* =========================================================
          🗂️ RESPONSIVE SIDEBAR (NAV BAR) - ซ่อนอยู่ จะโผล่เมื่อกดแฮมเบอร์เกอร์
          ========================================================= */}
      {/* แผงโปร่งแสงสีดำหลังบ้านเมื่อเปิด Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-200 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <span className="font-bold text-yellow-400">เมนูควบคุมระบบ</span>
          <button onClick={() => setIsSidebarOpen(false)} className="text-slate-400 hover:text-white text-xl p-1">
            ✕
          </button>
        </div>

        <nav className="p-2 flex flex-col gap-1">
          {/* เมนูพื้นฐาน (Public) */}
          <Link to="/" onClick={() => setIsSidebarOpen(false)} className="px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm flex items-center gap-2">🏠 Home</Link>
          <Link to="/about" onClick={() => setIsSidebarOpen(false)} className="px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm flex items-center gap-2">ℹ️ About Us</Link>

          {/* เมนูเฉพาะกลุ่มผู้ใช้งาน (Logged In User) */}
          {isLoggedIn && (
            <>
              <div className="border-t border-slate-800 my-2" />
              <Link to="/user-home" onClick={() => setIsSidebarOpen(false)} className="px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm text-sky-400 flex items-center gap-2">🏆 Tournament List</Link>
              <Link to="/leaderboard" onClick={() => setIsSidebarOpen(false)} className="px-4 py-2.5 hover:bg-slate-800 rounded-lg text-sm flex items-center gap-2">📊 Leader Board</Link>
              
              {/* ด่านตรวจสิทธิ์ SCORER คีย์แต้มสดหน้างาน */}
              {(user.role === "SCORER" || user.role === "TD" || user.role === "ADMIN") && (
                <Link to="/scoring" onClick={() => setIsSidebarOpen(false)} className="px-4 py-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 rounded-lg text-sm font-medium flex items-center gap-2 border border-emerald-900/50">
                  📝 Scoring Panel
                </Link>
              )}
            </>
          )}

          {/* ปุ่มออกจากระบบท้ายแถว */}
          {isLoggedIn && (
            <button 
              onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
              className="mt-4 px-4 py-2.5 w-full text-left text-red-400 hover:bg-red-950/30 rounded-lg text-sm flex items-center gap-2 font-medium"
            >
              🚪 Logout
            </button>
          )}
        </nav>
      </aside>

      {/* =========================================================
          🔷 BODY AREA - รูเจาะกลางสำหรับพ่นตารางหน้าจอลูกผ่าน <Outlet />
          ========================================================= */}
      <main className="flex-1 max-w-md w-full mx-auto bg-white shadow-sm border-x border-gray-200">
        <Outlet />
      </main>

    </div>
  );
}