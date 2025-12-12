import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../apiClient.js";
import { useAuth } from "../context/AuthContext.jsx";

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

        <label className="text-sm text-slate-400">Email</label>
        <input
          type="email"
          required
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="text-sm text-slate-400">Password</label>
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
