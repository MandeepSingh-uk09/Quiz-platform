import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import './navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setMenuOpen(false); // Close menu after logout
  };

  return (
    <div className="navbar">
      {/* Logo */}
      <div className="logo">Quizer</div>

      {/* Menu Button (Visible on Small Screens) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Navigation Items (Hidden in Mobile until menu is open) */}
      <div className={`nav-items ${menuOpen ? 'active' : ''}`}>
        <div className="nav-item" onClick={() => { navigate('/landing'); setMenuOpen(false); }}>Home</div>
        <div className="nav-item" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>Quiz</div>
        <div className="nav-item" onClick={() => { navigate('/leaderboard'); setMenuOpen(false); }}>Leaderboard</div>
        <div className="nav-item">Profile</div>

        {/* Logout inside menu (only on small screens) */}
        <div className="nav-item logout-mobile" onClick={handleLogout}>Logout</div>
      </div>

      {/* Logout outside menu (only on large screens) */}
      <div className="nav-item logout-desktop" onClick={handleLogout}>Logout</div>
    </div>
  );
};

export default Navbar;
