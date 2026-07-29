// src/components/td/RegisterTournamentModal.tsx

import React, { useState } from "react";
import { useGolfStore } from "../../store/useGolfStore";

interface RegisterTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Array<{ course_id: number; course_name: string }>;
}

export const RegisterTournamentModal: React.FC<RegisterTournamentModalProps> = ({
  isOpen,
  onClose,
  courses,
}) => {
  const { createTournament } = useGolfStore();

  const [formData, setFormData] = useState({
    tournament_name: "",
    event_date: new Date().toISOString().split("T")[0],
    course_id: courses[0]?.course_id || 1,
    tournament_mode: "PEORIA_DMN", // PEORIA_DMN หรือ NO_HD
    use_age_option: false,
  });

  // State สำหรับควบคุม Custom Dropdown เพื่อป้องกันปัญหามุมซ้ายลอย
  const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
  const [isRuleDropdownOpen, setIsRuleDropdownOpen] = useState(false);

  // รายการกติกา Handicap Rule
  const handicapRules = [
    { id: "PEORIA_DMN", label: "🎲 Peoria System (สุ่ม 12 หลุมลับ)" },
    { id: "NO_HD", label: "📊 NO_HD (Gross Only - ไม่คิดแต้มต่อ)" },
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tournament_name.trim()) return;

    await createTournament(formData);
    onClose();
  };

  const selectedCourse = courses.find((c) => c.course_id === formData.course_id) || courses[0];
  const selectedRule = handicapRules.find((r) => r.id === formData.tournament_mode) || handicapRules[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-emerald-400">🏆 สร้างรายการแข่งขันใหม่</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-2xl font-bold w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* ชื่อทัวร์นาเมนต์ */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              ชื่อรายการแข่งขัน <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tournament_name}
              onChange={(e) => setFormData({ ...formData, tournament_name: e.target.value })}
              placeholder="เช่น Singha All Thailand 2026"
              className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* เลือกสนามกอล์ฟ (Custom Accessible Dropdown) */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              สนามแข่งขัน <span className="text-red-400">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setIsCourseDropdownOpen(!isCourseDropdownOpen);
                setIsRuleDropdownOpen(false);
              }}
              className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white text-left flex items-center justify-between focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer text-sm"
            >
              <span className="truncate">⛳ {selectedCourse?.course_name}</span>
              <span className={`transition-transform text-xs text-slate-400 ${isCourseDropdownOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {isCourseDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1">
                {courses.map((course) => (
                  <button
                    key={course.course_id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, course_id: course.course_id });
                      setIsCourseDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      formData.course_id === course.course_id
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-200 hover:bg-slate-700/60"
                    }`}
                  >
                    <span>⛳ {course.course_name}</span>
                    {formData.course_id === course.course_id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* วันที่แข่งขัน */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">วันที่จัดแข่ง</label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* กติกาการคิดแต้มต่อ (Custom Accessible Dropdown) */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              กติกาคิดแต้มต่อ (Handicap Rule)
            </label>
            <button
              type="button"
              onClick={() => {
                setIsRuleDropdownOpen(!isRuleDropdownOpen);
                setIsCourseDropdownOpen(false);
              }}
              className="w-full h-12 px-4 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 font-semibold text-left flex items-center justify-between focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer text-sm"
            >
              <span className="truncate">{selectedRule?.label}</span>
              <span className={`transition-transform text-xs text-amber-400 ${isRuleDropdownOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {isRuleDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1">
                {handicapRules.map((rule) => (
                  <button
                    key={rule.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, tournament_mode: rule.id });
                      setIsRuleDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      formData.tournament_mode === rule.id
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-200 hover:bg-slate-700/60"
                    }`}
                  >
                    <span>{rule.label}</span>
                    {formData.tournament_mode === rule.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ออปชันอายุ */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <span className="text-sm text-slate-300">เปิดใช้ออปชันคำนวณช่วงอายุผู้เล่น</span>
            <input
              type="checkbox"
              checked={formData.use_age_option}
              onChange={(e) => setFormData({ ...formData, use_age_option: e.target.checked })}
              className="w-6 h-6 rounded accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-900/40 transition-colors cursor-pointer"
            >
              💾 บันทึกสร้างแมตช์
            </button>
          </div>
        </form>

        {/* 🛡️ Copyright Footer */}
        <div className="mt-6 pt-3 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-sans tracking-wide">
            © 2026 Chatchai Suriyawan • Golf-TD (Beta)
          </p>
        </div>
      </div>
    </div>
  );
};