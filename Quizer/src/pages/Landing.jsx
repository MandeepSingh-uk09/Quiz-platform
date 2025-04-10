import React, { useState , useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import "./landing.css"
import Navbar from '../components/Navbar'
import Detailedquiz from '../components/Detailedquiz';
import Takequiz from '../components/Takequiz';
import Getassignedquiz from '../components/Getassignedquiz';
const Landing = () => {

    const navigate =useNavigate();

    const [quizcount,setQuizcount]= useState([]);
    const [visibility,setVisibility] = useState("false");
    const [quiztype,setQuiztype] =useState();
    const [selected,setSelected] = useState(false);
    const [assignedQuizzes,setAssignedQuizzes]=useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user.email;
    const userID =user._id;

    const toggleSelected = (type) =>{
        if(type==="all"){
            setSelected(false);
        }else if(type ==="assigned"){
            setSelected(true);
        }
    }

    useEffect(()=>{
        quizdata(email);
        qetaAssignedQuizzes(userID);
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

    const qetaAssignedQuizzes = async (userID) =>{
        try{
            const response = await fetch(`http://localhost:8080/api/auth/get-assigned-quizzes/${userID}`)

            if(response.ok){
                const data = await response.json();
                console.log(data);
                setAssignedQuizzes(data.assignedQuiz);
            }
        }catch(error){
            console.log(error);
        }
    }

  return (
    <div className='landing-container'>
        <div className='landing-page'>
        <Navbar />
        <div className='quiz-status'>
            <div className='your-quizzes'>
                <h2> {user.username}, you have created...</h2>
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
                <div className='aq-heading'>Take Quiz
                    <div className='aq-type'>
                        <div className={`aq-all ${selected? "": "selected"}`} onClick={()=>{toggleSelected("all")}}>
                            Open Quizzes
                        </div>
                        <div className={`aq-assigned ${selected? "selected": ""}`} onClick={()=>{toggleSelected("assigned")}}>
                            Assigned Quizes {`(${assignedQuizzes.length})`}
                        </div>                    
                    </div>
                </div>
                <>
                {selected ?  
                <Getassignedquiz email={email} assignedQuizzes={assignedQuizzes}/>
                :
                <Takequiz email={email} userAssignedQuizzes={assignedQuizzes}/>
                }
                </>
            </div>
        </div>
        {visibility==="true"? <Detailedquiz visibility={visibility} setVisibility={setVisibility} quiztype={quiztype} email={email}/>: ""}
        </div>
    </div>
  )
}

export default Landing
