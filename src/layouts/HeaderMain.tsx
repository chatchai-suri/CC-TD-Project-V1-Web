// src/layouts/HeaderMain.tsx

/**
 * 🎯 ชิ้นส่วนแถบหัวบนสุดของระบบ (Status Bar / Top Header)
 * @param onToggleMenu ฟังก์ชันยิงสัญญาณสลับสถานะ เปิด/ปิด Sidebar บนมือถือ
 * @param user ข้อมูลสถานะและสิทธิ์ของผู้เล่นที่ดึงมาจากระบบ
 */
export default function HeaderMain({ onToggleMenu, user }: any) {
  return (
    <header className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* 🔥 ปุ่ม Hamburger: แสดงผลตลอดเวลาบนจอมือถือ และจะหดซ่อนเมื่อขยายเข้าจอใหญ่ (md:hidden) */}
        <button 
          onClick={onToggleMenu}
          className="p-2 hover:bg-blue-800 rounded-lg transition-colors focus:outline-none md:hidden"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <span className="font-bold text-lg tracking-wider">GOLF-TD</span>
      </div>

      {/* บาร์กล่องข้อมูลโปรไฟล์ผู้ใช้ขวาสุด */}
      <div className="flex items-center gap-2 bg-blue-950 px-3 py-1.5 rounded-full text-sm border border-blue-800/50">
        <span className="text-base">{user.profile_icon}</span>
        <span className="font-medium hidden sm:inline">{user.nickname}</span>
        <span className="bg-yellow-500 text-blue-950 font-bold px-1.5 py-0.2 rounded text-[10px]">
          {user.role}
        </span>
      </div>
    </header>
  );
}