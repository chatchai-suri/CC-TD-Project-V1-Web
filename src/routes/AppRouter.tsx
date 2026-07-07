// import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import Layout from '../layouts/Layout.tsx'
// import Home from '../pages/public/Home.tsx'
import LayoutPublic from '../layouts/LayoutPublic.tsx'
import LayoutGolfer from '../layouts/LayoutGolfer.tsx'
import LayoutTd from '../layouts/LayoutTd.tsx'
import LayoutAdmin from '../layouts/LayoutAdmin.tsx'
import Flights from '../pages/td/Flights.tsx'
import PublicHome from '../pages/public/PublicHome.tsx'
import AdminHome from '../pages/admin/AdminHome.tsx'
import GolferTournaments from '../pages/golfer/GolferTournaments.tsx'
import Leaderboard from '../pages/golfer/LeaderBoard.tsx'
import TdTournaments from '../pages/td/TdTournaments.tsx'


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
          <Route path="/td/tournaments" element={<TdTournaments />} />
          <Route path="/td/flights" element={<Flights />} />
        </Route>

        { /* Private Routes [GOLFER]*/ }
        <Route path="/golfer" element={<LayoutGolfer />} >
          <Route index element={<div>HomeGolfer</div>} />
          <Route path="/golfer/tournaments" element={<GolferTournaments />} />
          <Route path="/golfer/leaderboard" element={<Leaderboard />} />
          <Route path="/golfer/scoringPanel" element={<div>Scoring Panel</div>} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default AppRouter
