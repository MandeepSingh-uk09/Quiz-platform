import React from 'react'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate =useNavigate();
  const handleLogout= ()=>{
    localStorage.clear();
    navigate('/');
  }
  return (
    <div className='navbar'>
        <div className='logo'>Quizer</div>
        <div className='nav-items'>
            <div className='nav-item'>Home</div>
            <div className='nav-item'>Quiz</div>
            <div className='nav-item'>Leaderboard</div>
            <div className='nav-item'>Profile</div>
        </div>
        <div className='nav-item' onClick={()=>{handleLogout()}}>Logout</div>
    </div>
  )
}

export default Navbar
