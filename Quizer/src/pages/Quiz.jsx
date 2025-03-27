import React from 'react'
import { useState } from 'react'
import './quiz.css'
const Quiz = () => {
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
        setQuestions(prevQuestions => [...prevQuestions, { question, options }]);
        /* setQuestions([...questions,{ question, options }]); */       
        console.log([...questions, { question, options, correctAnswer }]);
        handleClear();
    };

    const handleClear = () => {
        setQuestion('');
        setOptions(['', '', '', '']);
    };

    const handleFinish = () => {
        
        try {
            const response = fetch("http://localhost:8080/api/auth/quiz/MCQ", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    questions
                })
            });
            const result = response.json();
            console.log(result);
        }
        catch (error) {
            console.log(error);
        }
    }

  return (
    <>
    <div className='quiz-page'>
        <div className='action-bar'>
            <div className='action'>{`<- Back`}</div>
            <div className='action' onClick={()=>{handleFinish}}>Finish</div>
        </div>
        <div className='quiz-create'>            
            <div className='no-of-questions' >
                <div className='que-heading'>Questions</div>
                <div className="questions-count">
                    {questions.map((question, index) => (

                        <div className='que-count'>{index + 1}</div>
                    ))}
                    {/* <div className='que-count'>1</div>
                    <div className='que-count'>2</div>
                    <div className='que-count'>3</div>
                    <div className='que-count'>4</div>
                    <div className='que-count'>5</div> */}
                </div>
            </div>
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

export default Quiz
