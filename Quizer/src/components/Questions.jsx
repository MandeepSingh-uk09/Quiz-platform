import React from 'react'
import "./questions.css"
const Questions = ({questions}) => {
  return (
    <>
      <div className='no-of-questions' >
          <div className='que-heading'>Questions</div>
            <div className="questions-count">
              {questions.map((question, index) => (
                  <div className='que-count' key={index}>{index + 1}</div>
                ))}
            </div>
      </div>
    </>
  )
}

export default Questions
