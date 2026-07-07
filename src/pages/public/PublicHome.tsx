// src/pages/public/PublicHome.tsx

/**
 * 🎯 หน้าแรกสุดฝั่งสาธารณะ (Public Site Landing Page)
 */
export default function PublicHome() {
  return (
    <div className="max-w-md mx-auto my-8 text-center space-y-6 px-4">
      <div className="space-y-2">
        <div className="text-5xl">⛳</div>
        <h1 className="text-2xl font-extrabold text-blue-900 tracking-tight">GOLF-TD PLATFORM</h1>
        <p className="text-xs text-gray-500">ระบบบริหารจัดการแข่งขันกอล์ฟและบันทึกแต้มสดดิจิทัลระดับอุตสาหกรรม</p>
      </div>
      
      <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 text-left shadow-inner">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-3">📢 Public Announcement</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          ยินดีต้อนรับสู่ระบบจำลองโครงหน้าบ้าน แฟลตฟอร์มนี้รองรับระบบประมวลผลผู้นำสด (Live Leaderboard) สำหรับบุคคลทั่วไปเปิดเข้าชมได้ฟรีโดยไม่ต้องล็อกอินในอนาคต
        </p>
      </div>

      <div className="text-[11px] text-gray-400 font-medium">
        สัจจะโครงการพัฒนาด้วยความลื่นไหลร่วมกับป๋าปูและเจ็มคุง 😊
      </div>
    </div>
  );
}