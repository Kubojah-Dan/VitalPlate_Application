import { Coffee, Sun, Moon, Utensils, Clock } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { subscribeUser } from "../utils/subscribeToPush.js";

const NotificationPanel = () => {
  const currentHour = new Date().getHours();

  const reminders = [
    { type: "Breakfast", time: 8, icon: Coffee, message: "Time for a healthy start!" },
    { type: "Lunch", time: 13, icon: Sun, message: "Refuel your energy." },
    { type: "Snack", time: 16, icon: Utensils, message: "Grab a healthy bite." },
    { type: "Dinner", time: 19, icon: Moon, message: "Time to wind down." },
  ];

  const active = reminders.find(r => currentHour <= r.time) || reminders[0];

  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const enablePush = async () => {
    try {
      setLoading(true);
      await subscribeUser(token);
      alert("Subscribed to push notifications");
    } catch (err) {
      console.error(err);
      alert("Push subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-xl">
      <div className="px-4 py-3 border-b border-slate-800 bg-slate-950">
        <h3 className="text-sm font-semibold text-white">Meal Tracker</h3>
      </div>

      <div className="p-2">
        {reminders.map(r => {
          const Icon = r.icon;
          const isActive = r.type === active.type;

          return (
            <div
              key={r.type}
              className={`flex items-center gap-3 p-3 rounded-lg mb-1 ${
                isActive ? "bg-emerald-900/30" : "opacity-50"
              }`}
            >
              <div className={`p-2 rounded-full ${isActive ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-500"}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">{r.type}</p>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {r.time}:00
                </p>
              </div>
            </div>
          );
        })}

        <div className="mt-3">
          <button onClick={enablePush} disabled={loading} className="w-full bg-emerald-600 px-3 py-2 rounded-lg">
            {loading ? 'Subscribing...' : 'Enable Push Notifications'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
