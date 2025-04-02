import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import "./home.css";

const Home = () => {
    const [isRegister, setIsRegister] = useState(true);

    const toggleAuth = () => {
        setIsRegister(!isRegister);
    };

    return (   
        <div className="auth-container">
            {isRegister ? 
                <>
                    <div className='auth-image'></div>
                    <Login toggleAuth={toggleAuth} />
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