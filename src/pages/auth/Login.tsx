// src/pages/auth/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGolfStore } from "../../store/useGolfStore";
import Swal from "sweetalert2"; // 🛡️ นำเข้าขุมพลังกล่องข้อความพรีเมียมส่วนกลางสโมสร[cite: 9]

/**
 * 🎯 วัตถุประสงค์: หน้าจอเข้าสู่ระบบอัจฉริยะ (Hybrid Failback Login Screen)
 * @description ออกแบบโครงสร้างรองรับ Virtual Keyboard บน iPhone SE โดยปล่อยระนาบเนื้อหายืดดิ่งธรรมชาติ[cite: 14]
 * @param credentials วัตถุข้อมูลรหัสผ่าน { username, password } ส่งเข้าตู้ Zustand store[cite: 1]
 */
export default function Login() {
  const navigate = useNavigate();
  
  // 🧠 ดึง Action ล็อกอินหลัก และสเตตัสการโหลดมาจากสมองกลกลาง Zustand[cite: 1]
  const loginGolfer = useGolfStore((state: any) => state.loginGolfer);
  const isLoading = useGolfStore((state: any) => state.isLoading);

  // 📥 ตัวแปร Local State สำหรับแกะรอยการพิมพ์ช่อง Input ในสมาร์ทโฟน
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  /**
   * 🎯 วัตถุประสงค์: ดักจับคำสั่งการส่งฟอร์มล็อกอิน และประมวลผลระบบหนีไฟกรณีสัญญาณเครือข่ายล่ม
   */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🛡️ ด่านตรวจความปลอดภัยขั้นต้น (Front-End Validation)
    if (!username.trim() || !password.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ระเบียบไม่ครบถ้วน",
        text: "กรุณากรอก Username และ Password ให้ครบถ้วนด้วยครับป๋า!",
        confirmButtonColor: "#0f172a", // สี Slate-900 แมตช์ Theme สโมสร
      });
      return;
    }

    try {
      // 🚀 ส่งกระแสคำสั่งมุดอุโมงค์เข้าหาคลังสมองกล Zustand store ข้ามอุปกรณ์[cite: 1]
      const result = await loginGolfer({ username, password });

      if (result?.success) {
        // 🎯 ดึงสิทธิ์ที่เพิ่งล็อกอินสำเร็จเพื่อกำหนดทางเดินรถให้ตรงตาม Matrix R3
        const role = result?.user?.global_role || result?.data?.global_role;

        // ปลุกเสกกล่องความสำเร็จขนาดกะทัดรัดความไวสูง[cite: 8]
        Swal.fire({
          icon: "success",
          title: "ยืนยันสิทธิ์สำเร็จ",
          text: `ยินดีต้อนรับเข้าสู่ระบบกอล์ฟ-TD ครับป๋าปู!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // 🔀 ดีดรถ นำทางพายูสเซอร์อพยพผ่านด่านสิทธิ์ข้ามมิติไปยังตารางทัวร์นาเมนต์หลักหรือแผงป้อนแต้มทันที[cite: 8]
        if (role === "SCORER") {
          navigate("/golfer/scoringPanel"); // ➡️ พา SCORER ตรงเข้าแผงคีย์แต้มสด
        } else if (role === "TD" || role === "ADMIN") {
          navigate("/td/flights"); // ➡️ พา TD ตรงเข้าหน้าจัดการก๊วน
        } else {
          navigate("/golfer/tournaments"); // ➡️ GOLFER ทั่วไปเข้าหน้าทัวร์นาเมนต์
        }
      }
    } catch (error: any) {
      // 🛡️ ด่านที่ 2: ระบบบริหารจัดการข้อผิดพลาดกรณีเกิด Error จริงหลังบ้าน (Error Handling Integration)
      console.error("📢 ตรวจพบสัญญาณขัดข้องฝั่งด่านหน้า:", error);
      
      Swal.fire({
        icon: "error",
        title: "การล็อกอินขัดข้อง",
        text: error?.response?.data?.message || "รหัสผ่านไม่ถูกต้อง หรือระบบเครือข่ายหลังบ้านปฏิเสธการเชื่อมต่อครับป๋า!",
        confirmButtonColor: "#dc2626", // สีแดงแจ้งภัย
      });
    }
  };

  return (
    // 📱 ใช้กฎระเบียบคุมมิติหน้าจอ: ปล่อยเนื้อหายืดดิ่งอิสระ Window Scroll คอนฟิกรองรับ Virtual Keyboard[cite: 14]
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-start items-center p-4 pt-12">
      
      {/* โลโก้ตรายางสโมสรจัดวางเยื้องตำแหน่งบนสุด[cite: 14] */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white text-3xl font-black mb-2 shadow-md">
          ⛳
        </div>
        <h1 className="text-xl font-black tracking-tight text-slate-900">GOLF-TD PLATFORM</h1>
        <p className="text-[11px] text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
          Tournament Director & Live Scoring System[cite: 14]
        </p>
      </div>

      {/* 🏗️ กรอบกล่องฟอร์ม ลอยตัวอิสระ ไม่ล็อกความสูง ป้องกันแป้นพิมพ์คีย์บอร์ดมือถือดีดบังขอบล่าง[cite: 14] */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-xl p-5">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2 mb-4 text-left">
          🔐 ลงชื่อเข้าสู่สนามแข่งขัน
        </h2>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
          {/* ช่องกรอกข้อมูลที่ 1: Username */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 tracking-wider">
              👤 รหัสผู้ใช้งาน (USERNAME)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="พิมพ์ชื่อโปรไฟล์ (เช่น nobita)"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* ช่องกรอกข้อมูลที่ 2: Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 tracking-wider">
              🔑 รหัสผ่านเข้าคลัง (PASSWORD)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* ปุ่มคำสั่งยิงสัญญานก้าวเข้าสู่สนามกอล์ฟ */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-slate-400"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                กำลังสแกนตั๋วสิทธิ์ควบคุม...
              </>
            ) : (
              "🏌️‍♂️ ก้าวเข้าสู่สนามแข่งขัน"
            )}
          </button>
        </form>
      </div>

      {/* แถบแจ้งเตือนระดับวินัยความเสถียรใต้กล่องฟอร์ม */}
      <div className="mt-4 max-w-sm text-center">
        <p className="text-[10px] text-slate-400 italic">
          * ระบบสวมเกราะ High-Stability Hybrid Failback Ready[cite: 1] หาก pp1 ขาดการเชื่อมต่อ ระบบจะปลดล็อก Persona ออฟไลน์ให้ลุยงานต่อทันทีครับป๋าปู![cite: 1]
        </p>
      </div>

    </div>
  );
}