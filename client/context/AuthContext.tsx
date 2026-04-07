import React, { createContext, useContext, useState, useEffect } from "react";
import { authenticateUser } from "@/lib/mockDatabase";

export type UserRole = "super_admin" | "doctor" | "patient" | "admin" | "staff" | "records_officer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Authenticate against mock database
      const mockUser = authenticateUser(email, password);

      if (!mockUser) {
        return { success: false, error: "Invalid email or password" };
      }

      // Convert to User object
      const newUser: User = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        organization: mockUser.organization,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
