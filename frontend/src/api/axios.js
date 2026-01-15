import axios from "axios";

export const api = axios.create({
  baseURL: "https://real-time-chat-backend-ashutosh.onrender.com",
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

