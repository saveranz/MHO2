import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-white to-health-100 gradient-mesh relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-health-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-health-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '3s'}}></div>

      <div className="container mx-auto px-4 py-20 relative z-10">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-4 bg-gradient-to-r from-health-500 to-health-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transform"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

          </div>

          <div className="mt-8 glass-light p-8 border-2 border-health-200/50 rounded-2xl shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 bg-gradient-to-b from-health-500 to-health-600 rounded-full"></div>
              <p className="text-sm font-bold text-gray-900">Demo Credentials</p>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all">
                <p className="text-xs font-semibold text-health-700 mb-1">Admin (Super)</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">admin@mho.gov.ph</span>
                  {" • "}
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">admin123</span>
                </p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all">
                <p className="text-xs font-semibold text-health-700 mb-1">Doctor (Dr. Santos)</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">dr.santos@mho.gov.ph</span>
                  {" • "}
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">santos123</span>
                </p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all">
                <p className="text-xs font-semibold text-health-700 mb-1">Nurse (Elena Cruz)</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">nurse.elena@mho.gov.ph</span>
                  {" • "}
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">elena123</span>
                </p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all">
                <p className="text-xs font-semibold text-health-700 mb-1">Midwife (Ana Lopez)</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">midwife.ana@mho.gov.ph</span>
                  {" • "}
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">ana123</span>
                </p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-all border border-health-200">
                <p className="text-xs font-semibold text-health-700 mb-1">Patient Records Officer</p>
                <p className="text-xs text-gray-600">
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">records@mho.gov.ph</span>
                  {" • "}
                  <span className="font-mono bg-health-50 px-2 py-1 rounded">records123</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">→ Goes directly to Patient Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
