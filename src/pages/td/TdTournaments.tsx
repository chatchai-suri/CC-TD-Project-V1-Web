// src/pages/td/TdTournaments.tsx
import { useState } from "react";

/**
 * 🎯 หน้าจอหลักของผู้จัดการแข่งขัน (TD Tournament List Directory)[cite: 22]
 */
export default function TdTournaments() {
  const [tournaments, setTournaments] = useState<any[]>([
    { no: "n-1", name: "SAT Friendship 13rd", date: "2-Aug-2025", course: "Mountain Shadow GC", status: "Close" },
    { no: "n", name: "Alpha-Test", date: "26-Jun-2026", course: "Amata Spring CC", status: "Live!" },
    { no: "n+1", name: "Beta-Test", date: "3-Jul-2026", course: "Khaokheaw CC", status: "Setup" }
  ]);

  const toggleStatus = (idNo: string, currentStatus: string) => {
    let nextStatus = "Setup";
    if (currentStatus === "Setup") nextStatus = "Live!";
    else if (currentStatus === "Live!") nextStatus = "Close";
    else nextStatus = "Setup";
    setTournaments(prev => prev.map(t => t.no === idNo ? { ...t, status: nextStatus } : t));
  };

  return (
    <div className="space-y-6">
      {/* Head Detail Area */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">🏆 Tournament List (Director View)</h1>
          <p className="text-xs text-gray-500 mt-1">ยินดีต้อนรับผู้จัดการแข่งขัน: กดปุ่มด้านขวาเพื่อเนรมิตเปิดทัวร์นาเมนต์ใหม่</p>
        </div>
        <button 
          onClick={() => alert("เปิดโมดูลสร้างทัวร์นาเมนต์ใหม่...")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap self-start sm:self-center"
        >
          ➕ Create New Tournament
        </button>
      </div>

      {/* 🏗️ ตารางยุบรวม 3 คอลัมน์สูตรกระชับประหยัดพื้นที่แนวราบ (Option 2 Verified) */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider border-b border-slate-700">
              <th className="p-3 w-1/2">Name</th>
              <th className="p-3 w-1/3">Date / Course</th>
              <th className="p-3 text-center whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium">
            {tournaments.map((t: any) => (
              <tr key={t.no} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-3 font-bold text-blue-900 align-middle">
                  <div className="max-w-[180px] sm:max-w-none truncate sm:whitespace-normal">
                    {t.name}
                  </div>
                </td>
                <td className="p-3 text-gray-600 align-middle space-y-0.5">
                  <div className="font-semibold text-slate-800 text-[11px]">📅 {t.date}</div>
                  <div className="text-gray-400 text-[10px] font-normal truncate max-w-[130px] sm:max-w-none">
                    📍 {t.course}
                  </div>
                </td>
                <td className="p-3 text-center align-middle whitespace-nowrap">
                  <button
                    onClick={() => toggleStatus(t.no, t.status)}
                    className={`min-w-[65px] px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm border transition-all ${
                      t.status === "Live!" 
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300 animate-pulse" 
                        : t.status === "Close"
                        ? "bg-gray-100 text-gray-600 border-gray-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {t.status}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}