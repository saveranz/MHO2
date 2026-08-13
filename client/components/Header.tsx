import { Link, useNavigate } from "react-router-dom";
import { Activity, LogOut, Menu, X, Mail, CheckCircle } from "lucide-react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, logout, isLoggedIn, login, loading, sendPasswordReset, sendVerificationEmail } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password modal
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  
  // Email Verification
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
        
        // Check if email verification is needed
        if (result.needsVerification) {
          setLoginOpen(false);
          setShowVerificationPrompt(true);
        }
        return;
      }
      setLoginOpen(false);
      setEmail("");
      setPassword("");
      
      // Get the user from localStorage to determine redirect
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

  const handleForgotPassword = async () => {
    setResetError("");
    setResetSuccess(false);
    
    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }
    
    setIsResetting(true);
    
    try {
      const result = await sendPasswordReset(resetEmail);
      
      if (result.success) {
        setResetSuccess(true);
        setTimeout(() => {
          setShowForgotPassword(false);
          setResetEmail("");
          setResetSuccess(false);
        }, 3000);
      } else {
        setResetError(result.error || "Failed to send reset email");
      }
    } catch (err) {
      setResetError("An error occurred. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSendVerification = async () => {
    try {
      const result = await sendVerificationEmail(email);
      if (result.success) {
        setVerificationSent(true);
      }
    } catch (err) {
      console.error("Failed to send verification email:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-800">MHO Bongabong</span>
          </Link>

          {/* Rounded Navigation Pills */}
          <nav className="hidden md:flex items-center gap-2 bg-cyan-400 rounded-full px-2 py-2">
            <Link to="/" className="px-6 py-2.5 text-white font-medium hover:bg-white/20 rounded-full transition-all">
              Home
            </Link>
            <a href="#about" className="px-6 py-2.5 text-white font-medium hover:bg-white/20 rounded-full transition-all">
              About Us
            </a>
            <a href="#services" className="px-6 py-2.5 text-white font-medium hover:bg-white/20 rounded-full transition-all">
              Service
            </a>
            <a href="#doctors" className="px-6 py-2.5 text-white font-medium hover:bg-white/20 rounded-full transition-all">
              Doctors
            </a>
            <a href="#blog" className="px-6 py-2.5 text-white font-medium hover:bg-white/20 rounded-full transition-all">
              Blog
            </a>
          </nav>

          <div className="flex gap-2 items-center">
            {loading ? (
              // Show nothing while loading to avoid flicker
              <div className="w-32 h-12"></div>
            ) : isLoggedIn ? (
              <>
                <span className="text-sm text-gray-600 hidden md:inline font-medium">
                  {user?.name}
                </span>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="p-2.5 text-cyan-600 hover:bg-cyan-50 rounded-full transition-all hover:scale-110"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="px-6 py-3 bg-cyan-400 text-white font-medium rounded-full hover:bg-cyan-500 transition-all hover:scale-105 text-sm flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                Login
              </button>
            )}
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2.5 text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            About Us
          </a>
          <a
            href="#services"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            Service
          </a>
          <a
            href="#doctors"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            Doctors
          </a>
          <a
            href="#blog"
            onClick={() => setMenuOpen(false)}
            className="px-3 py-2.5 rounded-xl text-foreground font-medium hover:bg-cyan-50 hover:text-cyan-600 transition-colors"
          >
            Blog
          </a>
        </div>
      )}

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={(open) => { setLoginOpen(open); if (!open) { setEmail(""); setPassword(""); setError(""); } }}>
        <DialogContent className="sm:max-w-md rounded-3xl border-2 border-cyan-200/50 p-10 shadow-2xl backdrop-blur-xl bg-white/90">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-800">MHO Bongabong</DialogTitle>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your account</p>
          </DialogHeader>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5 mt-6" autoComplete="off">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3.5 rounded-xl border-2 border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
              />
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => {
                  setLoginOpen(false);
                  setShowForgotPassword(true);
                }}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-4 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transform"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-cyan-600" />
            </div>
            <DialogTitle className="text-center text-2xl">Reset Password</DialogTitle>
            <DialogDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="py-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-center text-green-700 font-medium">
                Password reset link sent! Check your email.
              </p>
            </div>
          ) : (
            <>
              {resetError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {resetError}
                </div>
              )}

              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail("");
                    setResetError("");
                  }}
                  disabled={isResetting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isResetting}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  {isResetting ? "Sending..." : "Send Reset Link"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Verification Prompt */}
      <Dialog open={showVerificationPrompt} onOpenChange={setShowVerificationPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-amber-600" />
            </div>
            <DialogTitle className="text-center text-2xl">Email Verification Required</DialogTitle>
            <DialogDescription className="text-center">
              Your email address has not been verified. Please check your inbox for the verification link.
            </DialogDescription>
          </DialogHeader>

          {verificationSent ? (
            <div className="py-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-center text-green-700 font-medium">
                Verification email sent! Check your inbox.
              </p>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-600">
              Didn't receive the email? Click below to resend.
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowVerificationPrompt(false);
                setVerificationSent(false);
              }}
            >
              Close
            </Button>
            {!verificationSent && (
              <Button
                type="button"
                onClick={handleSendVerification}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                Resend Verification Email
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
