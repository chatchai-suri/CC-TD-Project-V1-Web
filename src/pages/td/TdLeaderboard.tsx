// src/pages/td/TdLeaderboard.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom"; // 💡 1. นำเข้าเครื่องยนต์ควบคุมท่อทางเดินรถขากลับ[cite: 15]
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 วัตถุประสงค์หลัก: หน้าจอกระดานสรุปผลแมตช์ (Tournament Result) และ บอร์ดคะแนนสด (Live Leaderboard) ฝั่งสิทธิ์ TD[cite: 15]
 * @description ปรับปรุงสถาปัตยกรรม: 1. ฝังปุ่มย้อนกลับด่วนดัก Params ต้นทาง 2. กระชับฟอนต์และพื้นที่ ไม่ให้สายข้อความขาดกลางอากาศบน iPhone SE[cite: 4, 15]
 */
function TdLeaderboard() {
  const navigate = useNavigate(); // 👈 ประกาศทางด่วนนำทางขากลับด่วน
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id") || "t2";
  const statusMode = searchParams.get("status") || "final"; // ดึงสถานะแมตช์ ("live" | "final")[cite: 15]

  const resultData = useGolfStore((state: any) => state.tournamentResult);
  const activeScoreCard = useGolfStore((state: any) => state.activeScoreCard);
  const fetchTournamentResult = useGolfStore((state: any) => state.fetchTournamentResult);
  const fetchPlayerScoreCard = useGolfStore((state: any) => state.fetchPlayerScoreCard);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    fetchTournamentResult(tournamentId);
  }, [tournamentId, fetchTournamentResult]);

  if (isLoading) return <div className="text-center py-12 text-slate-500 font-bold text-xs animate-pulse">🔄 กำลังประมวลผลกระดานคะแนน TD...</div>;
  if (!resultData) return <div className="text-center py-12 text-slate-400 font-bold text-xs">⚠️ ไม่พบข้อมูลผลการแข่งขันในระบบสารบบ[cite: 15]</div>;

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1 text-[11px] max-h-[640px]">
      
      {/* =========================================================================
          👑 แถวปุ่มควบคุมทางนำทางขากลับด่วนของฝ่ายจัดการแข่งขัน (TD Back Link Button Switch)
          ========================================================================= */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 mb-1.5 shrink-0">
        <button
          onClick={() => navigate("/td/tournaments")} // ดีดพารถกลับไปที่แผงรายการแข่ง TD ทันที ถูกต้องการเดินรถ 100%[cite: 16]
          className="inline-flex items-center gap-0.5 text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors"
        >
          ⬅️ กลับแผงควบคุมหลัก (TD Control)
        </button>
        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
          statusMode === "live" ? "bg-red-500 text-white animate-pulse" : "bg-slate-600 text-white"
        }`}>
          {statusMode === "live" ? "LIVE BOARD" : "FINAL BOARD"}[cite: 15]
        </span>
      </div>

      {/* 📦 ส่วนหัวแสดงข้อมูลทัวร์นาเมนต์ (Fix Location - หดประหยัดพื้นที่แนวตั้ง Mobile-First)[cite: 4, 15] */}
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-left text-slate-700 mb-2 shadow-sm shrink-0">
        <p className="text-xs font-black text-emerald-700 leading-tight line-clamp-1">Tournament: {resultData.tournament_name}</p>[cite: 15]
        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] mt-1 font-semibold text-gray-500 border-t border-slate-200/60 pt-1">
          <p>📍 Course: <strong className="text-slate-900">{resultData.course_name}</strong></p>[cite: 15]
          <p>📅 Date: <strong className="text-slate-900">{resultData.event_date}</strong></p>[cite: 15]
          <p>⛳ Par: <strong className="text-slate-900 font-mono">{resultData.par}</strong></p>[cite: 15]
          <p>📋 Rule: <strong className="text-slate-900">{resultData.hadicap_rule}</strong></p>[cite: 15]
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {/* ====================================================
             PART 1: กระดานผลผู้นำภาพรวมก๊วน (Table / Cards)[cite: 15]
             ==================================================== */}
        <div>
          {/* 🖥️ โหมดจอคอมพิวเตอร์ (Desktop Table Style)[cite: 15] */}
          <div className="hidden md:block overflow-y-auto max-h-40 rounded-xl border border-slate-200 bg-white shadow-sm scrollbar-thin">
            <table className="w-full text-left border-collapse text-[10px]">
              <thead className="bg-slate-800 text-white font-bold uppercase sticky top-0 z-10">
                {statusMode === "live" ? (
                  <tr>
                    <th className="p-2 text-center w-16">Pos</th>[cite: 15]
                    <th className="p-2">Player</th>[cite: 15]
                    <th className="p-2 text-center w-24">To Par</th>[cite: 15]
                    <th className="p-2 text-center w-24">Holes</th>[cite: 15]
                  </tr>
                ) : (
                  <tr>
                    <th className="p-2 text-center w-16">Rank</th>[cite: 15]
                    <th className="p-2">Player</th>[cite: 15]
                    <th className="p-2 text-center">Group</th>[cite: 15]
                    <th className="p-2 text-center">Gross</th>[cite: 15]
                    <th className="p-2 text-center">Handicap</th>[cite: 15]
                    <th className="p-2 text-center">Net</th>[cite: 15]
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-700 font-mono">
                {resultData.results?.map((p: any) => {
                  const mockToPar = p.rank === 1 ? "-1" : p.rank === 2 ? "E" : `+${p.rank - 1}`;
                  const mockToParColor = mockToPar.startsWith("-") ? "text-red-500 bg-red-50" : mockToPar === "E" ? "text-slate-500 bg-slate-100" : "text-blue-500 bg-blue-50";

                  return (
                    <tr key={p.user_id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-center font-sans bg-slate-50/20">{p.rank}</td>
                      <td className="p-2 font-sans">
                        <button 
                          onClick={() => fetchPlayerScoreCard(p.user_id, p.name)} //[cite: 15]
                          className="text-blue-600 font-black hover:underline text-left flex items-center gap-1 cursor-pointer"
                        >
                          👤 {p.name}[cite: 15]
                        </button>
                      </td>

                      {statusMode === "live" ? (
                        <>
                          <td className="p-2 text-center">
                            <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${mockToParColor}`}>
                              {mockToPar}
                            </span>
                          </td>
                          <td className="p-2 text-center font-sans text-slate-400">18 / 18</td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 text-center text-slate-400 font-sans">{p.flight || "G01"}</td>
                          <td className="p-2 text-center text-slate-900">{p.gross}</td>
                          <td className="p-2 text-center text-slate-400">{p.handicap}</td>
                          <td className="p-2 text-center text-emerald-600 font-black">{p.net}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📱 โหมดจอมือถือสลักการ์ดกระชับ (Mobile Card Style - ลบช่องไฟขยะ ฟิตพอดีขอบ iPhone SE)[cite: 4, 15] */}
          <div className="block md:hidden space-y-1.5 max-h-[350px] overflow-y-auto pr-0.5 scrollbar-thin">
            {resultData.results?.map((p: any) => {
              const mockToPar = p.rank === 1 ? "-1" : p.rank === 2 ? "E" : `+${p.rank - 1}`;
              const mockToParColor = mockToPar.startsWith("-") ? "text-red-600" : mockToPar === "E" ? "text-slate-500" : "text-blue-600";

              return (
                <div 
                  key={p.user_id}
                  onClick={() => {
                    fetchPlayerScoreCard(p.user_id, p.name); //[cite: 15]
                    setIsMobileModalOpen(true); //[cite: 15]
                  }}
                  className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-sm flex justify-between items-center cursor-pointer active:bg-slate-50 transition-all"
                >
                  <div className="text-left">
                    <h4 className="font-black text-slate-900 text-xs">Pos {p.rank}: 👑 {p.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                      {statusMode === "live" ? <span className="text-amber-600">⛳ Holes: 18 / 18</span> : <span>Hcp: {p.handicap} \| F: {p.flight || "G01"}</span>}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {statusMode === "live" ? (
                      <p className={`text-xs font-black font-mono ${mockToParColor}`}>Par: {mockToPar}</p>
                    ) : (
                      <p className="text-sm font-black text-emerald-600 font-mono">Net: {p.net}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ====================================================
             PART 2: การกางตรวจใบการ์ด 18 หลุมด้านล่างดักสถานะ live[cite: 15]
             ==================================================== */}
        {statusMode !== "live" && (
          <div className="hidden md:block shrink-0">
            {activeScoreCard ? (
              <div className="border border-slate-200 rounded-xl bg-white p-2 shadow-sm animate-fade-in">
                <ScoreCardTable cardData={activeScoreCard} />
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 font-bold text-[10px]">
                💡 เลือกคลิกที่รายชื่อนักกอล์ฟด้านบน เพื่อกางเปิดตรวจใบจดคะแนน 1-18 หลุมตรงนี้ได้ทันทีครับป๋า[cite: 15]
              </div>
            )}
          </div>
        )}
      </div>

      {/* โมดอลเต็มจอโหมดมือถือตรวจสอบคะแนน Verify[cite: 15] */}
      {statusMode !== "live" && isMobileModalOpen && activeScoreCard && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-2 animate-slide-up block md:hidden">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-3">
            <h3 className="font-black text-slate-900 text-xs">📇 Mobile Score Card View (TD Verify)</h3>[cite: 15]
            <button onClick={() => setIsMobileModalOpen(false)} className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 cursor-pointer">✕ ปิดหน้าต่าง</button>[cite: 15]
          </div>
          <ScoreCardTable cardData={activeScoreCard} />
        </div>
      )}
    </div>
  );
}

/**
 * 🛠️ SUB-COMPONENT: ตารางแสดงคะแนนรายหลุม 1-18 หลุม (หดคลาสกระชับพื้นที่ ป้องกันอักษร Wrap ขาดตอน)[cite: 15]
 */
function ScoreCardTable({ cardData }: any) {
  return (
    <div className="text-left">
      <div className="bg-slate-900 text-white p-2 rounded-lg mb-2 flex justify-between items-center text-[10px]">
        <div>
          <p className="font-black text-amber-400 text-xs">Player: {cardData.player_name}</p>[cite: 15]
          <p className="text-[9px] text-slate-400 mt-0.5 font-mono">@{cardData.username}</p>[cite: 15]
        </div>
        <span className="bg-emerald-600 font-black px-2 py-0.5 rounded text-[9px]">VERIFIED</span>[cite: 15]
      </div>
      <div className="overflow-y-auto max-h-40 border border-slate-100 rounded-lg shadow-inner pr-0.5 scrollbar-thin">
        <table className="w-full text-left border-collapse text-[10px]">
          <thead className="bg-slate-100 text-slate-700 font-black sticky top-0 z-10">
            <tr>
              <th className="p-2 text-center">Hole</th>[cite: 15]
              <th className="p-2 text-center">Par</th>[cite: 15]
              <th className="p-2 text-center">Index</th>[cite: 15]
              <th className="p-2 text-center bg-blue-50 text-blue-900 font-black">Stroke</th>[cite: 15]
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono font-bold text-slate-600">
            {cardData.hole_scores?.map((h: any) => (
              <tr key={h.hole_no} className="hover:bg-slate-50/50">
                <td className="p-2 text-center bg-slate-50/30 text-slate-400 font-sans">Hole {h.hole_no}</td>[cite: 15]
                <td className="p-2 text-center text-slate-900">{h.par}</td>[cite: 15]
                <td className="p-2 text-center text-slate-400">{h.index}</td>[cite: 15]
                <td className="p-2 text-center bg-blue-50/30 text-blue-600 text-xs font-black">{h.stroke}</td>[cite: 15]
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TdLeaderboard;