// src/store/useGolfStore.ts

import { create } from "zustand";

/**
 * 🎯 วัตถุประสงค์หลัก: คลังความทรงจำกลางสำหรับจัดการข้อมูลการแข่งขันกอล์ฟ (Tournaments & Flights)
 * รองรับการทำงานแบบจำลอง (Mock Data) ร่วมกับ 6 คอร์ฟังก์ชันสำหรับหน้าจัดก๊วน (Setup Flight)
 */
export const useGolfStore = create<any>((set: any, get: any) => ({
  tournaments: [
    { id: "t1", title: "Golf-TD Grand Opening 2026", course_name: "Alpine Golf Club", date: "2026-07-08", status: "setup" },
    { id: "t2", title: "Singha All Thailand Championship", course_name: "Thana City Country Club", date: "2026-07-09", status: "live" },
    { id: "t3", title: "Papoo Custom Cup v1", course_name: "Amata Spring Country Club", date: "2026-06-30", status: "close" },
  ],
  currentFlight: [], // เก็บรายการกลุ่มทัวร์นาเมนต์ทั้งหมด (Group 01, Group 02)
  isLoading: false,
  error: null,

  fetchTournaments: async () => {
    // โค้ดเดิมสำหรับโหลดหน้า TdTournaments
  },

  /**
   * ค้นหาและเตรียมข้อมูลก๊วน (Flight Setup)
   */
  fetchFlightDetails: async () => {
    if (get().currentFlight.length > 0) return; // ป้องกันการรีเซ็ตค่าซ้ำตอนทดสอบหน้างาน
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const mockFlights = [
      {
        id: "f1",
        group_name: "Group 01",
        teeoff_time: "07:00 น.",
        start_hole: "Hole 1",
        players: [
          { user_id: 1, name: "Nobita", role: "GOLFER", handicap: 12 },
          { user_id: 2, name: "Shizuka", role: "GOLFER", handicap: 18 },
          { user_id: 3, name: "Gian", role: "SCORER", handicap: 15 },
          { user_id: 4, name: "Suneo", role: "GOLFER", handicap: 14 },
        ]
      },
      {
        id: "f2",
        group_name: "Group 02",
        teeoff_time: "07:12 น.",
        start_hole: "Hole 1",
        players: [
          { user_id: 5, name: "Dekisugi", role: "TD", handicap: 5 },
          { user_id: 6, name: "Player B", role: "GOLFER", handicap: 24 },
          { user_id: 7, name: "Player C", role: "SCORER", handicap: 20 },
          { user_id: 8, name: "Player D", role: "GOLFER", handicap: 18 },
        ]
      }
    ];
    set({ currentFlight: mockFlights, isLoading: false });
  },

  /**
   * Action 1: เพิ่มสมาชิกในกลุ่ม (สูงสุด 6 คน)
   */
  addMemberToFlight: (flightId: string) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      if (f.id === flightId) {
        if (f.players.length >= 6) {
          alert("❌ ไม่สามารถเพิ่มได้: สมาชิกในก๊วนเต็มสูงสุด 6 คนแล้วครับป๋า!");
          return f;
        }
        const newId = Date.now();
        return {
          ...f,
          players: [...f.players, { user_id: newId, name: `New Player ${f.players.length + 1}`, role: "GOLFER", handicap: 18 }]
        };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  /**
   * Action 2: เพิ่มกลุ่มแข่งขันใหม่ (Add Group)
   */
  addGroupToFlight: () => {
    const { currentFlight } = get();
    const nextGroupNum = currentFlight.length + 1;
    const newGroup = {
      id: `f${Date.now()}`,
      group_name: `Group ${nextGroupNum < 10 ? '0' + nextGroupNum : nextGroupNum}`,
      teeoff_time: "07:24 น.",
      start_hole: "Hole 1",
      players: [
        { user_id: Date.now() + 1, name: "Player A", role: "GOLFER", handicap: 18 }
      ]
    };
    set({ currentFlight: [...currentFlight, newGroup] });
  },

  /**
   * Action 3, 4, 5: เปลี่ยนค่าเฉพาะบุคคล (ชื่อ, บทบาท, Handicap) ใน Local State ของ Zustand
   */
  updatePlayerField: (flightId: string, userId: number, field: string, value: any) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      if (f.id === flightId) {
        return {
          ...f,
          players: f.players.map((p: any) => 
            p.user_id === userId ? { ...p, [field]: value } : p
          )
        };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  /**
   * Action 6: บันทึกค่าข้อมูลทั้งหมด (เตรียมช่องยิง Axios สัปดาห์หน้า)
   */
  saveFlightSetup: async () => {
    set({ isLoading: true });
    // 🔌 เฟสเชื่อม API จริงในอนาคต: await apiService.post("/td/flights/save", { flights: get().currentFlight });
    await new Promise((resolve) => setTimeout(resolve, 500));
    set({ isLoading: false });
    alert("💾 บันทึกโครงสร้างการจัดก๊วนสำเร็จแล้วครับป๋าปู!");
  },

  /**
   * Action พิเศษ: ลบผู้เล่นออกจากก๊วนแข่งขันเฉพาะบุคคล
   * @param {string} flightId - ไอดีของก๊วนที่ผู้เล่นสังกัดอยู่
   * @param {number} userId - ไอดีของผู้เล่นที่ต้องการลบออก
   */
  deleteMemberFromFlight: (flightId: string, userId: number) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      if (f.id === flightId) {
        return {
          ...f,
          players: f.players.filter((p: any) => p.user_id !== userId)
        };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  toggleTournamentStatus: (id: string) => {
    const { tournaments } = get();
    const updated = tournaments.map((t: any) => {
      if (t.id === id) {
        let nextStatus = "setup";
        if (t.status === "setup") nextStatus = "live";
        else if (t.status === "live") nextStatus = "close";
        return { ...t, status: nextStatus };
      }
      return t;
    });
    set({ tournaments: updated });
  },

  tournamentResult: null, // ถังเก็บผลการแข่งขันภาพรวม
  activeScoreCard: null,   // ถังเก็บคะแนน 18 หลุมของผู้เล่นที่ถูกคลิกเลือก

  /**
   * ค้นหาและคำนวณผลการแข่งขันสรุปท้ายแมตช์ (Tournament Result)
   */
fetchTournamentResult: async (tournamentId: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // 🔀 คั่นข้อเงื่อนไขจำลองข้อมูลแปรผันตาม ID ทัวร์นาเมนต์ (สยบบั๊กชื่องานเพี้ยน)
    let tournamentName = "Golf-TD Grand Opening 2026";
    let courseName = "Alpine Golf Club";
    let eventDate = "2026-07-08";
    
    if (tournamentId === "t3") {
      tournamentName = "Papoo Custom Cup v1";
      courseName = "Mountain Shadow GC";
      eventDate = "2025-08-02";
    } else if (tournamentId === "t2") {
      tournamentName = "Alpha-Test Match";
      courseName = "Amata Spring CC";
      eventDate = "2026-06-26";
    }

    const mockResult = {
      tournament_name: tournamentName,
      course_name: courseName,
      event_date: eventDate,
      par: 72,
      hadicap_rule: "System 36",
      results: [
        { user_id: 101, name: "Nobita", nickname: "โนบิ", flight: "A", gross: 84, handicap: 12, net: 72, rank: 1 },
        { user_id: 102, name: "Shizuka", nickname: "ชิซู", flight: "A", gross: 90, handicap: 18, net: 72, rank: 2 },
        { user_id: 103, name: "Gian", nickname: "ไจแอน", flight: "A", gross: 89, handicap: 15, net: 74, rank: 3 },
        { user_id: 104, name: "Suneo", nickname: "ซูเนะ", flight: "A", gross: 89, handicap: 14, net: 75, rank: 4 },
      ]
    };
    set({ tournamentResult: mockResult, isLoading: false });
  },

  /**
   * ค้นหาแต้มดิบเจาะลึก 1-18 หลุมประจำตัวผู้เล่น
   */
  fetchPlayerScoreCard: async (userId: number, playerName: string) => {
    // จำลองการสร้างอาร์เรย์คะแนน 1-18 หลุมพ่วงค่า Par และ Index ประจำสนาม
    const mockHoles = Array.from({ length: 18 }, (_, i) => {
      const holeNo = i + 1;
      // คั่นข้อเงื่อนไขจำลองค่า Par มาตรฐานสนามกอล์ฟทั่วไป (ข้อ 4.3 ของกฎฟังก์ชัน)[cite: 15]
      let parValue = 4;
      if ([2, 7, 11, 16].includes(holeNo)) parValue = 3; // หลุมพาร์ 3
      if ([5, 9, 13, 18].includes(holeNo)) parValue = 5; // หลุมพาร์ 5

      return {
        hole_no: holeNo,
        par: parValue,
        index: Math.floor(Math.random() * 18) + 1,
        stroke: parValue + (Math.random() > 0.7 ? 1 : 0) // จำลองแต้มสโตรกใกล้เคียงพาร์
      };
    });

    set({
      activeScoreCard: {
        player_name: playerName,
        username: `${playerName.toLowerCase()}_kun`,
        hole_scores: mockHoles
      }
    });
  }
  
}));