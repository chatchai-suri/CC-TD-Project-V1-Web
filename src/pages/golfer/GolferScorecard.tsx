// src/pages/golfer/GolferScorecard.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";
import { apiService } from "../../utils/apiService";
import Swal from "sweetalert2";

export default function GolferScorecard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tournamentId = searchParams.get("id") || "10";
  const userId = Number(searchParams.get("userId")) || 0;
  const playerName = searchParams.get("name") || "นักกอล์ฟ";
  const statusMode = searchParams.get("status") || "final";

  const tournamentResult = useGolfStore((state: any) => state.tournamentResult);
  const courseHoles = useGolfStore((state: any) => state.courseHoles) || [];
  const fetchCourseHoles = useGolfStore((state: any) => state.fetchCourseHoles);

  const [directHoles, setDirectHoles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Centralized Master Hydration
  useEffect(() => {
    if (tournamentResult?.course_id && courseHoles.length === 0 && fetchCourseHoles) {
      fetchCourseHoles(tournamentResult.course_id);
    }
  }, [tournamentResult, courseHoles, fetchCourseHoles]);

  // 2. Fetch Scorecard Data แบบ Strict Single Source
  useEffect(() => {
    const fetchDirectScorecard = async () => {
      if (!userId) return;
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const res = await apiService.get(`/user/scorecard/${userId}?tournament_id=${tournamentId}`);
        
        // 🛡️ Fail Explicitly Guard
        if (res.data && res.data.success && Array.isArray(res.data.hole_scores)) {
          setDirectHoles(res.data.hole_scores);
        } else {
          const msg = `⚠️ API Structure Inconsistent: ไม่พบ 'hole_scores' flat array`;
          setErrorMessage(msg);
          Swal.fire({
            icon: 'warning',
            title: 'พบความไม่สอดคล้องของข้อมูล',
            text: `โครงสร้างข้อมูลใบคะแนนของคุณ ${playerName} ไม่ตรงตามมาตรฐานระบบ`,
            confirmButtonText: 'รับทราบ'
          });
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'ไม่สามารถดึงข้อมูลใบคะแนนได้';
        setErrorMessage(`❌ Network Error: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDirectScorecard();
  }, [userId, tournamentId, playerName]);

  const playerResult = tournamentResult?.leaderboard?.find((r: any) => Number(r.user_id) === userId);

  // 🎯 STRICT SINGLE SOURCE MAPPER (แก้ไขเป๊ะตามที่คุณปูวางโครงสร้าง)
  const fullHoles = Array.from({ length: 18 }, (_, i) => {
    const holeNo = i + 1;
    
    // ดึง Master Specs จาก Store กลางเป็นหลัก
    const masterHole = courseHoles.find((m: any) => Number(m.hole_no) === holeNo);
    
    // ดึง Score ตรงจาก Flat Array Response
    const foundScore = directHoles.find((s: any) => Number(s.hole_no) === holeNo);

    // Strict Validation Fallback
    const parValue = masterHole?.par || foundScore?.par || 4;
    const strokeValue = foundScore ? Number(foundScore.strokes ?? foundScore.stroke ?? 0) : 0;

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

  const getCellScoreStyle = (stroke: number, par: number) => {
    if (stroke === 0) return "text-slate-300 font-normal";
    const diff = stroke - par;
    if (diff < 0) return "bg-emerald-50 text-emerald-600 font-black"; 
    if (diff === 0) return "text-slate-900 font-bold";               
    return "bg-rose-50 text-rose-600 font-black";                    
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1 text-[11px]">
      
      {/* Header Back Button */}
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

      {/* Player Header Box */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-2.5 border border-slate-200 mb-3 text-left shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest block">⛳ DIGITAL SCORECARD</span>
            <h3 className="text-xs font-black text-slate-900 leading-tight line-clamp-1">{tournamentResult?.tournament_name || "Amata Alpha Championship 2026"}</h3>
          </div>
          <div className="bg-amber-500 text-slate-950 rounded-md px-2 py-0.5 text-center shrink-0 font-black shadow-sm">
            <span className="text-[10px] font-mono">Rank #{playerResult?.rank || "-"}</span>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 border-t border-slate-200/60 pt-1.5 font-semibold">
          <div className="truncate">👤 Player: <strong className="text-blue-700 font-bold">{playerName}</strong></div>
          <div className="truncate">📍 Course: <strong className="text-slate-900">{tournamentResult?.course_name || "Amata Spring CC"}</strong></div>
          <div className="truncate">📋 System: <strong className="text-slate-900">Peoria-DMN</strong></div>
        </div>
      </div>

      {/* 🚨 FAIL EXPLICITLY */}
      {errorMessage && (
        <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-lg text-left">
          {errorMessage}
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-slate-400 text-xs animate-pulse">
          🔄 กำลังดึงใบคะแนนรายหลุมข้ามเครือข่าย...
        </div>
      ) : (
        <div className="space-y-2">
          
          {/* OUT (Hole 1-9) */}
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
                    const cellStyle = getCellScoreStyle(strokeVal, parVal);
                    return <td key={i} className={`border-r border-slate-200 py-1 ${cellStyle}`}>{strokeVal || "-"}</td>;
                  })}
                  <td className="bg-slate-900 text-yellow-400 font-black">{calculateTotal(outHoles, 'stroke')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* IN (Hole 10-18) */}
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
                    const cellStyle = getCellScoreStyle(strokeVal, parVal);
                    return <td key={i} className={`border-r border-slate-200 py-1 ${cellStyle}`}>{strokeVal || "-"}</td>;
                  })}
                  <td className="bg-slate-900 text-yellow-400 font-black">{calculateTotal(inHoles, 'stroke')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GROSS / HD / NET Summary Box */}
          <div className="bg-slate-900 text-white rounded-xl p-2.5 flex justify-between items-center px-3 font-sans shadow-inner shrink-0">
            <div className="flex gap-2 text-[10px]">
              <span>GROSS: <strong className="text-yellow-400 font-mono font-black">{calculateTotal(fullHoles, 'stroke') || playerResult?.total_gross || 0}</strong></span>
            </div>
            <div className="text-[10px] text-right font-semibold">
              <span>HD: <strong className="text-amber-400 font-mono font-bold">{playerResult?.handicap ?? playerResult?.calculated_hd ?? 0}</strong></span>
              <span className="ml-2">NET: <strong className="text-emerald-400 font-mono font-black">{playerResult?.net ?? playerResult?.calculated_net ?? 0}</strong></span>
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