import React, { useEffect, useState } from "react";
import { User, Activity, AlertCircle, Save } from "lucide-react";
import { apiFetch } from "../apiClient";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [plans, setPlans] = useState([]);
  const [tab, setTab] = useState("personal");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiFetch("/api/user/profile", { token }).then(setProfile);
    apiFetch("/api/user/settings", { token }).then(setSettings);
  }, [token]);

  useEffect(() => {
    if (tab === "plans") {
      apiFetch("/api/plan/plans", { token }).then((res) => setPlans(res.plans || []));
    }
  }, [tab, token]);

  const update = (key, value) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const save = async () => {
    if (profile) {
      await apiFetch("/api/user/profile", {
        method: "PUT",
        token,
        body: profile,
      });
    }

    if (settings) {
      await apiFetch("/api/user/settings", {
        method: "PUT",
        token,
        body: settings,
      });
    }

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
            ["plans", User, "Plans"],
            ["notifications", AlertCircle, "Notifications"],
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
              <Input
                label="Phone (optional)"
                value={profile.phone || ""}
                onChange={(v) => update("phone", v)}
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

          {tab === "plans" && (
            <div className="space-y-4">
              {plans.length === 0 && (
                <p className="text-slate-400">You have no saved plans yet.</p>
              )}
              {plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-slate-900 p-3 rounded">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-slate-400">{new Date(p.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        await apiFetch(`/api/plan/${p.id}/select`, { token, method: "POST" });
                        const refreshed = await apiFetch(`/api/plan/plans`, { token });
                        setPlans(refreshed.plans || []);
                      }}
                      className={`px-3 py-2 rounded ${p.isCurrent ? 'bg-emerald-700 text-white' : 'bg-emerald-600'}`}
                    >
                      {p.isCurrent ? 'Current' : 'Select'}
                    </button>
                    <button
                      onClick={async () => {
                        const data = await apiFetch(`/api/plan/${p.id}`, { token });
                        localStorage.setItem('previewPlan', JSON.stringify({ plan: data.plan, profile: data.profile }));
                        navigate('/planner');
                      }}
                      className="px-3 py-2 border border-slate-700 rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-4">
              <label className="block text-sm text-slate-400">Phone</label>
              <input
                value={(profile.phone) || ""}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 px-4 py-2 rounded-lg text-white"
              />
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings?.smsNotificationsEnabled}
                  onChange={(e) => setSettings((s) => ({ ...s, smsNotificationsEnabled: e.target.checked }))}
                />
                <span className="text-slate-400">Enable SMS notifications</span>
              </label>

              <div className="flex gap-3 mt-3">
                <button
                  className="bg-emerald-600 px-3 py-2 rounded"
                  onClick={async () => {
                    await save();
                    try {
                      await apiFetch('/notifications/test-sms', { method: 'POST', token });
                      alert('Test SMS sent');
                    } catch (e) { alert('SMS test failed'); }
                  }}
                >Test SMS</button>

                <button
                  className="bg-emerald-600 px-3 py-2 rounded"
                  onClick={async () => {
                    await save();
                    try {
                      await apiFetch('/notifications/test', { method: 'POST', token });
                      alert('Test Push sent');
                    } catch (e) { alert('Push test failed'); }
                  }}
                >Test Push</button>
              </div>
            </div>
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
