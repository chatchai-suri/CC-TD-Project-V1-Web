// src/routes/AppRouter.tsx
import { Route, Routes } from 'react-router-dom'
import LayoutPublic from '../layouts/LayoutPublic.tsx'
import LayoutGolfer from '../layouts/LayoutGolfer.tsx'
import LayoutTd from '../layouts/LayoutTd.tsx'
import LayoutAdmin from '../layouts/LayoutAdmin.tsx'
import PublicHome from '../pages/public/PublicHome.tsx'
import AdminHome from '../pages/admin/AdminHome.tsx'

import Register from '../pages/auth/Register.tsx'
import Login from '../pages/auth/Login.tsx'

// ----------------------------------------------------
// 🛡️ สถานีนำเข้าด่านการ์ดตรวจความปลอดภัยหน้าบ้าน (Route Guard)
// ----------------------------------------------------
import ProtectRouter from './ProtectRouter.tsx' // 👈 👑 เปิดท่อเรียกใช้งานการ์ดดักรถ R3

// ----------------------------------------------------
// 🏆 สรุปสถานีนำเข้าฝั่งโมดูลผู้จัดการแข่งขัน (TD Modules)
// ----------------------------------------------------
import TdTournaments from '../pages/td/TdTournaments.tsx'
import Flights from '../pages/td/Flights.tsx'
import TdLeaderboard from '../pages/td/TdLeaderboard.tsx' 

// ----------------------------------------------------
// 🏌️‍♂️ สรุปสถานีนำเข้าฝั่งโมดูลนักกอล์ฟและแคดดี้ (Golfer & Scorer Modules)
// ----------------------------------------------------
import GolferTournaments from '../pages/golfer/GolferTournaments.tsx'
import GolferLeaderboard from '../pages/golfer/GolferLeaderboard.tsx' 
import ScoringPanel from '../pages/golfer/ScoringPanel.tsx' 
import GolferScorecard from '../pages/golfer/GolferScorecard.tsx'

function AppRouter() {
  return (
    <>
      <Routes>
        { /* ==========================================
             🟢 PUBLIC ROUTES (คนนอก / GUEST เข้าถึงได้ลื่นไหล)
             ========================================== */ }
        <Route path="/" element={<LayoutPublic />} >
          <Route index element={<PublicHome />} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        { /* ==========================================
             🔒 PRIVATE ROUTES [ADMIN] (ล็อกสิทธิ์ระดับสูงสุด)
             ========================================== */ }
        {/* 🛡️ สวมเกราะชั้นนอก: บังคับคัดกรองเฉพาะบทบาท ADMIN เท่านั้นถึงจะกางประตูให้ส่อง Layout ได้ */}
        <Route element={<ProtectRouter allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<LayoutAdmin />} >
            <Route index element={<AdminHome />} />
            <Route path="/admin/accounts" element={<div>Account Management</div>} />
          </Route>
        </Route>

        { /* ==========================================
             🔒 PRIVATE ROUTES [TD] (ล็อกสิทธิ์ระดับฝ่ายจัดการแข่งขัน)
             ========================================== */ }
        {/* 🛡️ สวมเกราะชั้นนอก: บังคับคัดกรองเฉพาะกลุ่ม TD และ ADMIN เท่านั้นถึงจะมีสิทธิ์มุดท่อเข้ามาควบคุมสารบบ */}
        <Route element={<ProtectRouter allowedRoles={['TD', 'ADMIN']} />}>
          <Route path="/td" element={<LayoutTd />} >
            <Route index element={<div>HomeTd</div>} />
            <Route path="tournaments" element={<TdTournaments />} />
            <Route path="flights" element={<Flights />} />
            <Route path="leaderboard" element={<TdLeaderboard />} /> 
          </Route>
        </Route>

        { /* ==========================================
             🔒 PRIVATE ROUTES [GOLFER & SCORER - HYBRID ZONE]
             ========================================== */ }
        <Route path="/golfer" element={<LayoutGolfer />} >
          <Route index element={<div>HomeGolfer</div>} />
          <Route path="tournaments" element={<GolferTournaments />} />
          
          {/* 🔀 เลเยอร์หน้าจอกลุ่มแชร์สิทธิ์ร่วมกัน: ยอมให้ผ่านเข้าส่องดูได้ทุกระดับสิทธิ์ในระบบคลับ */}
          <Route element={<ProtectRouter allowedRoles={['GOLFER', 'SCORER', 'TD', 'ADMIN']} />}>
            <Route path="leaderboard" element={<GolferLeaderboard />} /> 
            <Route path="scorecard" element={<GolferScorecard />} /> 
            <Route path="scoringPanel" element={<ScoringPanel />} /> {/* 👈 ย้ายขึ้นมาพิกัดท่อนี้ ดับไฟดีดรถคว่ำเด็ดขาด! */}
          </Route>
        </Route>

        {/* สถานีดักเก็บขยะขอบทางเดินรถกรณีป้อน URL หลงทิศ */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default AppRouter