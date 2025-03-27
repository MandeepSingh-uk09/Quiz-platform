import React from 'react'
import { useNavigate } from 'react-router-dom';
import './dashboard.css'
import Navbar from '../components/Navbar'
const Dashboard = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const email = user.email;
    const navigate = useNavigate();
    const handleClick = (quizType) => {
        switch(quizType){
            case "MCQ":
                navigate("/quiz", {state: {quizType: "MCQ", email: email}});
                break;
            case "True/False":
                navigate("/quiz");
                break;
            case "Poll Quiz":
                navigate("/quiz");
                break;
            case "Open-Ended":
                navigate("/quiz");
                break;
            default:
                navigate("/quiz");
        }  
    }

  return (
    <div className='dashboard'>
        <Navbar />
        <div className='greeting'>Hello Meandeep , ready to create your own quiz... </div>
        <div className='quiz-cards'>
            
            <div className='quiz-card'>
                <div className='quiz-card-title'>MCQ</div>
                <div className='quiz-card-description'>It offers a statement and then students must select the correct answers from a list of possibilities. </div>
                <button className='quiz-card-button' onClick={() => handleClick("MCQ")}>Start</button>
            </div>
            <div className='quiz-card'>
                <div className='quiz-card-title'>True/False</div>
                <div className='quiz-card-description'>You are asked to judge whether a factual statement is either true or false.</div>
                <button className='quiz-card-button' onClick={() => handleClick("True/False")}>Start</button>
            </div>
            <div className='quiz-card'>
                <div className='quiz-card-title'>Poll Quiz</div>
                <div className='quiz-card-description'>combines the quick feedback of a poll with the engagement of a quiz</div>
                <button className='quiz-card-button' onClick={() => handleClick("Poll Quiz")}>Start</button>
            </div>
            <div className='quiz-card'>
                <div className='quiz-card-title'>Open-Ended</div>
                <div className='quiz-card-description'> questions are designed to elicit a detailed and thoughtful response, rather than a simple  answer</div>
                <button className='quiz-card-button' onClick={() => handleClick("Open-Ended")}>Start</button>
            </div>            
        </div>
    </div>
  )
}

export default Dashboard
