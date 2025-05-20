import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css';
import { loginUser } from "../services/auth";

// inside your component


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
  

    try {
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => navigate('/profile'), 1000);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message
          ? error.response.data.message
          : 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMsg && <div style={{ color: 'red', marginTop: 8 }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: 'green', marginTop: 8 }}>{successMsg}</div>}
        <div className="divider">OR</div>
        <Link to="/register">Don&apos;t have an account? Register</Link>
        <br />
        <Link to="/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};

export default LoginPage;