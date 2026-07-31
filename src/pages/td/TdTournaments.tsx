// src/pages/td/TdTournament.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";
import { STATUS_STYLES, PRIMARY_BTN_STYLE } from "../../utils/statusStyles";
import Swal from "sweetalert2";

// นำเข้า Modals
import AdminUserModal from "../../components/AdminUserModal";
import { RegisterTournamentModal } from "../../components/td/RegisterTournamentModal";
import { EditTournamentModal } from "../../components/td/EditTournamentModal";

/**
 * 🎯 หน้ารายการแข่งขันสำหรับบทบาทสิทธิ์ TD 
 * @description R3 Architecture: ปุ่มคู่ Context-Aware Action ควบคุมสถานะแมตช์ (SETUP, LIVE, FINAL)
 */
function TdTournaments() {

  // state management จาก Zustand Store ส่วนกลาง
  const tournaments = useGolfStore((state: any) => state.tournaments || []);
  const fetchTournaments = useGolfStore((state: any) => state.fetchTournaments);
  const updateMatchStatus = useGolfStore((state: any) => state.updateMatchStatus);
  const isLoading = useGolfStore((state: any) => state.isLoading);
  const courses = useGolfStore((state: any) => state.courses || []);
  const fetchCourses = useGolfStore((state: any) => state.fetchCourses);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchTournaments) fetchTournaments();
    if (fetchCourses) fetchCourses(); // 👈 ดึงรายชื่อสนามจาก DB จริง
  }, [fetchTournaments, fetchCourses]);

  // 🔔 ฟังก์ชันจัดการสลับสถานะแมตช์ พ่วง SweetAlert2
  const handleStatusSwitch = async (matchId: string, currentMatchName: string, targetStatus: string) => {
    const statusTitles: Record<string, string> = {
      live: "🔵 เปิดสนามการแข่งขัน (Go LIVE)",
      setup: "🟢 ถอยกลับไปตั้งหลักจัดก๊วน (To SETUP)",
      finalToLive: "🔓 ปลดล็อกแก้ไขคะแนน (To LIVE)"
    };

    const result = await Swal.fire({
      title: "ยืนยันการเปลี่ยนสถานะ?",
      html: `<span class="text-xs">ต้องการสลับสถานะแมตช์ <b class="text-blue-600">${currentMatchName}</b><br/>เป็น <b>${statusTitles[targetStatus] || targetStatus}</b> หรือไม่?</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0f172a",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "ยืนยันเปลี่ยนสถานะ",
      cancelButtonText: "ยกเลิก",
      customClass: { popup: "rounded-2xl text-xs", title: "text-sm font-bold" }
    });

    if (result.isConfirmed) {
      const nextStatus = targetStatus === "finalToLive" ? "live" : targetStatus;
      if (updateMatchStatus) {
        await updateMatchStatus(matchId, nextStatus);
      }

      Swal.fire({
        title: "เปลี่ยนสถานะสำเร็จ!",
        text: `สลับสถานะเป็น ${nextStatus.toUpperCase()} เรียบร้อยแล้ว`,
        icon: "success",
        timer: 1300,
        showConfirmButton: false,
        customClass: { popup: "rounded-2xl" }
      });
    }
  };

  if (isLoading) return <div className="text-center py-16 text-slate-500 font-bold text-xs animate-pulse">🔄 กำลังมุดอุโมงค์ข้อมูลแมตช์ TD...</div>;

  return (
    <div className="w-full bg-white text-slate-900 font-sans px-1 text-[11px] min-h-[600px] flex flex-col justify-between">
      
      <div>
        {/* 🧱 ส่วนที่ 1: หัวข้อรายการ พร้อมปุ่มควบคุม */}
        <div className="mb-3 border-b border-slate-100 pb-2 space-y-2 shrink-0">
          
          {/* บรรทัดบน: Title & Subtitle */}
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              🏆 Tournament Panel (TD Role)
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              จัดการก๊วนกอล์ฟ และควบคุมสถานะแมตช์การแข่งขัน
            </p>
          </div>

          {/* บรรทัดล่าง: ปุ่ม Action คู่ขนาน เรียงแนวนอน 2 คอลัมน์ กดง่าย ได้บาลานซ์ */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span>➕ สร้างรายการใหม่</span>
            </button>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="h-8 bg-purple-700 hover:bg-purple-800 text-white font-black text-[11px] rounded-lg shadow-xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1"
            >
              <span>👥 จัดการผู้เล่น</span>
            </button>
          </div>

        </div>
        
        {tournaments.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-dashed border-slate-300 text-center shadow-sm max-w-sm mx-auto my-4">
            <p className="text-xs text-amber-600 font-bold">No Event History 🌟</p>
          </div>
        ) : (
          /* 🧱 ส่วนที่ 2: รายการแมตช์ */
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-0.5 scrollbar-thin">
            {tournaments.map((t: any) => {
              const currentMatchId = t.tournament_id || t.id;
              const currentMatchName = t.tournament_name || t.title || "แมตช์แข่งขันทางการ";
              const currentStatus = (t.status || "setup").toLowerCase();
              const statusConfig = STATUS_STYLES[currentStatus] || STATUS_STYLES.setup;

              return (
                <div key={currentMatchId} className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 shadow-sm transition-all">
                  
                  {/* บรรทัดบน: ชื่อแมตช์ + Badge และปุ่มแก้ไข */}
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="text-left min-w-0 flex-1">
                      <h3 className="font-black text-slate-800 text-xs leading-tight truncate">{currentMatchName}</h3>
                      {/* 📍 สนาม + 📅 วันที่ แบบกระชับ ไม่แตกบรรทัดล้น */}
                      <div className="flex items-center text-[10px] text-slate-500 mt-0.5 font-medium min-w-0 space-x-1">
                        <span className="truncate flex-1">
                          📍 {t.course?.course_name || t.course_name || t.courseTitle || "-"}
                        </span>
                        <span className="shrink-0">
                          | 📅 {t.event_date ? new Date(t.event_date).toISOString().split('T')[0] : "2026-07-20"}
                        </span>
                      </div>
                    </div>
                    
                    {/* ฝั่งขวา: Badge สถานะ และปุ่มแก้ไขอยู่ต่อกันด้านล่าง */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2 py-0.5 text-[9px] rounded-md font-black tracking-wider uppercase border ${statusConfig.badge}`}>
                        ● {statusConfig.label}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTournament(t);
                          setIsEditOpen(true);
                        }}
                        className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-md text-[10px] font-bold transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-0.5"
                      >
                        ✏️ แก้ไข
                      </button>
                    </div>
                  </div>

                  {/* บรรทัดล่าง: ปุ่มคู่ Context-Aware Action Pair */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                    
                    {/* 🟢 ปุ่มซ้าย: Action สลับสเตตัสตามเงื่อนไข State Machine */}
                    {currentStatus === "setup" && (
                      <button
                        onClick={() => handleStatusSwitch(currentMatchId, currentMatchName, "live")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all active:scale-95 shadow-sm ${STATUS_STYLES.live.button}`}
                      >
                        🚀 เปิดสนาม (Go LIVE)
                      </button>
                    )}

                    {currentStatus === "live" && (
                      <button
                        onClick={() => handleStatusSwitch(currentMatchId, currentMatchName, "setup")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all active:scale-95 shadow-sm ${STATUS_STYLES.setup.button}`}
                      >
                        🟢 ถอยตั้งหลัก (To SETUP)
                      </button>
                    )}

                    {currentStatus === "final" && (
                      <button
                        onClick={() => handleStatusSwitch(currentMatchId, currentMatchName, "finalToLive")}
                        className={`px-2.5 py-1 text-[10px] rounded-lg font-bold transition-all active:scale-95 shadow-sm ${STATUS_STYLES.final.button}`}
                      >
                        🔓 ปลดล็อกแก้ไข (To LIVE)
                      </button>
                    )}

                    {/* 🚀 ปุ่มขวา: ปุ่ม Navigate นำทางตามบริบท */}
                    <button
                      onClick={() => {
                        if (currentStatus === "setup") {
                          navigate(`/td/flights?id=${currentMatchId}`);
                        } else {
                          navigate(`/golfer/leaderboard?id=${currentMatchId}`);
                        }
                      }}
                      className={`px-2.5 py-1 text-[10px] shrink-0 ${PRIMARY_BTN_STYLE}`}
                    >
                      {currentStatus === "setup" ? "⚙️ จัดก๊วน (Flights)" : "📊 ดูบอร์ดผู้นำ"}
                    </button>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 📋 MODAL WINDOWS */}
      <AdminUserModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <RegisterTournamentModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        courses={courses} // 👈 ส่งข้อมูลสนามจริงจาก DB
      />

      <EditTournamentModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        tournament={selectedTournament}
        courses={courses} // 👈 ส่งข้อมูลสนามจริงจาก DB
      />

      {/* 📄 Responsive Footer */}
      <footer className="mt-4 pt-2 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium shrink-0">
        <p>Copyright © 2026 Chatchai Suriyawan. All rights reserved.</p>
      </footer>

    </div>
  );
}

export default TdTournaments;