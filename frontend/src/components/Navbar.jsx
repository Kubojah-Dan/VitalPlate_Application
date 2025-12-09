import { Menu, ChefHat } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* Left side (Toggle button + Logo) */}
      <div className="flex items-center gap-4">

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-slate-300 hover:text-white"
          onClick={onToggleSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-colorful-gradient">
          <ChefHat className="text-vp-secondary h-7 w-7" />
          <span>VitalPlate</span>
        </Link>

      </div>

      {/* (Right side of navbar if you ever add controls) */}
      <div></div>
    </nav>
  );
};

export default Navbar;
