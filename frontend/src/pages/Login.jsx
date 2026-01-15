import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm.jsx";
import { api, setAuthToken } from "../api/axios.js";

export default function Login() {
  const nav = useNavigate();

  async function onSubmit(form) {
    const { data } = await api.post("/api/auth/login", form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setAuthToken(data.token);
    nav("/chat");
  }

  return (
    <AuthForm
      title="Welcome back"
      fields={[
        { name: "email", label: "Email", placeholder: "E-mail" },
        { name: "password", label: "Password", type: "password", placeholder: "******" }
      ]}
      onSubmit={onSubmit}
      footer={
        <>New here? <a className="text-[#A855F7]" href="/signup">Create account</a></>
      }
    />
  );
}
