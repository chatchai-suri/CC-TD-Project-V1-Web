// src/components/PeoriaModal.tsx
import React, { useState } from 'react';

interface HoleInfo {
  hole_no: number;
  par: number;
}

interface PeoriaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (secretHoles: number[]) => void;
  holesData?: HoleInfo[];
}

// 💡 อัปเดตข้อมูล Par จริงจากสนามใน DB (pic6): Par รวม 71 (OUT: 36, IN: 35)
const DEFAULT_HOLES: HoleInfo[] = [
  { hole_no: 1, par: 4 }, { hole_no: 2, par: 3 }, { hole_no: 3, par: 4 },
  { hole_no: 4, par: 4 }, { hole_no: 5, par: 5 }, { hole_no: 6, par: 4 },
  { hole_no: 7, par: 3 }, { hole_no: 8, par: 4 }, { hole_no: 9, par: 5 },
  { hole_no: 10, par: 4 }, { hole_no: 11, par: 5 }, { hole_no: 12, par: 3 },
  { hole_no: 13, par: 4 }, { hole_no: 14, par: 4 }, { hole_no: 15, par: 4 },
  { hole_no: 16, par: 4 }, { hole_no: 17, par: 3 }, { hole_no: 18, par: 4 }
];

export default function PeoriaModal({
  isOpen,
  onClose,
  onSubmit,
  holesData = DEFAULT_HOLES
}: PeoriaModalProps) {
  const [selectedHoles, setSelectedHoles] = useState<number[]>([]);

  if (!isOpen) return null;

  const outHoles = holesData.filter(h => h.hole_no <= 9);
  const inHoles = holesData.filter(h => h.hole_no >= 10);

  const toggleHole = (holeNo: number) => {
    if (selectedHoles.includes(holeNo)) {
      setSelectedHoles(selectedHoles.filter(id => id !== holeNo));
    } else {
      if (selectedHoles.length < 12) {
        setSelectedHoles([...selectedHoles, holeNo]);
      }
    }
  };

  const handleAutoRandomize = () => {
    const pickSection = (sectionHoles: HoleInfo[]) => {
      const par3 = sectionHoles.filter(h => h.par === 3);
      const par4 = sectionHoles.filter(h => h.par === 4);
      const par5 = sectionHoles.filter(h => h.par === 5);

      const shuffle = (array: HoleInfo[]) => [...array].sort(() => 0.5 - Math.random());

      const selectedPar3 = shuffle(par3).slice(0, 1);
      const selectedPar4 = shuffle(par4).slice(0, 4);
      const selectedPar5 = shuffle(par5).slice(0, 1);

      return [...selectedPar3, ...selectedPar4, ...selectedPar5].map(h => h.hole_no);
    };

    const randomOut = pickSection(outHoles);
    const randomIn = pickSection(inHoles);
    setSelectedHoles([...randomOut, ...randomIn].sort((a, b) => a - b));
  };

  const countSelected = (holesList: HoleInfo[]) => {
    const selected = holesList.filter(h => selectedHoles.includes(h.hole_no));
    const totalPar = selected.reduce((sum, h) => sum + h.par, 0);
    const par3Count = selected.filter(h => h.par === 3).length;
    const par4Count = selected.filter(h => h.par === 4).length;
    const par5Count = selected.filter(h => h.par === 5).length;
    
    const isValid = selected.length === 6;

    return { count: selected.length, totalPar, par3Count, par4Count, par5Count, isValid };
  };

  const outStat = countSelected(outHoles);
  const inStat = countSelected(inHoles);
  const isAllValid = outStat.isValid && inStat.isValid && selectedHoles.length === 12;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-[350px] shadow-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-blue-900 text-white p-3 flex justify-between items-center">
          <div>
            <h3 className="font-black text-sm text-amber-400">🎲 สุ่มจับฉลาก 12 หลุมลับ</h3>
            <p className="text-[10px] text-blue-200">กติกา Peoria-DMN System (OUT 6 / IN 6)</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white text-lg font-bold">✕</button>
        </div>

        <div className="p-3 space-y-3 max-h-[80vh] overflow-y-auto">
          
          <button
            onClick={handleAutoRandomize}
            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🎲</span> สุ่มจับฉลากอัตโนมัติ (Auto Peoria-DMN)
          </button>

          {/* ฝั่ง OUT */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-black text-xs text-blue-900">⛳ ฝั่ง OUT (หลุม 1-9)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${outStat.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                เลือก {outStat.count}/6 (Par: {outStat.totalPar})
              </span>
            </div>
            
            <div className="grid grid-cols-9 gap-1">
              {outHoles.map(h => {
                const isSelected = selectedHoles.includes(h.hole_no);
                return (
                  <button
                    key={h.hole_no}
                    onClick={() => toggleHole(h.hole_no)}
                    className={`flex flex-col items-center justify-center py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-700 text-white font-black shadow-sm scale-105'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{h.hole_no}</span>
                    <span className={`text-[8px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>P{h.par}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ฝั่ง IN */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-black text-xs text-blue-900">⛳ ฝั่ง IN (หลุม 10-18)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${inStat.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                เลือก {inStat.count}/6 (Par: {inStat.totalPar})
              </span>
            </div>
            
            <div className="grid grid-cols-9 gap-1">
              {inHoles.map(h => {
                const isSelected = selectedHoles.includes(h.hole_no);
                return (
                  <button
                    key={h.hole_no}
                    onClick={() => toggleHole(h.hole_no)}
                    className={`flex flex-col items-center justify-center py-1 rounded-lg border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600 border-purple-700 text-white font-black shadow-sm scale-105'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-[11px] font-bold">{h.hole_no}</span>
                    <span className={`text-[8px] ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>P{h.par}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <div className="p-3 bg-slate-100 border-t border-slate-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            ยกเลิก
          </button>
          
          <button
            disabled={!isAllValid}
            onClick={() => onSubmit(selectedHoles)}
            className={`flex-1 py-2 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1 ${
              isAllValid
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md active:scale-95 cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <span>🔒</span> ยืนยันปิดแมตช์
          </button>
        </div>

      </div>
    </div>
  );
}