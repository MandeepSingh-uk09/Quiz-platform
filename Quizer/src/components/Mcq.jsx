import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import './quiz.css'
import Questions from './Questions'
import Submitnav from './Submitnav'
const Mcq = () => {
    
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);
    const { quizType , email } = location.state || {};
    console.log(quizType);
    console.log(email);
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [questions, setQuestions] = useState([]);
    
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        if (index === 0) {
            setCorrectAnswer(value);
        }
        setOptions(newOptions);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setQuestions(prevQuestions => [...prevQuestions, { question, options, correctAnswer }]);
        /* setQuestions([...questions,{ question, options }]); */       
        console.log([...questions, { question, options, correctAnswer }]);
        handleClear();
    };

    const handleClear = () => {
        setQuestion('');
        setOptions(['', '', '', '']);
    };

    const handleFinish = async () => {
        console.log(questions);
        try {
            const response = await fetch("http://localhost:8080/api/auth/quiz/mcq", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email: email,
                    quizType: quizType,
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
    <div className='quiz-page'>
        <Submitnav handleFinish={handleFinish} />
        <div className='quiz-create'>            
            <Questions questions={questions} />
            <form className='add-question' onSubmit={handleSubmit}>
            <div>
                <div className='question-type'>{questions.length+1} MCQ</div>

                <input 
                    type='text' 
                    className='question' 
                    placeholder='Enter your question' 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <div className='options'>
                    {options.map((option, index) => (
                        <input 
                            key={index} 
                            type='text' 
                            className='option' 
                            placeholder={`Option ${index + 1}`} 
                            value={option} 
                            onChange={(e) => handleOptionChange(index, e.target.value)
                            }
                        />
                    ))}
                </div>
                <div>Note: Place the correct answer as the first option.</div>
            </div>
            <div className='save-next'>
                <button type='button' onClick={handleClear}>Clear</button>
                <button type='submit'>Add</button>
            </div>
        </form>
        </div>
    </div>


            <div className='quiz-title'></div>
            <div className='quiz-description'></div>
    </>
  )
}

export default Mcq
