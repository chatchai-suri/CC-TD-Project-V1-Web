// src/pages/golfer/GolferScorecard.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";
import { apiService } from "../../utils/apiService";

const REAL_COURSE_PAR = [4, 3, 4, 4, 5, 4, 3, 4, 5, 4, 5, 3, 4, 4, 4, 4, 3, 4];

export default function GolferScorecard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tournamentId = searchParams.get("id") || "5";
  const userId = Number(searchParams.get("userId")) || 0;
  const playerName = searchParams.get("name") || "นักกอล์ฟ";
  const statusMode = searchParams.get("status") || "final";

  const tournamentResult = useGolfStore((state: any) => state.tournamentResult);
  const activeScoreCard = useGolfStore((state: any) => state.activeScoreCard);

  // 💡 State ท้องถิ่นเก็บข้อมูลคะแนนดิบรายหลุม
  const [directHoles, setDirectHoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 🎯 ยิงตรงเข้าท่อ API /api/v1/user/scorecard/:userId
  useEffect(() => {
    const fetchDirectScorecard = async () => {
      if (!userId) return;
      setIsLoading(true);
      try {
        const res = await apiService.get(`/user/scorecard/${userId}?tournament_id=${tournamentId}`);
        if (res.data && res.data.success && Array.isArray(res.data.hole_scores)) {
          setDirectHoles(res.data.hole_scores);
        }
      } catch (err) {
        // Fallback ใช้ข้อมูลจาก Zustand Store หาก Direct Fetch มีปัญหา
        const storeHoles = activeScoreCard?.hole_scores || activeScoreCard || [];
        setDirectHoles(Array.isArray(storeHoles) ? storeHoles : []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectScorecard();
  }, [userId, tournamentId]);

  const playerResult = tournamentResult?.leaderboard?.find((r: any) => Number(r.user_id) === userId);

  // 💡 แมปสโตรกดิบจาก DB ให้ตรงล็อกหลุม 1-18 แบบเป๊ะ 100%
  const fullHoles = Array.from({ length: 18 }, (_, i) => {
    const holeNo = i + 1;
    const found = directHoles.find((h: any) => Number(h.hole_no) === holeNo);

    const strokeValue = found ? Number(found.strokes ?? found.stroke ?? 0) : 0;
    const parValue = found && found.par ? Number(found.par) : REAL_COURSE_PAR[i];

    return { 
      hole_no: holeNo, 
      par: parValue, 
      stroke: strokeValue 
    };
  });

  const outHoles = fullHoles.slice(0, 9);
  const inHoles = fullHoles.slice(9, 18);

  const calculateTotal = (holesList: any[], field: 'stroke' | 'par') => {
    return holesList.reduce((acc, curr) => acc + (Number(curr[field]) || 0), 0);
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1 text-[11px]">
      
      {/* ปุ่มกลับกระดานผู้นำ */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
        <button
          onClick={() => navigate(`/golfer/leaderboard?id=${tournamentId}&status=${statusMode}`)}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          ⬅️ กลับกระดานผู้นำ
        </button>
        <span className="text-[10px] bg-emerald-600 text-white font-black px-2 py-0.5 rounded shadow-sm">
          📸 OFFICIAL SCORECARD
        </span>
      </div>

      {/* บล็อกข้อมูลผู้เล่น */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-2.5 border border-slate-200 mb-3 text-left shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block">⛳ DIGITAL SCORECARD</span>
            <h3 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{tournamentResult?.tournament_name || "Papoo Alpha Championship 2026"}</h3>
          </div>
          <div className="bg-amber-500 text-slate-950 rounded-md px-2 py-0.5 text-center shrink-0 font-black shadow-sm">
            <span className="text-[10px] font-mono">Rank #{playerResult?.rank || "-"}</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 border-t border-slate-200/60 pt-1.5 font-semibold">
          <div className="truncate">👤 Player: <strong className="text-blue-700 font-bold">{playerName}</strong></div>
          <div className="truncate">📍 Course: <strong className="text-slate-900">Amata Spring CC</strong></div>
          <div className="truncate">📋 System: <strong className="text-slate-900">Peoria-DMN</strong></div>
        </div>
      </div>

      {/* ตารางแสดงแต้ม OUT / IN */}
      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          🔄 กำลังดึงใบคะแนนรายหลุมข้ามเครือข่าย...
        </div>
      ) : (
        <div className="space-y-2">
          
          {/* OUT (หลุม 1-9) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-center border-collapse table-fixed text-[10px]">
              <thead>
                <tr className="bg-slate-900 text-white font-bold font-mono">
                  <th className="py-1 border-r border-slate-800 text-left px-1.5 w-[45px]">OUT</th>
                  {outHoles.map((_, i) => (
                    <th key={i} className="border-r border-slate-800 py-1">#{i + 1}</th>
                  ))}
                  <th className="py-1 bg-emerald-800 text-white w-[35px]">TOT</th>
                </tr>
              </thead>
              <tbody className="font-mono font-bold divide-y divide-slate-100 text-[10px]">
                <tr className="bg-slate-50 text-slate-500">
                  <td className="py-1 border-r border-slate-200 text-left px-1.5">PAR</td>
                  {outHoles.map((h: any, i: number) => <td key={i} className="border-r border-slate-200">{h.par}</td>)}
                  <td className="bg-emerald-50 text-emerald-900">{calculateTotal(outHoles, 'par')}</td>
                </tr>
                <tr className="bg-white text-slate-900">
                  <td className="py-1 border-r border-slate-200 text-left px-1.5 text-purple-600 font-sans font-black">SCORE</td>
                  {outHoles.map((h: any, i: number) => {
                    const strokeVal = Number(h.stroke) || 0;
                    const parVal = Number(h.par) || 4;
                    const diff = strokeVal ? strokeVal - parVal : 0;
                    const cellBg = strokeVal === 0 ? "text-slate-300" : diff < 0 ? "bg-red-50 text-red-600 font-black" : diff > 0 ? "bg-blue-50 text-blue-600 font-black" : "text-slate-900 font-bold";
                    return <td key={i} className={`border-r border-slate-200 py-1 ${cellBg}`}>{strokeVal || "-"}</td>;
                  })}
                  <td className="bg-slate-900 text-yellow-400 font-black">{calculateTotal(outHoles, 'stroke') || playerResult?.out_gross}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* IN (หลุม 10-18) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-center border-collapse table-fixed text-[10px]">
              <thead>
                <tr className="bg-slate-900 text-white font-bold font-mono">
                  <th className="py-1 border-r border-slate-800 text-left px-1.5 w-[45px]">IN</th>
                  {inHoles.map((_, i) => (
                    <th key={i} className="border-r border-slate-800 py-1">#{i + 10}</th>
                  ))}
                  <th className="py-1 bg-emerald-800 text-white w-[35px]">TOT</th>
                </tr>
              </thead>
              <tbody className="font-mono font-bold divide-y divide-slate-100 text-[10px]">
                <tr className="bg-slate-50 text-slate-500">
                  <td className="py-1 border-r border-slate-200 text-left px-1.5">PAR</td>
                  {inHoles.map((h: any, i: number) => <td key={i} className="border-r border-slate-200">{h.par}</td>)}
                  <td className="bg-emerald-50 text-emerald-900">{calculateTotal(inHoles, 'par')}</td>
                </tr>
                <tr className="bg-white text-slate-900">
                  <td className="py-1 border-r border-slate-200 text-left px-1.5 text-purple-600 font-sans font-black">SCORE</td>
                  {inHoles.map((h: any, i: number) => {
                    const strokeVal = Number(h.stroke) || 0;
                    const parVal = Number(h.par) || 4;
                    const diff = strokeVal ? strokeVal - parVal : 0;
                    const cellBg = strokeVal === 0 ? "text-slate-300" : diff < 0 ? "bg-red-50 text-red-600 font-black" : diff > 0 ? "bg-blue-50 text-blue-600 font-black" : "text-slate-900 font-bold";
                    return <td key={i} className={`border-r border-slate-200 py-1 ${cellBg}`}>{strokeVal || "-"}</td>;
                  })}
                  <td className="bg-slate-900 text-yellow-400 font-black">{calculateTotal(inHoles, 'stroke') || playerResult?.in_gross}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* สรุปผลรวม GROSS / HD / NET */}
          <div className="bg-slate-900 text-white rounded-xl p-2.5 flex justify-between items-center px-3 font-sans shadow-inner shrink-0">
            <div className="flex gap-2 text-[10px]">
              <span>GROSS: <strong className="text-yellow-400 font-mono font-black">{playerResult?.total_gross || calculateTotal(fullHoles, 'stroke')}</strong></span>
            </div>
            <div className="text-[10px] text-right font-semibold">
              <span>HD: <strong className="text-amber-400 font-mono font-bold">{playerResult?.handicap || 0}</strong></span>
              <span className="ml-2">NET: <strong className="text-emerald-400 font-mono font-black">{playerResult?.net || 0}</strong></span>
            </div>
          </div>

        </div>
      )}

      <p className="text-[8px] text-slate-400 text-center mt-3 tracking-tight">
        * Certified Digital Scorecard - Powered by GOLF-TD Platform 2026
      </p>

    </div>
  );
}