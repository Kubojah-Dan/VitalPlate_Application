import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import DashboardComponent from "../components/Dashboard.jsx";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plansList, setPlansList] = useState([]);
  const [showPlanChooser, setShowPlanChooser] = useState(false);

  useEffect(() => {
    if (!user || !token) return;

    const loadDashboard = async () => {
      try {
        const [currentResp, listResp] = await Promise.all([
          apiFetch("/api/plan", { token }),
          apiFetch("/api/plan/plans", { token }),
        ]);

        const weeklyPlan = currentResp?.plan ?? null;
        const profileFromApi =
          currentResp?.profile || user.profile || {
            name: user.email?.split("@")[0] || "Friend",
            goal: "Maintain Health",
          };

        setPlan(weeklyPlan);
        setProfile(profileFromApi);

        setPlansList(listResp?.plans || []);

        // If the user has at least one existing plan and no current plan, prompt chooser
        if ((listResp?.plans?.length || 0) > 0 && !currentResp?.plan) {
          setShowPlanChooser(true);
        }

      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, token]);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-vp-secondary">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col">
        <Navbar
          onToggleSidebar={() =>
            setSidebarOpen((v) => !v)
          }
        />

        {showPlanChooser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-800 p-6 rounded-lg w-full max-w-2xl">
              <h3 className="text-xl font-bold mb-2">Choose a Meal Plan</h3>
              <p className="text-slate-400 mb-4">We found existing meal plans — pick one to use or generate a new plan.</p>

              <div className="space-y-3 max-h-64 overflow-auto mb-4">
                {plansList.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-900 p-3 rounded">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-slate-400">{new Date(p.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await apiFetch(`/api/plan/${p.id}/select`, { token, method: "POST" });
                          window.location.reload();
                        }}
                        className="px-3 py-2 bg-emerald-600 rounded"
                      >
                        Use
                      </button>
                      <button
                        onClick={async () => {
                          const data = await apiFetch(`/api/plan/${p.id}`, { token });
                          setPlan(data.plan);
                          setProfile(data.profile);
                          setShowPlanChooser(false);
                        }}
                        className="px-3 py-2 border border-slate-700 rounded"
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    setShowPlanChooser(false);
                    const newProfile = profile || { name: user.profile?.name || user.email.split("@")[0], age: user.profile?.age, weight: user.profile?.weight, gender: user.profile?.gender };
                    await apiFetch("/api/plan/generate", { token, method: "POST", body: newProfile });
                    window.location.reload();
                  }}
                  className="bg-emerald-500 px-4 py-2 rounded"
                >
                  Generate New Plan
                </button>
                <button onClick={() => setShowPlanChooser(false)} className="px-4 py-2 border rounded">Close</button>
              </div>
            </div>
          </div>
        )}

        <DashboardComponent plan={plan} profile={profile} />
      </main>
    </div>
  );
};

export default Dashboard;
