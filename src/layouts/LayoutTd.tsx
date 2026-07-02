// import React from 'react'
import { Outlet } from "react-router-dom"
import HeaderMain from "./HeaderMain"
import NavBarTd from "./NavBarTd"

function LayoutTd() {
  return (
    <div>
      <HeaderMain />
      <NavBarTd />
      <Outlet />
    </div>
  )
}

export default LayoutTd
