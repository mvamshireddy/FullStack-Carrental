import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Handle form submission for email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      const { token } = response.data;

      // Save token to localStorage and navigate to dashboard or home
      localStorage.setItem('token', token);
      alert('Login Successful');
      navigate('/dashboard'); // Adjust route as needed
    } catch (error) {
      console.error('Login Error:', error);
      alert('Invalid credentials. Please try again.');
    }
  };

  // Handle Google login success
  const handleGoogleSuccess = async (response) => {
    try {
      const { tokenId } = response;
      const googleResponse = await axios.post('http://localhost:5000/api/auth/google/callback', { token: tokenId });
      const { token } = googleResponse.data;

      // Save token to localStorage and navigate to dashboard or home
      localStorage.setItem('token', token);
      alert('Google Login Successful');
      navigate('/dashboard'); // Adjust route as needed
    } catch (error) {
      console.error('Google Login Error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  // Handle Google login failure
  const handleGoogleFailure = (error) => {
    console.error('Google Login Failed:', error);
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {/* Email/Password Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="divider">OR</div>

        {/* Google Login Button */}
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
          className="google-login-button"
        />
      </div>
    </div>
  );
};

export default LoginPage;