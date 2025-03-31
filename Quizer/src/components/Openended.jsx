import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import './quiz.css'
import Questions from './Questions'
import Submitnav from './Submitnav'
const Openended = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);
    const { quizType , email , username} = location.state || {};
    
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);   
   
    const[quizDescription,setQuizdescription]=useState();
    const[popUp,setPopup] =useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setQuestions(prevQuestions => [...prevQuestions, { question}]);
        /* setQuestions([...questions,{ question, options }]); */       
        console.log([...questions, { question}]);
        handleClear();
    };

    const handleClear = () => {
        setQuestion('');
    };

    const handleFinish = async () => {
        console.log(questions);
        try {
            const response = await fetch("http://localhost:8080/api/auth/quiz/openended", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: email,
                    quizType: quizType,
                    username: username,
                    quizDescription: quizDescription,
                    questions: questions                    
                })
            });
            const result = await response.json();
            console.log(result);
            navigate('/dashboard');
            
        }
        catch (error) {
            console.log(error);
        }
    }

  return (
    <>
    {!popUp===false ?
    <div className='quiz-page'>
        <Submitnav handleFinish={handleFinish} />
        <div className='quiz-create'>            
            <Questions questions={questions} />
            <form className='add-question' onSubmit={handleSubmit}>
            <div>
                <div className='question-type'>{questions.length+1} Open-Ended</div>

                <input 
                    type='text' 
                    className='oe-question' 
                    placeholder='Enter your question' 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                />
                
            </div>
            <div className='save-next'>
                <button type='button' onClick={handleClear}>Clear</button>
                <button type='submit'>Add</button>
            </div>
        </form>
        </div>
    </div>
    :
    <div className='quiz-description'>
        <h3>Enter your Quiz Description here</h3>
        <input type="text" placeholder='write...' onChange={(e)=>{setQuizdescription(e.target.value)}}/>
        <button onClick={()=>{setPopup(true)}}>Next</button>
    </div>
    }
    </>
  )
}

export default Openended
