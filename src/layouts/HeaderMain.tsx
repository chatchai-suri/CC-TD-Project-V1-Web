// src/layouts/HeaderMain.tsx
import { useGolfStore } from "../store/useGolfStore";
import { useNavigate } from "react-router-dom";

interface HeaderMainProps {
  onToggleMenu?: () => void; // 👈 ปรับชื่อ Prop ให้ตรงกับ LayoutPublic
  user?: any;
}

export default function HeaderMain({ onToggleMenu }: HeaderMainProps) {
  const navigate = useNavigate();
  const currentUser = useGolfStore((state: any) => state.currentUser);
  const logout = useGolfStore((state: any) => state.logout);

  // แกะชื่อแสดงผลและบทบาทสิทธิ์
  const userRole = currentUser?.global_role || "GUEST";
  const displayName = currentUser?.nickname || currentUser?.fullname || currentUser?.username || "ผู้มาเยือน";

  const handleLogoutAction = () => {
    if (logout) logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-blue-900 text-white shadow-md sticky top-0 z-40">
      <div className="w-full max-w-[375px] mx-auto px-2.5 py-1.5 flex items-center justify-between gap-1">
        
        {/* ฝั่งซ้าย: ปุ่ม Hamburger และ Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMenu} // 👈 เรียกใช้งานฟังก์ชันที่ส่งมาจาก Layout แม่
            className="p-1 rounded-lg hover:bg-blue-800 transition-colors cursor-pointer text-lg leading-none active:scale-95"
            title="เปิดเมนูหลัก"
          >
            ☰
          </button>
          
          <div 
            onClick={() => navigate("/")}
            className="flex items-center cursor-pointer font-black text-xs tracking-wider shrink-0"
          >
            <span className="text-amber-400">GOLF-</span>
            <span className="text-white">TD</span>
          </div>
        </div>

        {/* ฝั่งขวา: ป้ายชื่อผู้ใช้ + ปุ่ม Login / Logout (แสดงปุ่ม Login ทันทีบนมือถือ) */}
        <div className="flex items-center gap-1.5 shrink-0 min-w-0">
          {userRole === "GUEST" ? (
            <button
              onClick={() => navigate("/login")}
              className="text-[10px] bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer active:scale-95 border border-emerald-500"
            >
              🔑 เข้าสู่ระบบ
            </button>
          ) : (
            <>
              <div className="flex items-center gap-1 bg-blue-950/90 px-2 py-0.5 rounded-full border border-blue-700/50 max-w-[130px]">
                <span className="text-[10px] font-bold truncate text-slate-100">
                  {displayName}
                </span>
                <span className="text-[8px] font-black px-1.5 py-0.2 rounded bg-purple-600 text-white uppercase shrink-0">
                  {userRole}
                </span>
              </div>

              <button
                onClick={handleLogoutAction}
                className="text-[9px] bg-red-600/80 hover:bg-red-600 text-white px-1.5 py-0.5 rounded font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                title="ออกจากระบบ"
              >
                ออก
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}