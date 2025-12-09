import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop"
          alt="Healthy food"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-vp-background/90 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 py-12 grid md:grid-cols-2 gap-10 items-center animate-fade-in-up">
        <div>
          {/* Logo stays the same name */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-vp-primary/20 flex items-center justify-center border border-vp-primary/40">
              <span className="text-vp-secondary font-bold text-xl">V</span>
            </div>
            <div>
              <h1 className="text-2xl tracking-tight">VitalPlate</h1>
              <p className="text-xs text-slate-300">Medically tailored meal planning</p>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl leading-tight font-extrabold mb-4">
            Eat for your{' '}
            <span className="text-colorful-gradient">health, not just hunger.</span>
          </h2>
          <p className="text-slate-300 text-sm md:text-base mb-6 max-w-lg">
            VitalPlate builds weekly meal plans for diabetes, hypertension, IBS and more —
            combining AI nutrition, grocery planning and beautiful visual recipes in one
            dashboard.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-vp-secondary text-vp-background font-semibold shadow-lg shadow-emerald-900/40 hover:bg-emerald-400 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl border border-slate-600/80 text-slate-100 font-semibold hover:border-vp-primary hover:text-vp-primary transition"
            >
              I already have an account
            </Link>
          </div>

          <div className="mt-6 text-xs text-slate-400 space-y-1">
            <p>• Personalized plans based on your conditions</p>
            <p>• Smart grocery list, drag-and-drop planner</p>
            <p>• Medically informed nutrition guidance</p>
          </div>
        </div>

        <div className="bg-vp-card/80 border border-slate-700 rounded-3xl p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
          {/* You can reuse any nice "preview dashboard" layout from VITALPLATE2 here */}
          <p className="text-sm text-slate-300 mb-4">Preview</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Today&apos;s Calories</span>
              <span className="text-lg font-bold text-vp-secondary">1,320 / 2,000</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-vp-secondary to-vp-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Breakfast</p>
                <p className="font-semibold">Oatmeal & Berries</p>
                <p className="text-slate-500 mt-1">Heart-healthy • 350 kcal</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Lunch</p>
                <p className="font-semibold">Grilled Salmon Bowl</p>
                <p className="text-slate-500 mt-1">Omega-3 • 480 kcal</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Dinner</p>
                <p className="font-semibold">Low-sodium Veggie Stir Fry</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3">
                <p className="text-slate-400 mb-1">Snack</p>
                <p className="font-semibold">Greek Yogurt & Nuts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
