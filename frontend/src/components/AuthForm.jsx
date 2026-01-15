import React from "react";
import { Link } from "react-router-dom";

export default function AuthForm({ title, onSubmit, fields, footer }) {
  const [form, setForm] = React.useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0F172A] p-6 shadow-lg">
        <h1 className="text-2xl font-semibold">{title}</h1>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          {fields.map((f) => (
            <div key={f.name} className="space-y-2">
              <label className="text-sm text-[#94A3B8]">{f.label}</label>
              <input
                type={f.type || "text"}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#020617] px-4 py-3 outline-none focus:border-[#22D3EE]/60"
                placeholder={f.placeholder}
              />
            </div>
          ))}

          <button className="w-full rounded-xl bg-[#22D3EE] py-3 font-semibold text-black hover:opacity-90">
            Continue
          </button>
        </form>

        <div className="mt-4 text-sm text-[#94A3B8]">
          {footer}
        </div>
      </div>
    </div>
  );
}
