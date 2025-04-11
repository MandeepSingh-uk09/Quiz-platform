import React, { useState } from 'react';
import './questions.css';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import AlertBox from './AlertBox';

const Questions = ({ questions, setQuestions }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [index, setIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const deleteQuestion = (index) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    setShowAlert(false);
  };

  const handleDelete = (index) => {
    setIndex(index);
    const message = (
      <>
        Are you sure you want to delete this question?
        <br />
        <strong>Q.{index + 1}: {questions[index].question}</strong>
      </>
    );
    setAlertMessage(message);
    setAlertType("warning");
    setShowAlert(true);
  };

  return (
    <>
      <div className={`dropdown-toggle-container ${questions.length === 0 ? "none" : ""}`}>
        <button className="dropdown-toggle-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {dropdownOpen ? 'Hide Questions' : 'Show Questions'} {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
        </button>
      </div>

      <div className={`no-of-questions ${questions.length === 0 ? "none" : ""} ${questions.length !== 0 && dropdownOpen ? "dropdown-open" : ""}`}>
        <div className='que-heading'>Questions</div>
        <div className="questions-count">
          {questions.map((question, index) => (
            <div className='que-question' key={index}>
              <div className='que-count'>{index + 1}</div>
              <div className='que-text'>{question.question}</div>
              <span className="question-delete-btn" onClick={() => handleDelete(index)}>&times;</span>
            </div>
          ))}
        </div>
      </div>

      {showAlert && (
        <AlertBox 
        message={alertMessage} type={alertType} onClose={() => setShowAlert(false)}
        button={true} btnType='delete' btnFunction={() => deleteQuestion(index)} 
        />
      )}
    </>
  );
};

export default Questions;
