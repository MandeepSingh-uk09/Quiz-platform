import React from 'react'
import { useState , useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import './detailedquiz.css'
const Detailedquiz = ({visibility,setVisibility ,quiztype, email}) => {

  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] =useState([])
  const [close , setClose] =useState("false")

  useEffect(() => {
    if (visibility === "true") {
      fetchQuizzes();
    }
  }, [visibility]);

  const fetchQuizzes = async()=>{

    const response = await fetch(`http://localhost:8080/api/auth/quizzes/by-type?type=${quiztype}&email=${email}`)

    const data = await response.json();
    console.log(data);
    setQuizzes(data);
  }

  const handleDeleteQuiz = async (quizId) => {
    console.log(quizId);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/quizzes/${quizId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleSelect = (index)=>{
    console.log(quizzes[index]);
    const data = quizzes[index].questions;
    setClose("true");
    console.log(data);
    setQuestions(...questions,data);
  }

  return (
    
    <div className={`detailed-quiz ${visibility === "true" ? "visibility" : ""}`}>
      <div className='view-quizs'>
        <div className='close' onClick={() => setVisibility("false")}>&times;</div>
        <div className='dq-comp'>
          <h3>Your {quiztype} Quizzes </h3>

          {quizzes.length > 0 ? (
            quizzes.map((quiz , index) => (
              <div className='dq-lists' key={quiz._id} onClick={()=>{handleSelect(index)}}>
                <div className='list-desc' >{quiz.quizDescription || quiz._id}</div>
                <div className="list-del">
                  <IconButton aria-label="delete" onClick={() => handleDeleteQuiz(quiz._id)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            ))
          ) : (
            <p>No quizzes found.</p>
          )}
        </div>
      </div>
      <div className={`de-qusetions ${close === "false" ? "close" : ""}`}>
        <div className='close' onClick={() => {setClose("false");setQuestions([])}}>&times;</div>
        <div className='dq-comp'>
          <h3>Your Questions </h3>
          {questions.length > 0 ? (
            questions.map((quiz , index) => (
              <div className='dq-list' key={index}>
                <div className='list-desc'>{index+1}. {`${quiz.question || index}`}</div>
              </div>              
            ))
            
          ) : (
            <p>No quizzes found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Detailedquiz
