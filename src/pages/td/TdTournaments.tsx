// src/pages/td/TdTournaments.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 📥 1. นำเข้าท่อสายส่งสัญญาณควบคุมเส้นทางเดินรถ[cite: 12]
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 วัตถุประสงค์หลัก: หน้ารายการแข่งขันสำหรับบทบาทสิทธิ์ TD 
 * @description ปรับปรุงสถาปัตยกรรม R3: กระชับมิติวัดขนาดพอดีจอ iPhone SE จิ้มง่าย พ่วง Query Params นำทางหนาแน่น[cite: 12]
 */
function TdTournaments() {
  // ดึง State และ Actions ออกมาจากคลังสมองกลส่วนกลาง Zustand[cite: 12]
  // ⛳ [จุดแก้ไขยุทธศาสตร์]: สลักการ fallback array เผื่อไว้กรณีข้อมูลหลังบ้านยังโหลดมาไม่สมบูรณ์
  const tournaments = useGolfStore((state: any) => state.tournaments || []);
  const fetchTournaments = useGolfStore((state: any) => state.fetchTournaments);
  const toggleTournamentStatus = useGolfStore((state: any) => state.toggleTournamentStatus);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const navigate = useNavigate(); // 👈 2. ประกาศตัวแปรรับกระแสสัญญาณควบคุมเส้นทาง[cite: 12]

  // สั่งยิงกระแสสัญญาณดึงข้อมูลอัตโนมัติทันทีเมื่อเปิดหน้าจอ[cite: 12]
  useEffect(() => {
    if (fetchTournaments) {
      fetchTournaments();
    }
  }, [fetchTournaments]);

  if (isLoading) return <div className="text-center py-16 text-slate-500 font-bold text-xs animate-pulse">🔄 กำลังมุดอุโมงค์ข้อมูลแมตช์ TD...[cite: 12]</div>;

  return (
    <div className="w-full bg-white text-slate-900 font-sans px-1 text-[11px] max-h-[640px]">
      
      {/* 🧱 ส่วนที่ 1: หัวข้อรายการภาพรวมจัดการ (บีบระยะแนวตั้ง Mobile-First)[cite: 12] */}
      <div className="mb-3 text-left border-b border-slate-100 pb-1.5 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
            🏆 Tournament Panel (TD Role)[cite: 12]
          </h2>
          <p className="text-[10px] text-slate-500">คลิกข้อความสลับสเตตัสจำลอง หรือกดปุ่มนำทางจัดการระบบก๊วน[cite: 12]</p>
        </div>
        <span className="text-[9px] bg-slate-900 text-white font-black px-2 py-0.5 rounded shadow-sm">ADMIN BOARD[cite: 12]</span>
      </div>
      
      {tournaments.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-dashed border-slate-300 text-center shadow-sm max-w-sm mx-auto my-4">
          <p className="text-xs text-amber-600 font-bold">No Event History 🌟[cite: 12]</p>
        </div>
      ) : (
        /* 🧱 ส่วนที่ 2: รายการแมตช์ (ขยาย Target Touch ปุ่มกดให้จิ้มง่าย สลายบั๊กนิ้วเบียด)[cite: 12] */
        <div className="space-y-2 max-h-[540px] overflow-y-auto pr-0.5 scrollbar-thin">
          {tournaments.map((t: any) => {
            // ⛳ [จุดแก้ไขคีย์หลัก]: แปลงร่างจาก t.id และ t.title เดิม ให้สตรีมค่าตรงตามพิมพ์เขียวฐานข้อมูลจริง
            const currentMatchId = t.tournament_id || t.id;
            const currentMatchName = t.tournament_name || t.title || "แมตช์แข่งขันทางการ";
            const currentStatus = (t.status || "setup").toLowerCase();

            return (
              <div key={currentMatchId} className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 shadow-sm transition-all">
                <div className="flex justify-between items-center gap-3">
                  
                  {/* ฝั่งซ้าย: ข้อมูลร่วมแมตช์ จิ้มหัวข้อสลับ Loop สเตตัสจำลองใน Dev Mode ได้ลื่นไหล[cite: 12] */}
                  <div 
                    onClick={() => toggleTournamentStatus && toggleTournamentStatus(currentMatchId)} // 👈 3. ฟังก์ชันคลิกหมุนเปลี่ยนสถานะแมตช์ออฟไลน์[cite: 12]
                    className="cursor-pointer hover:opacity-70 transition-opacity flex-1 text-left"
                    title="คลิกบริเวณข้อความเพื่อทดสอบหมุนเปลี่ยนสถานะแมตช์ออฟไลน์"
                  >
                    <h3 className="font-black text-slate-800 text-xs leading-tight line-clamp-1">{currentMatchName}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-medium">📍 {t.course_name || "Amata Spring CC"} | 📅 {t.event_date || t.date || "2026-07-20"}</p>
                  </div>
                  
                  {/* ฝั่งขวา: ปุ่ม Action นำทางสลับรางวิ่งรถ พ่วงส่ง Query String ป้องกันระบบหลงทิศ[cite: 12] */}
                  <button
                    onClick={() => {
                      // 🔀 เลเยอร์ที่ 1: สถานะ SETUP -> วิ่งมุดท่อไปหน้าจัดสรรก๊วน พ่วงส่ง ID แมตช์ตัวจริง ไม่เป็น undefined![cite: 12]
                      if (currentStatus === "setup") {
                        navigate(`/td/flights?id=${currentMatchId}`);
                      } 
                      // 🔀 เลเยอร์ที่ 2: สถานะ LIVE -> วิ่งทะลวงไปส่องบอร์ดผู้นำสดแต้มขยับข่ายโรงงาน[cite: 12]
                      else if (currentStatus === "live") {
                        navigate(`/golfer/leaderboard?id=${currentMatchId}`);
                      } 
                      // 🔀 เลเยอร์ที่ 3: สถานะ CLOSE หรือ FINAL -> วิ่งไปเปิดตารางคะแนนสุทธิที่เป็นทางการท้ายแมตช์[cite: 12]
                      else if (currentStatus === "close" || currentStatus === "final") {
                        navigate(`/golfer/leaderboard?id=${currentMatchId}`);
                      }
                    }}
                    className={`px-3 py-1.5 text-[10px] rounded-lg font-black tracking-tight shrink-0 transition-all active:scale-95 border uppercase ${
                      currentStatus === "live" ? "bg-red-500 text-white border-red-400 animate-pulse" :
                      currentStatus === "close" || currentStatus === "final" ? "bg-slate-700 text-white border-slate-600" : "bg-amber-400 text-slate-950 border-amber-500"
                    }`}
                  >
                    {currentStatus === "close" ? "FINAL" : currentStatus}
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TdTournaments;