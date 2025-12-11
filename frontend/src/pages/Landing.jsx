import React from 'react';
import { Link } from 'react-router-dom'; 
import { Utensils, ChefHat, HeartPulse, ListChecks, Zap } from 'lucide-react';

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

const Landing = () => {
    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden font-inter text-white">
            <style>
                {`
                /* Neon Glow is now Emerald */
                .neon-glow-text {
                    text-shadow: 0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(6, 150, 100, 0.4);
                }
                /* Grid is now Emerald */
                .bg-grid {
                    background-image: linear-gradient(to right, rgba(16, 185, 129, 0.08) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(16, 185, 129, 0.08) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                `}
            </style>

            <div className="absolute inset-0 bg-gray-950">
                <div className="absolute inset-0 bg-grid opacity-30" />
            </div>
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2000&auto=format&fit=crop"
                    alt="Healthy, futuristic food pattern"
                    className="w-full h-full object-cover opacity-10"
                />
                <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center animate-fade-in-up">
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                            <ChefHat className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl tracking-wide font-extrabold text-white">VitalPlate</h1>
                            <p className="text-sm text-gray-400 tracking-widest">MEDICALLY TAILORED MEAL MATRIX</p>
                        </div>
                    </div>

                    <h2 className="text-5xl lg:text-7xl leading-tight font-extrabold mb-6">
                        <span className="text-white block">Nutrition powered by</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 neon-glow-text">
                            AI Intelligence.
                        </span>
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-xl">
                        VitalPlate generates hyper-personalized, medically compliant weekly meal protocols for managing chronic conditions like diabetes and hypertension, integrating AI-driven dietary science with seamless grocery manifests.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-8">
                        <Link
                            to="/register"
                            className="flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-500 text-gray-900 font-bold text-lg shadow-xl shadow-emerald-500/40 hover:bg-emerald-400 transition transform hover:scale-[1.02] duration-300 uppercase tracking-widest"
                        >
                            <Zap className="w-5 h-5 mr-2" />
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gray-600 text-emerald-300 font-semibold hover:border-emerald-400 hover:text-emerald-400 transition duration-300 uppercase tracking-wider"
                        >
                            I already have an account
                        </Link>
                    </div>

                    <div className="mt-8 text-sm text-gray-400 grid grid-cols-2 gap-y-3 gap-x-6 max-w-xl">
                        <p className="flex items-center"><HeartPulse className="w-4 h-4 mr-2 text-red-500" /> Condition Mapping</p>
                        <p className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-yellow-400" /> Visual Recipe Access</p>
                        <p className="flex items-center"><ListChecks className="w-4 h-4 mr-2 text-green-500" /> Automated Grocery Manifests</p>
                        <p className="flex items-center"><Zap className="w-4 h-4 mr-2 text-emerald-400" /> Real-time Macro Tracking</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-emerald-800/50 rounded-3xl p-8 shadow-2xl shadow-black/80 backdrop-blur-xl transition">
                    <p className="text-lg font-semibold text-emerald-400 mb-6 flex items-center"><Zap className="w-5 h-5 mr-2" /> DATA FEED: ACTIVE PROTOCOL</p>

                    <div className="space-y-6">
                        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400 tracking-widest">TARGETED ENERGY INTAKE (CAL)</span>
                                <span className="text-2xl font-extrabold text-emerald-400">1,320<span className="text-gray-500"> / 2,000</span></span>
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
        </div>
    );
};

export default Landing;