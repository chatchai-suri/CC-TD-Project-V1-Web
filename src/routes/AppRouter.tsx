// src/routes/AppRouter.tsx

import { Route, Routes } from 'react-router-dom'
import LayoutPublic from '../layouts/LayoutPublic.tsx'
import LayoutGolfer from '../layouts/LayoutGolfer.tsx'
import LayoutTd from '../layouts/LayoutTd.tsx'
import LayoutAdmin from '../layouts/LayoutAdmin.tsx'
import PublicHome from '../pages/public/PublicHome.tsx'
import AdminHome from '../pages/admin/AdminHome.tsx'

// ----------------------------------------------------
// 🏆 สรุปสถานีนำเข้าฝั่งโมดูลผู้จัดการแข่งขัน (TD Modules)
// ----------------------------------------------------
import TdTournaments from '../pages/td/TdTournaments.tsx'
import Flights from '../pages/td/Flights.tsx'
import TdLeaderboard from '../pages/td/TdLeaderboard.tsx' // 👈 เปิดสายสัญญาณ Import ดับไฟ 404[cite: 19]

// ----------------------------------------------------
// 🏌️‍♂️ สรุปสถานีนำเข้าฝั่งโมดูลนักกอล์ฟและแคดดี้ (Golfer & Scorer Modules)
// ----------------------------------------------------
import GolferTournaments from '../pages/golfer/GolferTournaments.tsx'
import GolferLeaderboard from '../pages/golfer/GolferLeaderboard.tsx' // 👈 เปลี่ยนชื่อตามมติป๋าปู
import ScoringPanel from '../pages/golfer/ScoringPanel.tsx' // 👈 นำเข้าไฟล์แผงป้อนคะแนนปุ่มหนาตัวใหม่

function AppRouter() {
  return (
    <>
      <Routes>
        { /* Public Routes */ }
        <Route path="/" element={<LayoutPublic />} >
          <Route index element={<PublicHome />} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/golfer" element={<div>HomeGolfer</div>} />
          <Route path="/td" element={<div>HomeTd</div>} />
          <Route path="/admin" element={<div>HomeAdmin</div>} />
          <Route path="/login" element={<div>Login</div>} />
        </Route>

        { /* Private Routes [ADMIN]*/ }
        <Route path="/admin" element={<LayoutAdmin />} >
          <Route index element={<AdminHome />} />
          <Route path="/admin/accounts" element={<div>Account Management</div>} />
        </Route>

        { /* Private Routes [TD]*/ }
        <Route path="/td" element={<LayoutTd />} >
          <Route index element={<div>HomeTd</div>} />
          <Route path="tournaments" element={<TdTournaments />} />
          <Route path="flights" element={<Flights />} />
          {/* 🔀 รองรับพาสซิ่ง URL มุดดิน: /td/leaderboard?id=t2&status=live หรือ status=final */}
          <Route path="leaderboard" element={<TdLeaderboard />} /> 
        </Route>

        { /* Private Routes [GOLFER & SCORER] */ }
        <Route path="/golfer" element={<LayoutGolfer />} >
          <Route index element={<div>HomeGolfer</div>} />
          <Route path="tournaments" element={<GolferTournaments />} />
          <Route path="leaderboard" element={<GolferLeaderboard />} /> {/* 👈 อัปเดตคอมโพเนนต์ปลายทาง */}
          <Route path="scoringPanel" element={<ScoringPanel />} /> {/* 👈 เสียบแทนกล่องสตริงเดิม ดับไฟ 404 เด็ดขาด */}
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default AppRouter