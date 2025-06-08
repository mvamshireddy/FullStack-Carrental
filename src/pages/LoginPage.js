import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://fullstack-carrental.onrender.com';

const GoogleLogo = () => (
  <svg className="google-icon" width="22" height="22" viewBox="0 0 22 22">
    <g>
      <path fill="#4285F4" d="M21.805 11.22c0-.78-.07-1.56-.22-2.32H11.22v4.39h5.96c-.25 1.26-1.01 2.33-2.15 3.05v2.53h3.47c2.03-1.87 3.2-4.62 3.2-7.65z"/>
      <path fill="#34A853" d="M11.22 22c2.89 0 5.32-.96 7.09-2.63l-3.47-2.53c-.96.65-2.19 1.03-3.62 1.03-2.78 0-5.13-1.88-5.97-4.41H2.63v2.61C4.38 19.7 7.59 22 11.22 22z"/>
      <path fill="#FBBC05" d="M5.25 13.46c-.25-.74-.39-1.52-.39-2.34s.14-1.6.39-2.34v-2.61H2.63C1.94 7.8 1.5 9.34 1.5 11c0 1.66.44 3.2 1.13 4.54l2.62-2.08z"/>
      <path fill="#EA4335" d="M11.22 6.69c1.57 0 2.97.54 4.08 1.6l3.06-3c-1.77-1.67-4.2-2.69-7.14-2.69-3.63 0-6.84 2.3-8.59 5.51l2.62 2.08c.84-2.53 3.19-4.41 5.97-4.41z"/>
      <path fill="none" d="M0 0h22v22H0z"/>
    </g>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => navigate(redirectPath), 1000);
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

  // Google Login Handler
  const handleGoogleLogin = () => {
    window.location.href =`${API_URL}/api/auth/google`||'https://fullstack-carrental.onrender.com/api/auth/google';
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
        <button
          className="google-login-button"
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
        >
          <GoogleLogo />
          <span className="google-btn-text">Continue with Google</span>
        </button>
        <Link to="/register" style={{ display: 'block', marginTop: 16 }}>
          Don't have an account? Register
        </Link>
        <Link to="/forgot-password" style={{ display: 'block', marginTop: 8 }}>
          Forgot password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;