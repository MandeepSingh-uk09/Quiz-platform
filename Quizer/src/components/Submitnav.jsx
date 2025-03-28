import React from 'react'
import { useNavigate } from 'react-router-dom'

const Submitnav = ({handleFinish}) => {
  const navigate = useNavigate();
  const handleBack=()=>{    
    navigate('/dashboard');
  }
  return (
    <>
      <div className='action-bar'>
            <div className='action' onClick={()=>{handleBack()}}>back</div>
            <div className='action' onClick={()=>{handleFinish()}}>Finish</div>
        </div>
    </>
  )
}

export default Submitnav
