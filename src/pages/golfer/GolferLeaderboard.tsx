// src/pages/golfer/GolferLeaderboard.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";

/**
 * 🎯 หน้าจอแสดงกระดานคะแนนสดผู้นำ และผลสรุปแมตช์ฝั่งนักกอล์ฟ (Golfer Leaderboard View)
 * 🛠️ อัปเกรด: โมดอลตรวจใบแต้ม 18 หลุม (Score Card Viewer) โหมด FINAL ให้แสดงผลสรุปส่วนตัวผู้เล่นครบถ้วนในตัวมันเอง
 */
export default function GolferLeaderboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tournamentId = searchParams.get("id") || "t1";
  const statusMode = searchParams.get("status") || "final";

  const resultData = useGolfStore((state: any) => state.tournamentResult);
  const activeScoreCard = useGolfStore((state: any) => state.activeScoreCard);
  const fetchTournamentResult = useGolfStore((state: any) => state.fetchTournamentResult);
  const fetchPlayerScoreCard = useGolfStore((state: any) => state.fetchPlayerScoreCard);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [selectedPlayerSummary, setSelectedPlayerSummary] = useState<any>(null); // ถังเก็บข้อมูลสรุปของผู้เล่นที่ถูกคลิก

  useEffect(() => {
    fetchTournamentResult(tournamentId);
  }, [tournamentId, fetchTournamentResult]);

  if (isLoading) return <div className="text-center p-8 text-gray-500 text-xs">กำลังประมวลผลกระดานคะแนน...</div>;
  if (!resultData) return <div className="text-center p-8 text-gray-400 text-xs">ไม่พบข้อมูลการแข่งขัน</div>;

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12">
      {/* ปุ่มกดย้อนกลับไปหน้ารายชื่อทัวร์นาเมนต์หลัก */}
      <button 
        onClick={() => navigate("/golfer/tournaments")}
        className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
      >
        ⬅️ ย้อนกลับไปหน้าทัวร์นาเมนต์
      </button>

      {/* หัวข้อการ์ดแมตช์อ้างอิงสถานะกอล์ฟ (Mobile-First UI) */}
      <div className={`p-4 rounded-xl shadow-sm text-white ${statusMode === "live" ? "bg-slate-900" : "bg-slate-800"}`}>
        <div className="flex justify-between items-center">
          <div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
              statusMode === "live" ? "bg-red-600 animate-pulse" : "bg-emerald-600"
            }`}>
              {statusMode === "live" ? "🔴 LIVE SCORE" : "🏆 FINAL RESULT"}
            </span>
            <h1 className="text-base font-bold mt-1 tracking-tight">{resultData.tournament_name}</h1>
            <p className="text-[10px] text-slate-400">📅 {resultData.event_date} | 📍 {resultData.course_name}</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-yellow-400">Par {resultData.par}</div>
            <div className="text-[9px] text-slate-400 font-semibold">{resultData.hadicap_rule}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* PART 1: กระดานตารางผู้นำ */}
        <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white font-semibold text-center">
                <th className="p-3 w-12">{statusMode === "live" ? "Pos" : "Rank"}</th>
                <th className="p-3 text-left">Player</th>
                {statusMode === "live" ? (
                  <>
                    <th className="p-3 w-16">To Par</th>
                    <th className="p-3 w-16">Holes</th>
                  </>
                ) : (
                  <>
                    <th className="p-3 w-14">Gross</th>
                    <th className="p-3 w-14">Net</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-center font-bold text-slate-700">
              {resultData.results.map((p: any) => {
                const mockToPar = p.rank === 1 ? "-1" : p.rank === 2 ? "E" : `+${p.rank - 1}`;
                const mockToParColor = mockToPar.startsWith("-") ? "bg-red-100 text-red-800" : mockToPar === "E" ? "bg-slate-100 text-slate-800" : "bg-blue-100 text-blue-800";

                return (
                  <tr key={p.user_id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-mono text-slate-500 align-middle">{p.rank}</td>
                    
                    <td className="p-3 text-left align-middle">
                      {statusMode === "live" ? (
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <span>🏌️‍♂️</span>
                          <span className="truncate max-w-[110px]">{p.name}</span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            fetchPlayerScoreCard(p.user_id, p.name);
                            setSelectedPlayerSummary(p); // 💾 แฝงเก็บสัญญานข้อมูล Rank, Gross, Net ประจำตัวดีดพ่วงเข้าโมดอลล่าง
                            setIsMobileModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer flex items-center gap-1 text-left"
                        >
                          <span>🏌️‍♂️</span>
                          <span className="truncate max-w-[110px]">{p.name}</span>
                        </button>
                      )}
                    </td>

                    {statusMode === "live" ? (
                      <>
                        <td className="p-3 align-middle">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${mockToParColor}`}>
                            {mockToPar}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 font-mono align-middle">14/18</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 align-middle text-gray-500 font-medium">{p.gross}</td>
                        <td className="p-3 align-middle text-emerald-600 font-black">{p.net}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {statusMode !== "live" && (
          <div className="text-center p-3 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-medium text-[11px]">
            💡 เลื่อนและเลือกคลิกที่รายชื่อนักกอล์ฟด้านบน เพื่อเปิดตรวจใบจดคะแนน 1-18 หลุมตรงนี้ได้ทันทีครับป๋า
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* โมดอลเต็มจอใบแต้มโหมดมือถือ / เดสก์ท็อปวิวเดี่ยว (อัปเกรดข้อมูล Header สมบูรณ์แบบ) */}
      {/* ---------------------------------------------------- */}
      {statusMode !== "live" && isMobileModalOpen && activeScoreCard && selectedPlayerSummary && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 block animate-slide-up">
          {/* แผงปุ่มปิดวินัยส่วนบน */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-3">
            <span className="text-[10px] bg-slate-100 text-slate-600 font-black px-2 py-0.5 rounded">
              GOLF-TD WEB PLATFORM
            </span>
            <button 
              onClick={() => setIsMobileModalOpen(false)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-gray-500 cursor-pointer"
            >
              ปิดหน้าต่าง ✕
            </button>
          </div>

          {/* 🏆 สลักกระดานข้อมูลรวมความเสถียรตามเป้าหมายของป๋าปู (เบ็ดเสร็จในใบเดียว) */}
          <ScoreCardTable 
            cardData={activeScoreCard} 
            tournamentInfo={{
              name: resultData.tournament_name,
              date: resultData.event_date,
              course: resultData.course_name
            }}
            playerInfo={selectedPlayerSummary}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 🛠️ SUB-COMPONENT: ตารางแสดงคะแนนรายหลุม 1-18 หลุม (ฉบับขยายอาณาเขตดีไซน์พ่นหัวสวยงาม)
 */
function ScoreCardTable({ cardData, tournamentInfo, playerInfo }: any) {
  return (
    <div className="space-y-3">
      {/* การ์ดสรุปผลงานระดับมาสเตอร์แบบสมบูรณ์ถาวร (แคปภาพอวดในไลน์ได้ทันที) */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 shadow-md">
        <p className="text-[10px] font-bold text-emerald-400 tracking-wider">⛳ {tournamentInfo.course}</p>
        <h3 className="text-base font-black text-white tracking-tight mt-0.5">{tournamentInfo.name}</h3>
        <p className="text-[9px] text-slate-400">📅 Competition Date: {tournamentInfo.date}</p>
        
        {/* แผงกริดแสดงสถิติประชากรฟีลด์ทองคำ */}
        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-800/60 p-2 rounded-lg">
            <p className="text-[9px] text-slate-400 font-medium">Rank</p>
            <p className="text-sm font-black text-amber-400">#{playerInfo.rank}</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg col-span-1">
            <p className="text-[9px] text-slate-400 font-medium">Player</p>
            <p className="text-xs font-bold text-slate-200 truncate">{cardData.player_name}</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg">
            <p className="text-[9px] text-slate-400 font-medium">Gross</p>
            <p className="text-sm font-black text-slate-200">{playerInfo.gross}</p>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-lg bg-emerald-950/40 border border-emerald-900/40">
            <p className="text-[9px] text-emerald-400 font-bold">Net Score</p>
            <p className="text-sm font-black text-emerald-400">{playerInfo.net}</p>
          </div>
        </div>
      </div>

      {/* ตัวตารางแสดงสถิติรูดเลื่อน 18 หลุมความสูงอิสระ */}
      <div className="overflow-y-auto max-h-80 border border-gray-100 rounded-xl shadow-inner pr-0.5 scrollbar-thin">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead className="bg-slate-100 text-slate-700 font-bold sticky top-0 z-10">
            <tr className="text-center">
              <th className="p-2.5 text-left pl-4">Hole Number</th>
              <th className="p-2.5 w-20">Par</th>
              <th className="p-2.5 bg-blue-50 text-blue-900 w-24">Stroke</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-semibold text-slate-600 text-center">
            {cardData.hole_scores.map((h: any) => (
              <tr key={h.hole_no} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-2.5 text-left pl-4 text-gray-400 font-bold">Hole {h.hole_no}</td>
                <td className="p-2.5 font-mono">{h.par}</td>
                <td className="p-2.5 bg-blue-50/30 text-blue-700 font-black text-xs">{h.stroke}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}