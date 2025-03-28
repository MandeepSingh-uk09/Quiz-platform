import React from 'react'
import { useState } from 'react'
import Mcq from '../components/Mcq'
import Truefalse from '../components/Truefalse'
import Poll from '../components/Poll'
import Openended from '../components/Openended'
import { useLocation } from 'react-router-dom'

const Quiz = () => {
    const location = useLocation();
    console.log(location.state);
    const { quizType } = location.state || {};
    console.log(quizType);
    const startQuiz = ()=>{switch(quizType){
        case "MCQ":
            return <Mcq />;
        case "True/False":
            return <Truefalse />;
        case "Poll Quiz":
            return <Poll />;
        case "Open-Ended":
            return <Openended />;
        default:
            return <Mcq />;
    }}
  return (
    <>
        {startQuiz()}
    </>
  )
}

export default Quiz
