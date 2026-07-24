// src/pages/golfer/GolferLeaderboard.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";
import PeoriaModal from "../../components/PeoriaModal";
import { apiService } from "../../utils/apiService";
import Swal from "sweetalert2";

export default function GolferLeaderboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const tournamentId = searchParams.get("id") || "5";
  
  const tournamentResult = useGolfStore((state: any) => state.tournamentResult);
  const fetchTournamentResult = useGolfStore((state: any) => state.fetchTournamentResult);
  const isLoading = useGolfStore((state: any) => state.isLoading);
  const currentUser = useGolfStore((state: any) => state.currentUser);

  const [isPeoriaModalOpen, setIsPeoriaModalOpen] = useState(false);

  useEffect(() => {
    if (fetchTournamentResult && tournamentId) {
      fetchTournamentResult(tournamentId);
    }
  }, [tournamentId, fetchTournamentResult]);

  const isLiveMode = tournamentResult?.status === "live";
  const displayLeaderboard = tournamentResult?.leaderboard || [];
  const userRole = currentUser?.global_role || "GUEST";

  const handlePlayerClick = (userId: number, playerName: string) => {
    const matchStatus = tournamentResult?.status || "live"; 
    const currentRole = currentUser?.global_role || "TD"; 

    if (matchStatus === "live" && (currentRole === "SCORER" || currentRole === "GOLFER" || currentRole === "TD")) {
      navigate(`/golfer/scoringPanel?id=${tournamentId}&userId=${userId}&name=${encodeURIComponent(playerName)}&status=${matchStatus}`);
    } else if ((matchStatus === "final" || matchStatus === "close") && currentRole !== "GUEST") {
      navigate(`/golfer/scorecard?id=${tournamentId}&userId=${userId}&name=${encodeURIComponent(playerName)}&status=${matchStatus}`);
    } else if (matchStatus === "setup" && (currentRole === "TD" || currentRole === "ADMIN")) {
      navigate(`/td/flights?id=${tournamentId}`);
    }
  };

  // 🎯 ปรับแก้เฉพาะฟังก์ชัน handleCloseTournament ใน GolferLeaderboard.tsx:

  const handleCloseTournament = async (secretHoles: number[]) => {
    try {
      const res = await apiService.put(`/td/tournaments/${tournamentId}/close`, {
        peoria_holes: secretHoles
      });

      if (res.data && res.data.success) {
        setIsPeoriaModalOpen(false);
        await Swal.fire({
          icon: 'success',
          title: '🏆 ปิดแมตช์การแข่งขันสำเร็จ!',
          text: 'ระบบคำนวณแต้มต่อ Peoria-DMN และสลักอันดับ Net/HD เรียบร้อยแล้วครับ!',
          timer: 2000,
          showConfirmButton: false
        });
        
        // 💡 แก้จุดเด้งหลุด: สั่งดึงข้อมูลบอร์ดใหม่แทนการ reload ทั้งหน้า
        if (fetchTournamentResult) {
          fetchTournamentResult(tournamentId);
        }
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์เพื่อปิดแมตช์ได้ครับป๋า!';
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการปิดแมตช์',
        text: errorMsg
      });
    }
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1">
      {/* ส่วนหัวป้ายนำทาง */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <button
          onClick={() => navigate("/td/tournaments")}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          ⬅️ กลับไปตารางแข่ง
        </button>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
          isLiveMode ? "bg-red-500 text-white animate-pulse" : "bg-emerald-600 text-white"
        }`}>
          {isLiveMode ? "⚡ LIVE SCORE" : "🏆 FINAL SCORE"}
        </span>
      </div>

      {/* 👑 แผงควบคุมสโมสรส่วนพิเศษ */}
      {(userRole === "TD" || userRole === "ADMIN") && isLiveMode && (
        <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-2.5 rounded-2xl flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="text-left">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1">
              <span>👑</span> แผงควบคุมสโมสร (TD Control)
            </span>
            <span className="text-[10px] text-amber-700 block mt-0.5">
              คะแนนครบแล้ว พร้อมจับฉลากหลุมลับคิดแต้มต่อ Peoria-DMN
            </span>
          </div>
          <button
            onClick={() => setIsPeoriaModalOpen(true)}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>🎲</span> สุ่มหลุมลับ
          </button>
        </div>
      )}

      <PeoriaModal
        isOpen={isPeoriaModalOpen}
        onClose={() => setIsPeoriaModalOpen(false)}
        onSubmit={handleCloseTournament}
      />

      {/* บล็อกหัวเรื่องภาพรวมแมตช์ */}
      <div className="mb-4 text-left">
        <h3 className="text-base font-black text-slate-900 tracking-tight line-clamp-1">
          🏆 {tournamentResult?.tournament_name || "Papoo Alpha Championship 2026"}
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
          <span>📍 Amata Spring CC</span>
          <span className="text-slate-300">|</span>
          <span>📅 2026-06-23</span>
        </p>
        
        {/* กล่องเฉลยหลุมลับ */}
        <div className={`mt-2 p-2 rounded-lg border text-left ${isLiveMode ? "bg-slate-50 border-slate-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-[10px] font-bold ${isLiveMode ? "text-slate-500" : "text-amber-800"}`}>
            {isLiveMode ? "🔒 หลุมลับประมวลผล Peoria จะแสดงเมื่อสถานะการแข่งขันจบรอบลงตัว" : "🔍 รายชื่อหลุมลับ Peoria จากฉลากปาร์ตี้เลี้ยงฉลอง"}
          </p>
          <p className="text-xs font-black text-slate-950 mt-0.5 tracking-widest">
            ⛳ หลุมลับ: [ <span className={isLiveMode ? "text-slate-400 font-medium" : "text-amber-900 font-black"}>{tournamentResult?.peoria_hidden_holes || (isLiveMode ? "??, ??, ??, ??, ??, ??" : "1, 3, 5, 11, 14, 16")}</span> ]
          </p>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
          <span className="text-slate-600 font-medium">⛳ Par: <strong className="text-slate-950 font-bold">{tournamentResult?.par || 72}</strong></span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 font-medium">📋 Rule: <strong className="text-slate-950 font-bold">{tournamentResult?.handicap_rule || "Peoria-DMN System"}</strong></span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs animate-pulse">
          🔄 กำลังคำนวณสถิติผู้นำข้ามเครือข่าย...
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider text-center">
                <th className="py-2.5 w-1/12">Pos</th>
                <th className="py-2.5 text-left pl-2 w-4/12">Player Name</th>
                {isLiveMode ? (
                  <>
                    <th className="py-2.5 w-3/12">Holes</th>
                    <th className="py-2.5 w-4/12 bg-red-950 text-red-200 font-black">To Par / G</th>
                  </>
                ) : (
                  <>
                    <th className="py-2.5 w-2/12 text-slate-300">Gross</th>
                    <th className="py-2.5 w-2/12 text-amber-300">HD</th>
                    <th className="py-2.5 w-3/12 bg-emerald-900 text-emerald-200 font-black">NET</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium text-center">
              {displayLeaderboard.map((r: any) => {
                let toParColor = "text-slate-900";
                if (r.total_to_par < 0) toParColor = "text-red-600 font-bold"; 
                if (r.total_to_par > 0) toParColor = "text-blue-600"; 

                return (
                  <tr 
                    key={r.user_id} 
                    onClick={() => handlePlayerClick(r.user_id, r.fullname)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer border-b"
                  >
                    <td className="py-2.5 font-black text-slate-700">
                      {r.rank === 1 ? "🥇 1" : r.rank === 2 ? "🥈 2" : r.rank === 3 ? "🥉 3" : r.rank}
                    </td>
                    
                    <td className="py-2.5 text-left pl-2 flex items-center gap-1.5">
                      <img 
                        src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${r.user_id}`} 
                        alt="avatar" 
                        className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-blue-600 text-xs truncate max-w-[85px] hover:underline">
                          {r.fullname}
                        </div>
                        <div className="text-[8px] text-slate-400 font-normal truncate">
                          {r.nickname || "-"}
                        </div>
                      </div>
                    </td>

                    {isLiveMode ? (
                      <>
                        <td className="py-2.5 font-semibold text-slate-600 text-[11px]">
                          {r.holes_played} / 18
                        </td>
                        <td className="py-2.5 bg-red-50/30">
                          <span className={`block font-black text-xs ${toParColor}`}>
                            {r.display_to_par}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-normal mt-0.5">
                            (G: {r.total_gross})
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2.5 font-bold text-slate-600 text-[11px]">
                          {r.total_gross}
                        </td>
                        <td className="py-2.5 font-bold text-amber-600 text-[11px]">
                          {r.handicap}
                        </td>
                        <td className="py-2.5 bg-emerald-50/50 font-black text-emerald-700 text-xs">
                          {r.net}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-slate-400 text-center mt-4 italic">
        * ระบบคำนวณแต้มต่อ Peoria-DMN (Double Morihiro Naoki) สลักผลทางการ
      </p>

    </div>
  );
}