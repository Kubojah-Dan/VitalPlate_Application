import React, { useEffect, useState } from "react";
import { apiFetch } from "../apiClient";
import { useAuth } from "../context/AuthContext.jsx";

const NotificationsPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/api/notifications", { token }).then(setData);
  }, [token]);

  if (!data) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-4">Meal Reminders</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
        {data.reminders.map(r => (
          <div key={r.type} className="flex justify-between">
            <span>{r.type}</span>
            <span>{r.time}:00</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;


