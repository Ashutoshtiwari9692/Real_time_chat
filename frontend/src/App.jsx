import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Chat from "./pages/Chat.jsx";

const getToken = () => localStorage.getItem("token");

export default function App() {
  const token = getToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/chat" : "/login"} />} />
        <Route path="/login" element={token ? <Navigate to="/chat" /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/chat" /> : <Signup />} />
        <Route path="/chat" element={token ? <Chat /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
