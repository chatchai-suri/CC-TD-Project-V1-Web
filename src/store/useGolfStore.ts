// src/store/useGolfStore.ts
import { create } from "zustand";
import { apiService } from "../utils/apiService";
import Swal from "sweetalert2";

export const useGolfStore = create<any>((set: any, get: any) => ({

  // 🔐 Authentication State & Actions
  currentUser: null,
  isLoading: false,
  error: null,

  registerGolfer: async (userData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/auth/register', userData);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error });
      throw error;
    }
  },

  loginGolfer: async (credentials: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.post('/auth/login', credentials);
      const { data } = response.data;
      console.log("✅ Login Success - Authenticated User Data:", data);
      set({ currentUser: data, isLoading: false, error: null });
      return response.data;
    } catch (error: any) {
      console.error("❌ Login Failed - API Response Error:", error);
      set({ currentUser: null, isLoading: false, error: error });
      throw error;
    }
  },
  
  // ⛳ Repositories & Metadata Cache
  tournaments: [], 
  currentFlight: [], 
  userList: [],
  tournamentResult: null, 

  // 🏛️ Master Metadata Caching (Static Course Specs)
  courseHoles: [], // เก็บคลังข้อมูล 18 หลุม (hole_no, par, index)
  activeTournamentId: null, // เก็บรหัสทัวร์นาเมนต์ปัจจุบันเพื่อคุม State Invalidation

fetchTournaments: async () => {
  set({ isLoading: true, error: null });
  try {
    // 🎯 [Fix Endpoint]: เปลี่ยนจาก /user/tournaments เป็น /td/tournaments ให้ตรงกับบทบาท TD Panel
    const response = await apiService.get('/td/tournaments');
    const fetchedData = response?.data?.data || response?.data || [];
    console.log("⛳ [TD Panel] Fetched Tournaments Data via /td/tournaments:", fetchedData);
    set({ tournaments: fetchedData, isLoading: false });
    return fetchedData;
  } catch (err: any) {
    console.error("❌ Fetch Tournaments Error:", err);
    set({ tournaments: [], isLoading: false, error: err });
    return [];
  }
},

fetchUserList: async () => {
    try {
      const response = await apiService.get('/user/all');
      const users = response?.data?.data || [];
      console.log("👥 [API Real Integration] Fetched Users Success:", users);
      set({ userList: users });
      return users;
    } catch (error) {
      console.error("❌ Fetch User List Failed:", error);
      set({ userList: [] });
      return [];
    }
  },

fetchFlightDetails: async (tournamentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/td/tournaments/${tournamentId}/flights`);
      const flightData = response?.data?.data || response?.data || [];
      
      // 🎯 Auto-Sync Role Normalize: ดึง role จาก flight_member หรือ fallback ไปที่ global_role ของ user
      const normalizedFlights = flightData.map((f: any) => ({
        ...f,
        members: (f.members || []).map((m: any) => ({
          ...m,
          role: (m.role || m.user?.global_role || "GOLFER").toUpperCase()
        }))
      }));

      set({ currentFlight: normalizedFlights, isLoading: false });
    } catch (error: any) {
      set({ currentFlight: [], isLoading: false });
    }
  },

  addGroupToFlight: () => {
    const { currentFlight } = get();
    const nextGroupNum = currentFlight.length + 1;
    const newGroup = {
      flight_id: `temp-${Date.now()}`,
      flight_name: `Group ${nextGroupNum < 10 ? '0' + nextGroupNum : nextGroupNum}`,
      t_off_time: "08:00",
      start_hole: 1,
      members: []
    };
    set({ currentFlight: [...currentFlight, newGroup] });
  },

  addMemberToFlight: (flightId: any) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      const fId = f.flight_id || f.id;
      if (fId === flightId) {
        const currentMembers = f.members || f.players || [];
        if (currentMembers.length >= 6) return f;
        const tempUserId = Date.now();
        const newMember = {
          user_id: tempUserId,
          role: "GOLFER",
          handicap_claim: 18.0,
          user: { fullname: "คลิกเพื่อเลือกนักกอล์ฟ..." }
        };
        return { ...f, members: [...currentMembers, newMember] };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  // ⛳ Action ปรับอัปเดตข้อมูลผู้เล่นใน Flight (พร้อมระบบ Single Scorer Guard Clause)
  updatePlayerField: (flightId: any, targetUserId: number, field: string, value: any) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      const fId = f.flight_id || f.id;
      if (fId === flightId) {
        const currentMembers = f.members || f.players || [];
        
        // 🛡️ Single Scorer Guard: หากสั่งตั้งค่า field "role" เป็น "SCORER"
        // ให้สลับทุกคนในก๊วนนั้นกลับเป็น "GOLFER" ก่อน แล้วค่อยสลัก "SCORER" ให้ targetUserId
        const isPromotingScorer = field === "role" && value === "SCORER";

        const updatedMembers = currentMembers.map((m: any) => {
          if (m.user_id === targetUserId) {
            if (field === "user_id") {
              return { ...m, user_id: value.id, user: { ...m.user, fullname: value.name } };
            }
            if (field === "role") return { ...m, role: value };
            if (field === "handicap") return { ...m, handicap_claim: value };
            return { ...m, [field]: value };
          }
          
          // 🛡️ ถ้ามีคนอื่นพยายามเป็น SCORER เพิ่มในก๊วนเดียวกัน ให้ปลดสิทธิ์คนเก่ากลับเป็น GOLFER ทันที
          if (isPromotingScorer && (m.role === "SCORER" || m.role === "scorer")) {
            return { ...m, role: "GOLFER" };
          }

          return m;
        });
        return { ...f, members: updatedMembers };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  deleteMemberFromFlight: (flightId: any, userId: number) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      const fId = f.flight_id || f.id;
      if (fId === flightId) {
        const currentMembers = f.members || f.players || [];
        const filtered = currentMembers.filter((m: any) => m.user_id !== userId);
        return { ...f, members: filtered };
      }
      return f;
    });
    set({ currentFlight: updated });
  },

  deleteFlightGroup: async (flightId: any) => {
    const { currentFlight } = get();
    if (typeof flightId === 'string' && flightId.startsWith('temp-')) {
      const filtered = currentFlight.filter((f: any) => (f.flight_id || f.id) !== flightId);
      set({ currentFlight: filtered });
      return;
    }
    try {
      set({ isLoading: true });
      await apiService.delete(`/td/flights/${flightId}`);
      const filtered = currentFlight.filter((f: any) => (f.flight_id || f.id) !== flightId);
      set({ currentFlight: filtered, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  saveFlightSetup: async (tournamentId: number | string) => {
    set({ isLoading: true });
    const { currentFlight } = get();

    try {
      for (const flight of currentFlight) {
        const flightId = flight.flight_id || flight.id;
        const memberPayloads = (flight.members || [])
          .filter((m: any) => typeof m.user_id === 'number' && m.user_id < 1000000000000)
          .map((m: any) => ({
            user_id: m.user_id,
            role: m.role || "GOLFER",
            handicap_claim: m.handicap_claim || 0
          }));

        if (memberPayloads.length > 0) {
          if (typeof flightId === 'string' && flightId.startsWith('temp-')) {
            const payload = {
              flight_name: flight.flight_name || "Group 01",
              t_off_time: flight.t_off_time || "08:00",
              user_ids: memberPayloads
            };
            await apiService.post(`/td/tournaments/${tournamentId}/flights`, payload);
          } else {
            const payload = {
              flight_id: Number(flightId),
              user_ids: memberPayloads
            };
            await apiService.put(`/td/flights/${flightId}/members`, payload);
          }
        }
      }

      const refreshedFlights = await apiService.get(`/td/tournaments/${tournamentId}/flights`);
      const flightData = refreshedFlights?.data?.data || refreshedFlights?.data || [];
      set({ currentFlight: flightData, isLoading: false });

      return { success: true };
    } catch (error: any) {
      set({ isLoading: false });
      throw error;
    }
  },

  saveFlightScores: async (flightId: number, scoresPayload: any[]) => {
    set({ isLoading: true });
    try {
      const response = await apiService.post('/scorer/scores', {
        flight_id: flightId,
        scores: scoresPayload
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchTournamentResult: async (tournamentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/user/tournament/${tournamentId}/leaderboard`);
      
      // 🎯 Metadata Caching Logic: ดึงและสลัก Master Holes ลง Store เมื่อได้ Response
      const resultData = response.data;
      if (resultData && Array.isArray(resultData.holes)) {
        set({
          courseHoles: resultData.holes,
          activeTournamentId: tournamentId
        });
      }

      set({ tournamentResult: resultData, isLoading: false });
      return resultData;
    } catch (err: any) {
      set({ tournamentResult: null, isLoading: false, error: err });
      return null;
    }
  },

  logout: () => {
    set({ 
      currentUser: null, 
      tournaments: [], 
      currentFlight: [], 
      tournamentResult: null, 
      userList: [],
      courseHoles: [],
      activeTournamentId: null
    });
  },

  // 🟢 Action สำหรับสลับสถานะแมตช์ (Hybrid Offline/Online Status Switching)
  updateMatchStatus: async (tournamentId: string | number, newStatus: string) => {
  const { tournaments } = get();
  
  // 1. Update State ใน Zustand ทันทีเพื่อความเร็วหน้าจอ (Optimistic UI)
  const updatedTournaments = tournaments.map((t: any) => {
    const tId = t.tournament_id || t.id;
    if (String(tId) === String(tournamentId)) {
      return { ...t, status: newStatus };
    }
    return t;
  });
  set({ tournaments: updatedTournaments });

  // 2. ยิง API ลง MySQL หลังบ้าน (ถ้า Offline จะ Fallback เงียบๆ ไม่ทำระบบล่ม)
  try {
    const response = await apiService.patch(`/td/tournaments/${tournamentId}/status`, {
      status: newStatus
    });
    console.log("✅ Match Status Updated in DB:", response.data);
    return { success: true };
  } catch (error) {
    console.warn("⚠️ API Unavailable - Running in Offline/Dev Mode:", error);
    return { success: true, offline: true };
  }
  },

  // (เพิ่ม Action fetchCourseHoles สำหรับ Caching Master Holes)
  fetchCourseHoles: async (courseId: number | string) => {
    if (!courseId) return;
    try {
      const res = await apiService.get(`/user/courses/${courseId}/holes`);
      if (res.data && res.data.success && Array.isArray(res.data.holes)) {
        set({ courseHoles: res.data.holes });
      }
    } catch (err: any) {
      console.error("❌ Failed to hydrate Master Course Holes from DB:", err);
    }
  },

  // เพิ่มใน createStore implementation:
createTournament: async (data: any) => {
  try {
    const res = await apiService.post("/td/tournaments", data);
    if (res.data.success) {
      Swal.fire({
        title: "สำเร็จ!",
        text: "สร้างรายการแข่งขันใหม่เรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#fff",
      });
      // Refresh รายชื่อแมตช์
      get().fetchTournaments();
    }
  } catch (error: any) {
    Swal.fire({
      title: "ผิดพลาด!",
      text: error.response?.data?.message || "ไม่สามารถสร้างรายการแข่งขันได้",
      icon: "error",
      background: "#0f172a",
      color: "#fff",
    });
  }
},

updateTournament: async (id: number, data: any) => {
  try {
    const res = await apiService.put(`/td/tournaments/${id}`, data);
    if (res.data.success) {
      Swal.fire({
        title: "สำเร็จ!",
        text: "อัปเดตข้อมูลรายการแข่งขันเรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#fff",
      });
      get().fetchTournaments();
    }
  } catch (error: any) {
    Swal.fire({
      title: "ผิดพลาด!",
      text: error.response?.data?.message || "ไม่สามารถแก้ไขรายการแข่งขันได้",
      icon: "error",
      background: "#0f172a",
      color: "#fff",
    });
  }
},

deleteTournament: async (id: number) => {
  try {
    const res = await apiService.delete(`/td/tournaments/${id}`);
    if (res.data.success) {
      Swal.fire({
        title: "ลบสำเร็จ!",
        text: "ลบรายการแข่งขันเรียบร้อยแล้ว",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#0f172a",
        color: "#fff",
      });
      get().fetchTournaments();
    }
  } catch (error: any) {
    Swal.fire({
      title: "ไม่สามารถลบได้!",
      text: error.response?.data?.message || "เกิดข้อผิดพลาดในการลบรายการ",
      icon: "error",
      background: "#0f172a",
      color: "#fff",
    });
  }
},

courses: [],
fetchCourses: async () => {
  try {
    // 🎯 Step 1: ลองยิงท่อหลัก /td/courses
    const response = await apiService.get('/td/courses');
    const fetchedCourses = response?.data?.data || response?.data || [];
    
    if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
      console.log("⛳ [Store] Fetched Courses Success via /td/courses:", fetchedCourses);
      set({ courses: fetchedCourses });
      return fetchedCourses;
    }

    // 🎯 Step 2: Fallback ยิงท่อสำรอง /user/courses กรณีท่อแรกได้ Array ว่าง
    console.warn("⚠️ /td/courses returned empty, trying fallback /user/courses...");
    const fallbackRes = await apiService.get('/user/courses');
    const fallbackData = fallbackRes?.data?.data || fallbackRes?.data || [];
    set({ courses: fallbackData });
    return fallbackData;

  } catch (error: any) {
    const errorDetail = error?.response?.data?.message || error?.message || "Unknown Network Error";
    console.error("❌ Fetch Courses Failed - Diagnostic Error Message:", errorDetail, error);

    // 🎯 Step 3: กรณี Error ให้ลองยิงท่อกลาง /courses เป็นไม้ตายสุดท้าย
    try {
      const lastTryRes = await apiService.get('/courses');
      const lastTryData = lastTryRes?.data?.data || lastTryRes?.data || [];
      set({ courses: lastTryData });
      return lastTryData;
    } catch (finalErr: any) {
      const finalMsg = finalErr?.response?.data?.message || finalErr?.message || errorDetail;
      console.error("❌ All Course Endpoints Failed. Final Error Message:", finalMsg);
      set({ courses: [], error: finalMsg });
      return [];
    }
  }
},

}));

