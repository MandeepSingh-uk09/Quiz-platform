import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AlertBox from './AlertBox'
import "./poll.css"
import Questions from './Questions';
import Submitnav from './Submitnav';

const Poll = () => {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage]= useState("");
    const [alertType, setAlertType] = useState("info");

    
    const navigate = useNavigate();
    const location = useLocation();

    const { quizType, email, username } = location.state || {};

    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [questions, setQuestions] = useState([]);
    const [quizDescription, setQuizDescription] = useState('');
    const [popUp, setPopup] = useState(false);

    const accessCount = 0;

    const handleQuizdescription = () =>{
        if(quizDescription.trim() === ''){
            setAlertMessage("please enter a quiz description!");
            setAlertType("warning");
            setShowAlert(true);
            return;
        }
        setPopup(true);
    }

    // Handle option input changes
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    // Add question to the list
    const handleAdd = (e) => {
        e.preventDefault();

        if(question.trim() === ''){
            setAlertMessage("please enter a question!");
            setAlertType("warning");
            setShowAlert(true);
            return;
        }

        if(options[0].trim() === '' || options[1].trim() === ''){
            setAlertMessage("Please fill in all options!");
            setAlertType("info");
            setShowAlert(true);
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
        if(questions.length === 0){
            setAlertMessage("Please add at least one question!");
            setAlertType("error");
            setShowAlert(true);
            return;
        }
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

    const goBack = () =>{
        navigate('/dashboard')
    }

    return (
        <>
            {popUp ? (
                <div className='poll-quiz-page'>
                    <Submitnav handleFinish={handleFinish} />
                    <div className='poll-quiz-create'>
                        <Questions questions={questions} setQuestions={setQuestions}/>
                        <form className='poll-add-question' onSubmit={handleAdd}>
                            <div>
                                <div className='poll-question-type'>Q.{questions.length + 1} Poll question</div>
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
            )
            :
            (
                <div className='poll-quiz-description'>
                    <div className="poll-description-close-btn" onClick={goBack}>
                        &times;
                    </div>
                    <h3>Enter your Quiz Description here (Poll)</h3>
                    <input
                        type="text"
                        placeholder='Write here...'
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                    />
                    <button onClick={handleQuizdescription}>Next</button>
                </div>
            ) }
            {showAlert && (<AlertBox message={alertMessage} type={alertType}  onClose={() => setShowAlert(false)}
                    />
                )}   
        </>
    );
};

export default Poll;
