import React from 'react';
import './alertBox.css';

const AlertBox = ({ message, type = 'info', onClose , button =false, btnType="delete" , btnFunction=null }) => {
  return (
    <div className="alert-overlay">
      <div className={`alert-box ${type}`}>
        <span>{message}</span>
        <button className="alert-close-btn" onClick={onClose}>
          &times;
        </button>
        {button && (
          (btnType === "delete")? 
          <button className="alert-delete-btn" onClick={btnFunction}>
            Delete
          </button>
          :
          (btnType === "done"?
            
          <button className="alert-done-btn" onClick={btnFunction}>
            Done
          </button>
          :"")
        )}
      </div>
    </div>
  );
};

export default AlertBox;
