// src/pages/td/Flights.tsx

/**
 * 🎯 หน้าจอจัดสรรและบริหารจัดการก๊วนแข่งขัน (TD Flight Management Page - Option 1 Responsive)
 */
export default function Flights() {
  // 🧠 Mock Data โครงสร้างก๊วนออกรอบจำลองประชากร 5 ขุนพลหลักตามสารบบโครงการ
  const mockFlights = [
    {
      id: 1,
      groupName: "Group 01",
      startTime: "07:00",
      startHole: "Hole 1",
      members: [
        { name: "Nobita", role: "Golfer", handicap: 12 },
        { name: "Shizuka", role: "Golfer", handicap: 18 },
        { name: "Gian", role: "Scorer", handicap: 15 },
        { name: "Suneo", role: "Golfer", handicap: 14 }
      ]
    },
    {
      id: 2,
      groupName: "Group 02",
      startTime: "07:12",
      startHole: "Hole 1",
      members: [
        { name: "Dekisugi", role: "TD", handicap: 5 },
        { name: "Player B", role: "Golfer", handicap: 24 },
        { name: "Player C", role: "Scorer", handicap: 20 },
        { name: "Player D", role: "Golfer", handicap: 18 }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Detail Area */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">🏌️‍♂️ Group Members Assignment</h1>
        <p className="text-xs text-gray-500 mt-1">จัดสรรกลุ่มผู้เล่น, บทบาทแคดดี้คีย์แต้ม และตรวจสอบประวัติคะแนนต่อแต้ม</p>
      </div>

      {/* 🏗️ ตารางสูตรประหยัดพื้นที่แนวราบ 3 คอลัมน์พิชิตจอมือถือ (Option 1 Verified) */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold uppercase tracking-wider border-b border-slate-700">
              <th className="p-3 w-1/3 min-w-[120px]">Group / Time / Hole</th>
              <th className="p-3 w-1/3 min-w-[110px]">Player / Role</th>
              <th className="p-3 w-1/3 min-w-[80px]">Handicap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockFlights.map((flight: any) => (
              <tr key={flight.id} className="hover:bg-slate-50/40 transition-colors">
                
                {/* 1. คอลัมน์ข้อมูลก๊วน: มัดรวมชื่องาน เวลาทีออฟ และหลุมสตาร์ทซ้อนกันแนวดิ่ง */}
                <td className="p-3 align-top space-y-1 bg-slate-50/60 border-r border-gray-100">
                  <div className="font-bold text-blue-950 text-xs">{flight.groupName}</div>
                  <div className="text-slate-600 font-medium text-[11px]">⏱️ {flight.startTime} น.</div>
                  <div className="text-emerald-700 text-[10px] font-semibold">⛳ {flight.startHole}</div>
                </td>

                {/* 2 & 3. คอลัมน์ลูกผสม: วนลูปพ่นขุนพล 4 คน ซ้อนดิ่งภายในช่องตารางเดียว */}
                <td colSpan={2} className="p-0 align-top">
                  <div className="divide-y divide-gray-100">
                    {flight.members.map((member: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        
                        {/* ช่องย่อยฝั่งซ้าย: ซ้อนชื่อผู้เล่นด้านบน และ ป้ายบทบาทจาง ๆ ด้านล่าง */}
                        <div className="p-2.5 space-y-0.5 flex-1 min-w-0">
                          <div className="font-bold text-slate-800 truncate">
                            {index + 1}. {member.name}
                          </div>
                          <div className={`text-[9px] font-extrabold uppercase tracking-wide inline-block px-1.5 py-0.2 rounded-sm ${
                            member.role === "Scorer" || member.role === "TD"
                              ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {member.role}
                          </div>
                        </div>

                        {/* ช่องย่อยฝั่งขวา: แสดงแต้มต่อ Handicap ยึดพิกัดแนวราบให้ตรงตลับคอลัมน์ 3 */}
                        <div className="p-2.5 w-1/2 text-left text-slate-700 font-semibold border-l border-gray-50">
                          🏅 HC: {member.handicap}
                        </div>

                      </div>
                    ))}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}