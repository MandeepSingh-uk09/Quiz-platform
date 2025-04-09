import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./poll.css"
import Questions from './Questions';
import Submitnav from './Submitnav';

const Poll = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);

    const { quizType, email, username } = location.state || {};

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [questions, setQuestions] = useState([]);
    const [quizDescription, setQuizDescription] = useState('');
    const [popUp, setPopup] = useState(false);

    const accessCount = 0;

    // Handle option input changes
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Add question to the list
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question.trim() || options.some(option => !option.trim())) {
            alert("Please enter a question and options.");
            return;
        }

        const formattedOptions = options.map(option => ({
            text: option,
            votes: 0 // Initialize votes to 0
        }));

        setQuestions(prevQuestions => [
            ...prevQuestions,
            { question, options: formattedOptions }
        ]);

        console.log([...questions, { question, options: formattedOptions }]);

        handleClear();
    };

    // Reset input fields after adding a question
    const handleClear = () => {
        setQuestion('');
        setOptions(['', '']);
    };

    // Submit final quiz
    const handleFinish = async () => {
        console.log(questions);
        try {
            const response = await fetch("http://localhost:8080/api/auth/quiz/poll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    email,
                    quizType,
                    username,
                    quizDescription,
                    accessCount,
                    questions
                })
            });

            const result = await response.json();
            if (!result.id) {
                throw new Error("Quiz ID not found in response.");
            }
            console.log(result.id);
            navigate('/assign-quiz', {state:{quizID :result.id }});
        } 
        catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    return (
        <>
            {!popUp ? (
    <div className='poll-quiz-description'>
        <h3>Enter your Quiz Description here</h3>
        <input
            type="text"
            placeholder='Write here...'
            value={quizDescription}
            onChange={(e) => setQuizDescription(e.target.value)}
        />
        <button onClick={() => setPopup(true)}>Next</button>
    </div>
) : (
    <div className='poll-quiz-page'>
        <Submitnav handleFinish={handleFinish} />
        <div className='poll-quiz-create'>
            <Questions questions={questions} />
            <form className='poll-add-question' onSubmit={handleSubmit}>
                <div>
                    <div className='poll-question-type'>{questions.length + 1} Poll</div>
                    <input
                        type='text'
                        className='poll-question'
                        placeholder='Enter your question'
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className='poll-options'>
                        {options.map((option, index) => (
                            <input
                                key={index}
                                type='text'
                                className='poll-option'
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                </div>
                <div className='poll-save-next'>
                    <button type='button' onClick={handleClear}>Clear</button>
                    <button type='submit'>Add</button>
                </div>
            </form>
        </div>
    </div>
)}
        </>
    );
};

export default Poll;
