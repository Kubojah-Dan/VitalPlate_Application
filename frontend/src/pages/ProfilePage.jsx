import React, { useEffect, useState } from "react";
import { User, Activity, AlertCircle, Save } from "lucide-react";
import { apiFetch } from "../apiClient";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("personal");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/api/user/profile", { token }).then(setProfile);
  }, [token]);

  const update = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const save = async () => {
    await apiFetch("/api/user/profile", {
      method: "PUT",
      token,
      body: profile,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return null;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Your Profile
          </h1>
          <p className="text-slate-400">
            Manage your personal & dietary data
          </p>
        </div>
        <button
          onClick={save}
          className="bg-emerald-600 px-6 py-2 rounded-lg text-white hover:bg-emerald-500"
        >
          {saved ? "Saved!" : <Save size={18} />}
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="space-y-2">
          {[
            ["personal", User, "Personal"],
            ["dietary", AlertCircle, "Dietary"],
            ["goals", Activity, "Goals"],
          ].map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full p-3 rounded-xl flex gap-3 items-center ${
                tab === key
                  ? "bg-slate-800 text-emerald-400 border border-slate-700"
                  : "text-slate-400 hover:bg-slate-900"
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          {tab === "personal" && (
            <>
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(v) => update("name", v)}
              />
              <Input
                label="Age"
                type="number"
                value={profile.age}
                onChange={(v) => update("age", +v)}
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={profile.weight}
                onChange={(v) => update("weight", +v)}
              />
            </>
          )}

          {tab === "dietary" && (
            <Input
              label="Dietary Restrictions"
              value={profile.dietaryRestrictions || ""}
              onChange={(v) =>
                update("dietaryRestrictions", v)
              }
            />
          )}

          {tab === "goals" && (
            <>
              <select
                value={profile.goal}
                onChange={(e) => update("goal", e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
              >
                <option>Maintain Health</option>
                <option>Lose Weight</option>
                <option>Muscle Gain</option>
              </select>
              <textarea
                value={profile.lifestyle || ""}
                onChange={(e) =>
                  update("lifestyle", e.target.value)
                }
                placeholder="Lifestyle info"
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white h-24"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-slate-400 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
    />
  </div>
);

export default ProfilePage;
