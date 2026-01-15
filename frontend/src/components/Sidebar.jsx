import React from "react";

export default function Sidebar({ users, online, activeUser, onSelect, me }) {
  return (
    <div className="border-r border-white/10 bg-[#0F172A] p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#94A3B8]">Signed in as</p>
          <p className="font-semibold">{me?.userName}</p>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="rounded-xl border border-white/10 bg-[#020617] px-3 py-2 text-xs text-[#94A3B8] hover:opacity-90"
        >
          Logout
        </button>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-[#94A3B8]">Users</p>
        <div className="mt-3 space-y-2">
          {users.map((u) => {
            const isOnline = online.includes(u._id);
            const isActive = activeUser?._id === u._id;
            return (
              <button
                key={u._id}
                onClick={() => onSelect(u)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  isActive ? "border-[#22D3EE]/50 bg-[#020617]" : "border-white/10 bg-[#0B1224]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{u.userName}</p>
                    <p className="text-xs text-[#94A3B8]">{u.email}</p>
                  </div>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isOnline ? "bg-[#22D3EE]" : "bg-white/20"
                    }`}
                    title={isOnline ? "Online" : "Offline"}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
