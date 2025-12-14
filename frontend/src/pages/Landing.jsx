import React from "react";
import { Link } from "react-router-dom";
import {
  Utensils,
  ChefHat,
  HeartPulse,
  ListChecks,
  Zap,
  Brain,
  ShieldCheck,
  Sparkles,
} from "lucide-react";


const MealBlock = ({ time, name, info, icon }) => (
  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-emerald-600 transition duration-300 hover:bg-gray-800/50 shadow-md">
    <p className="text-xs text-gray-500 mb-1 tracking-wider">{time}</p>
    <p className="font-semibold text-white flex items-center">
      {icon && <span className="mr-2 flex items-center">{icon}</span>}
      {name}
    </p>
    <p className="text-gray-500 mt-1 text-xs">{info}</p>
  </div>
);


const RECIPE_SHOWCASE = [
  {
    name: "Spicy Arrabiata Pasta",
    image:
      "https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg",
    description:
      "A fiery Italian classic rich in antioxidants and heart-friendly fats.",
  },
  {
    name: "Grilled Salmon with Lemon",
    image:
      "https://www.themealdb.com/images/media/meals/1548772327.jpg",
    description:
      "Omega-3 packed protein ideal for cardiovascular health.",
  },
  {
    name: "Chicken Veggie Stir-Fry",
    image:
      "https://www.themealdb.com/images/media/meals/1525873040.jpg",
    description:
      "High-protein, low-glycemic meal perfect for metabolic balance.",
  },
];


const Landing = () => {
  return (
    <div className="relative font-inter text-white">
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <style>{`
          .neon-glow-text {
            text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(6, 150, 100, 0.4);
          }
          .bg-grid {
            background-image:
              linear-gradient(to right, rgba(16,185,129,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16,185,129,0.08) 1px, transparent 1px);
            background-size: 50px 50px;
          }
        `}</style>

        <div className="absolute inset-0 bg-gray-950">
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>

        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop"
            alt="Healthy food"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-lg">
                <ChefHat className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold">VitalPlate</h1>
                <p className="text-sm text-gray-400 tracking-widest">
                  MEDICALLY TAILORED MEAL MATRIX
                </p>
              </div>
            </div>

            <h2 className="text-5xl lg:text-7xl font-extrabold mb-6">
              <span className="block">Nutrition powered by</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 neon-glow-text">
                AI Intelligence.
              </span>
            </h2>

            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Hyper-personalized, medically aligned meal planning for diabetes,
              hypertension, and metabolic health.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl bg-emerald-500 text-gray-900 font-bold shadow-xl hover:bg-emerald-400 transition uppercase tracking-widest"
              >
                <Zap className="inline mr-2" /> Get Started
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl border-2 border-gray-600 text-emerald-300 hover:border-emerald-400 transition uppercase"
              >
                I already have an account
              </Link>
            </div>
          </div>

          <div className="bg-white/5 border border-emerald-800/50 rounded-3xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl transition">
  <p className="text-lg font-semibold text-emerald-400 mb-6 flex items-center">
    <Zap className="w-5 h-5 mr-2" />
    DATA FEED: ACTIVE PROTOCOL
  </p>

  <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 mb-6">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-400 tracking-widest">
        TARGETED ENERGY INTAKE (CAL)
      </span>
      <span className="text-2xl font-extrabold text-emerald-400">
        1,320<span className="text-gray-500"> / 2,000</span>
      </span>
    </div>
    <div className="w-full h-3 rounded-full bg-gray-800 overflow-hidden shadow-inner shadow-black/50">
      <div className="h-full w-[66%] bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20" />
    </div>
    <div className="text-xs text-gray-500 mt-2 flex justify-between tracking-wide">
      <span>PROTOCOL ADHERENCE</span>
      <span>66%</span>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
    <MealBlock
      time="08:00 HRS"
      name="Chia Seed Matrix"
      info="Diabetic-Safe • 350 kcal"
      icon={<ChefHat className="w-4 h-4 text-amber-400" />}
    />
    <MealBlock
      time="13:00 HRS"
      name="Keto-Optimized Salmon"
      info="Hypertension Protocol • 480 kcal"
      icon={<Utensils className="w-4 h-4 text-green-400" />}
    />
    <MealBlock
      time="19:00 HRS"
      name="Low-Sodium Veggie Stir-Fry"
      info="IBS Compliant • 490 kcal"
      icon={<HeartPulse className="w-4 h-4 text-red-400" />}
    />
    <MealBlock
      time="22:00 HRS"
      name="Casein Protein Fuel"
      info="Recovery Boost • 120 kcal"
      icon={<Zap className="w-4 h-4 text-emerald-400" />}
    />
  </div>
</div>

        </div>
      </div>

      <section className="relative py-24 px-6 overflow-hidden">
  
  {/* Background layers (same as hero) */}
  <div className="absolute inset-0 bg-gray-950">
    <div className="absolute inset-0 bg-grid opacity-20" />
  </div>

  <div className="absolute inset-0">
    <img
      src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop"
      alt="Healthy food background"
      className="w-full h-full object-cover opacity-10"
    />
    <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
  </div>

  {/* Content */}
  <div className="relative z-10">
    <h3 className="text-4xl font-extrabold text-center mb-4">
      AI-Curated Recipe Showcase
    </h3>
    <p className="text-center text-gray-400 max-w-2xl mx-auto mb-12">
      A glimpse of what your personalized weekly protocol looks like.
    </p>

    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
      {RECIPE_SHOWCASE.map((r) => (
        <div
          key={r.name}
          className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-emerald-500 transition shadow-xl backdrop-blur-md"
        >
          <img
            src={r.image}
            alt={r.name}
            className="w-full h-56 object-cover"
          />
          <div className="p-6">
            <h4 className="text-xl font-bold mb-2">{r.name}</h4>
            <p className="text-gray-400 text-sm">{r.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      <section className="bg-slate-950 py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <Brain className="mx-auto text-emerald-400 mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Clinical AI Engine</h4>
            <p className="text-gray-400 text-sm">
              Trained on nutrition science & chronic condition management.
            </p>
          </div>
          <div>
            <ShieldCheck className="mx-auto text-emerald-400 mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Medically Aligned</h4>
            <p className="text-gray-400 text-sm">
              Designed to respect dietary guidelines and health protocols.
            </p>
          </div>
          <div>
            <Sparkles className="mx-auto text-emerald-400 mb-4" size={40} />
            <h4 className="text-xl font-bold mb-2">Effortless Planning</h4>
            <p className="text-gray-400 text-sm">
              Meals, macros, groceries — generated in seconds.
            </p>
          </div>
        </div>
      </section>
      <footer className="bg-gray-950 border-t border-slate-800 py-10 text-center text-gray-400 text-sm">
        <p className="mb-2">
          © {new Date().getFullYear()} VitalPlate • Powered by AI Nutrition
        </p>
        <p>
          Data inspiration from{" "}
          <span className="text-emerald-400 font-medium">TheMealDB</span>
        </p>
      </footer>
    </div>
  );
};

export default Landing;
