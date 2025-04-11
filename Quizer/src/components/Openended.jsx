import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AlertBox from './AlertBox'
import "./openended.css"
import Questions from './Questions'
import Submitnav from './Submitnav'
const Openended = () => {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage]= useState("");
    const [alertType, setAlertType] = useState("info");

    
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state);
    const { quizType , email , username} = location.state || {};
    
    const [question, setQuestion] = useState('');
    const [questions, setQuestions] = useState([]);   
   
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
    
    const handleAdd = (e) => {
        e.preventDefault();
        console.log(question.trim());
        if(question.trim() === ''){
            setAlertMessage("please enter a question!");
            setAlertType("warning");
            setShowAlert(true);
            return;
        }
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
        if(questions.length === 0){
          setAlertMessage("Please add at least one question!");
          setAlertType("error");
          setShowAlert(true);
          return;
      }
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
    {popUp ? (
      <div className='oe-quiz-page'>
        <Submitnav handleFinish={handleFinish} />
        <div className='oe-quiz-create'>
          <Questions questions={questions} setQuestions={setQuestions}/>
          <form className='oe-add-question' onSubmit={handleAdd}>
            <div>
              <div className='oe-question-type'>
                Q.{questions.length + 1} Open-Ended question
              </div>

              <input
                type='text'
                className='oe-question'
                placeholder='Enter your question'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
            </div>
            <div className='oe-save-next'>
              <button type='button' onClick={handleClear}>
                Clear
              </button>
              <button type='submit'>Add</button>
            </div>
          </form>
        </div>
      </div>
    ) : (
      <div className='oe-quiz-description'>
        <div className="oe-description-close-btn" onClick={goBack}>
          &times;
        </div>
        <h3>Enter your Quiz Description here (Open-Ended)</h3>
        <input
          type='text'
          placeholder='write...'
          onChange={(e) => {
            setQuizdescription(e.target.value);
          }}
        />
        <button onClick={handleQuizdescription}> Next </button>
      </div>
    )}
    {showAlert && (<AlertBox message={alertMessage} type={alertType}  onClose={() => setShowAlert(false)}
            />
          )}   
    </>
  )
}

export default Openended
