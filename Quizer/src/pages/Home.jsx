import React from 'react'
import { useState } from 'react'
import Login from '../components/Login'
import "./home.css"
import Register from '../components/Register'
const Home = () => {

    const [isRegister, setIsRegister] = useState(true)

    const handleLogin = () => {
        setIsRegister(!isRegister)
    }

  return (   
    <div className="home">
      {isRegister ? 
        <>
          <div className='home-pic'></div>
          <Login handleLogin={handleLogin} />
        </>
       : 
        <>
          <Register handleLogin={handleLogin} />
          <div className='home-pic'></div>
        </>
      }
    </div>
  )
}

export default Home
