import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://vitalplate-application.onrender.com";
//"http://localhost:5000";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: { email, password, profile: {} }
      });

      login(res.token, res.user);
      navigate("/onboarding");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative">
      <div className="absolute inset-0">
        <img
          src="https://freefoodphotos.com/imagelibrary/seafood/thumbs/salad_tuna.jpg"
          alt="Healthy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-vp-background/90"></div>
      </div>

      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-vp-card/80 p-8 rounded-2xl border border-slate-700 shadow-xl max-w-md w-full"
      >
        <h2 className="text-3xl mb-6 font-bold text-center text-colorful-gradient">
          Create Account
        </h2>

        <div className="flex flex-col gap-3 mb-6">
          <a
            href={`${API_URL}/api/auth/google`}
            className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white font-semibold flex items-center justify-center space-x-2 transition duration-150 ease-in-out hover:bg-slate-600/70"
          >
            <i className="fa-brands fa-google text-lg text-red-500"></i>
            <span>Continue with Google</span>
          </a>

          <a
            href={`${API_URL}/api/auth/github`}
            className="w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white font-semibold flex items-center justify-center space-x-2 transition duration-150 ease-in-out hover:bg-slate-600/70"
          >
            <i className="fa-brands fa-github text-lg text-slate-300"></i>
            <span>Continue with GitHub</span>
          </a>
        </div>
        
        <hr className="border-t border-slate-700 mb-6" />

        <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Mail size={16} className="text-emerald-500" />
            Email Address
        </label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Lock size={16} className="text-emerald-500" />
             Password
        </label>
        <input
          type="password"
          required
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-6"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-vp-secondary text-black font-semibold py-3 rounded-xl"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="text-slate-400 text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link className="text-vp-primary font-semibold" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;