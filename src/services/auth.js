import axios from "axios";
import API_BASE_URL from "../api";

export function loginUser(credentials) {
  return axios.post(`${API_BASE_URL}/users/login`, credentials);
}

export function registerUser(data) {
  return axios.post(`${API_BASE_URL}/users/register`, data);
}