import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Home, Calendar, List, BookOpen, LogOut } from "lucide-react";

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { icon: Home, text: "Dashboard", to: "/dashboard" },
    { icon: Calendar, text: "Planner", to: "/planner" },
    { icon: List, text: "Grocery List", to: "/grocery" },
    { icon: BookOpen, text: "Recipes", to: "/recipes" }
  ];

  return (
    <div className="bg-vp-card/90 w-60 h-full p-6 border-r border-slate-800">
      <h2 className="text-xl font-bold text-colorful-gradient mb-10">
        VitalPlate
      </h2>

      <nav className="space-y-4">
        {navItems.map(({ icon: Icon, text, to }) => (
          <Link key={text} to={to} className="flex items-center gap-3 text-slate-300 hover:text-vp-primary transition">
            <Icon size={18} />
            {text}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-6 left-6 text-vp-accent flex items-center gap-2"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
