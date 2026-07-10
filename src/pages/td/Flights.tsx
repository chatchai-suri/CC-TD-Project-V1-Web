// src/pages/td/Flights.tsx

import { useEffect, useState } from "react";
import { useGolfStore } from "../../store/useGolfStore";
import Swal from "sweetalert2"; // 👈 ดึงระบบเตือนภัยสากลนิยมมาครอบด่านเซฟตี้

/**
 * 🎯 วัตถุประสงค์หลัก: หน้าจอจัดสรรก๊วน (Group Members Assignment) สิทธิ์ TD
 * เพิ่ม Action ปุ่มลบผู้เล่นท้ายแถว (Option 2) ครอบสัญญาน Safe Guard ด้วย SweetAlert2[cite: 10]
 */
function Flights() {
  const flights = useGolfStore((state: any) => state.currentFlight);
  const fetchFlightDetails = useGolfStore((state: any) => state.fetchFlightDetails);
  const updatePlayerField = useGolfStore((state: any) => state.updatePlayerField);
  const addMemberToFlight = useGolfStore((state: any) => state.addMemberToFlight);
  const addGroupToFlight = useGolfStore((state: any) => state.addGroupToFlight);
  const deleteMemberFromFlight = useGolfStore((state: any) => state.deleteMemberFromFlight); // 👈 ดึงปุ่มลบจากสโตร์
  const saveFlightSetup = useGolfStore((state: any) => state.saveFlightSetup);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSelectTarget, setActiveSelectTarget] = useState<any>(null);

  const mockUserDatabase = [
    { id: 101, name: "Doraemon" },
    { id: 102, name: "Charmy" },
    { id: 103, name: "Pikachu" },
    { id: 104, name: "Son Goku" },
    { id: 105, name: "Gem-Kung" },
    { id: 106, name: "Caddy No.9" }
  ];

  useEffect(() => {
    fetchFlightDetails();
  }, [fetchFlightDetails]);

  /**
   * 🔀 ฟังก์ชันคุมระบบด่านเซฟตี้ปุ่มลบ (Safe Guard Confirm via SweetAlert2)
   * @param {string} flightId - ไอดีก๊วนกอล์ฟ
   * @param {number} userId - ไอดีผู้เล่น
   * @param {string} playerName - ชื่อผู้เล่นเพื่อแสดงบนป๊อปอัป
   */
  const handleDeleteClick = (flightId: string, userId: number, playerName: string) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: `คุณแน่ใจไหมที่จะลบ ${playerName} ออกจากก๊วนนี้?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444", // สีแดงดุดัน
      cancelButtonColor: "#64748b",
      confirmButtonText: "ใช่, ลบออกเลย!",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      // 1. กรณีผู้ใช้งานกดปุ่มยืนยันสีแดง ให้รันคำสั่งลบออกจากความทรงจำ Zustand ทันที
      if (result.isConfirmed) {
        deleteMemberFromFlight(flightId, userId);
      }
    });
  };

  const handleSelectPlayer = (user: any) => {
    if (activeSelectTarget) {
      const { flightId, userId } = activeSelectTarget;
      updatePlayerField(flightId, userId, "name", user.name);
      setIsModalOpen(false);
    }
  };

  if (isLoading) return <div className="text-center p-8 text-gray-500">กำลังประมวลผลระบบจัดก๊วนกอล์ฟ...</div>;

  return (
    <div className="p-4 w-full max-w-5xl mx-auto pb-12">
      {/* ส่วนหัวหน้าจอส่วนกลาง + ปุ่ม Save อยู่บริเวณ Header มองเห็นตลอดเวลา */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            🏌️‍♂️ Group Members Assignment
          </h2>
          <p className="text-xs text-gray-500 mt-1">จัดสรรกลุ่มผู้เล่น, บทบาทแคดดี้คีย์แต้ม และตรวจสอบประวัติต่อแต้ม</p>
        </div>
        <button 
          onClick={saveFlightSetup}
          className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold text-xs shadow-md hover:bg-slate-900 active:scale-95 transition-all"
        >
          💾 Save Flight Assignment
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. โหมดหน้าจอ COMPUTER (Desktop View: ตารางสากลนิยม)  */}
      {/* ---------------------------------------------------- */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-4 w-1/4">Group / Time / Hole</th>
              <th className="p-4 w-2/4">Player / Role / Delete</th>
              <th className="p-4 w-1/4">Handicap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {flights?.map((flight: any) => (
              <tr key={flight.id} className="align-top hover:bg-slate-50/30 transition-colors">
                {/* กลุ่มข้อมูลร่วม */}
                <td className="p-4 border-r border-gray-100">
                  <h4 className="font-bold text-slate-900 text-base">{flight.group_name}</h4>
                  <p className="text-xs text-gray-500 mt-1">⏱️ {flight.teeoff_time}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">⛳ {flight.start_hole}</p>
                  <button 
                    onClick={() => addMemberToFlight(flight.id)}
                    className="mt-4 px-2 py-1 bg-slate-100 border border-gray-200 rounded-md text-[11px] font-bold text-slate-700 block hover:bg-slate-200"
                  >
                    ➕ Add Member (ในก๊วน)
                  </button>
                </td>
                
                {/* ข้อมูลบุคคลจำเป็น + ปุ่มลบ Option 2 ท้ายช่อง Role */}
                <td className="p-4 border-r border-gray-100">
                  <div className="space-y-3">
                    {flight.players.map((p: any, idx: number) => (
                      <div key={p.user_id} className="flex items-center gap-2 py-1">
                        <span className="text-sm font-bold text-slate-400 w-4">{idx + 1}.</span>
                        
                        <div 
                          onClick={() => {
                            setActiveSelectTarget({ flightId: flight.id, userId: p.user_id });
                            setIsModalOpen(true);
                          }}
                          className="px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-slate-50/50 hover:bg-white hover:border-slate-400 cursor-pointer w-44 font-medium text-slate-800 transition-all truncate"
                        >
                          {p.name || <span className="text-gray-300">คลิกเลือกผู้เล่น...</span>}
                        </div>

                        <select
                          value={p.role}
                          onChange={(e) => updatePlayerField(flight.id, p.user_id, "role", e.target.value)}
                          className="px-1 py-1 text-xs border border-gray-200 rounded-md bg-white font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="GOLFER">GOLFER</option>
                          <option value="SCORER">SCORER</option>
                        </select>

                        {/* 🗑️ ปุ่มลบเวอร์ชันเดสก์ท็อป เสียบถัดออกไปจากช่อง Role ทันที */}
                        <button
                          onClick={() => handleDeleteClick(flight.id, p.user_id, p.name)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors text-xs font-bold"
                          title="ลบผู้เล่นคนนี้ออกจากก๊วน"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </td>

                {/* ข้อมูล Handicap */}
                <td className="p-4">
                  <div className="space-y-3">
                    {flight.players.map((p: any) => (
                      <div key={p.user_id} className="flex items-center gap-2 py-1">
                        <span className="text-xs text-gray-400 font-semibold">HC:</span>
                        <input 
                          type="number" 
                          value={p.handicap}
                          onChange={(e) => updatePlayerField(flight.id, p.user_id, "handicap", parseInt(e.target.value) || 0)}
                          className="px-2 py-1 text-sm border border-gray-200 rounded-md bg-slate-50/50 text-center focus:bg-white focus:outline-none w-16 font-bold text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. โหมดหน้าจอมือถือ (Mobile View: หดกล่องชื่อเพิ่มช่องลบ) */}
      {/* ---------------------------------------------------- */}
      <div className="block md:hidden space-y-4">
        {flights?.map((flight: any) => (
          <div key={flight.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-slate-100 p-3 flex justify-between items-center border-b border-gray-200">
              <span className="font-bold text-slate-800">{flight.group_name}</span>
              <div className="flex gap-3 text-xs text-gray-600 font-medium">
                <span>⏱️ {flight.teeoff_time}</span>
                <span className="text-emerald-600 font-bold">⛳ {flight.start_hole}</span>
              </div>
            </div>

            <div className="p-3 space-y-4 divide-y divide-gray-100">
              {flight.players.map((p: any, idx: number) => (
                <div key={p.user_id} className="pt-3 first:pt-0 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs font-bold text-gray-400">{idx + 1}.</span>
                      {/* 📱 หดขนาดกล่องชื่อลงมาเหลือความกว้างกําลังดีตามแผนผังป๋าปู */}
                      <div 
                        onClick={() => {
                          setActiveSelectTarget({ flightId: flight.id, userId: p.user_id });
                          setIsModalOpen(true);
                        }}
                        className="px-2 py-1 text-sm border border-gray-200 rounded-md bg-slate-50 text-slate-800 w-28 max-w-[120px] font-semibold cursor-pointer truncate"
                      >
                        {p.name}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <select
                        value={p.role}
                        onChange={(e) => updatePlayerField(flight.id, p.user_id, "role", e.target.value)}
                        className="px-1 py-1 text-xs border border-gray-200 rounded-md bg-white font-bold text-slate-700"
                      >
                        <option value="GOLFER">GOLFER</option>
                        <option value="SCORER">SCORER</option>
                      </select>

                      {/* 🗑️ ปุ่มลบในโหมดมือถือ เสียบข้างช่อง Role อย่างสวยงามลื่นไหลสายตา */}
                      <button
                        onClick={() => handleDeleteClick(flight.id, p.user_id, p.name)}
                        className="p-1 bg-red-50 text-red-500 rounded-md text-xs font-bold border border-red-100"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <span className="text-gray-500">Handicap:</span>
                    <input 
                      type="number" 
                      value={p.handicap}
                      onChange={(e) => updatePlayerField(flight.id, p.user_id, "handicap", parseInt(e.target.value) || 0)}
                      className="px-2 py-0.5 border border-gray-200 rounded-md bg-slate-50 text-center w-14 font-bold"
                    />
                  </div>
                </div>
              ))}

              <button 
                onClick={() => addMemberToFlight(flight.id)}
                className="w-full py-2 mt-2 text-xs bg-slate-50 border border-dashed border-gray-300 rounded-lg font-bold text-slate-600 hover:bg-slate-100"
              >
                ➕ Add Member (+เพิ่มสมาชิกในก๊วนนี้)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ปุ่ม Add Group ด้านล่างสุดของตารางก๊วน */}
      <div className="mt-4 flex justify-center">
        <button 
          onClick={addGroupToFlight}
          className="w-full md:w-auto px-8 py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
        >
          ➕ Add Group (เพิ่มกลุ่มแข่งขันใหม่)
        </button>
      </div>

      {/* Modal ยูสเซอร์ดรอปลิสต์เลือกชื่อผู้เล่น */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800">📋 เลือกรายชื่อนักกอล์ฟในระบบ</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            </div>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {mockUserDatabase.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectPlayer(user)}
                  className="p-3 border border-gray-100 rounded-xl bg-slate-50 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 cursor-pointer transition-all"
                >
                  🏌️‍♂️ {user.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;