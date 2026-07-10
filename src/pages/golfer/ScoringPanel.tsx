// src/pages/golfer/ScoringPanel.tsx
import { useState } from "react";

/**
 * 🎯 วัตถุประสงค์หลัก: แผงบันทึกคะแนนสดสำหรับแคดดี้และ Scorer (Scoring Panel Professional Grade)
 * 🛠️ ซ่อมแซม: เคลียร์อักษรขยะบรรทัด 97 ดับไฟแดง, กางแผง 4 ผู้เล่นด้านบนตาม Option 3 
 * และบีบรังผึ้งเหลือ 6 คอลัมน์จบกระชับพื้นที่ในหน้าจอ iPhone SE 100%
 */
export default function ScoringPanel() {
  const [selectedHole, setSelectedHole] = useState<number>(1);
  const [stroke, setStroke] = useState<number | null>(null); // 🧠 เริ่มต้นเป็นนัล (ขีดลอย) เพื่อดักสติป้องการเผลอเซฟแต้มหลุด

  // 🔀 💡 วิธีทดสอบระบบสิทธิ์ดักจับ (Read-Only Guard):
  // สับเปลี่ยนค่าตรงนี้เพื่อทดสอบ: สลัก "SCORER" = แคดดี้คีย์ได้ปกติ | สลัก "GOLFER" = นักกอล์ฟอ่านได้อย่างเดียว แก้ไขไม่ได้
  const mockUserRole = "GOLFER"; 

  // 🧠 คลังความทรงจำจำลองรายชื่อสมาชิกที่ร่วมเดินทางในก๊วนเดียวกัน (Max 6 Players - Option 3)
  const [players, setPlayers] = useState<any[]>([
    { user_id: 101, name: "Nobita", nickname: "โนบิ", current_stroke: null },
    { user_id: 102, name: "Shizuka", nickname: "ชิซู", current_stroke: null },
    { user_id: 103, name: "Gian", nickname: "ไจแอน", current_stroke: null },
    { user_id: 104, name: "Suneo", nickname: "ซูเนะ", current_stroke: null },
  ]);

  // ตัวแปรไอดีผู้เล่นหลักที่ระบบกำลังเลือกคีย์แต้มคาจอ
  const [activePlayerId, setActivePlayerId] = useState<number>(101);

  // คลังข้อมูลจำลองคะแนนที่เคยจดไปแล้ว เพื่อนำมาแปะวงเล็บตรวจสอบความโปร่งใสรายหลุม [4] บนรังผึ้ง (Option B)
  const [savedScores, setSavedScores] = useState<{ [key: string]: number }>({
    "101_1": 4, "101_2": 3, "101_3": 5,
    "102_1": 5, "102_2": 3, "102_3": 4,
    "103_1": 4, "103_2": 4, "103_3": 6,
    "104_1": 4, "104_2": 2, "104_3": 5,
  });

  const mockHolePars: { [key: number]: number } = {
    1: 4, 2: 3, 3: 4, 4: 4, 5: 5, 6: 4, 7: 3, 8: 4, 9: 5,
    10: 4, 11: 4, 12: 3, 13: 5, 14: 4, 15: 4, 16: 3, 17: 4, 18: 5
  };

  const currentPar = mockHolePars[selectedHole] || 4;
  const activePlayer = players.find(p => p.user_id === activePlayerId);

  // 🔀 ฟังก์ชันคุมวาล์วสลับชื่อผู้เล่นคีย์แต้มยกก๊วน (ดึงแต้มเก่าขึ้นมาพรูฟถ้าเคยบันทึกไว้)
  const handlePlayerSwitch = (playerId: number) => {
    setActivePlayerId(playerId);
    const scoreKey = `${playerId}_${selectedHole}`;
    const previousScore = savedScores[scoreKey];
    
    setPlayers(prev => prev.map(p => 
      p.user_id === playerId ? { ...p, current_stroke: previousScore || null } : p
    ));
  };

  // 🔀 ฟังก์ชันสลับหลุมจดคะแนนอิสระ
  const handleHoleSwitch = (holeNo: number) => {
    setSelectedHole(holeNo);
    const scoreKey = `${activePlayerId}_${holeNo}`;
    const previousScore = savedScores[scoreKey];

    setPlayers(prev => prev.map(p => 
      p.user_id === activePlayerId ? { ...p, current_stroke: previousScore || null } : p
    ));
  };

  // ➕➖ ปุ่มเครื่องยนต์เพิ่มลดสโตรกแต้มหนา
  const handleStrokeAdjustment = (action: "inc" | "dec") => {
    if (mockUserRole === "GOLFER") return; // ดักเซฟตี้สิทธิ์ผู้เล่นทั่วไปห้ามขยับตัวเลข
    
    const currentStroke = activePlayer?.current_stroke;
    let baseStroke = currentStroke !== null ? currentStroke : currentPar;

    if (action === "inc") baseStroke += 1;
    if (action === "dec") baseStroke = Math.max(1, baseStroke - 1);

    setPlayers(prev => prev.map(p => 
      p.user_id === activePlayerId ? { ...p, current_stroke: baseStroke } : p
    ));
  };

  // 💾 สั่งบันทึกข้อมูลสกอร์ลงหน่วยความจำ
  const handleSaveScore = () => {
    if (activePlayer?.current_stroke === null || mockUserRole === "GOLFER") return;
    
    const scoreKey = `${activePlayerId}_${selectedHole}`;
    setSavedScores(prev => ({ ...prev, [scoreKey]: activePlayer.current_stroke }));
    
    alert(`บันทึกคะแนนหลุม ${selectedHole} ของคุณ ${activePlayer.name} สำเร็จกริบเรียบร้อยครับป๋า!`);
  };

  return (
    // 💡 คุม Gap ความสูงรอบด้านด้วย space-y-2.5 เพื่อกระชับ Layout บนหน้าจอ iPhone SE
    <div className="max-w-md mx-auto p-3 space-y-2.5 pb-12 text-xs animate-fade-in select-none">
      
      {/* ---------------------------------------------------- */}
      {/* 1. ส่วนหัวคุมงานก๊วนและแผงสลับชื่อผู้เล่นร่วมเดินทาง (Option 3 กางแผงครบก๊วน) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-slate-950 text-white p-3 rounded-xl shadow-md border border-slate-900">
        <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
          ✍️ SCORER GROUP MATRIX (OPTION 3)
        </span>
        <h1 className="text-[10px] font-bold text-slate-400 mt-1">📍 Alpine Golf Club | Flight A</h1>
        
        {/* แผงปุ่มรายชื่อสมาชิกสี่คนกางแผ่แนวราบ กดสลับคนคีย์ได้ทันทีไม่ต้องย้ายหน้าต่าง */}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          {players.map((p) => {
            const isSelected = p.user_id === activePlayerId;
            const hasHoleScore = savedScores[`${p.user_id}_${selectedHole}`] !== undefined;

            return (
              <button
                key={p.user_id}
                onClick={() => handlePlayerSwitch(p.user_id)}
                className={`p-2 rounded-lg border font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white shadow-xs"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <div className="truncate">
                  <p className="text-[10px] font-black truncate">👑 {p.name}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full ${hasHoleScore ? "bg-emerald-400" : "bg-slate-600"}`}></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. แผงควบคุมบวก-ลบสเกลหนา ป้องกันการเผลอเซฟ (Giant Stroke Controller) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <div>
            <span className="text-sm font-black text-slate-800">หลุมแข่งขันที่ {selectedHole}</span>
            <span className="text-[10px] text-gray-400 block font-semibold">สนามกำหนด: Par {currentPar}</span>
          </div>
          <div className="text-right">
            {activePlayer?.current_stroke !== null ? (
              <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                activePlayer.current_stroke < currentPar ? "bg-red-50 text-red-600" : activePlayer.current_stroke === currentPar ? "bg-slate-50 text-slate-600" : "bg-blue-50 text-blue-600"
              }`}>
                {activePlayer.current_stroke - currentPar === 0 ? "Even" : activePlayer.current_stroke - currentPar < 0 ? `${activePlayer.current_stroke - currentPar}` : `+${activePlayer.current_stroke - currentPar}`}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full font-bold text-[9px] bg-amber-50 text-amber-600">Pending</span>
            )}
          </div>
        </div>

        {/* ปุ่มเครื่องยนต์กดสโตรกบวก-ลบ */}
        <div className="flex items-center justify-between py-1.5 px-4 bg-slate-50 rounded-xl border border-gray-100">
          <button
            onClick={() => handleStrokeAdjustment("dec")}
            disabled={mockUserRole === "GOLFER"}
            className="w-12 h-14 bg-white text-slate-800 rounded-xl text-xl font-black shadow-xs border border-gray-200 active:scale-90 transition-all cursor-pointer flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed select-none"
          >
            -
          </button>
          
          <div className="text-center">
            {activePlayer?.current_stroke !== null ? (
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tight block">{activePlayer?.current_stroke}</span>
            ) : (
              <span className="text-2xl font-black text-slate-300 font-mono tracking-tight block">-</span>
            )}
            <span className="text-[9px] text-gray-400 font-bold block">
              {activePlayer?.current_stroke !== null ? "STROKES" : "กรุณาใส่คะแนน"}
            </span>
          </div>

          <button
            onClick={() => handleStrokeAdjustment("inc")}
            disabled={mockUserRole === "GOLFER"}
            className="w-12 h-14 bg-slate-900 text-white rounded-xl text-xl font-black shadow-sm active:scale-90 transition-all cursor-pointer flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed select-none"
          >
            +
          </button>
        </div>

        {/* ปุ่มเซฟแปลงโฉมตามระเบียบตรวจสอบบทบาทผู้ใช้งานขาเข้า */}
        <button
          onClick={handleSaveScore}
          disabled={activePlayer?.current_stroke === null || mockUserRole === "GOLFER"}
          className={`w-full py-3 text-white text-xs font-black rounded-xl transition-all shadow-xs ${
            mockUserRole === "GOLFER"
              ? "bg-slate-100 text-slate-400 border border-gray-200 cursor-not-allowed"
              : activePlayer?.current_stroke !== null
              ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer active:scale-[0.99]"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {mockUserRole === "GOLFER"
            ? "🔒 โหมดอ่านอย่างเดียว (Read-Only) ผู้เล่นแก้ไขไม่ได้"
            : activePlayer?.current_stroke !== null
            ? `💾 บันทึกคะแนนของ ${activePlayer.name} (Save)`
            : `⚠️ กรุณากด +/- เพื่อใส่ stroke count ก่อนบันทึก`}
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. ตารางรังผึ้งบีบอัดความกว้าง 6 คอลัมน์ (Compact 6-Cols Grid Layout) */}
      {/* ---------------------------------------------------- */}
      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        <span className="font-black text-slate-700 block mb-2 pl-0.5 text-[11px]">
          🏁 ทวนสอบคะแนนรายหลุม (Score Audit Matrix):
        </span>
        
        {/* 💡 หักมุมจัดเรียงคอลัมน์ใหม่เป็น grid-cols-6 จบครบ 18 หลุมในความสูงเพียง 3 แถวแนวราบพอดีเป๊ะ */}
        <div className="grid grid-cols-6 gap-1">
          {Array.from({ length: 18 }, (_, i) => i + 1).map((h) => {
            const isSelected = selectedHole === h;
            const pastStroke = savedScores[`${activePlayerId}_${h}`];

            return (
              <button
                key={h}
                onClick={() => handleHoleSwitch(h)}
                className={`py-1.5 rounded-lg font-bold transition-all border text-center cursor-pointer flex flex-col justify-between items-center h-10 ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 scale-95 font-black"
                    : "bg-slate-50 text-slate-700 border-gray-100 hover:bg-slate-100"
                }`}
              >
                <span className="text-[9px] font-medium opacity-75">{h}</span>
                <span className={`text-[10px] font-black ${isSelected ? "text-yellow-300" : "text-blue-600"}`}>
                  {pastStroke !== undefined ? pastStroke : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}