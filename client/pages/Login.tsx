import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();
  const { login, sendPasswordReset, sendVerificationEmail } = useAuth();
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

  const getDashboardPath = (role: UserRole): string => {
    switch (role) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
          setShowVerificationPrompt(true);
        }
        return;
      }

      // Note: The user will be available in context after login
      // We use a setTimeout to ensure context is updated before navigation
      setTimeout(() => {
        // Fetch the user's role from the login response
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          const dashboardPath = getDashboardPath(user.role);
          navigate(dashboardPath);
        }
      }, 100);
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-white to-health-100 gradient-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-health-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-health-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '3s'}}></div>

      <div className="container mx-auto px-4 py-10 md:py-20 relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-health-600 hover:text-health-700 font-medium mb-12 transition-all hover:gap-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <div className="glass rounded-3xl border-2 border-health-200/50 p-10 md:p-12 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 bg-gradient-to-br from-health-500 to-health-600 rounded-2xl flex items-center justify-center shadow-lg shadow-health-500/30">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gradient">MediHub</h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to access your account</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm font-medium animate-slide-up">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm hover:bg-white"
                />
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-health-600 hover:text-health-700 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-4 bg-gradient-to-r from-health-500 to-health-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transform"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 bg-health-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-health-600" />
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
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-transparent transition-all"
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
                  className="bg-health-600 hover:bg-health-700"
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
                className="bg-health-600 hover:bg-health-700"
              >
                Resend Verification Email
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
