// src/routes/ProtectRouter.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useGolfStore } from "../store/useGolfStore";

/**
 * 🎯 วัตถุประสงค์: ระบบดักจับการ์ดตรวจความปลอดภัยเส้นทางเดินรถ (Route Guard Security)
 * @description คัดกรองระดับสิทธิ์ผู้ใช้งาน (User Role Matrix R3) หากสิทธิ์ไม่ถึงเกณฑ์ บังคับดีดกลับหน้าแรกทันที
 * @param {string[]} allowedRoles - อาร์เรย์รายชื่อสิทธิ์ที่ได้รับอนุญาตให้ผ่านด่านเข้าเพจได้
 */
export default function ProtectRouter({ allowedRoles }: { allowedRoles: string[] }) {
  // 🧠 ดึงโปรไฟล์ผู้ใช้งานปัจจุบันจากคลังสมองกลกลาง Zustand Store
  const currentUser = useGolfStore((state: any) => state.currentUser);

  // แกะรหัสคัดกรองระดับสิทธิ์ หากเป็นค่าว่างเปล่าแปรสภาพให้เป็น GUEST โดยอัตโนมัติ
  const userRole = currentUser?.global_role || "GUEST";

  console.log(`🛡️ ProtectRouter Check -> Your Role: [${userRole}] | Allowed:`, allowedRoles);

  // 🔀 1. ด่านกักตรวจ: หากระดับสิทธิ์ปัจจุบันไม่มีรายชื่ออยู่ในกลุ่มที่ได้รับอนุญาต (Unauthorized)
  if (!allowedRoles.includes(userRole)) {
    console.warn(`🚫 สิทธิ์ [${userRole}] ต่ำกว่าเกณฑ์ข้อบังคับ! ระบบสั่งดีดตัวกลับสถานีแรกหลักด่วน`);
    return <Navigate to="/" replace />;
  }

  // 🟢 2. ด่านผ่านฉลุย: อนุญาตให้สายสัญญาณเดินทางต่อไปยังเพจลูกพ่นแสดงผลผ่านแท็ก <Outlet />
  return <Outlet />;
}