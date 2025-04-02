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
    
    <div className={`quiz-modal ${visibility === "true" ? "visible" : ""}`}>
            {close === "false" ? 
            <div className="quiz-container">
                <span className="quiz-detail-close-btn" onClick={() => setVisibility("false")}>&times;</span>
                <h3 className="quiz-title">Your {quiztype} Quizzes</h3>

                {quizzes.length > 0 ? (
                    <ul className="quiz-list">
                        {quizzes.map((quiz, index) => (
                            <li className="quiz-item" key={quiz._id} onClick={() => {handleSelect(index)}}>
                                <span className="quiz-item-desc">{quiz.quizDescription || quiz._id}</span>
                                <IconButton className="delete-icon" aria-label="delete" onClick={(e) => { e.stopPropagation(); handleDeleteQuiz(quiz._id); }}>
                                    <DeleteIcon />
                                </IconButton>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No quizzes found.</p>
                )}
            </div>
            : 
            <div className={`questions-container ${close === "false" ? "" : "visible"}`}>
                <span className="quiz-detail-close-btn" onClick={() => { setClose("false"); setQuestions([]); }}>&times;</span>
                <h3 className="quiz-title">Your Questions</h3>
                {questions.length > 0 ? (
                    <ul className="quiz-list">
                        {questions.map((quiz, index) => (
                            <li className="question-item" key={index}>
                                {index + 1}. {quiz.question || index}
                            </li>
                        ))}  
                        <li className="question-item" >
                                hey
                        </li>       
                        <li className="question-item" >
                                hey
                        </li>  
                        <li className="question-item" >
                                hey
                        </li>  
                        <li className="question-item" >
                                hey
                        </li>                 
                        <li className="question-item" >
                                hey
                        </li>  
                        <li className="question-item" >
                                hey
                        </li>  
                        <li className="question-item" >
                                hey
                        </li>  
                        <li className="question-item" >
                                hey
                        </li>  
                    </ul>
                ) : (
                    <p>No questions found.</p>
                )}
            </div>
            }
        </div>
      
  )
}

export default Detailedquiz
