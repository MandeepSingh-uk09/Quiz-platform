import React, { useEffect, useState } from 'react'
import { FaUser , FaArrowLeft } from 'react-icons/fa'
import Navbar from '../components/Navbar'

import { useNavigate } from 'react-router-dom'
import './profile.css'

const Profile = () => {

    const navigate =useNavigate();

    const [user,setUser] = useState(null);

     useEffect(()=>{
        const userData = JSON.parse(localStorage.getItem('user'));
        console.log(userData);

        const userInfo = {
            username: userData.username,
            email: userData.email,
            photo: userData.photo? userData.photo : null
        }

        console.log(userInfo)

        if(userData){
            setUser(userInfo);
        } 
     },[]);

  

  const handleLogout = () => {
    navigate('/');
  }

  const handleBack =() =>{
    navigate('/landing');
  }

  return (
    <>
    <div className='profile-page'>
        <Navbar />
        <div className='profile-bg'>
        <div className="user-profile-card">
            { user ? 
            <>
                <div className="user-top-bar">
                    <span className="user-back-icon" onClick={handleBack}>
                        <FaArrowLeft color='gray'/>
                    </span>
                    {/* use &#10005; for × icon */}
                </div>

                <div className="user-profile-image">
                    {user.photo? <img src={`http://localhost:8080/uploads/${user.photo}`} alt="User" />: <FaUser color="#ccc" size={100} /> }                
                </div>

                <div className="user-profile-info">
                    <h2>{user.username}</h2>
                    <p>{user.email}</p>
                </div>
            </> 
            : 
            <div> data is loading</div>
            }
            <button className="user-logout-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
        </div>
    </div>
    </>
  )
}

export default Profile
