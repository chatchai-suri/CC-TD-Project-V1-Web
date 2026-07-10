// src/pages/td/TdLeaderboard.tsx

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 วัตถุประสงค์หลัก: หน้าจอกระดานสรุปผลแมตช์ (Tournament Result) และ บอร์ดคะแนนสด (Live Leaderboard)
 * 🛠️ ซ่อมแซม: แก้ไขปัญหา string ขาดตอนบรรทัด 217 จากการตัดคำ (Word Wrap) เรียบร้อยครับป๋า
 */
function TdLeaderboard() {
  const [searchParams] = useSearchParams();
  const tournamentId = searchParams.get("id") || "t1";
  const statusMode = searchParams.get("status") || "final";

  const resultData = useGolfStore((state: any) => state.tournamentResult);
  const activeScoreCard = useGolfStore((state: any) => state.activeScoreCard);
  const fetchTournamentResult = useGolfStore((state: any) => state.fetchTournamentResult);
  const fetchPlayerScoreCard = useGolfStore((state: any) => state.fetchPlayerScoreCard);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  useEffect(() => {
    fetchTournamentResult(tournamentId);
  }, [tournamentId, fetchTournamentResult]);

  if (isLoading) return <div className="text-center p-8 text-gray-500">กำลังประมวลผลกระดานคะแนน...</div>;
  if (!resultData) return <div className="text-center p-8 text-gray-400">ไม่พบข้อมูลการแข่งขัน</div>;

  return (
    <div className="p-4 w-full max-w-5xl mx-auto pb-12">
      {/* ---------------------------------------------------- */}
      {/* ส่วนหัวแสดงข้อมูลทัวร์นาเมนต์ (Fix Location) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-50 p-4 rounded-xl border border-gray-200 mb-4 text-slate-700">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">
            {statusMode === "live" ? "🟢 LIVE Leaderboard" : "🏆 Tournament Result"}
          </h2>
          {statusMode === "live" && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-sm animate-pulse">
              LIVE SCORE
            </span>
          )}
        </div>
        <p className="text-base font-semibold mt-1 text-emerald-700">Tournament: {resultData.tournament_name}</p>
        <div className="grid grid-cols-2 gap-2 text-xs mt-2 font-medium text-gray-600">
          <p>📍 Course: {resultData.course_name}</p>
          <p>📅 Date: {resultData.event_date}</p>
          <p>⛳ Par: {resultData.par}</p>
          <p>📝 Handicap Rule: {resultData.hadicap_rule}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* ==================================================== */}
        {/* PART 1: กระดานผลแปรสภาพคู่แฝด (Table / Cards) */}
        {/* ==================================================== */}
        <div>
          {/* 🖥️ โหมดจอคอมพิวเตอร์ (Desktop Table Style) */}
          <div className="hidden md:block overflow-y-auto h-48 rounded-xl border border-gray-200 bg-white shadow-sm scrollbar-thin">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-800 text-white text-xs font-bold uppercase sticky top-0 z-10">
                {statusMode === "live" ? (
                  <tr>
                    <th className="p-3 text-center w-16">Pos</th>
                    <th className="p-3">Player</th>
                    <th className="p-3 text-center w-32">To Par</th>
                    <th className="p-3 text-center w-32">Holes</th>
                  </tr>
                ) : (
                  <tr>
                    <th className="p-3 text-center w-16">Rank</th>
                    <th className="p-3">Player</th>
                    <th className="p-3 text-center">Group</th>
                    <th className="p-3 text-center">Gross</th>
                    <th className="p-3 text-center">Handicap</th>
                    <th className="p-3 text-center">Net</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm font-semibold text-slate-700">
                {resultData.results.map((p: any) => {
                  const mockToPar = p.rank === 1 ? "-1" : p.rank === 2 ? "E" : `+${p.rank - 1}`;
                  const mockToParColor = mockToPar.startsWith("-") ? "text-red-500 bg-red-50" : mockToPar === "E" ? "text-gray-600 bg-gray-100" : "text-blue-500 bg-blue-50";

                  return (
                    <tr key={p.user_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center bg-slate-50/50">{p.rank}</td>
                      <td className="p-3">
                        <button 
                          onClick={() => fetchPlayerScoreCard(p.user_id, p.name)}
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer text-left flex items-center gap-1.5"
                        >
                          <span>👑</span>
                          <span>{p.name}</span>
                        </button>
                      </td>

                      {statusMode === "live" ? (
                        <>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${mockToParColor}`}>
                              {mockToPar}
                            </span>
                          </td>
                          <td className="p-3 text-center text-gray-500">14 / 18</td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-center text-gray-500">{p.flight}</td>
                          <td className="p-3 text-center">{p.gross}</td>
                          <td className="p-3 text-center text-gray-400">{p.handicap}</td>
                          <td className="p-3 text-center text-emerald-600 font-bold">{p.net}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 📱 โหมดจอมือถือ (Mobile Card Style) */}
          <div className="block md:hidden space-y-3">
            {resultData.results.map((p: any) => {
              const mockToPar = p.rank === 1 ? "-1" : p.rank === 2 ? "E" : `+${p.rank - 1}`;
              const mockToParColor = mockToPar.startsWith("-") ? "text-red-600" : mockToPar === "E" ? "text-gray-600" : "text-blue-600";

              return (
                <div 
                  key={p.user_id}
                  onClick={() => {
                    fetchPlayerScoreCard(p.user_id, p.name);
                    setIsMobileModalOpen(true);
                  }}
                  className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center cursor-pointer active:bg-slate-50"
                >
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      Pos {p.rank}: 👑 {p.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {statusMode === "live" ? (
                        <span className="text-amber-600 font-bold">⛳ Holes: 14 / 18</span>
                      ) : (
                        <span>Handicap: {p.handicap} | Flight: {p.flight}</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    {statusMode === "live" ? (
                      <p className={`text-base font-black ${mockToParColor}`}>To Par: {mockToPar}</p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500">Gross: {p.gross}</p>
                        <p className="text-sm font-bold text-emerald-600 mt-0.5">Net: {p.net}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================== */}
        {/* PART 2: การกางใบจดแต้มสไตล์ Option C (เดสก์ท็อปแบ่งพื้นที่ล่าง) */}
        {/* ==================================================== */}
        {/* 💡 คั่นเงื่อนไขดักจับ: ถ้าสถานะเป็น live ห้ามพ่นกล่องตรวจการ์ด 18 หลุมนี้ออกมาเด็ดขาด */}
        {statusMode !== "live" && (
          <div className="hidden md:block">
            {activeScoreCard ? (
              <div className="border border-gray-200 rounded-xl bg-white p-4 shadow-sm animate-fade-in">
                <ScoreCardTable cardData={activeScoreCard} />
              </div>
            ) : (
              <div className="text-center p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 font-medium text-sm">
                💡 เลื่อนและเลือกคลิกที่รายชื่อนักกอล์ฟด้านบน เพื่อเปิดตรวจใบจดคะแนน 1-18 หลุมตรงนี้ได้ทันทีครับป๋า
              </div>
            )}
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* โมดอลเต็มจอโหมดมือถือ (Mobile Full-Screen Overlay Modal) */}
      {/* ---------------------------------------------------- */}
      {/* 💡 ครอบปิดประตูสัญญานฝั่งมือถือด้วยเช่นกันในสถานะ live */}
      {statusMode !== "live" && isMobileModalOpen && activeScoreCard && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 animate-slide-up block md:hidden">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <h3 className="font-bold text-slate-900 text-lg">📇 Mobile Score Card View</h3>
            <button 
              onClick={() => setIsMobileModalOpen(false)}
              className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-bold text-gray-500"
            >
              ปิดหน้าต่าง ✕
            </button>
          </div>
          <ScoreCardTable cardData={activeScoreCard} />
        </div>
      )}
    </div>
  );
}

/**
 * 🛠️ SUB-COMPONENT: ตารางแสดงคะแนนรายหลุม 1-18 หลุม
 */
function ScoreCardTable({ cardData }: any) {
  return (
    <div>
      <div className="bg-slate-800 text-white p-3 rounded-lg mb-3 flex justify-between items-center text-xs">
        <div>
          <p className="font-bold text-sm text-amber-400">Player: {cardData.player_name}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Username: @{cardData.username}</p>
        </div>
        <span className="bg-emerald-600 font-bold px-2 py-1 rounded">1-18 Holes Verified</span>
      </div>

      {/* 💡 หดและจัดฟอร์แมตกระชับพื้นที่คลาสเพื่อไม่ให้เกิดการ Wrap ตัดสายข้อความขาดกลางอากาศ */}
      <div className="overflow-y-auto max-h-72 border border-gray-100 rounded-lg shadow-inner pr-1 scrollbar-thin">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
            <tr>
              <th className="p-2.5 text-center">Hole</th>
              <th className="p-2.5 text-center">Par</th>
              <th className="p-2.5 text-center">Index</th>
              <th className="p-2.5 text-center bg-blue-50 text-blue-900 font-black">Stroke</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-slate-600">
            {cardData.hole_scores.map((h: any) => (
              <tr key={h.hole_no} className="hover:bg-slate-50/50">
                <td className="p-2.5 text-center bg-slate-50/30 text-gray-400 font-bold">Hole {h.hole_no}</td>
                <td className="p-2.5 text-center">{h.par}</td>
                <td className="p-2.5 text-center text-gray-400">{h.index}</td>
                <td className="p-2.5 text-center bg-blue-50/30 text-blue-700 font-bold text-sm">{h.stroke}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TdLeaderboard;