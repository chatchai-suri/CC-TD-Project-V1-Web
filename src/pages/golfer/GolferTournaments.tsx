// src/pages/golfer/GolferTournaments.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 หน้าจอรายการแข่งขันสำหรับนักกอล์ฟและแคดดี้ (Golfer Tournament Directory)
 * 🔌 เชื่อมต่อ: Zustand Global Store ผูกรางข้อมูลกลางตรงกับระบบของ TD
 */
export default function GolferTournaments() {
  const navigate = useNavigate();
  
  // 🧠 ดึงสถานะข้อมูลทัวร์นาเมนต์จำลองตรงจากคลังสมองกลส่วนกลาง
  const tournaments = useGolfStore((state: any) => state.tournaments);
  const fetchTournaments = useGolfStore((state: any) => state.fetchTournaments);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* ส่วนหัวแสดงการต้อนรับของฝั่งผู้เล่น */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">🏆 My Tournaments</h1>
        <p className="text-xs text-gray-500 mt-1">ตรวจสอบประวัติลงแข่ง เกาะติดบอร์ดคะแนนสด หรือส่องผลสรุปแมตช์ทางการ</p>
      </div>

      {/* 🏗️ ตารางแสดงผลเวอร์ชันกระชับ ยุบรวมช่อง Date/Course ป้องกันจอล้นบน Mobile-First */}
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider">
              <th className="p-3">Tournament Info</th>
              <th className="p-3 text-center">Leaderboard Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium">
            {tournaments.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                
                {/* 1. ข้อมูลชื่องาน วันแข่งขัน และคอร์สสนามกอล์ฟ */}
                <td className="p-3 space-y-0.5">
                  <div className="font-bold text-blue-900 text-xs">{t.title}</div>
                  <div className="text-gray-500 text-[10px] font-normal">
                    📅 {t.date} | 📍 {t.course_name}
                  </div>
                </td>

                {/* 2. ปุ่มสับรางนำทางข้ามแดนตามระเบียบ Tournament Status Matrix */}
                <td className="p-3 text-center align-middle whitespace-nowrap">
                  {t.status === "live" ? (
                    <button
                      onClick={() => navigate(`/golfer/leaderboard?id=${t.id}&status=live`)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold rounded-lg shadow-sm transition-colors animate-pulse cursor-pointer"
                    >
                      ⚡ ดูบอร์ดสด (Live)
                    </button>
                  ) : t.status === "close" ? (
                    <button
                      onClick={() => navigate(`/golfer/leaderboard?id=${t.id}&status=final`)}
                      className="px-3 py-1 bg-slate-600 hover:bg-slate-700 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      📜 ดูผลสรุปแมตช์
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                      🛠️ กำลังเซ็ตติ้งก๊วน
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}