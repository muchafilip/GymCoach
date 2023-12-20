import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: any) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/workout');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-logo">RP</div>
            <h2>Sign in to your account</h2>
            <form onSubmit={handleLogin} className="auth-form">
                <div className="social-buttons">
                    <button className="social-button apple">Continue with Apple</button>
                    <button className="social-button facebook">Continue with Facebook</button>
                    <button className="social-button google">Continue with Google</button>
                </div>
                <div className="divider">OR</div>
                <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                <button className="auth-button" type="submit">Sign in</button>
                <div className="auth-footer">
                    <a href="/register">Don't have an account?</a>
                    <a href="/reset-password">Forgot your password?</a>
                </div>
            </form>
        </div>
    );
};

export default Login;
