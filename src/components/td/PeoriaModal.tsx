// src/components/PeoriaModal.tsx
import { useState, useEffect } from "react";
import { useGolfStore } from "../../store/useGolfStore";

interface PeoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: any;
  onConfirmCloseMatch: (selectedHoles: number[]) => void;
}

export default function PeoriaModal({
  isOpen,
  onClose,
  tournament,
  onConfirmCloseMatch
}: PeoriaModalProps) {
  const [selectedHoles, setSelectedHoles] = useState<number[]>([]);
  
  // 🎯 ดึงข้อมูล Master Holes (Par & Index) จาก Store กลาง
  const courseHoles = useGolfStore((state: any) => state.courseHoles) || [];

  useEffect(() => {
    if (isOpen && tournament) {
      if (tournament.peoria_holes) {
        const existing = typeof tournament.peoria_holes === "string"
          ? tournament.peoria_holes.split(",").map(Number).filter((n: number) => n > 0)
          : Array.isArray(tournament.peoria_holes) ? tournament.peoria_holes : [];
        
        if (existing.length === 12) {
          setSelectedHoles(existing);
          return;
        }
      }
      setSelectedHoles([]);
    }
  }, [isOpen, tournament]);

  if (!isOpen) return null;

  const outHoles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const inHoles = [10, 11, 12, 13, 14, 15, 16, 17, 18];

  const selectedOutCount = selectedHoles.filter((h) => h <= 9).length;
  const selectedInCount = selectedHoles.filter((h) => h > 9).length;

  const toggleHole = (holeNo: number) => {
    if (selectedHoles.includes(holeNo)) {
      setSelectedHoles(selectedHoles.filter((h) => h !== holeNo));
    } else {
      const isOut = holeNo <= 9;
      if (isOut && selectedOutCount >= 6) return;
      if (!isOut && selectedInCount >= 6) return;
      setSelectedHoles([...selectedHoles, holeNo]);
    }
  };

  const handleAutoSelect = () => {
    const shuffle = (array: number[]) => [...array].sort(() => Math.random() - 0.5);
    const randomOut = shuffle(outHoles).slice(0, 6);
    const randomIn = shuffle(inHoles).slice(0, 6);
    setSelectedHoles([...randomOut, ...randomIn].sort((a, b) => a - b));
  };

  // ดึงค่า Par ประจำหลุม
  const getHolePar = (holeNo: number) => {
    const found = courseHoles.find((h: any) => Number(h.hole_no) === holeNo);
    if (found && found.par) return found.par;
    return (holeNo === 2 || holeNo === 7 || holeNo === 11 || holeNo === 15) ? 5 : (holeNo === 3 || holeNo === 5 || holeNo === 8 || holeNo === 13 || holeNo === 17) ? 3 : 4;
  };

  const isReadyToSubmit = selectedOutCount === 6 && selectedInCount === 6;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col text-slate-800">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b mb-3">
          <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
            🎲 สุ่มจับฉลาก 12 หลุมลับ (Peoria-DMN)
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xs cursor-pointer">✕</button>
        </div>

        {/* Action Button: Auto Select */}
        <button
          onClick={handleAutoSelect}
          className="w-full py-2 mb-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
        >
          🎲 สุ่มจับฉลากอัตโนมัติ (Auto Peoria-DMN)
        </button>

        <div className="space-y-3 overflow-y-auto pr-1">
          {/* OUT Section */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black text-slate-700">⛳ ฝั่ง OUT (หลุม 1-9)</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${selectedOutCount === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                เลือก {selectedOutCount}/6
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {outHoles.map((h) => {
                const isSelected = selectedHoles.includes(h);
                const par = getHolePar(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleHole(h)}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-purple-700 text-white border-purple-800 shadow-sm scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-black leading-tight">{h}</span>
                    <span className={`text-[8px] font-bold ${isSelected ? "text-purple-200" : "text-slate-400"}`}>P{par}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* IN Section */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-black text-slate-700">⛳ ฝั่ง IN (หลุม 10-18)</span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${selectedInCount === 6 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                เลือก {selectedInCount}/6
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {inHoles.map((h) => {
                const isSelected = selectedHoles.includes(h);
                const par = getHolePar(h);
                return (
                  <button
                    key={h}
                    onClick={() => toggleHole(h)}
                    className={`py-1.5 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? "bg-purple-700 text-white border-purple-800 shadow-sm scale-105"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xs font-black leading-tight">{h}</span>
                    <span className={`text-[8px] font-bold ${isSelected ? "text-purple-200" : "text-slate-400"}`}>P{par}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-2 pt-3 mt-2 border-t">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-xs cursor-pointer"
          >
            ยกเลิก
          </button>
          <button
            disabled={!isReadyToSubmit}
            onClick={() => onConfirmCloseMatch(selectedHoles)}
            className={`flex-1 py-2 font-black rounded-xl text-xs shadow-sm transition-all ${
              isReadyToSubmit
                ? "bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            🔒 ยืนยันปิดแมตช์
          </button>
        </div>

      </div>
    </div>
  );
}