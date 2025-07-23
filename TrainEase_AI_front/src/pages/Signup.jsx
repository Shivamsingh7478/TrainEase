import Navbar from "../components/navbar";
import "./Signup.css";
import "../components/Navbar.css"
import { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

export default function Signup(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setError("");
        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { email, password });
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                // Redirect based on role
                if (res.data.user.role === 'trainer') {
                    window.location.href = '/home/dashboard';
                } else if (res.data.user.role === 'trainee') {
                    window.location.href = '/trainee';
                }
            } else {
                setError(res.data.message || 'Signup failed.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed.');
        }
        setLoading(false);
    };

    return(
        <>
        <Navbar/>
   <div className="signup-container">
     
    <div className="signup-box">
        <h2>Sign up</h2>
        <input type="text" placeholder="Email" className="login-input" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="login-input" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm Password" className="login-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        <p>Already registered? <Link to="/login">Login</Link></p>
        <button className="signup-btn" onClick={handleSignup} disabled={loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
        {error && <p style={{color:'red', marginTop:10}}>{error}</p>}
    </div>
   </div>
   </>
    );
}