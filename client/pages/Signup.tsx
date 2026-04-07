import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Activity, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuth, type UserRole } from "@/context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [organization, setOrganization] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("admin");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions: { value: UserRole; label: string; dashboardPath: string }[] = [
    { value: "super_admin", label: "Super Admin", dashboardPath: "/admin" },
    { value: "admin", label: "Admin", dashboardPath: "/admin" },
    { value: "doctor", label: "Doctor", dashboardPath: "/patients" },
    { value: "patient", label: "Patient", dashboardPath: "/appointments" },
    { value: "staff", label: "Staff", dashboardPath: "/appointments" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!organization || !email || !password) {
        setError("Please fill in all fields");
        return;
      }

      await login(email, password, role);

      // Find the dashboard path for this role
      const roleOption = roleOptions.find((r) => r.value === role);
      const dashboardPath = roleOption?.dashboardPath || "/admin";

      navigate(dashboardPath);
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-white to-health-100">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-health-600 hover:text-health-700 font-medium mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl border border-health-200 p-8 md:p-12 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-health-500 to-health-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-health-900">MediHub</h1>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Account</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  placeholder="Your healthcare facility"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-4 py-3 rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 transition-all"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-health-500 to-health-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-health-600 font-medium hover:text-health-700">
                Sign in here
              </Link>
            </p>

            <p className="text-center text-xs text-gray-500 mt-6">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
