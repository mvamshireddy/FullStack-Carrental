import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./RegisterPage.css";

const API_URL = process.env.REACT_APP_API_URL;

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      // 1. Register the user
      await axios.post(`${API_URL}/users/register`, form);

      // 2. Immediately log in the user after successful registration
      const loginRes = await axios.post(`${API_URL}/users/login`, {
        email: form.email,
        password: form.password
      });
      const { token, user } = loginRes.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccessMsg("Registration successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message
          ? error.response.data.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required disabled={loading} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} required disabled={loading} />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {errorMsg && <div style={{ color: "red", marginTop: 8 }}>{errorMsg}</div>}
        {successMsg && <div style={{ color: "green", marginTop: 8 }}>{successMsg}</div>}
        <div className="divider">OR</div>
        <Link to="/login">Already have an account? Login</Link>
      </div>
    </div>
  );
};

export default RegisterPage;