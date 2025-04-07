import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import "./home.css";

const Home = () => {
    const [isRegister, setIsRegister] = useState(true);

    const toggleAuth = () => {
        setIsRegister(!isRegister);
        console.log("isRegister", !isRegister);
    };

    return (   
        <div className="auth-container">
            {isRegister ? 
                <>
                    <div className='auth-image'></div>
                    <Login toggleAuth={toggleAuth} setIsRegister={setIsRegister}/>
                </>
            : 
                <>
                    <Register toggleAuth={toggleAuth} />
                    <div className='auth-image'></div>
                </>
            }
        </div>
    );
};

export default Home;