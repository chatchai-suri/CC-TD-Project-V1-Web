// src/pages/td/Flights.tsx
import { useEffect, useState } from "react";
import { useGolfStore } from "../../store/useGolfStore";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

/**
 * 🎯 วัตถุประสงค์หลัก: หน้าจอจัดสรรก๊วนและสมาชิกผู้เล่น (Group Members Assignment) สิทธิ์ TD
 * @description ดึงรายชื่อนักกอล์ฟตัวจริงจากตาราง users ใน DB ขึ้น Modal จิ้มเลือก รองรับการเพิ่ม/ลบ/จัดก๊วน บันทึกลง MySQL
 */
function Flights() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 📥 แกะรอยรหัสทัวร์นาเมนต์ตัวจริงจาก URL Query (ดีฟอลต์เป็น id=5)
  const tournamentId = searchParams.get("id") || "5";

  // 🧠 ดึง Actions และ State จาก Zustand Store
  const flights = useGolfStore((state: any) => state.currentFlight || []);
  const userList = useGolfStore((state: any) => state.userList || []);
  const fetchFlightDetails = useGolfStore(
    (state: any) => state.fetchFlightDetails
  );
  const fetchUserList = useGolfStore((state: any) => state.fetchUserList);
  const updatePlayerField = useGolfStore(
    (state: any) => state.updatePlayerField
  );
  const addMemberToFlight = useGolfStore(
    (state: any) => state.addMemberToFlight
  );
  const addGroupToFlight = useGolfStore((state: any) => state.addGroupToFlight);
  const deleteMemberFromFlight = useGolfStore(
    (state: any) => state.deleteMemberFromFlight
  );
  const saveFlightSetup = useGolfStore((state: any) => state.saveFlightSetup);
  const tournamentResult = useGolfStore((state: any) => state.tournamentResult);
  const isLoading = useGolfStore((state: any) => state.isLoading);
  const deleteFlightGroup = useGolfStore(
    (state: any) => state.deleteFlightGroup
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSelectTarget, setActiveSelectTarget] = useState<any>(null);

  // 🎯 เรียกยิงสัญญานดึงข้อมูลก๊วน และคลังรายชื่อผู้เล่นจาก DB จริงทันทีเมื่อกางหน้าจอ
  useEffect(() => {
    if (fetchFlightDetails && tournamentId) {
      fetchFlightDetails(tournamentId);
    }
    if (fetchUserList) {
      fetchUserList();
    }
  }, [tournamentId, fetchFlightDetails, fetchUserList]);

  const handleDeleteClick = (
    flightId: any,
    userId: number,
    playerName: string
  ) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `ต้องการถอดคุณ ${playerName} ออกจากก๊วนนี้ใช่ไหม?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ใช่, ถอดออก!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed && deleteMemberFromFlight) {
        deleteMemberFromFlight(flightId, userId);
      }
    });
  };

  const handleSelectPlayer = (user: any) => {
    if (activeSelectTarget && updatePlayerField) {
      const { flightId, targetUserId } = activeSelectTarget;
      updatePlayerField(flightId, targetUserId, "user_id", {
        id: user.user_id,
        name: user.fullname || user.username,
      });
      setIsModalOpen(false);
    }
  };

  const handleAddMemberAction = (flightId: any, currentMemberCount: number) => {
    if (currentMemberCount >= 6) {
      Swal.fire({
        icon: "error",
        title: "ก๊วนเต็ม!",
        text: "ขีดจำกัดสูงสุดไม่เกิน 6 คนต่อ 1 กลุ่มแข่งขันครับป๋า!",
        confirmButtonColor: "#0f172a",
      });
      return;
    }
    addMemberToFlight(flightId);
  };

  const handleSaveAction = async () => {
    try {
      await saveFlightSetup(tournamentId);
      Swal.fire({
        title: "บันทึกสำเร็จ! 💾",
        text: `สลักข้อมูลผังจัดก๊วนของทัวร์นาเมนต์ ID: ${tournamentId} ลงตู้ MySQL เรียบร้อยครับป๋า!`,
        icon: "success",
        confirmButtonColor: "#0f172a",
        confirmButtonText: "รับทราบ, ลุยต่อสนามแข่ง",
      });
    } catch (err: any) {
      Swal.fire({
        title: "บันทึกไม่สำเร็จ",
        text: "กรุณาตรวจสอบว่าเลือกรายชื่อผู้เล่นครบถ้วนแล้วหรือยังครับป๋า!",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  // 🗑️ ฟังก์ชันรับแรงกดลบก๊วนทั้งกลุ่ม
  const handleDeleteFlightGroup = (flightId: any, flightName: string) => {
    Swal.fire({
      title: "ยืนยันการทำลายก๊วน?",
      text: `ต้องการลบกลุ่ม "${flightName}" ออกจากระบบใช่ไหมครับป๋า?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "ใช่, ลบก๊วนนี้ทิ้ง!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed && deleteFlightGroup) {
        try {
          await deleteFlightGroup(flightId);
          Swal.fire({
            icon: "success",
            title: "ลบก๊วนสำเร็จ!",
            text: `ทำลายก๊วน ${flightName} ออกจากระบบเรียบร้อยครับ`,
            confirmButtonColor: "#0f172a",
          });
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "ลบก๊วนล้มเหลว",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-1 text-[11px] max-h-[640px] flex flex-col overflow-hidden">
      {/* แถวควบคุมย้อนกลับระดับสิทธิ์ TD */}
      <div className="px-1 pb-1.5 border-b border-slate-100 flex items-center justify-between shrink-0 mb-1">
        <button
          onClick={() => navigate("/td/tournaments")}
          className="inline-flex items-center gap-0.5 text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          ⬅️ กลับแผงควบคุมหลัก
        </button>
        <span className="text-[8px] bg-slate-900 text-white font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
          T-SETUP MODE
        </span>
      </div>

      {/* SECTION 1: HEADER BLOCK */}
      <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 mb-2 flex justify-between items-center shrink-0 shadow-sm text-left">
        <div>
          <span className="text-[8px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded uppercase tracking-wider block w-max">
            Flight Assignment
          </span>
          <h2 className="text-xs font-black text-slate-900 leading-tight line-clamp-1 mt-0.5">
            🏆{" "}
            {tournamentResult?.tournament_name ||
              "Papoo Alpha Championship 2026"}
          </h2>
          <p className="text-[9px] text-slate-500 font-medium">
            จัดสรรสมาชิกก๊วนกอล์ฟ และกำหนดบทบาทผู้จดแต้มในสนาม
          </p>
        </div>

        <button
          onClick={handleSaveAction}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-black text-[10px] tracking-tight shrink-0 shadow-sm cursor-pointer active:scale-95 transition-all"
        >
          💾 Save Flight
        </button>
      </div>

      {/* 🚦 SECTION 2: DYNAMIC MAIN GRID */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-0.5 pb-2 scrollbar-thin">
        {isLoading ? (
          <div className="text-center py-16 text-slate-400 font-bold text-xs animate-pulse">
            🔄 กำลังเชื่อมสายสัญญาณคลังข้อมูลก๊วน...
          </div>
        ) : flights.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center italic text-slate-400 my-2">
            "ยังไม่มีการลงทะเบียนกลุ่มแข่งขัน
            กดปุ่มเพิ่มกลุ่มด้านล่างเพื่อเริ่มจัดก๊วนได้เลยครับป๋า!"
          </div>
        ) : (
          flights.map((flight: any, fIdx: number) => {
            const currentFlightId = flight.flight_id || flight.id;
            const currentFlightName =
              flight.flight_name ||
              `Group ${fIdx + 1 < 10 ? "0" + (fIdx + 1) : fIdx + 1}`;
            const currentMembers = flight.members || flight.players || [];

            return (
              <div
                key={currentFlightId}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* หัวแถบประจำกลุ่ม พร้อมปุ่ม 🗑️ ลบก๊วนนี้ สิทธิ TD */}
                <div className="bg-slate-900 text-white p-2 flex justify-between items-center text-[10px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="font-black">📋 {currentFlightName}</span>
                    <button
                      onClick={() =>
                        handleDeleteFlightGroup(
                          currentFlightId,
                          currentFlightName
                        )
                      }
                      className="text-[9px] bg-red-600/80 hover:bg-red-600 text-white px-1.5 py-0.5 rounded cursor-pointer transition-all"
                    >
                      🗑️ ลบก๊วนนี้
                    </button>
                  </div>
                  <div className="flex gap-2 font-mono font-semibold text-slate-300 text-[9px]">
                    <span>⏱️ {flight.t_off_time || "08:00"} น.</span>
                    <span className="text-amber-400 font-bold">
                      ⛳ Hole {flight.start_hole || 1}
                    </span>
                  </div>
                </div>

                {/* รายชื่อสมาชิกภายในกลุ่ม */}
                <div className="p-1.5 space-y-1 divide-y divide-slate-100">
                  {currentMembers.map((p: any, idx: number) => {
                    const pName =
                      p.user?.fullname || p.name || "คลิกเลือกรายชื่อ...";
                    const pUserId = p.user_id;
                    const pRole = p.role || "GOLFER";
                    const pHd =
                      p.handicap_claim !== undefined
                        ? p.handicap_claim
                        : p.handicap || 18.0;

                    return (
                      <div
                        key={pUserId || idx}
                        className="pt-1 first:pt-0 flex flex-col gap-1 text-left"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-1">
                            <span className="text-[10px] font-mono font-black text-slate-400 w-3">
                              {idx + 1}.
                            </span>

                            {/* กล่องเลือกนักกอล์ฟ - จิ้มเพื่อเปิด Modal ดึงยูสเซอร์จาก DB */}
                            <div
                              onClick={() => {
                                setActiveSelectTarget({
                                  flightId: currentFlightId,
                                  targetUserId: pUserId,
                                });
                                setIsModalOpen(true);
                              }}
                              className="px-2 py-1 text-[11px] border border-slate-200 rounded-md bg-slate-50 font-black text-slate-800 w-32 max-w-[130px] cursor-pointer truncate shadow-inner hover:bg-amber-50 hover:border-amber-300 transition-all"
                            >
                              🏌️‍♂️ {pName}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {/* สลับบทบาท GOLFER / SCORER */}
                            <select
                              value={pRole}
                              onChange={(e) =>
                                updatePlayerField &&
                                updatePlayerField(
                                  currentFlightId,
                                  pUserId,
                                  "role",
                                  e.target.value
                                )
                              }
                              className="px-1 py-1 text-[10px] border border-slate-200 rounded-md bg-white font-black text-slate-700 cursor-pointer focus:outline-none"
                            >
                              <option value="GOLFER">GOLFER</option>
                              <option value="SCORER">SCORER</option>
                            </select>

                            {/* ปุ่มลบผู้เล่นออกจากก๊วน */}
                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  currentFlightId,
                                  pUserId,
                                  pName
                                )
                              }
                              className="p-1 bg-red-50 text-red-500 hover:bg-red-100 border border-red-100 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 text-[10px] font-semibold text-slate-500 pr-1.5">
                          <span>Handicap Claim:</span>
                          <input
                            type="number"
                            value={pHd}
                            onChange={(e) =>
                              updatePlayerField &&
                              updatePlayerField(
                                currentFlightId,
                                pUserId,
                                "handicap",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="px-1.5 py-0.2 border border-slate-200 rounded-md bg-slate-50 text-center w-12 font-black text-slate-800 focus:bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                    );
                  })}

                  {/* ปุ่มเพิ่มสมาชิกเฉพาะก๊วนนี้ (จำกัด 6 คน) */}
                  <button
                    onClick={() =>
                      handleAddMemberAction(
                        currentFlightId,
                        currentMembers.length
                      )
                    }
                    className="w-full py-1 mt-1.5 text-[9px] bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg font-black text-slate-600 cursor-pointer"
                  >
                    ➕ Add Member (+ เพิ่มคนในกลุ่มนี้ {currentMembers.length}
                    /6)
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* SECTION 3: ADD NEW GROUP BUTTON */}
        <div className="pt-1 px-4 shrink-0">
          <button
            onClick={addGroupToFlight}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            ➕ Add Group (เพิ่มกลุ่มแข่งขันใหม่)
          </button>
        </div>
      </div>

{/* 📋 MODAL WINDOW: ดึงรายชื่อประชากรจากตู้ DB (พร้อมระบบดักจับไม่ให้เลือกคนซ้ำข้ามก๊วน) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-xs font-black text-slate-900">
                📋 เลือกรายชื่อนักกอล์ฟจากตู้ DB
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 scrollbar-thin">
              {userList.map((user: any) => {
                // 🛡️ ด่านตรวจ: เช็กว่า user_id นี้ถูกจัดลงก๊วนใดก๊วนหนึ่งในทัวร์นาเมนต์นี้ไปแล้วหรือยัง?
                const isAlreadySelected = flights.some((f: any) =>
                  (f.members || f.players || []).some(
                    (m: any) => m.user_id === user.user_id
                  )
                );

                return (
                  <div
                    key={user.user_id}
                    onClick={() => !isAlreadySelected && handleSelectPlayer(user)}
                    className={`p-2 border rounded-xl text-[11px] font-black transition-all text-left flex justify-between items-center ${
                      isAlreadySelected
                        ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60" // 🚫 ซ่อนสิทธิ์คนซ้ำเป็นสีเทา
                        : "bg-slate-50 border-slate-100 text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 cursor-pointer"
                    }`}
                  >
                    <span>🏌️‍♂️ {user.fullname || user.username}</span>
                    <span className="text-[9px] font-mono">
                      {isAlreadySelected ? "⛔ เลือกแล้ว" : `ID: ${user.user_id}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;