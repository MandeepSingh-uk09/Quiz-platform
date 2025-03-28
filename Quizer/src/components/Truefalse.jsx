import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './quiz.css'
import Submitnav from './Submitnav'
import Questions from './Questions'

const Truefalse = () => {

    const location = useLocation();
    console.log(location.state);
    const { quizType , email } = location.state || {};
    console.log(quizType);

    const navigate=useNavigate();

    const [selectedOption, setSelectedOption] = useState("True");
    const [question,setQuestion]=useState('');
    const [questions,setQuestions]=useState([]);

    const handleAdd=(e)=>{
        e.preventDefault();
        setQuestions([...questions,{question,selectedOption}]);
        console.log([...questions,{question,selectedOption}]);
        handleClear();
    }
    const handleClear = () => {
        setQuestion('');
        setSelectedOption('True');
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
    <div className='quiz-page'>
        <Submitnav  handleFinish={handleFinish}/>
        <div className='quiz-create'>          
            <Questions questions={questions} />  
            <form className='add-question' onSubmit={handleAdd}>
            <div>
                <div className='question-type'>True/False</div>
                
                <input 
                    type='text' 
                    className='question' 
                    placeholder='Enter your question' 
                    onChange={(e)=>setQuestion(e.target.value)}
                    value={question}
                />
                <div className='options'>
                click on the correct option
                <label htmlFor="true" className={`tf-label ${selectedOption === "True" ? "selected" : ""}`}>
                <input
                        type="radio"
                        id="true"
                        name="TF"
                        value="True"
                        checked={selectedOption === "True"}
                        onChange={(e) => setSelectedOption(e.target.value)}
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
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />
                    False
                </label>
                </div>
                <div>Note: By default the value is true.</div>
            </div>
            <div className='save-next'>
                <button type='button'>Clear</button>
                <button type='submit'>Add</button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Truefalse
