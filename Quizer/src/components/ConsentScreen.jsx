import React from 'react';
import './consentScreen.css';
import { useNavigate } from 'react-router-dom';

const ConsentScreen = ({ onStart}) => {

    const navigate = useNavigate();
    const handleBack =()=>{
        navigate("/landing");
    }
  return (
    <div className="consent-container">
      <div className="consent-box">
        <div className="animation-box">
        <video src="http://localhost:8080/uploads/Consent.webm" autoPlay loop muted />
        </div>
        <h2 className="consent-title">Do you want to start the game?</h2>
        <p className="consent-message">
          Please confirm to proceed or go back to the previous screen.
        </p>

        <div className="button-group">
        <button className="back-button" onClick={handleBack}>Go Back</button>
          <button className="start-button" onClick={onStart}>Start Game</button>
        </div>
      </div>
    </div>
  );
};

export default ConsentScreen;
