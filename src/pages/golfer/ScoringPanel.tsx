// src/pages/golfer/ScoringPanel.tsx
import { useEffect, useState } from "react";
import { useGolfStore } from "../../store/useGolfStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * 🎯 วัตถุประสงค์: หน้าจอแผงป้อนคะแนนดิบรายหลุม / หน้าจอทวนสอบคะแนนสำหรับผู้เล่นในสนาม
 * @description อัปเกรดนวัตกรรม: 
 * 1. ดึงสโตรกคะแนนเดิมจากฐานข้อมูลมาถมลงแผงอัตโนมัติ แต้มไม่หายเมื่อมุดกลับเข้ามา
 * 2. กดปุ่ม +/- ครั้งแรกดีดแต้มเท่ากับค่า Par ทันทีใน 1 คลิก
 * 3. ปุ่มล้างแต้ม (↺) ล็อกความสูงคงที่ ไม่ดันตารางขึ้น-ลง (No Layout Shift)
 * 4. สีแต้มมาตรฐานกอล์ฟดิจิทัล: Par=ดำ/เทาเข้ม, Over Par=สีแดง, Under Par=สีเขียว
 * 5. ดักจับสิทธิ์ GOLFER ให้กลายเป็นโหมด Read-Only ซ่อนเครื่องมือป้อนแต้มและปุ่มเซฟตามระเบียบสโมสร 100%
 */
export default function ScoringPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔐 Zustand Store Global Hooks & Central State Repository
  const currentFlight = useGolfStore((state: any) => state.currentFlight || []);
  const fetchFlightDetails = useGolfStore((state: any) => state.fetchFlightDetails);
  const saveFlightScores = useGolfStore((state: any) => state.saveFlightScores);
  const tournamentResult = useGolfStore((state: any) => state.tournamentResult);
  const fetchTournamentResult = useGolfStore((state: any) => state.fetchTournamentResult);
  const currentUser = useGolfStore((state: any) => state.currentUser); // 💡 ดึงสิทธิ์มาเช็ค Read-Only
  const isLoading = useGolfStore((state: any) => state.isLoading);

  // 📥 แกะเช็ครหัสแมตช์ขาเข้าจาก URL Parameters
  const tournamentId = searchParams.get("id") || "5";
  const currentStatus = searchParams.get("status") || "live";

  // แกะรหัสสิทธิ์ปัจจุบันของผู้ใช้งานหน้าจอ
  const userRole = currentUser?.global_role || "GUEST";
  const isReadOnlyMode = userRole === "GOLFER"; // 🔒 หากเป็น GOLFER บังคับล็อกห้ามแก้แต้มเด็ดขาด

  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedHoleNo, setSelectedHoleNo] = useState<number>(1); 
  const [flightScoresRepo, setFlightScoresRepo] = useState<Record<number, any[]>>({});

  // 🎯 1. ค้นหาก๊วนและประกาศตัวแปรให้เรียบร้อยก่อนเรียกใช้ใน Effect
  const activeFlight = currentFlight.find((f: any) =>
    (f.members || []).some((m: any) => m.user_id === currentUser?.user_id)
  ) || currentFlight[0];

  const activeFlightId = activeFlight?.flight_id || activeFlight?.id || 12;
  const activeMembers = activeFlight?.members || activeFlight?.players || [];

  // 🎯 2. Effect: เปิดท่อดึงข้อมูลก๊วนจริงและข้อมูลแมตช์แข่งขันตรงพิกัด
  useEffect(() => {
    if (fetchFlightDetails && tournamentId) {
      fetchFlightDetails(tournamentId);
    }
    if (fetchTournamentResult && tournamentId) {
      fetchTournamentResult(tournamentId);
    }
  }, [tournamentId, fetchFlightDetails, fetchTournamentResult]);

  // 🎯 3. Effect: ดึงสโตรกคะแนนเดิมจากฐานข้อมูลมาถมกางตารางสดอัตโนมัติ
  useEffect(() => {
    if (activeMembers.length > 0) {
      const initialRepo: Record<number, any[]> = {};
      
      activeMembers.forEach((p: any) => {
        const uId = p.user_id;
        const userSavedScores = p.user?.scores || p.scores || [];
        
        // สร้าง Map จับคู่ [hole_no -> strokes]
        const scoreMap = new Map<number, number>();
        userSavedScores.forEach((s: any) => {
          const hNo = s.hole?.hole_no || s.hole_no;
          if (hNo) scoreMap.set(Number(hNo), Number(s.strokes));
        });

        initialRepo[uId] = Array.from({ length: 18 }, (_, i) => {
          const holeNo = i + 1;
          const existingStroke = scoreMap.has(holeNo) ? scoreMap.get(holeNo) : null;
          return {
            hole_no: holeNo,
            par: [2, 7, 11, 16].includes(holeNo) ? 3 : [5, 9, 13, 18].includes(holeNo) ? 5 : 4,
            index: holeNo,
            stroke: existingStroke !== undefined && existingStroke !== null ? existingStroke : null
          };
        });
      });

      setFlightScoresRepo(initialRepo);
      if (!selectedPlayerId) {
        setSelectedPlayerId(currentUser?.user_id || activeMembers[0]?.user_id);
      }
    }
  }, [activeFlight, activeMembers, currentUser]);

  const activePlayerScores = selectedPlayerId ? flightScoresRepo[selectedPlayerId] || [] : [];
  const currentActiveHole = activePlayerScores.find(h => h.hole_no === selectedHoleNo);

  const outHoles = activePlayerScores.slice(0, 9);
  const inHoles = activePlayerScores.slice(9, 18);

  /**
   * 🎯 Action: ปรับปรุงกลไกดีดค่า Par ในคลิกเดียว (The Default-to-Par Click Trigger 👑)
   * @description หากแต้มเดิมเป็น null เมื่อกดปุ่มครั้งแรก ระบบจะสตาร์ทแต้มให้เท่ากับค่า Par ของหลุมนั้นทันที
   */
  const handleScoreModify = (direction: "UP" | "DOWN") => {
    if (!selectedPlayerId || isReadOnlyMode) return;
    setFlightScoresRepo(prev => ({
      ...prev,
      [selectedPlayerId]: (prev[selectedPlayerId] || []).map(h => {
        if (h.hole_no === selectedHoleNo) {
          if (h.stroke === null) {
            return { ...h, stroke: h.par }; // คลิกแรกดีดเท่ากับ Par
          }
          return { ...h, stroke: direction === "UP" ? h.stroke + 1 : Math.max(1, h.stroke - 1) };
        }
        return h;
      })
    }));
  };

  /**
   * 🧹 Action: ยกเลิก/ล้างแต้มหลุมนี้กลับเป็น null (-) กรณีคีย์ผิดหลุม
   */
  const handleClearHoleScore = () => {
    if (!selectedPlayerId || isReadOnlyMode) return;
    setFlightScoresRepo(prev => ({
      ...prev,
      [selectedPlayerId]: (prev[selectedPlayerId] || []).map(h => {
        if (h.hole_no === selectedHoleNo) {
          return { ...h, stroke: null };
        }
        return h;
      })
    }));
  };

  /**
   * 🎨 Action: คำนวณสีแต้มตามมาตรฐานกอล์ฟดิจิทัลสากลนิยม
   * Par = สีดำ/เทาเข้ม, Over Par = สีแดง, Under Par = สีเขียวสด
   */
  const getScoreColorClass = (stroke: number | null, par: number, isSelected: boolean) => {
    if (stroke === null) return "text-slate-300";
    if (isSelected) return "bg-purple-600 text-white font-black";

    const diff = stroke - par;
    if (diff === 0) return "text-slate-900 font-bold bg-slate-50"; 
    if (diff > 0) return "text-red-600 font-black bg-red-50";     
    return "text-emerald-600 font-black bg-emerald-50";           
  };

  /**
   * 📊 Action: คำนวณตัวเลขเศษส่วนสัดส่วนความคืบหน้าหลุม (เช่น 4/18)
   */
  const getPlayerProgress = (userId: number) => {
    const scores = flightScoresRepo[userId] || [];
    const completedCount = scores.filter(h => h.stroke !== null).length;
    return { text: `${completedCount}/18`, isDone: completedCount === 18 };
  };

  /**
   * 🚀 Action: ลั่นไกยิงบันทึกสโตรกคะแนนสดลงคลัง MySQL ผ่าน saveFlightScores
   */
  const handleSaveAction = async () => {
    if (isReadOnlyMode) return;

    try {
      const scoresPayload: any[] = [];
      Object.keys(flightScoresRepo).forEach((uIdStr) => {
        const uId = Number(uIdStr);
        const userScores = flightScoresRepo[uId] || [];
        userScores.forEach((s) => {
          if (s.stroke !== null) {
            scoresPayload.push({
              user_id: uId,
              hole_no: s.hole_no,
              stroke: s.stroke
            });
          }
        });
      });

      if (saveFlightScores) {
        await saveFlightScores(activeFlightId, scoresPayload);
      }

      if (fetchTournamentResult) {
        await fetchTournamentResult(tournamentId);
      }

      Swal.fire({
        icon: "success",
        title: "บันทึกแต้มลง DB สำเร็จ! 💾",
        text: `สลักสโตรกคะแนนสดลงคลัง MySQL เรียบร้อยครับป๋า!`,
        confirmButtonColor: "#0f172a",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "บันทึกแต้มล้มเหลว",
        text: "ไม่สามารถส่งสัญญาณบันทึกแต้มลงตู้ MySQL ได้ครับป๋า!",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (isLoading || currentFlight.length === 0) {
    return <div className="w-full text-center py-16 text-slate-500 font-bold text-xs animate-pulse">🔄 กำลังเปิดท่อสัญญาณเรียกก๊วนจริง...</div>;
  }

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1 text-[11px] max-h-[640px]">
      
      {/* 👑 Action 1: แถวปุ่มควบคุมทางนำทางกลับด่วนหัวเพจ (Header Quick Return Link) */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 mb-1.5 shrink-0">
        <button
          onClick={() => navigate(`/golfer/leaderboard?id=${tournamentId}&status=${currentStatus}`)}
          className="inline-flex items-center gap-0.5 text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          ⬅️ กลับกระดานผู้นำ (แมตช์ปัจจุบัน)
        </button>
        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${isReadOnlyMode ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}`}>
          {isReadOnlyMode ? "👁️ VIEW MODE" : "✍️ EDIT MODE"}
        </span>
      </div>

      {/* ส่วนหัวแผงแปรผันป้ายนำทางตามบทบาทสิทธิ์ */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 mb-2">
        <h2 className="text-xs font-black text-slate-900 uppercase">
          {isReadOnlyMode ? "👁️ SCORE VERIFICATION" : "📝 SCORING PANEL (CADDY MODE)"}
        </h2>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded ${isReadOnlyMode ? "bg-blue-600 text-white" : "bg-purple-600 text-white"}`}>
          {isReadOnlyMode ? "VIEWER ONLY" : "SCORER ONLY"}
        </span>
      </div>

      {/* คอนเทนเนอร์บน - Tournament Info */}
      <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-left mb-1.5 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xs font-black text-slate-950 leading-tight line-clamp-1">{tournamentResult?.tournament_name || "Papoo Alpha Championship 2026"}</h3>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">📍 Amata Spring Country Club</p>
          </div>
          <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded animate-pulse">LIVE SCORE</span>
        </div>
      </div>

      {/* บล็อกที่ 1: รายชื่อนักกอล์ฟในก๊วน Grid 2x2 */}
      <div className="bg-slate-900 text-white p-2 rounded-xl mb-1.5 text-left">
        <div className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-1">
          👥 รายชื่อนักกอล์ฟในก๊วน ({activeFlight?.flight_name || "Group 01"})
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {activeMembers.map((p: any) => {
            const uId = p.user_id;
            const pName = p.user?.fullname || p.fullname || p.username || `User ${uId}`;
            const progress = getPlayerProgress(uId);
            const isSelected = selectedPlayerId === uId;
            
            return (
              <button
                key={uId}
                onClick={() => setSelectedPlayerId(uId)}
                className={`py-2 px-2.5 rounded-lg font-black text-xs flex justify-between items-center border transition-all cursor-pointer ${
                  isSelected ? "bg-purple-600 text-white border-purple-400 shadow-md" : "bg-slate-800 text-slate-300 border-slate-700/60"
                }`}
              >
                <span className="truncate max-w-[90px]">👤 {pName}</span>
                <span className={`text-[9px] font-mono px-1 rounded ${
                  progress.isDone 
                    ? "bg-emerald-600 text-white font-black" 
                    : isSelected ? "bg-purple-800 text-purple-200" : "bg-slate-950 text-slate-400"
                }`}>
                  {progress.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🧱 ส่วนที่ 2: เครื่องมือปรับแต่งแต้มสด (ซ่อนสลายร่างหายไปทันทีถ้าหากเป็นสิทธิ์ GOLFER ผู้อ่าน) */}
      {!isReadOnlyMode ? (
        <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-2 mb-2 flex items-center justify-between shadow-sm min-h-[58px]">
          <div className="text-left flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black font-mono text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                คีย์แต้ม หลุม {selectedHoleNo}
              </span>
              {/* ↺ ปุ่มล้างแต้มล็อกความสูงคงที่ ไม่ดันตารางขึ้น-ลง */}
              <button
                onClick={handleClearHoleScore}
                disabled={currentActiveHole?.stroke === null}
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  currentActiveHole?.stroke !== null
                    ? "bg-red-100 hover:bg-red-200 text-red-700 cursor-pointer"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                }`}
              >
                ↺ ล้างแต้ม
              </button>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 font-semibold">
              Par: {currentActiveHole?.par || 4} | HD: {currentActiveHole?.index || 1}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => handleScoreModify("DOWN")}
              className="w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-900 font-black rounded-lg text-base cursor-pointer active:scale-95"
            >
              -
            </button>
            <span className={`w-6 text-center font-mono text-lg font-black ${currentActiveHole?.stroke === null ? "text-slate-300" : "text-slate-950"}`}>
              {currentActiveHole?.stroke === null ? "-" : currentActiveHole?.stroke}
            </span>
            <button
              onClick={() => handleScoreModify("UP")}
              className="w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-lg text-base cursor-pointer active:scale-95"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-100 text-blue-800 p-2 rounded-xl mb-2 text-left font-bold text-[10px]">
          ℹ️ โหมดทวนสอบแต้มสด: คุณกำลังส่องคะแนนในก๊วนแบบป้องกันแก้ไขคะแนนดิบ
        </div>
      )}

      {/* ส่วนที่ 3: ตารางคะแนนแยก OUT / IN แนวตั้งสัมผัสใหญ่ */}
      <div className="space-y-1.5">
        {/* ตาราง OUT */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse table-fixed text-[10px]">
            <thead>
              <tr className="bg-slate-800 text-white font-bold font-mono">
                <th className="py-1 bg-slate-950 border-r border-slate-700 text-left px-1 w-[45px]">OUT</th>
                {outHoles.map((h: any) => (
                  <th key={h.hole_no} onClick={() => setSelectedHoleNo(h.hole_no)} className={`border-r border-slate-700 py-1 cursor-pointer ${selectedHoleNo === h.hole_no ? "bg-purple-600 text-white font-black text-xs" : ""}`}>
                    {h.hole_no}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono font-bold divide-y divide-slate-100 text-[9px]">
              <tr className="bg-slate-50 text-slate-400"><td className="py-0.5 border-r border-slate-200 px-1 text-left">PAR</td>{outHoles.map((h: any) => <td key={h.hole_no} className="border-r border-slate-200 py-0.5">{h.par}</td>)}</tr>
              <tr className="bg-white text-slate-900">
                <td className="py-1 border-r border-slate-200 text-purple-600 px-1 text-left">SCORE</td>
                {outHoles.map((h: any) => {
                  const isSelected = selectedHoleNo === h.hole_no;
                  const cellBg = getScoreColorClass(h.stroke, h.par, isSelected);
                  return (
                    <td
                      key={h.hole_no}
                      onClick={() => setSelectedHoleNo(h.hole_no)}
                      className={`border-r border-slate-200 py-1 cursor-pointer font-black text-[11px] ${cellBg}`}
                    >
                      {h.stroke === null ? "-" : h.stroke}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ตาราง IN */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-center border-collapse table-fixed text-[10px]">
            <thead>
              <tr className="bg-slate-800 text-white font-bold font-mono">
                <th className="py-1 bg-slate-950 border-r border-slate-700 text-left px-1 w-[45px]">IN</th>
                {inHoles.map((h: any) => (
                  <th key={h.hole_no} onClick={() => setSelectedHoleNo(h.hole_no)} className={`border-r border-slate-700 py-1 cursor-pointer ${selectedHoleNo === h.hole_no ? "bg-purple-600 text-white font-black text-xs" : ""}`}>
                    {h.hole_no}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-mono font-bold divide-y divide-slate-100 text-[9px]">
              <tr className="bg-slate-50 text-slate-400"><td className="py-0.5 border-r border-slate-200 px-1 text-left">PAR</td>{inHoles.map((h: any) => <td key={h.hole_no} className="border-r border-slate-200 py-0.5">{h.par}</td>)}</tr>
              <tr className="bg-white text-slate-900">
                <td className="py-1 border-r border-slate-200 text-purple-600 px-1 text-left">SCORE</td>
                {inHoles.map((h: any) => {
                  const isSelected = selectedHoleNo === h.hole_no;
                  const cellBg = getScoreColorClass(h.stroke, h.par, isSelected);
                  return (
                    <td
                      key={h.hole_no}
                      onClick={() => setSelectedHoleNo(h.hole_no)}
                      className={`border-r border-slate-200 py-1 cursor-pointer font-black text-[11px] ${cellBg}`}
                    >
                      {h.stroke === null ? "-" : h.stroke}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ปุ่มลั่นไกเซฟล่างสุด (ซ่อนร่างไปทันทีถ้าหากเป็นสิทธิ์ผู้เล่นคนดู Read-Only) */}
        {!isReadOnlyMode && (
          <div className="pt-0.5 shrink-0">
            <button
              onClick={handleSaveAction}
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl font-black text-xs shadow-md bg-purple-600 hover:bg-purple-700 text-white cursor-pointer active:scale-95 transition-all"
            >
              💾 ยืนยันบันทึกคะแนนก๊วนลงระบบ
            </button>
          </div>
        )}
      </div>

    </div>
  );
}