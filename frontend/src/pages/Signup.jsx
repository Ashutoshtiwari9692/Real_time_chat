import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { api, setAuthToken } from "../api/axios.js";

export default function Signup() {
  const nav = useNavigate();

  async function onSubmit(form) {
    const { data } = await api.post("/api/auth/signup", form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthToken(data.token);
    nav("/chat");
  }

  return (
    <AuthForm
      title="Create your account"
      fields={[
        { name: "userName", label: "Username", placeholder: "Enter your name" },
        { name: "email", label: "Email", placeholder: "E-mail" },
        { name: "password", label: "Password", type: "password", placeholder: "***********" }
      ]}
      onSubmit={onSubmit}
      footer={
        <>Already have an account? <a className="text-[#22D3EE]" href="/login">Login</a></>
      }
    />
  );
}
