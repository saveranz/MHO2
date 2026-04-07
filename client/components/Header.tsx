import { Link, useNavigate } from "react-router-dom";
import { Activity, LogOut, Menu, X } from "lucide-react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Header() {
  const { user, logout, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getDashboardPath = (role?: UserRole): string => {
    const r = role ?? user?.role;
    switch (r) {
      case "super_admin":
      case "admin":
        return "/admin";
      case "doctor":
      case "staff":
        return "/staff";
      case "records_officer":
        return "/patients";
      default:
        return "/staff";
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || "Login failed. Please try again.");
        return;
      }
      setLoginOpen(false);
      setEmail("");
      setPassword("");
      setTimeout(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          navigate(getDashboardPath(u.role));
        }
      }, 100);
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
              <button
                onClick={() => setLoginOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-health-500 to-health-600 text-white font-medium rounded-xl hover:shadow-glow transition-all hover:scale-105 text-sm"
              >
                Staff Login
              </button>
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

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={(open) => { setLoginOpen(open); if (!open) { setEmail(""); setPassword(""); setError(""); } }}>
        <DialogContent className="sm:max-w-md rounded-3xl border-2 border-health-200/50 p-10 shadow-2xl backdrop-blur-xl bg-white/90">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-health-500 to-health-600 rounded-2xl flex items-center justify-center shadow-lg shadow-health-500/30">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold text-gradient">MediHub</DialogTitle>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5 mt-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 bg-gradient-to-r from-health-500 to-health-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transform"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  );
}
