import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import "./landing.css"
import Navbar from '../components/Navbar'
import { data } from 'react-router-dom';
import Detailedquiz from '../components/Detailedquiz';
import Takequiz from '../components/Takequiz';
const Landing = () => {

    const navigate =useNavigate();

    const [quizcount,setQuizcount]= useState([]);
    const [visibility,setVisibility] = useState("false");
    const [quiztype,setQuiztype] =useState();

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;

    useEffect(()=>{
        quizdata(email);
    },[visibility])

    const quizdata = async (email)=>{
        try{
            const response= await fetch(`http://localhost:8080/api/auth/quizzes?email=${email}`);
            if(response){
                const data =await response.json();
                console.log(data);
                setQuizcount(data);
            }
        }catch(error){
            console.log(error);
        }          
    }

  return (
    <div className='landing-page'>
      <Navbar />
      <div className='quiz-status'>
        <div className='your-quizzes'>
            <h2>You have created,..</h2>
            <div className='quizs-detail'>
                {quizcount.map((quiz, index) => (
                    <div key={index} className="quizs-card" onClick={()=>{setVisibility("true");setQuiztype(quiz.quizType)}}>
                    <div className="card-heading">{quiz.quizType}</div>
                    <div className="number-of-quiz">{quiz.count}</div>
                    </div>
                ))}
            </div>
            <div className='quiz-btn' onClick={()=>{navigate('/dashboard')}}>Create Quiz</div>
        </div>
        <div className='assigned-quizzes'>
            <div className='aq-heading'>Take Quiz</div>
            <Takequiz email={email}/>
        </div>
      </div>
      {visibility==="true"? <Detailedquiz visibility={visibility} setVisibility={setVisibility} quiztype={quiztype} email={email}/>: ""}
    </div>
  )
}

export default Landing
