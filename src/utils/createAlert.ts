// src/utils/createAlert.ts
import Swal from "sweetalert2";

/**
 * 🎯 ฟังก์ชันแจ้งเตือนส่วนกลางโครงการ Golf-TD (Hybrid System)
 * @param icon ข้อความระบุสัญลักษณ์ เช่น "success", "error", "warning", "info"
 * @param text เนื้อหาข้อความแจ้งเตือนที่ต้องการแสดงผล
 * @param isModal true = กล่องเซฟตี้ใหญ่กลางจอ (เหมาะกับเอเรอร์ระบบ) | false = Toast เล็กด่วนมุมบนขวา (เหมาะกับคีย์แต้ม)
 */
export const createAlert = (icon: any, text: any, isModal: boolean = false) => {
  // 1. กรณีต้องการแสดงผลแบบ กล่องใหญ่ตรงกลางจอ (Modal)
  if (isModal) {
    return Swal.fire({
      icon: icon || "error",
      title: "Oops...",
      text: text || "Something went wrong!",
      confirmButtonColor: "#1e3a8a", // โทนสีน้ำเงินเข้มสโมสรกอล์ฟ
      confirmButtonText: "Close",
    });
  }

  // 2. กรณีปกติ พ่นเป็น Toast ขนาดเล็กความไวสูง มุมขวาบนจอ (ไม่บล็อกนิ้วมือตอนคีย์แต้ม)
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  return Toast.fire({
    icon: icon || "info",
    title: text || "Operation completed successfully",
  });
};