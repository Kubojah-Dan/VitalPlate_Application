import { Menu, ChefHat, Bell, User, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import NotificationPanel  from "./NotificationPanel";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>

        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-colorful-gradient">
          <ChefHat className="text-vp-secondary h-7 w-7" />
          <span>VitalPlate</span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 relative">

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800 relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 z-50">
              <NotificationPanel />
            </div>
          )}
        </div>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
          title="Profile"
        >
          <User size={20} />
        </button>

        {/* Settings */}
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-full text-slate-400 hover:text-emerald-400 hover:bg-slate-800"
          title="Settings"
        >
          <Settings size={20} />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;

