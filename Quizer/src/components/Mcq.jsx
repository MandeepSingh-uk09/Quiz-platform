import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AlertBox from './AlertBox'
import "./mcq.css"
import Questions from './Questions'
import Submitnav from './Submitnav'
const Mcq = () => {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage]= useState("");
    const [alertType, setAlertType] = useState("info");

    
    const navigate = useNavigate();
    const location = useLocation();
    const { quizType , email, username } = location.state || {};
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [questions, setQuestions] = useState([]);

    const [optionindex,setOptionindex]=useState(0)

    const[quizDescription,setQuizdescription]=useState('');
    const[popUp,setPopup] =useState(false);

    const handleQuizdescription = () =>{
        if(quizDescription.trim() === ''){
            setAlertMessage("please enter a quiz description!");
            setAlertType("warning");
            setShowAlert(true);
            return;
        }
        setPopup(true);
    }
    
    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        if (index === 0) {
            setCorrectAnswer(value);
        }
        setOptions(newOptions);
    };
    
    const handleClick = (index) =>{
        console.log(index);
        const newOptions = [...options];    
        console.log(newOptions[index]);
        setOptionindex(index)
        setCorrectAnswer(newOptions[index]);
        
    }


    const handleAdd = (e) => {
        e.preventDefault();
        console.log(question.trim());
        if(question.trim() === ''){
            setAlertMessage("please enter a question!");
            setAlertType("warning");
            setShowAlert(true);
            return;
        }

        if(options[0].trim() === '' || options[1].trim() === ''  || options[2].trim() === ''  || options[3].trim() === ''){
            setAlertMessage("Please fill in all four options!");
            setAlertType("info");
            setShowAlert(true);
            return;
        }        
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
        if(questions.length === 0){
            setAlertMessage("Please add at least one question!");
            setAlertType("error");
            setShowAlert(true);
            return;
        }
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
                    username: username,
                    quizDescription: quizDescription,
                    questions: questions                    
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
            console.log(error);
        }
    }

    const goBack = () =>{
        navigate('/dashboard')
    }

  return (
    <>
    {popUp ?
        <div className='mcq-quiz-page'>
        <Submitnav handleFinish={handleFinish} />
        <div className='mcq-quiz-create'>    
                    
            <Questions questions={questions} setQuestions={setQuestions}/>            
            <form className='mcq-add-question' onSubmit={handleAdd}>
                <div>
                    <div className='mcq-question-type'>Q.{questions.length + 1} MCQ question</div>
                    <input 
                        type='text' 
                        className='mcq-question' 
                        placeholder='Enter your question' 
                        value={question} 
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                    <div className='mcq-options'>
                        {options.map((option, index) => (
                            <input 
                                key={index} 
                                type='text' 
                                className={`mcq-option ${optionindex === index ? 'green': ''}`} 
                                placeholder={`Option ${index + 1}`} 
                                value={option} 
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                onDoubleClick={()=>{handleClick(index)}}
                            />
                        ))}
                    </div>
                    <div className='mcq-info'>Note: Double click to choose the correct answer, <br></br>  
                     <strong>By defaul the first option is correctanswer.</strong>
                    </div>
                </div>
                <div className='mcq-save-next'>
                    <button type='button' onClick={handleClear}>Clear</button>
                    <button type='submit'>Add</button>
                </div>         
            </form>            
        </div>
    </div>
    :
    <div className='mcq-quiz-description'>
        <div className="mcq-description-close-btn" onClick={goBack}>
          &times;
        </div>
        <h3>Enter your Quiz Description here (MCQ) </h3>
        <input 
            type="text" 
            placeholder='write...' 
            onChange={(e) => setQuizdescription(e.target.value)}
        />
        <button onClick={handleQuizdescription}>Next</button>
    </div>

    }
    {showAlert && (<AlertBox message={alertMessage} type={alertType}  onClose={() => setShowAlert(false)}
        />
      )}        
    </>
  )
}

export default Mcq
