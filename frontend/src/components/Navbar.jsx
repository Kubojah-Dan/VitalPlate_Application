import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-vp-card/80 backdrop-blur-md border-b border-slate-800 p-4 flex justify-between items-center">
      <Link to="/dashboard" className="font-bold text-xl text-colorful-gradient">
        VitalPlate
      </Link>

      <div className="flex gap-4">
        <Link to="/planner">Planner</Link>
        <Link to="/grocery">Grocery</Link>
        <Link to="/recipes">Recipes</Link>

        {user ? (
          <button onClick={logout} className="text-vp-accent font-semibold">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
