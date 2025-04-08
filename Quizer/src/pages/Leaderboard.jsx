import React, { useState, useEffect } from "react";
import "./leaderboard.css";
import Navbar from "../components/Navbar";

const Leaderboard = () => {
  const [quizData, setQuizData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState();
  const [quizDescription, setQuizDescription] = useState();
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [leaderboardQuizType, setLeaderboardQuizType] = useState("");
  const [pollData, setPollData] = useState(null);
  const [openEndedResponses, setOpenEndedResponses] = useState([]);
  const [assignedStatus ,setAssignedStatus] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const email = user?.email;

  useEffect(() => {
    if (email) {
      getData(email);
    }
  }, [email]);

  const getData = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/user-quizzes/${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user quizzes");
      }
      const data = await response.json();
      console.log(data);
      setQuizData(data);

      const quizTypes = Object.keys(data);
      console.log(quizTypes);
      if (quizTypes.length > 0) {
        const firstQuizType = quizTypes[0];
        const firstQuiz = data[firstQuizType][0];
        console.log(firstQuiz);

        if (firstQuiz) {
          handleSelect(firstQuiz.totalQuestions, firstQuiz.quizId, firstQuiz.description, firstQuizType);
        }
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    }
  };

  const handleSelect = async (total, id, description, quizType , assigned=false) => {
    setTotalQuestion(total);
    setQuizDescription(description);
    setSelectedQuizId(id);
    setLeaderboardQuizType(quizType);
    setAssignedStatus(assigned);

    if (quizType === "Poll Quiz") {
      fetchPollData(id);
    } else if (quizType === "Open-Ended") {
      fetchOpenEndedData(id);
    }else {
      fetchLeaderboardData(id);
    }
  };

  const fetchLeaderboardData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/leaderboard/${id}`);
      if (!response.ok) {
        setLeaderboard([]);
        return;
      }
      const data = await response.json();
      console.log("Leaderboard Data:", data);
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  const fetchPollData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/poll-leaderboard/${id}`);
      if (!response.ok) {
        setPollData(null);
        return;
      }
      const data = await response.json();
      console.log("Poll Data:", data);
      setPollData(data);
    } catch (error) {
      console.error("Error fetching poll data:", error);
    }
  };

  const fetchOpenEndedData = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/open-ended/${id}`);
      if (!response.ok) {
        setOpenEndedResponses([]);
        return;
      }
      const data = await response.json();
      setOpenEndedResponses(data);
    } catch (error) {
      console.error("Error fetching Open-Ended responses:", error);
    }
  };

  return (
    <div className="leaderboard-container">
      <Navbar />
      <div className="leaderboard-content">
        <aside className="leaderboard-sidebar">
          <h2 className="leaderboard-title">Quiz Types</h2>
          {quizData ? (
            <ul className="leaderboard-list">
              {Object.keys(quizData).map((quizType, index) => (
                <li key={index} className="leaderboard-category">
                  <h3 className="leaderboard-type">{quizType}</h3>
                  <ul className="leaderboard-items">
                    {quizData[quizType].map((quiz, idx) => (
                      <li
                        key={idx}
                        className={`leaderboard-item ${selectedQuizId === quiz.quizId ? "selected" : ""}`}
                        onClick={() => handleSelect(quiz.totalQuestions, quiz.quizId, quiz.description, quizType, quiz.assigned)}
                      >
                       {quiz.assigned? "(A)":""} {quiz.description || quiz.quizId}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <p>Loading quizzes...</p>
          )}
        </aside>

        {leaderboardQuizType === "Open-Ended" ? (
          <div className="leaderboard-results">
            <h2 className="leaderboard-results-title">Open-Ended Responses</h2>
            <h4 className="leaderboard-quiz-description">{quizDescription}</h4>
            <div className="open-ended-container">
              {openEndedResponses.length > 0 ? (
                openEndedResponses.map((entry, index) => (
                  <div key={index} className="open-ended-card">
                    <h3 className="user-name">{entry.username}</h3>
                    <p className="user-email">{entry.email}</p>
                    {entry.responses.map((response, rIndex) => (
                      <div key={rIndex} className="response-item">
                        <strong>Q.{rIndex + 1} {response.question}: </strong>{response.response}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <p>No Open-Ended responses available.</p>
              )}
            </div>
          </div>
        ) : leaderboardQuizType === "Poll Quiz" ? (
          <div className="leaderboard-results">
            <h2 className="leaderboard-results-title">Poll Quiz Results</h2>
            <h4 className="leaderboard-quiz-description">{quizDescription}</h4>
            {pollData ? (
              <div className="poll-container">
                <p className="poll-access-count">Total Access Count: {pollData.accessCount}</p>
                {pollData.questions.map((question, qIndex) => (
                  <div key={qIndex} className="leaderboard-poll-container">
                    <div className="leaderboard-poll-question">
                      Q{qIndex + 1}: {question.question}
                    </div>
                    <div className="leaderboard-poll-options">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="leaderboard-option-text">
                          {option.text} ({option.votes} votes)
                        </div>
                      ))}
                    </div>
                    <div className="leaderboard-poll-vote">
                      {question.options.map((option, oIndex) => {
                        const totalVotes = question.options.reduce((sum, opt) => sum + opt.votes, 0) || 1;
                        const votePercentage = ((option.votes / totalVotes) * 100).toFixed(2);
                        return (
                          <div
                            key={oIndex}
                            className={`leaderboard-poll-option ${oIndex === 0 ? "leaderboard-poll-yes" : "leaderboard-poll-no"}`}
                            style={{ width: `${votePercentage}%`, minWidth: "0px" }}
                          >{votePercentage !== 0.00 ? `${Math.floor(votePercentage)}%`:""}</div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p>No poll data available.</p>
                <p>Nobody played the quiz yet</p>
              </>
            )}
          </div>
        ) : (
          <div className="leaderboard-results">
            <h2 className="leaderboard-results-title">Leaderboard</h2>
            <h4 className="leaderboard-quiz-description">{quizDescription} {assignedStatus? "( Assigned )":""}</h4>
            <div className="leaderboard-scores">
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <div key={index} className="score-card">
                    <div className="user-score">{entry.score}/{totalQuestion}</div>
                    <div className="user-detail">
                      <div className="user-name">{entry.username}</div>
                      <div className="user-email">{entry.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <p>No leaderboard data available.</p>
                  <p>Nobody played the quiz yet</p>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Leaderboard;
