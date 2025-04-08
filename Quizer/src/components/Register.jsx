import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import "./register.css";

const Register = ({ toggleAuth }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const data = new FormData();
        data.append("username", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (photo) {
            data.append("photo", photo);
        }

        const response = await fetch("http://localhost:8080/api/auth/signup", {
            method: "POST",
            body: data,
        });

        if (response.ok) {
            const resData = await response.json();
            const getID = resData._id;
            assignUserQuiz(getID);
            toggleAuth();
        }
    };

    const assignUserQuiz = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/auth/set-assign-quiz/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response.ok) return;
        } catch (err) {
            console.log("Error in assigning quiz", err);
        }
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleRegister} encType="multipart/form-data">
                <h2>Register</h2>
                <div className="photo-preview">
                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" />
                    ) : (
                        <FaUser size={30} color="#ccc" />
                    )}
                </div>
                <input
                    type="file" name="photo" accept="image/*" onChange={handlePhotoChange} className="photo-upload"/>
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
