import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBox from './AlertBox';
import "./login.css"
const Login = ({ toggleAuth }) => {

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage]= useState("");
    const [alertType, setAlertType] = useState("info");


    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if(!response.ok){
            const errorData = await response.json();
            console.log(errorData);
            console.error("Signup failed:", errorData.message);
            setAlertMessage(errorData.message);
            setAlertType(errorData.type || "error");
            setShowAlert(true);
        }
        else{
            const result = await response.json();
            console.log(result);
            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.result));
            if(result){      
                navigate("/landing");
            }
        }
    };

    return (
        <>
        <div className="auth-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Ready for a Quiz</h2>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <span className="auth-toggle" onClick={toggleAuth}>Register</span></p>
        </div>
        {showAlert && (<AlertBox message={alertMessage} type={alertType}  onClose={() => setShowAlert(false)}
        />
      )}
        </>
    );
};

export default Login;