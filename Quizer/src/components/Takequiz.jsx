import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./takequiz.css"
const Takequiz = ({email}) => {

    const navigate = useNavigate();

    const[assignedQuizes, setAssignedQuizes] =useState([])

    useEffect(()=>{
        getData()
    },[email]);

    const getData = async()=>{
        try {
            const response = await fetch(`http://localhost:8080/api/auth/takequiz?email=${email}`);
            const data = await response.json();
            setAssignedQuizes(data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    }

    const handlePlay =(id)=>{
        navigate('/playquiz',{state:{id:id}})
    }

  return (
    <>
        {assignedQuizes.map((quiz, index) => (
                <div key={index} className='attend-quiz' onClick={()=>{handlePlay(quiz._id)}}>
                    <div className='q-detail'>
                        <div className='q-type'>{quiz.quizType}</div>
                        <div className='creator-name'>{quiz.username || quiz.email}</div>
                    </div>
                    <div className='q-desc'>{quiz.quizDescription || 'No description available'}</div>
                </div>
            ))}
    </>
  )
}

export default Takequiz
