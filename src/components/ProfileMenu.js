import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const { user, setUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <Link to="/login" className="profile-link">
        Login
      </Link>
    );
  }

  return (
    <div className="profile-menu">
      <span className="profile-greeting">Hello, {user.name || user.email}</span>
      <Link to="/profile" className="profile-link">Profile</Link>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}