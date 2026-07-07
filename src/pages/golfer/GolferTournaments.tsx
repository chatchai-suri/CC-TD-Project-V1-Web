// src/pages/golfer/Tournaments.tsx
import { useNavigate } from "react-router-dom";

/**
 * 🎯 หน้าจอรายการแข่งขันสำหรับนักกอล์ฟและแคดดี้ (Golfer Tournament Directory)
 */
export default function GolferTournaments() {
  const navigate = useNavigate();

  // 🧠 Mock Data ถอดประชากรแมตช์จริง เชื่อมโยงสถานะสัจจะระบบเดียวกับฝั่ง TD
  const mockUserTournaments = [
    { no: 1, name: "SAT Friendship 13rd", date: "2-Aug-2025", course: "Mountain Shadow GC", status: "Close", gross: 98, net: 90, rank: 12 },
    { no: 2, name: "Alpha-Test", date: "26-Jun-2026", course: "Amata Spring CC", status: "Live!", gross: 105, net: 95, rank: 14 },
    { no: 3, name: "Onsite-test", date: "22-Jul-2026", course: "Present Valley GC", status: "Setup", gross: null, net: null, rank: null }
  ];

  return (
    <div className="space-y-6">
      {/* ส่วนหัวแสดงการต้อนรับของฝั่งผู้เล่น */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">🏆 My Tournaments Directory</h1>
        <p className="text-xs text-gray-500 mt-1">ตรวจสอบประวัติการลงแข่ง ส่องผลการแข่งขันย้อนหลัง และเกาะติดลีดเดอร์บอร์ดสด</p>
      </div>

      {/* 🏗️ ตารางแสดงผลเวอร์ชันกระชับยุบซ้อน Date/Course ป้องกันจอล้น Responsive */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider">
              <th className="p-3">Tournament Info</th>
              <th className="p-3 text-center">Score (G/N)</th>
              <th className="p-3 text-center">Leaderboard Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium">
            {mockUserTournaments.map((t: any) => (
              <tr key={t.no} className="hover:bg-slate-50/50 transition-colors">
                
                {/* 1. ข้อมูลชื่อแมตช์ ซ้อนคู่กับวันจัดและคอร์สสนาม */}
                <td className="p-3 space-y-0.5">
                  <div className="font-bold text-blue-900 text-xs">{t.name}</div>
                  <div className="text-gray-500 text-[10px] font-normal">
                    📅 {t.date} | 📍 {t.course}
                  </div>
                </td>

                {/* 2. แต้มสกอร์สะสม Net/Gross และอันดับ Rank ที่เคยทำได้ */}
                <td className="p-3 text-center text-slate-700 align-middle">
                  {t.status === "Setup" ? (
                    <span className="text-gray-400 italic text-[10px]">รอแข่งขัน</span>
                  ) : (
                    <div>
                      <div className="font-bold text-slate-800">{t.gross}/{t.net}</div>
                      <div className="text-[9px] text-slate-400">Rank: #{t.rank}</div>
                    </div>
                  )}
                </td>

                {/* 3. ปุ่มกดนำทางข้ามแดนมุดเข้าสู่หน้า Leaderboard */}
                <td className="p-3 text-center align-middle whitespace-nowrap">
                  {t.status === "Live!" ? (
                    <button
                      onClick={() => navigate("/golfer/leaderboard")}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold rounded-lg shadow-sm transition-colors animate-pulse"
                    >
                      ⚡ ดูบอร์ดคะแนนสด (Live)
                    </button>
                  ) : t.status === "Close" ? (
                    <button
                      onClick={() => alert("แสดงใบคะแนนสรุปผลเป็นทางการ (Tournament Result)")}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-gray-300 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      📜 ดูผลสรุปแมตช์
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-bold">
                      🛠️ กำลังเซ็ตติ้ง
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