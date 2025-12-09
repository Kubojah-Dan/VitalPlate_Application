import React from "react";
import {
  LayoutDashboard,
  Calendar,
  ListChecks,
  BookOpen,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const linkClasses =
    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800/80 transition-colors";

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800">
          <span className="text-xl font-bold text-colorful-gradient">
            VitalPlate
          </span>

          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-slate-800 text-emerald-400"
                  : "text-slate-300"
              }`
            }
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/planner"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-slate-800 text-emerald-400"
                  : "text-slate-300"
              }`
            }
            onClick={onClose}
          >
            <Calendar size={18} />
            Planner
          </NavLink>

          <NavLink
            to="/grocery"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-slate-800 text-emerald-400"
                  : "text-slate-300"
              }`
            }
            onClick={onClose}
          >
            <ListChecks size={18} />
            Grocery List
          </NavLink>

          <NavLink
            to="/recipes"
            className={({ isActive }) =>
              `${linkClasses} ${
                isActive
                  ? "bg-slate-800 text-emerald-400"
                  : "text-slate-300"
              }`
            }
            onClick={onClose}
          >
            <BookOpen size={18} />
            Recipes
          </NavLink>
        </nav>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center gap-2 px-4 py-3 text-sm text-orange-400 hover:bg-slate-800/80 border-t border-slate-800"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
