import { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Make sure this file exists
import Navbar from '../components/navbar';
import "../components/Navbar.css"; // Optional: for navbar-specific styles

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      console.log('[LOGIN] Sending POST to /api/auth/login with:', { email: cleanEmail, password });
      const res = await axios.post('http://localhost:5000/api/auth/login', { email: cleanEmail, password });
      console.log('[LOGIN] Response received:', res);
      if (res.data && res.data.success && res.data.token && res.data.user) {
        localStorage.setItem('token', res.data.token);
        console.log('[LOGIN] Login successful, user:', res.data.user);
        if (res.data.user.role === 'trainer') {
          window.location.href = '/home/dashboard';
        } else if (res.data.user.role === 'trainee') {
          window.location.href = '/trainee';
        } else {
          alert('Unknown user role.');
        }
      } else {
        console.error('[LOGIN] Invalid response from server:', res.data);
        alert('Invalid response from server.');
      }
    } catch (err) {
      console.error('[LOGIN] Error during login:', err);
      if (err.response && err.response.data && err.response.data.message) {
        alert('Login error: ' + err.response.data.message);
      } else {
        alert('Server error or network issue. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <h2>TrainEase AI Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button onClick={handleLogin} className="login-button">
            Login
          </button>
        </div>
      </div>
    </>
  );
}
