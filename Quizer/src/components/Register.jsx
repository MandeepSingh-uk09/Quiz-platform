import React, { useState } from 'react';
import "./register.css"
const Register = ({ toggleAuth }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const response = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: formData.name,
                email: formData.email,
                password: formData.password
            })

            
        });

        if(response.ok){
            const data = await response.json();
            const getID = data._id;
            assignUserQuiz(getID);    
            toggleAuth();      
        }

    };

    const assignUserQuiz = async(id)=>{
        try{
            const response = await fetch(`http://localhost:8080/api/auth/set-assign-quiz/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }            
            });
    
            if(response.ok){
                return
            }
        }catch(err){
            console.log("error in assigning quiz",err)
        }
    }

    return (
        <div className="auth-form-container">
            <form onSubmit={handleRegister}>
                <h2>Register</h2>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
            <p>Have an account? <span className="auth-toggle" onClick={toggleAuth}>Login</span></p>
        </div>
    );
};

export default Register;