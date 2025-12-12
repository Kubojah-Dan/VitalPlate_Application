import React, { useState } from 'react';
import { Activity, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../apiClient.js';
import { useNavigate } from 'react-router-dom';

const HEALTH_CONDITIONS = [
  'Diabetes',
  'Hypertension',
  'High Cholesterol',
  'IBS',
  'Kidney Disease',
  'None'
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { token, user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    age: user?.profile?.age?.toString() || '30',
    weight: user?.profile?.weight?.toString() || '70',
    gender: user?.profile?.gender || 'Female',
    conditions: user?.profile?.conditions || [],
    goal: user?.profile?.goal || 'Maintain Health',
    dietaryRestrictions: user?.profile?.dietaryRestrictions || ''
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCondition = (condition) => {
    setFormData((prev) => {
      const exists = prev.conditions.includes(condition);
      return {
        ...prev,
        conditions: exists
          ? prev.conditions.filter((c) => c !== condition)
          : [...prev.conditions, condition]
      };
    });
  };

  const handleSubmit = async () => {
  try {
    setIsLoading(true);

    const profile = {
      ...formData,
      age: parseInt(formData.age),
      weight: parseInt(formData.weight),
    };

    const result = await apiFetch("/api/plan/generate", {
      method: "POST",
      token, 
      body: profile,
    });

    login(token, { ...user, profile });
    navigate("/dashboard");

  } catch (err) {
    console.error("Onboarding error:", err.message);
    alert(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
          alt="Healthy Food Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 bg-slate-900/95 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-slate-800 h-2 w-full">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto mb-6"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Generating Your Plan...</h2>
              <p className="text-slate-400">
                Our AI nutritionist is crafting a personalized menu based on your health profile.
              </p>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="bg-emerald-900/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 border border-emerald-800">
                      <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Welcome to VitalPlate</h2>
                    <p className="text-slate-400 mt-2">
                      Let&apos;s start with the basics to tailor your experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition placeholder-slate-500"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Health Profile</h2>
                    <p className="text-slate-400 mt-2">
                      Select any conditions to ensure medical tailoring.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HEALTH_CONDITIONS.map((condition) => (
                      <button
                        key={condition}
                        onClick={() => toggleCondition(condition)}
                        className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                          formData.conditions.includes(condition)
                            ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400'
                            : 'border-slate-800 bg-slate-800/50 hover:border-emerald-800 text-slate-400'
                        }`}
                      >
                        <span className="font-medium">{condition}</span>
                        {formData.conditions.includes(condition) && (
                          <Check size={20} className="text-emerald-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Final Touches</h2>
                    <p className="text-slate-400 mt-2">What are your main goals?</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Primary Goal
                      </label>
                      <select
                        value={formData.goal}
                        onChange={(e) => handleInputChange('goal', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition"
                      >
                        <option>Maintain Health</option>
                        <option>Lose Weight</option>
                        <option>Manage Blood Sugar</option>
                        <option>Lower Blood Pressure</option>
                        <option>Build Muscle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">
                        Any Dietary Restrictions? (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.dietaryRestrictions}
                        onChange={(e) =>
                          handleInputChange('dietaryRestrictions', e.target.value)
                        }
                        placeholder="e.g. Vegetarian, No Dairy, Peanut Allergy"
                        className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-900 outline-none transition placeholder-slate-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-10 flex justify-between">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-1 px-4 py-2 text-emerald-400 font-medium hover:text-white transition duration-200"
                  >
                    <ChevronRight size={18} className="transform rotate-180" />
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {step < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-emerald-600 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/50 uppercase tracking-wider transform hover:scale-[1.02]"
                  >
                    Next Step <ChevronRight size={18} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-gray-900 px-8 py-3 rounded-xl font-bold hover:from-emerald-400 hover:to-teal-400 transition shadow-xl shadow-emerald-700/50 uppercase tracking-wider transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Generate Plan'} <Activity size={18} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
