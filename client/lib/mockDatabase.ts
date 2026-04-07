import { UserRole } from "@/context/AuthContext";

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  organization?: string;
}

// Mock database of pre-registered users
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    email: "admin@mho.gov.ph",
    password: "admin123",
    name: "Admin User",
    role: "super_admin",
    organization: "MHO Bongabong",
  },
  // Legacy login kept for demo credentials card
  {
    id: "user-1b",
    email: "admin@medihub.com",
    password: "admin123",
    name: "Admin User",
    role: "super_admin",
    organization: "MHO Bongabong",
  },
  {
    id: "user-2",
    email: "dr.sarah@hospital.com",
    password: "doctor123",
    name: "Dr. Sarah Johnson",
    role: "doctor",
    organization: "City Hospital",
  },
  {
    id: "user-3",
    email: "john@hospital.com",
    password: "staff123",
    name: "John Smith",
    role: "staff",
    organization: "City Hospital",
  },
  {
    id: "user-4",
    email: "patient@example.com",
    password: "patient123",
    name: "Patient User",
    role: "patient",
    organization: "City Hospital",
  },
  {
    id: "user-5",
    email: "manager@clinic.com",
    password: "manager123",
    name: "Clinic Manager",
    role: "admin",
    organization: "Green Valley Clinic",
  },
  // ── Patient Records Officer ──
  {
    id: "mho-0",
    email: "records@mho.gov.ph",
    password: "records123",
    name: "Records Officer",
    role: "records_officer",
    organization: "MHO Bongabong",
  },
  // ── MHO Bongabong staff accounts ──
  {
    id: "mho-1",
    email: "dr.santos@mho.gov.ph",
    password: "santos123",
    name: "Dr. Maria Santos",
    role: "doctor",
    organization: "MHO Bongabong",
  },
  {
    id: "mho-2",
    email: "nurse.elena@mho.gov.ph",
    password: "elena123",
    name: "Elena Cruz",
    role: "staff",
    organization: "MHO Bongabong",
  },
  {
    id: "mho-3",
    email: "midwife.ana@mho.gov.ph",
    password: "ana123",
    name: "Ana Lopez",
    role: "staff",
    organization: "MHO Bongabong",
  },
  {
    id: "mho-4",
    email: "clerk.mark@mho.gov.ph",
    password: "mark123",
    name: "Mark Reyes",
    role: "staff",
    organization: "MHO Bongabong",
  },
  {
    id: "mho-5",
    email: "dr.carlo@mho.gov.ph",
    password: "carlo123",
    name: "Dr. Carlo Buenaventura",
    role: "doctor",
    organization: "MHO Bongabong",
  },
];

export function authenticateUser(
  email: string,
  password: string
): MockUser | null {
  const user = mockUsers.find((u) => u.email === email && u.password === password);
  return user || null;
}

export function getUserByEmail(email: string): MockUser | null {
  return mockUsers.find((u) => u.email === email) || null;
}
