import React from 'react';
import { GoogleLogin } from 'react-google-login';

const GoogleLoginButton = () => {
  const handleSuccess = (response) => {
    // Send the token to your backend for validation
    fetch('http://localhost:5000/api/auth/google/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.tokenId }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Store JWT token from backend
        localStorage.setItem('token', data.token);
        alert('Login successful!');
      })
      .catch((error) => console.error('Error logging in:', error));
  };

  const handleFailure = (error) => {
    console.error('Google Login Failed:', error);
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Login with Google"
      onSuccess={handleSuccess}
      onFailure={handleFailure}
      cookiePolicy={'single_host_origin'}
    />
  );
};

export default GoogleLoginButton;