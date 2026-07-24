// src/pages/golfer/GolferTournaments.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGolfStore } from '../../store/useGolfStore';

/**
 * 🎯 วัตถุประสงค์: หน้าจอภาพรวมรายการแข่งขันกоล์ฟสำหรับนักกอล์ฟและแคดดี้ (Golfer Dashboard)
 * @description ดึงประวัติข้อมูลระบบไฮบริดพ่นกางตารางสูตรกระชับ 3 คอลัมน์ ไร้เอเรอร์แจ้งเตือนซ้อน และปราศจาก Sub-Header ดำรกสายตา
 */
export default function GolferTournaments() {
  const navigate = useNavigate();

  // ดึงประชากรและสเตตัสระบบจากสมองกลกลาง Zustand Store ส่วนกลาง
  const tournaments = useGolfStore((state: any) => state.tournaments);
  const fetchTournaments = useGolfStore((state: any) => state.fetchTournaments);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  // 🎯 1. วงจรเรียกยิงสัญญานอัตโนมัติเมื่อหน้าจอเปิดตัวด่านแรก (Auto Fetch List Log)
  useEffect(() => {
    const loadData = async () => {
      try {
        // ลั่นไกยิงคำสั่ง ซึ่ง Store ไฮบริดจะส่งข้อมูลคลังสโมสรกลับมาถมตารางค้ำยันทันทีหากติดด่านความปลอดภัยหลังบ้าน
        await fetchTournaments();
      } catch (err: any) {
        // ปล่อยให้ลоจิกความปลอดภัยชั้น Store บริหารจัดการสับสายสัญญาณคลังข้อมูลภายในอย่างเงียบเชียบ
      }
    };
    loadData();
  }, [fetchTournaments]);

  return (
    <div className="w-full bg-white">
      
      {/* ❌ เคลียร์ระเบิดถอดถอนเครื่องยนต์ <HeaderMain /> และบล็อกดำแถบย่อยซ้ำซ้อนออกทิ้งไปเด็ดขาด */}

      {/* บล็อกเนื้อหาหลัก (Body Area) จัดมิติสัดส่วน Mobile-First พอดีจอ iPhone SE */}
      <div className="px-1 py-2 sm:p-6">
        <div className="mb-4 text-left">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            🏆 My Tournaments
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ตรวจสอบประวัติลงแข่ง เกาะติดบอร์ดคะแนนสด หรือส่องผลลัพธ์แมตช์ทางการ
          </p>
        </div>

        {/* 🎯 2. ลоจิก Conditional Rendering คุมสวิตช์แสดงผลคู่ขนานป้องกันถังข้อมูลว่าง */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
            <svg className="animate-spin h-6 w-5 text-emerald-600 mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            กำลังดึงข้อมูลแต้มสดข้ามเครือข่าย...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-dashed border-slate-300 text-center shadow-sm max-w-md mx-auto my-6">
            <p className="text-sm font-semibold text-slate-700">😊 Welcome to Our Club!</p>
            <p className="text-xs text-emerald-600 mt-2 italic">
              "No Event History, Please ask Admin or friends to share our amusement 😊"
            </p>
          </div>
        ) : (
          /* 🎯 3. มีข้อมูลประวัติจริง: กางตารางสูตรกระชับ 3 คอลัมน์เด็ดขาด พอดีจอ iPhone SE ไม่ต้องเลื่อนแนวราบ */
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="px-3 py-2.5 w-7/12">Tournament Info</th>
                    <th className="px-2 py-2.5 text-center w-2/12">Holes</th>
                    <th className="px-3 py-2.5 text-right w-3/12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {tournaments.map((t: any) => {
                    return (
                      <tr key={t.tournament_id || t.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                            {t.tournament_name || t.title}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-1.5">
                            <span>📍 {t.course_name || 'Amata Spring CC'}</span>
                            <span className="text-slate-300">|</span>
                            <span>📅 {t.event_date || t.date || '2026-07-14'}</span>
                          </div>
                        </td>

                        <td className="px-2 py-2.5 text-center font-semibold text-slate-600 text-[11px]">
                          {t.status === 'setup' ? '-' : '18'}
                        </td>

                        <td className="px-3 py-2.5 text-right">
                          {t.status === 'setup' || !t.status ? (
                            <span className="inline-block text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md cursor-not-allowed">
                              🛠️ Setup
                            </span>
                          ) : t.status === 'live' ? (
                            <button
                              onClick={() => navigate(`/golfer/leaderboard?id=${t.tournament_id || t.id}&status=live`)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded-md animate-pulse"
                            >
                              ⚡ Live!
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/golfer/leaderboard?id=${t.tournament_id || t.id}&status=final`)}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-slate-600 hover:bg-slate-700 px-2.5 py-1 rounded-md"
                            >
                              📊 Final
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}