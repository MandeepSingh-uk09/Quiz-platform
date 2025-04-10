import React from 'react';
import './alertBox.css';

const AlertBox = ({ message, type = 'info', onClose }) => {
  return (
    <div className="alert-overlay">
      <div className={`alert-box ${type}`}>
        <span>{message}</span>
        <button className="alert-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default AlertBox;
