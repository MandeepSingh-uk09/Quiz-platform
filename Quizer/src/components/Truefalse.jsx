import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import "./truefalse.css"
import Submitnav from './Submitnav'
import Questions from './Questions'

const Truefalse = () => {

    const location = useLocation();
    console.log(location.state);
    const { quizType , email , username} = location.state || {};
    console.log(quizType);

    const navigate=useNavigate();
    const [selectedOption, setSelectedOption] = useState("True");
    const [correctAnswer, setCorrectanswer] = useState("True");
    const [question,setQuestion]=useState('');
    const [options, setOptions] = useState(['True', 'False']);
    const [questions,setQuestions]=useState([]);

    const[quizDescription,setQuizdescription]=useState();
    const[popUp,setPopup] =useState(false);

    const handleAdd=(e)=>{
        e.preventDefault();
        setQuestions([...questions,{question,options,correctAnswer}]);
        console.log([...questions,{question,options,correctAnswer}]);
        handleClear();
    }
    const handleClear = () => {
        setQuestion('');
        setCorrectanswer('True');
    };

    const handleFinish = async () => {
        console.log(questions);
        try {
            const response = await fetch("http://localhost:8080/api/auth/quiz/truefalse", {
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
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <>
    {!popUp===false ?
    <div className='tf-quiz-page'>
        <Submitnav handleFinish={handleFinish}/>
        <div className='tf-quiz-create'>          
            <Questions questions={questions} />  
            <form className='tf-add-question' onSubmit={handleAdd}>
            <div>
                <div className='tf-question-type'>{questions.length+1}. True/False</div>
                
                <input 
                    type='text' 
                    className='tf-question' 
                    placeholder='Enter your question' 
                    onChange={(e)=>setQuestion(e.target.value)}
                    value={question}
                />
                <div className="tf-options">
                    Click on the correct option
                    <label htmlFor="true" className={`tf-label ${selectedOption === "True" ? "selected" : ""}`}>
                        <input
                            type="radio"
                            id="true"
                            name="TF"
                            value="True"
                            checked={selectedOption === "True"}
                            onChange={(e) => { setCorrectanswer(e.target.value); setSelectedOption("True"); }}
                        />
                        True
                    </label>                
                    <label htmlFor="false" className={`tf-label ${selectedOption === "False" ? "selected" : ""}`}>
                        <input
                            type="radio"
                            id="false"
                            name="TF"
                            value="False"
                            checked={selectedOption === "False"}
                            onChange={(e) => { setCorrectanswer(e.target.value); setSelectedOption("False"); }}
                        />
                        False
                    </label>
                </div>

                <div>Note: By default the value is true.</div>
            </div>
            <div className='tf-save-next'>
                <button type='button'>Clear</button>
                <button type='submit'>Add</button>
            </div>
        </form>
        </div>
    </div>
    :
    <div className='tf-quiz-description'>
        <h3>Enter your Quiz Description here</h3>
        <input type="text" placeholder='write...' onChange={(e)=>{setQuizdescription(e.target.value)}}/>
        <button onClick={()=>{setPopup(true)}}>Next</button>
    </div>
}
   
    </>
  )
}

export default Truefalse
