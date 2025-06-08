import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./ProfilePage.css";

const API_URL = process.env.REACT_APP_API_URL || "https://fullstack-carrental.onrender.com/api";

const ProfilePage = () => {
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
    // eslint-disable-next-line
  }, []);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <div style={{ padding: 32 }}>Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2>User Profile</h2>
        <div className="profile-info">
          <div><span className="profile-label">Name:</span> {user.name}</div>
          <div><span className="profile-label">Email:</span> {user.email}</div>
          <div><span className="profile-label">Phone:</span> {user.phone || "-"}</div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;