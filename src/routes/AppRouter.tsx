// import React from 'react'
import { Route, Routes } from 'react-router-dom'
// import Layout from '../layouts/Layout.tsx'
// import Home from '../pages/public/Home.tsx'
import LayoutPublic from '../layouts/LayoutPublic.tsx'
import LayoutGolfer from '../layouts/LayoutGolfer.tsx'
import LayoutTd from '../layouts/LayoutTd.tsx'
import LayoutAdmin from '../layouts/LayoutAdmin.tsx'
import Flights from '../pages/td/Flights.tsx'


function AppRouter() {
  return (
    <>
      <Routes>
        { /* Public Routes */ }
        <Route path="/" element={<LayoutPublic />} >
          <Route index element={<div>Welcome Tournament Director Landing Page</div>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/golfer" element={<div>HomeGolfer</div>} />
          <Route path="/td" element={<div>HomeTd</div>} />
          <Route path="/admin" element={<div>HomeAdmin</div>} />
          <Route path="/login" element={<div>Login</div>} />
        </Route>

        { /* Private Routes [ADMIN]*/ }
        <Route path="/admin" element={<LayoutAdmin />} >
          <Route index element={<div>HomeAdmin</div>} />
          <Route path="/admin/accounts" element={<div>Account Management</div>} />
        </Route>

        { /* Private Routes [TD]*/ }
        <Route path="/td" element={<LayoutTd />} >
          <Route index element={<div>HomeTd</div>} />
          <Route path="/td/tournaments" element={<div>Tournaments Management</div>} />
          <Route path="/td/flights" element={<Flights />} />
        </Route>

        { /* Private Routes [GOLFER]*/ }
        <Route path="/golfer" element={<LayoutGolfer />} >
          <Route index element={<div>HomeGolfer</div>} />
          <Route path="/golfer/tournaments" element={<div>Tournaments</div>} />
          <Route path="/golfer/leaderboard" element={<div>Leaderboard</div>} />
          <Route path="/golfer/scoringPanel" element={<div>Scoring Panel</div>} />
        </Route>

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  )
}

export default AppRouter
