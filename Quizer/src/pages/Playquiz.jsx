import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import "./playquiz.css";

const Playquiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizType, setQuizType] = useState();
  const [displayResult, setDisplayResult] = useState(false);

  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState("");

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const { username, email } = user;

  useEffect(() => {
    if (displayResult && quizType !== "Open-Ended" && quizType !== "Open-Ended" ) {
      console.log(`Final Score: ${score}`);
      sendScore(score); 
  }
    if (displayResult && quizType === "Open-Ended") {
      sendOpenEndedResponses(responses);
    }
    if (id) {
      fetchQuizzes();
    }
  }, [id,displayResult]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/quiz/${id}`);
      const data = await response.json();

      setQuestions(data.questions || []);
      console.log(data);
      setQuizType(data.quizType || '');

      if (data.quizType === "Poll Quiz") {
        updateAccessCount(); // Increment access count
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const updateAccessCount = async () => {
    try {
      await fetch(`http://localhost:8080/api/auth/update-access/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username ,id})
      });
    } catch (error) {
      console.error("Error updating access count:", error);
    }
  };

  const sendScore = async (finalScore) => {
    console.log(finalScore);
    const resultData = { username, email, id, quizType, score: finalScore };

    try {
      const response = await fetch('http://localhost:8080/api/auth/submit-quiz-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });

      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error sending score:', error);
    }
  };

  const handleOptionClick = async (option, questionIndex ,optionIndex) => {
    setSelectedOption(option);

    if (quizType === "Poll Quiz") {
      try {
        await fetch(`http://localhost:8080/api/auth/update-option/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionIndex, optionIndex})
        });
      } catch (error) {
        console.error("Error updating poll count:", error);
      }
    }
  };

  const sendOpenEndedResponses = async (responses) => {
    const resultData = { username, email, id, quizType, responses };
  
    try {
      const response = await fetch('http://localhost:8080/api/auth/submit-open-ended-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resultData),
      });
  
      const data = await response.json();
      console.log('Response from backend:', data);
    } catch (error) {
      console.error('Error sending Open-Ended responses:', error);
    }
  };
  

  const handleNext = () => {   
    if (quizType === "Open-Ended") {
      setResponses(prevResponses => {
        const updatedResponses = [
          ...prevResponses,
          { question: questions[currentQuestionIndex].question, response: currentResponse }
        ];
        return updatedResponses;
      });
      setCurrentResponse("");
    }
  
    if (quizType !== "Poll Quiz" && selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  
    setSelectedOption(null);
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {      
      setDisplayResult(true);
    }
  };

  const handleInputChange = (event) => {
    setCurrentResponse(event.target.value);
  };

  return (
    <>
    {(quizType !== "Open-Ended")?
    <div className="play-quiz">
      <div className="bg">
        {!displayResult ? (
        <div className="player">
          {questions.length > 0 ? (
            <>
              <div className="pl-que">
                <div className="pl-question">{`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`}</div>
                {quizType !== "Poll Quiz" && <div className="score">Score: {score}/{questions.length}</div>}
              </div>
              <div className="pl-options">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}              
                  className={`pl-option ${selectedOption === option ? "selected" : ""}`}
                  onClick={() => handleOptionClick(option, currentQuestionIndex , index)}
                >
                  {quizType === "Poll Quiz" ? option.text : option}
                </div>
              ))}
            </div>
              <div className="pl-control">
                <button className="pl-clear" onClick={() => setSelectedOption(null)}>Clear</button>
                <button className="pl-next" onClick={handleNext}>
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            </>
          ) : (
            <p>Loading quiz...</p>
          )}
        </div>)
        : 
        (displayResult && (
          quizType !== "Poll Quiz" ? (
            <div className="result">
              <div className="re-score">
                <h3>Score</h3>
                <div>{score}</div>
              </div>
              <div className="close-btn" onClick={() => navigate('/landing')}>Done</div>
            </div>
          ) : (
            <div className="result">
            <div className="poll-complete">
            <DotLottieReact
                src="https://lottie.host/0f02feb9-81b6-4795-a12b-3cd4385ec201/5mMaSvXVYK.lottie"
                loop
                autoplay
                speed={1.2}
              />
            </div>
          <div className="close-btn" onClick={() => navigate('/landing')}>Done</div>
        </div>
          )
        ))
        }
      </div>
    </div>
    : 
    <div className="play-quiz">
      <div className="bg">
      { !displayResult?
        <div className="player">
          {questions ? (
            <>
              <div className="pl-que">
                <div className="pl-question">{`Q${currentQuestionIndex + 1}. ${questions[currentQuestionIndex].question}`}</div>
                
              </div>
              <input type="text" className="pl-input" placeholder="Write your answer" value={currentResponse}  onChange={handleInputChange}/>            
              <div className="pl-control">
                <button className="pl-clear" onClick={() => setSelectedOption(null)}>Clear</button>
                <button className="pl-next" onClick={handleNext}>
                  {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                </button>
              </div>
            </>
          ) : (
            <p>Loading quiz...</p>
          )}
        </div>
        : 
        <div className="result">
          <div className="oe-complete">
          <DotLottieReact
              src="https://lottie.host/0f02feb9-81b6-4795-a12b-3cd4385ec201/5mMaSvXVYK.lottie"
              loop
              autoplay
              speed={1.2}
            />
          </div>
          <div className="close-btn" onClick={() => navigate('/landing')}>Done</div>
        </div>
      }
      </div>
    </div>
    }
    </>
  );
};

export default Playquiz;
