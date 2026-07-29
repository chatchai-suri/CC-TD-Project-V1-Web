// src/utils/statusStyles.ts

/**
 * 🎯 วัตถุประสงค์หลัก: คลังจัดเก็บสไตล์สีสถานะแมตช์ และปุ่มกดกลางประจำสโมสร Golf-TD
 * @description Centralized Single Source of Truth สำหรับคุม Palette สีทั้งระบบ (SETUP, LIVE, FINAL)
 */

export interface StatusStyleItem {
  label: string;
  badge: string;
  button: string;
}

// 🎨 Palette สีประจำสถานะแมตช์การแข่งขัน
export const STATUS_STYLES: Record<string, StatusStyleItem> = {
  setup: {
    label: "SETUP",
    badge: "bg-amber-400 text-amber-950 border-amber-500 font-extrabold",
    button: "bg-amber-500 hover:bg-amber-600 text-white"
  },
  live: {
    label: "LIVE",
    badge: "bg-rose-500 text-white border-rose-400 animate-pulse",
    button: "bg-rose-600 hover:bg-rose-700 text-white animate-pulse"
  },
  final: {
    label: "FINAL",
    badge: "bg-slate-800 text-white border-slate-700",
    button: "bg-slate-700 hover:bg-slate-800 text-white"
  }
};

// 🟦 สไตล์ปุ่มคำสั่งหลักประจำระบบ (Command / Navigation / Primary Action)
export const PRIMARY_BTN_STYLE = "bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-black shadow-sm transition-all active:scale-95";