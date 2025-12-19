import React, { useState } from "react";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

const API_URL = "https://vitalplate-application.onrender.com";
//"http://localhost:5000";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password }
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
          src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=2000"
          alt="Healthy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-vp-background/90"></div>
      </div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-vp-card/80 p-8 rounded-2xl border border-slate-700 shadow-xl max-w-md w-full"
      >
        <h2 className="text-3xl mb-6 font-bold text-center text-colorful-gradient">
          Welcome Back
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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-slate-400 text-center mt-4 text-sm">
          Don't have an account?{" "}
          <Link className="text-vp-primary font-semibold" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;