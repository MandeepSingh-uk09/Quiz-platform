import React from "react";
import { useNavigate } from "react-router-dom";
import "./submitnav.css";

const Submitnav = ({ handleFinish }) => {
  const navigate = useNavigate();

  return (
    <div className="action-bar">
      <button className="action back-btn" onClick={() => navigate("/dashboard")} aria-label="Go back">
      ⬅ Back
      </button>
      <button className="action finish-btn" onClick={handleFinish} aria-label="Finish">
        Finish
      </button>
    </div>
  );
};

export default Submitnav;
