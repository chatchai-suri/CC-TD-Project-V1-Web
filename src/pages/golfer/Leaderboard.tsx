// src/pages/golfer/Leaderboard.tsx

/**
 * 🎯 หน้าจอแสดงกระดานคะแนนสดผู้นำในสนามแข่งขัน (Live Leaderboard Viewer)
 */
export default function Leaderboard() {
  // 🧠 Mock Data จำลองแต้มผู้นำสดของพวกโนบิตะชิซุกะตามแบบพิมพ์เขียว
  const mockLeaders = [
    { pos: 1, avatar: "👑", name: "ไทยต้านโกง", toPar: -1, holePlayed: 4 },
    { pos: 2, avatar: "🏌️‍♂️", name: "I-Love-You", toPar: 0, holePlayed: 4 },
    { pos: 2, avatar: "🎀", name: "Shizuka", toPar: 0, holePlayed: 4 },
    { pos: 3, avatar: "👓", name: "Suneo", toPar: 1, holePlayed: 4 },
    { pos: 4, avatar: "📢", name: "Gian", toPar: 2, holePlayed: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* หัวข้อแมตช์อ้างอิงสถานะ Live สดตรงจากสนาม */}
      <div className="border-b border-gray-200 pb-4 bg-slate-900 text-white p-4 rounded-xl shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <span className="bg-red-600 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded animate-pulse">
              🔴 LIVE SCORE
            </span>
            <h1 className="text-lg font-bold mt-1 tracking-tight">Leader Board: Alpha-Test</h1>
            <p className="text-[10px] text-slate-400">📅 26-Jun-2026 | 📍 AMATA Spring International GC</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-yellow-400">Par 72</div>
            <div className="text-[9px] text-slate-400">กลุ่มแข่งขันหลัก: B</div>
          </div>
        </div>
      </div>

      {/* 🏗️ ตารางลีดเดอร์บอร์ดกระดานคะแนนผู้นำ คลีนกระชับปลอดภัยจอมือถือ */}
      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-800 text-white font-semibold text-center">
              <th className="p-3 w-12">Pos</th>
              <th className="p-3 text-left">Player</th>
              <th className="p-3 w-20">To Par</th>
              <th className="p-3 w-20">Holes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-center font-bold">
            {mockLeaders.map((leader: any, idx: number) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                
                {/* 1. ลำดับ Ranking คืนค่า Pos ตามลอจิกแต้มต่อ */}
                <td className="p-3 font-mono text-slate-500 text-sm align-middle">
                  {leader.pos}
                </td>

                {/* 2. ชื่อนักกอล์ฟพ่วงรูปจำลองไอคอนโพรไฟล์ */}
                <td className="p-3 text-left align-middle flex items-center gap-2">
                  <span className="text-base bg-slate-100 p-1 rounded-md">{leader.avatar}</span>
                  <span className="text-slate-900 font-bold text-xs truncate cursor-pointer hover:underline">
                    {leader.name}
                  </span>
                </td>

                {/* 3. คะแนนคะแนนสกอร์สะสม To Par (Under/Over/Even) */}
                <td className="p-3 align-middle">
                  <span className={`inline-block min-w-[36px] px-2 py-0.5 rounded text-[10px] ${
                    leader.toPar < 0 
                      ? "bg-red-100 text-red-800" 
                      : leader.toPar === 0 
                      ? "bg-slate-100 text-slate-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {leader.toPar < 0 ? leader.toPar : leader.toPar === 0 ? "E" : `+${leader.toPar}`}
                  </span>
                </td>

                {/* 4. จำนวนหลุมที่เล่นจบเคลียร์แต้มแล้วในสนาม */}
                <td className="p-3 text-slate-600 font-mono align-middle">
                  {leader.holePlayed} / 18
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}