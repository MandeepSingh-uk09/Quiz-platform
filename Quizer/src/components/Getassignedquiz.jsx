import React from 'react'
import { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import "./getassignedquiz.css"

const Getassignedquiz = ({email ,assignedQuizzes}) => {

  const navigate = useNavigate();

    const[assignedQuizes, setAssignedQuizes] =useState([])

    useEffect(()=>{
        getData()
    },[email]);

    const getData = async () => {
      try {
          const response = await fetch(`http://localhost:8080/api/auth/assigned-quizzes?email=${email}`);
          const data = await response.json();
  
          // Filter out quizzes whose _id is present in userAssignedQuizzes
          const filteredQuizzes = data.filter(
              quiz => assignedQuizzes.includes(quiz._id)
          );
  
          setAssignedQuizes(filteredQuizzes);
      } catch (error) {
          console.error('Error fetching quizzes:', error);
      }
  }    

  const handlePlay =(id)=>{
      navigate('/playquiz',{state:{id:id}})
  }
  return (
    <> { assignedQuizes.length > 0 ? 
      <>
        {assignedQuizes.map((quiz, index) => (
          <div key={index} className='assigned-attend-quiz' onClick={()=>{handlePlay(quiz._id)}}>
              <div className='assigned-q-detail'>
                  <div className='assigned-q-type'>{quiz.quizType}</div>
                  <div className='assigned-creator-name'>{quiz.username || quiz.email}</div>
              </div>
              <div className='assigned-q-desc'>{quiz.quizDescription || 'No description available'}</div>
          </div>
      ))}
      </>
      : 
        <div className='assigned-quiz-msg'>
          No assigned quizzes are available.
        </div>
      }
    </>
  )
}

export default Getassignedquiz
