// src/pages/td/Flights.tsx

/**
 * 🎯 หน้าจอจัดสรรและบริหารจัดการก๊วนแข่งขัน (TD Flight Management Page)
 */
export default function Flights() {
  // 🧠 Mock Data จำลองโครงสร้างสารบบก๊วนออกรอบตามพิมพ์เขียวแท็บ td flight
  const mockFlights = [
    { id: 1, flightNo: "Group 01", teeOff: "07:00", startHole: "Hole 1", players: ["Nobita", "Shizuka", "Gian", "Suneo"], status: "LIVE" },
    { id: 2, flightNo: "Group 02", teeOff: "07:12", startHole: "Hole 1", players: ["Dekisugi", "Player B", "Player C", "Player D"], status: "SETUP" }
  ];

  return (
    <div className="space-y-6">
      {/* ส่วนหัวหน้าเว็บ บอกพิกัดงานคุมระบบมือถือ */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">🏌️‍♂️ Flight Management Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">จัดแจงแบ่งกลุ่มผู้เล่น, เวลาทีออฟ และควบคุมสถานะก๊วนออกรอบ</p>
      </div>

      {/* 🏗️ การสลักตารางโครงร่าง CSS Grid / Table แสดงผลแบบ Simply Standard */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-gray-50">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold">
              <th className="p-3 whitespace-nowrap">ก๊วน (Flight No)</th>
              <th className="p-3 whitespace-nowrap">เวลาออกรอบ (Tee-off)</th>
              <th className="p-3 whitespace-nowrap">จุดสตาร์ท (Start)</th>
              <th className="p-3">รายชื่อกลุ่มผู้เล่นในสนาม (Players)</th>
              <th className="p-3 whitespace-nowrap text-center">สถานะ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockFlights.map((flight: any) => (
              <tr key={flight.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 font-bold text-blue-900 whitespace-nowrap">{flight.flightNo}</td>
                <td className="p-3 text-slate-700 font-medium whitespace-nowrap">⏱️ {flight.teeOff} น.</td>
                <td className="p-3 text-gray-600 whitespace-nowrap">⛳ {flight.startHole}</td>
                <td className="p-3">
                  {/* แผงตลับแสดงรายชื่อขุนพล วนลูปพ่นเป็นป้าย Badge คลีน ๆ สายตา */}
                  <div className="flex flex-wrap gap-1.5">
                    {flight.players.map((player: string, index: number) => (
                      <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-gray-200">
                        {index + 1}. {player}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 text-center whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    flight.status === "LIVE" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}>
                    {flight.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}