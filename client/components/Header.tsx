import { Link } from "react-router-dom";
import { Activity, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, logout, isLoggedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const getDashboardPath = () => {
    switch (user?.role) {
      case "super_admin":
      case "admin":
        return "/admin";
      case "doctor":
        return "/patients";
      case "patient":
        return "/appointments";
      default:
        return "/appointments";
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-health-200/50 shadow-lg backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            <div className="w-11 h-11 bg-gradient-to-br from-health-500 to-health-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gradient">Bongabong MHO</span>
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-foreground font-medium hover:text-health-600 transition-colors relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-health-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a href="#about" className="text-foreground font-medium hover:text-health-600 transition-colors relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-health-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#services" className="text-foreground font-medium hover:text-health-600 transition-colors relative group">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-health-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="text-foreground font-medium hover:text-health-600 transition-colors relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-health-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          <div className="flex gap-2 items-center">
            {isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden md:inline font-medium">
                  {user?.name}
                </span>
                <Link
                  to={getDashboardPath()}
                  className="px-5 py-2.5 bg-gradient-to-r from-health-500 to-health-600 text-white font-medium rounded-xl hover:shadow-glow transition-all hover:scale-105 text-sm"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="p-2.5 text-health-600 hover:bg-health-50 rounded-xl transition-all hover:scale-110"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2.5 bg-gradient-to-r from-health-500 to-health-600 text-white font-medium rounded-xl hover:shadow-glow transition-all hover:scale-105 text-sm"
              >
                Staff Login
              </Link>
            )}
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2.5 text-health-600 hover:bg-health-50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-health-200/50 bg-white/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-health-50 hover:text-health-600 transition-colors"
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-health-50 hover:text-health-600 transition-colors"
          >
            About
          </a>
          <a
            href="#services"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-health-50 hover:text-health-600 transition-colors"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-health-50 hover:text-health-600 transition-colors"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
}
