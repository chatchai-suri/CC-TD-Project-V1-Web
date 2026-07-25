// src/store/useGolfStore.ts
import { create } from "zustand";
import { apiService } from "../utils/apiService";

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
      const response = await apiService.get('/user/tournaments');
      const fetchedData = response?.data?.data || response?.data || [];
      console.log("⛳ Fetched Tournaments Data:", fetchedData);
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
      const users = response?.data?.data || response?.data || [];
      console.log("👥 Fetched User List Data:", users);
      set({ userList: users });
      return users;
    } catch (error) {
      console.error("❌ Fetch User List Error:", error);
      set({ userList: [] });
      return [];
    }
  },

  fetchFlightDetails: async (tournamentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiService.get(`/td/tournaments/${tournamentId}/flights`);
      const flightData = response?.data?.data || response?.data || [];
      set({ currentFlight: flightData, isLoading: false });
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

  updatePlayerField: (flightId: any, targetUserId: number, field: string, value: any) => {
    const { currentFlight } = get();
    const updated = currentFlight.map((f: any) => {
      const fId = f.flight_id || f.id;
      if (fId === flightId) {
        const currentMembers = f.members || f.players || [];
        const updatedMembers = currentMembers.map((m: any) => {
          if (m.user_id === targetUserId) {
            if (field === "user_id") {
              return { ...m, user_id: value.id, user: { ...m.user, fullname: value.name } };
            }
            if (field === "role") return { ...m, role: value };
            if (field === "handicap") return { ...m, handicap_claim: value };
            return { ...m, [field]: value };
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
  }

}));