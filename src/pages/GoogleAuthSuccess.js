import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://fullstack-carrental.onrender.com';

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setToken(token);
      axios
        .get(`${API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => {
          setUser(res.data);
          navigate('/');
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [location, setToken, setUser, navigate]);

  return <div>Logging you in...</div>;
}