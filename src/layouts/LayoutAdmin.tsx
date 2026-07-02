// import React from 'react'

import { Outlet } from "react-router-dom"
import HeaderMain from "./HeaderMain"
import NavBarAdmin from "./NavBarAdmin"

function LayoutAdmin() {
  return (
    <div>
      <HeaderMain />
      <NavBarAdmin />
      <Outlet />
    </div>
  )
}

export default LayoutAdmin
