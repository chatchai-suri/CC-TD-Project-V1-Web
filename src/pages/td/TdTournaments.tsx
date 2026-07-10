// src/pages/td/TdTournaments.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 1. นำเข้าท่อสายส่งสัญญาณทางเดินรถระดับต้นทาง
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 วัตถุประสงค์หลัก: หน้ารายการแข่งขันสำหรับบทบาท TD
 * สยบบั๊กเส้นแดง pic-4 พร้อมผูกสายนำทางร่วมกับ Actions สลับหมุนสถานะ Zustand คุ้มค่าหน้างาน[cite: 17]
 */
function TdTournaments() {
  // ดึง State และ Actions ออกมาจากคลังสมองกลส่วนกลาง
  const tournaments = useGolfStore((state: any) => state.tournaments);
  const fetchTournaments = useGolfStore((state: any) => state.fetchTournaments);
  const toggleTournamentStatus = useGolfStore((state: any) => state.toggleTournamentStatus);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const navigate = useNavigate(); // 👈 2. ประกาศตัวแปรรับกระแสสัญญาณควบคุมเส้นทางเดินรถ

  // สั่งยิงกระแสสัญญาณดึงข้อมูลอัตโนมัติทันทีเมื่อเปิดหน้าจอ
  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  if (isLoading) return <div className="text-center p-6 text-gray-500">กำลังมุดอุโมงค์ข้อมูล...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">รายการแข่งขัน (TD)</h2>
      
      {tournaments.length === 0 ? (
        <p className="text-amber-600 text-center">No Event History 🌟</p>
      ) : (
        <div className="space-y-3">
          {tournaments.map((t: any) => (
            <div key={t.id} className="p-4 rounded-xl border bg-white shadow-sm">
              <div className="flex justify-between items-center gap-2">
                {/* ฝั่งซ้าย: ข้อมูลร่วมแมตช์ จิ้มหัวข้อเพื่อกดสลับสเตตัสทดสอบระบบได้เหมือนเดิม */}
                <div 
                  onClick={() => toggleTournamentStatus(t.id)} // 👈 3. นำฟังก์ชันกลับมาแฝงไว้ที่นี่ จิ้มที่กล่องข้อความเพื่อหมุน Loop สเตตัสจำลองได้!
                  className="cursor-pointer hover:opacity-70 transition-opacity flex-1"
                  title="คลิกบริเวณข้อความเพื่อทดสอบหมุนเปลี่ยนสถานะแมตช์"
                >
                  <h3 className="font-semibold text-gray-800">{t.title}</h3>
                  <p className="text-xs text-gray-500">{t.course_name} | {t.date}</p>
                </div>
                
                {/* ฝั่งขวา: ปุ่ม Action นำทางสลับรางวิ่งรถตามกฎเหล็กดีไซน์ป๋าปู */}
                <button
                  onClick={() => {
                    // 🔀 เลเยอร์ที่ 1: สถานะ SETUP -> วิ่งมุดท่อไปหน้าจัดสรรก๊วนและสมาชิกผู้เล่น
                    if (t.status === "setup") {
                      navigate("/td/flights");
                    }
                    // 🔀 เลเยอร์ที่ 2: สถานะ LIVE -> วิ่งทะลวงไปส่องกระดานลีดเดอร์บอร์ดแบบแต้มขยับสดกลางสนาม
                    else if (t.status === "live") {
                      navigate(`/td/leaderboard?id=${t.id}&status=live`);
                    }
                    // 🔀 เลเยอร์ที่ 3: สถานะ CLOSE -> วิ่งไปเปิดตารางคะแนนสุทธิที่เป็นทางการท้ายแมตช์
                    else if (t.status === "close") {
                      navigate(`/td/leaderboard?id=${t.id}&status=final`);
                    }
                  }}
                  className={`px-3 py-1 text-xs rounded-full font-bold transition-all cursor-pointer ${
                    t.status === "live" ? "bg-emerald-500 text-white animate-pulse" :
                    t.status === "close" ? "bg-slate-500 text-white" : "bg-amber-400 text-gray-900"
                  }`}
                >
                  {t.status.toUpperCase()}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TdTournaments;