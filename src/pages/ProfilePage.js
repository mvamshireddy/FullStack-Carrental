import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
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