import React, { useEffect, useState } from "react";
import { Bell, Palette, List } from "lucide-react";
import { apiFetch } from "../apiClient";
import { useAuth } from "../context/AuthContext";

const SettingsPage = () => {
  const { token } = useAuth();
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/api/user/settings", { token }).then(setSettings);
  }, [token]);

  const toggle = (key) =>
    setSettings((s) => ({ ...s, [key]: !s[key] }));

  const update = (key, value) =>
    setSettings((s) => ({ ...s, [key]: value }));

  const save = async () => {
    await apiFetch("/api/user/settings", {
      method: "PUT",
      token,
      body: settings,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!settings) return null;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">
            Customize your VitalPlate experience
          </p>
        </div>
        <button
          onClick={save}
          className="bg-emerald-600 px-6 py-2 rounded-lg text-white hover:bg-emerald-500"
        >
          {saved ? "Saved!" : "Save"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">
              App Appearance
            </h3>
          </div>

          <div className="flex gap-4 items-center">
            <label className="text-slate-400">Units</label>
            <select
              value={settings.units}
              onChange={(e) => update("units", e.target.value)}
              className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
            >
              <option>Metric</option>
              <option>Imperial</option>
            </select>

            <label className="text-slate-400 ml-6">Week Start</label>
            <select
              value={settings.weekStart}
              onChange={(e) => update("weekStart", e.target.value)}
              className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
            >
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-orange-400" />
            <h3 className="text-lg font-semibold text-white">
              Notifications
            </h3>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">Meal Reminders</p>
              <p className="text-slate-500 text-sm">
                Get notified for meals
              </p>
            </div>
            <button
              onClick={() => toggle("notificationsEnabled")}
              className={`w-12 h-6 rounded-full p-1 transition ${
                settings.notificationsEnabled
                  ? "bg-emerald-600"
                  : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition ${
                  settings.notificationsEnabled
                    ? "translate-x-6"
                    : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Integration */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <List className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Integrations
            </h3>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium">
                Smart Grocery List
              </p>
              <p className="text-slate-500 text-sm">
                Auto-group ingredients
              </p>
            </div>
            <button
              onClick={() => toggle("groceryIntegration")}
              className={`w-12 h-6 rounded-full p-1 transition ${
                settings.groceryIntegration
                  ? "bg-emerald-600"
                  : "bg-slate-700"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform transition ${
                  settings.groceryIntegration
                    ? "translate-x-6"
                    : ""
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
