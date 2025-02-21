import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router'
import Footer from '../components/Footer'

const Routelayout = () => {
  const[showNavbar , setShowNavbar] = useState(true)
  const location = useLocation()

  useEffect(()=>{
    if(location.pathname === '/login' || location.pathname === '/signup'){
      setShowNavbar(false)
    }else{
      setShowNavbar(true)
    }
  },[location.pathname])
  return (
    <div>
     {showNavbar && <Navbar />}
      <div className="container">
        <Outlet/>
      </div>
      <Footer/>
    </div>
  )
}

export default Routelayout
