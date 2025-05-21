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

  if (!user) return <div style={{ padding: 32 }}>Loading profile...</div>;

  return (
    <div style={{ maxWidth: 400, margin: "48px auto", background: "#fff", padding: 32, borderRadius: 8, boxShadow: "0 2px 8px #ddd" }}>
      <h2>User Profile</h2>
      <div><b>Name:</b> {user.name}</div>
      <div><b>Email:</b> {user.email}</div>
      <div><b>Phone:</b> {user.phone || "-"}</div>
      <button
        style={{ marginTop: 24 }}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >Logout</button>
    </div>
  );
};

export default ProfilePage;