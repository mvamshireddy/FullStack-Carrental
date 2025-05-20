import React from "react";
import { Link } from "react-router-dom";
import "./ForgotPasswordPage.css";

const ForgotPasswordPage = () => (
  <div className="login-page">
    <div className="login-container">
      <h1>Forgot Password</h1>
      <p>
        Password reset functionality is coming soon.
        <br />
        <Link to="/login">Back to Login</Link>
      </p>
    </div>
  </div>
);

export default ForgotPasswordPage;