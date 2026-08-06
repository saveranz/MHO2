import { useState, useEffect } from "react";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Search,
  Plus,
  Download,
  QrCode,
  FileText,
  Calendar,
  User,
  Phone,
  MapPin,
  Edit,
  Eye,
  ArrowLeft,
  Home,
  Activity,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Merge,
  UserCheck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/context/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────
type ServiceType =
  | "OPD Consultation"
  | "Maternal Care"
  | "Immunization"
  | "Family Planning"
  | "TB-DOTS"
  | "Dental"
  | "Laboratory"
  | "Others";

type AgeGroup = "Child" | "Teen" | "Adult" | "Senior";
type LastVisitFilter = "all" | "this-month" | "this-year";
type SidebarView = "dashboard" | "list" | "qr" | "merge";

interface Patient {
  id: string;
  name: string;
  photo: null;
  dob: string;
  gender: "Male" | "Female";
  barangay: string;
  address: string;
  contactNumber: string;
  philhealthId: string | null;
  lastVisit: string;
  totalVisits: number;
  bloodGroup: string;
  allergies: string;
  serviceType: ServiceType;
  email?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BONGABONG_BARANGAYS = [
  "Aplaya", "Bagong Silang", "Balansay", "Bukal", "Calatunan",
  "Hagan", "Labasan", "Libertad", "Mabini", "Makahawang",
  "Paitan", "Poblacion", "Sagana", "San Isidro", "Sta. Cruz",
  "Tagumpay", "Wawa",
];

const SERVICE_TYPES: ServiceType[] = [
  "OPD Consultation", "Maternal Care", "Immunization",
  "Family Planning", "TB-DOTS", "Dental", "Laboratory", "Others",
];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_PATIENTS: Patient[] = [
  {
    id: "P001", name: "Maria Santos", photo: null, dob: "1985-03-15", gender: "Female",
    barangay: "Poblacion", address: "Blk 2 Lot 5, Poblacion, Bongabong, Oriental Mindoro",
    contactNumber: "0917-234-5678", philhealthId: "12-345678901-2",
    lastVisit: "2025-07-10", totalVisits: 12, bloodGroup: "A+",
    allergies: "Penicillin", serviceType: "OPD Consultation", email: "maria.santos@gmail.com",
  },
  {
    id: "P002", name: "Juan Dela Cruz", photo: null, dob: "1972-08-22", gender: "Male",
    barangay: "Hagan", address: "Purok 3, Hagan, Bongabong, Oriental Mindoro",
    contactNumber: "0921-567-8901", philhealthId: "12-456789012-3",
    lastVisit: "2025-06-28", totalVisits: 8, bloodGroup: "O+",
    allergies: "None", serviceType: "TB-DOTS", email: "jdelacruz@gmail.com",
  },
  {
    id: "P003", name: "Ana Reyes", photo: null, dob: "1998-11-03", gender: "Female",
    barangay: "Aplaya", address: "Sitio Dalampasigan, Aplaya, Bongabong, Oriental Mindoro",
    contactNumber: "0932-678-9012", philhealthId: null,
    lastVisit: "2025-07-05", totalVisits: 5, bloodGroup: "B+",
    allergies: "Sulfa", serviceType: "Maternal Care", email: "ana.reyes@yahoo.com",
  },
  {
    id: "P004", name: "Roberto Magpayo", photo: null, dob: "1960-05-17", gender: "Male",
    barangay: "Labasan", address: "Purok 1, Labasan, Bongabong, Oriental Mindoro",
    contactNumber: "0908-789-0123", philhealthId: "12-567890123-4",
    lastVisit: "2025-05-20", totalVisits: 20, bloodGroup: "AB-",
    allergies: "Aspirin", serviceType: "OPD Consultation",
  },
  {
    id: "P005", name: "Lourdes Pimentel", photo: null, dob: "1940-12-01", gender: "Female",
    barangay: "Mabini", address: "Purok 4, Mabini, Bongabong, Oriental Mindoro",
    contactNumber: "0945-890-1234", philhealthId: "12-678901234-5",
    lastVisit: "2025-07-12", totalVisits: 35, bloodGroup: "A-",
    allergies: "None", serviceType: "OPD Consultation",
  },
  {
    id: "P006", name: "Carlo Vidal", photo: null, dob: "2015-03-09", gender: "Male",
    barangay: "Sta. Cruz", address: "Purok 2, Sta. Cruz, Bongabong, Oriental Mindoro",
    contactNumber: "0912-901-2345", philhealthId: "12-789012345-6",
    lastVisit: "2025-07-01", totalVisits: 3, bloodGroup: "O-",
    allergies: "None", serviceType: "Immunization",
  },
  {
    id: "P007", name: "Elena Buenaventura", photo: null, dob: "1993-07-25", gender: "Female",
    barangay: "Libertad", address: "Sitio Bagong Palayan, Libertad, Bongabong, Oriental Mindoro",
    contactNumber: "0956-012-3456", philhealthId: "12-890123456-7",
    lastVisit: "2025-06-15", totalVisits: 9, bloodGroup: "B-",
    allergies: "Codeine", serviceType: "Family Planning",
  },
  {
    id: "P008", name: "Danilo Pajarillo", photo: null, dob: "1955-09-30", gender: "Male",
    barangay: "Sagana", address: "Purok 5, Sagana, Bongabong, Oriental Mindoro",
    contactNumber: "0977-123-4567", philhealthId: "12-901234567-8",
    lastVisit: "2025-04-18", totalVisits: 14, bloodGroup: "A+",
    allergies: "None", serviceType: "OPD Consultation",
  },
  {
    id: "P009", name: "Imelda Soledad", photo: null, dob: "1988-02-14", gender: "Female",
    barangay: "Makahawang", address: "Purok 3, Makahawang, Bongabong, Oriental Mindoro",
    contactNumber: "0906-234-5678", philhealthId: null,
    lastVisit: "2025-07-08", totalVisits: 6, bloodGroup: "O+",
    allergies: "None", serviceType: "Laboratory",
  },
  {
    id: "P010", name: "Fernando Dimapilis", photo: null, dob: "1979-06-20", gender: "Male",
    barangay: "Paitan", address: "Sitio Ilaya, Paitan, Bongabong, Oriental Mindoro",
    contactNumber: "0929-345-6789", philhealthId: "12-012345678-9",
    lastVisit: "2025-03-30", totalVisits: 4, bloodGroup: "AB+",
    allergies: "Ibuprofen", serviceType: "Dental",
  },
  {
    id: "P011", name: "Rosario Cabungcal", photo: null, dob: "2018-09-05", gender: "Female",
    barangay: "Bukal", address: "Purok 1, Bukal, Bongabong, Oriental Mindoro",
    contactNumber: "0961-456-7890", philhealthId: "12-123456790-1",
    lastVisit: "2025-07-14", totalVisits: 7, bloodGroup: "A+",
    allergies: "None", serviceType: "Immunization",
  },
  {
    id: "P012", name: "Pedro Alcantara", photo: null, dob: "1945-04-11", gender: "Male",
    barangay: "Calatunan", address: "Sitio Cana-an, Calatunan, Bongabong, Oriental Mindoro",
    contactNumber: "0918-567-8901", philhealthId: "12-234567891-2",
    lastVisit: "2025-06-22", totalVisits: 28, bloodGroup: "B+",
    allergies: "None", serviceType: "OPD Consultation",
  },
  {
    id: "P013", name: "Natividad Gozum", photo: null, dob: "2000-12-25", gender: "Female",
    barangay: "Bagong Silang", address: "Purok 2, Bagong Silang, Bongabong, Oriental Mindoro",
    contactNumber: "0943-678-9012", philhealthId: null,
    lastVisit: "2025-07-11", totalVisits: 2, bloodGroup: "O+",
    allergies: "None", serviceType: "Maternal Care",
  },
  {
    id: "P014", name: "Augusto Reyes", photo: null, dob: "1968-01-08", gender: "Male",
    barangay: "Balansay", address: "Purok 6, Balansay, Bongabong, Oriental Mindoro",
    contactNumber: "0974-789-0123", philhealthId: "12-345678902-3",
    lastVisit: "2025-05-05", totalVisits: 11, bloodGroup: "A-",
    allergies: "Tetracycline", serviceType: "TB-DOTS",
  },
  {
    id: "P015", name: "Concepcion Villareal", photo: null, dob: "1991-10-19", gender: "Female",
    barangay: "Tagumpay", address: "Sitio Masipag, Tagumpay, Bongabong, Oriental Mindoro",
    contactNumber: "0903-890-1234", philhealthId: "12-456789013-4",
    lastVisit: "2025-07-09", totalVisits: 16, bloodGroup: "AB+",
    allergies: "None", serviceType: "Family Planning",
  },
  {
    id: "P016", name: "Ernesto Marquez", photo: null, dob: "1983-05-28", gender: "Male",
    barangay: "Hagan", address: "Purok 4, Hagan, Bongabong, Oriental Mindoro",
    contactNumber: "0935-901-2345", philhealthId: "12-567890124-5",
    lastVisit: "2025-06-30", totalVisits: 7, bloodGroup: "B+",
    allergies: "None", serviceType: "Laboratory",
  },
  {
    id: "P017", name: "Josefina Bautista", photo: null, dob: "2013-07-14", gender: "Female",
    barangay: "San Isidro", address: "Purok 3, San Isidro, Bongabong, Oriental Mindoro",
    contactNumber: "0947-012-3456", philhealthId: "12-678901235-6",
    lastVisit: "2025-04-25", totalVisits: 4, bloodGroup: "O-",
    allergies: "None", serviceType: "Immunization",
  },
  {
    id: "P018", name: "Renato Domingo", photo: null, dob: "1948-03-02", gender: "Male",
    barangay: "Wawa", address: "Sitio Bayanan, Wawa, Bongabong, Oriental Mindoro",
    contactNumber: "0925-123-4567", philhealthId: "12-789012346-7",
    lastVisit: "2025-07-13", totalVisits: 22, bloodGroup: "A+",
    allergies: "NSAID", serviceType: "OPD Consultation",
  },
  {
    id: "P019", name: "Teresa Evangelista", photo: null, dob: "1995-08-17", gender: "Female",
    barangay: "Aplaya", address: "Purok 5, Aplaya, Bongabong, Oriental Mindoro",
    contactNumber: "0966-234-5678", philhealthId: null,
    lastVisit: "2025-07-15", totalVisits: 3, bloodGroup: "B+",
    allergies: "None", serviceType: "Dental",
  },
  {
    id: "P020", name: "Rodrigo Santillan", photo: null, dob: "1962-11-30", gender: "Male",
    barangay: "Mabini", address: "Purok 2, Mabini, Bongabong, Oriental Mindoro",
    contactNumber: "0978-345-6789", philhealthId: "12-890123457-8",
    lastVisit: "2025-06-10", totalVisits: 18, bloodGroup: "O+",
    allergies: "Amoxicillin", serviceType: "OPD Consultation",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAge(dob: string): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function getAgeGroup(dob: string): AgeGroup {
  const age = getAge(dob);
  if (age <= 12) return "Child";
  if (age <= 17) return "Teen";
  if (age <= 59) return "Adult";
  return "Senior";
}

function formatLastVisit(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} wk(s) ago`;
  return date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

function getServiceBadge(serviceType: ServiceType): string {
  const map: Record<ServiceType, string> = {
    "OPD Consultation": "bg-blue-100 text-blue-700",
    "Maternal Care": "bg-pink-100 text-pink-700",
    "Immunization": "bg-green-100 text-green-700",
    "Family Planning": "bg-purple-100 text-purple-700",
    "TB-DOTS": "bg-orange-100 text-orange-700",
    "Dental": "bg-cyan-100 text-cyan-700",
    "Laboratory": "bg-amber-100 text-amber-700",
    "Others": "bg-gray-100 text-gray-700",
  };
  return map[serviceType];
}

// ─── Form types ───────────────────────────────────────────────────────────────
interface PatientForm {
  name: string;
  dob: string;
  gender: "Male" | "Female" | "";
  barangay: string;
  contactNumber: string;
  philhealthId: string;
  bloodGroup: string;
  allergies: string;
  serviceType: ServiceType | "";
  email: string;
  address: string;
}

const EMPTY_FORM: PatientForm = {
  name: "", dob: "", gender: "", barangay: "", contactNumber: "",
  philhealthId: "", bloodGroup: "", allergies: "", serviceType: "",
  email: "", address: "",
};

// ─── Component ────────────────────────────────────────────────────────────────
const ALLOWED_ROLES = ["super_admin", "admin", "doctor", "records_officer"] as const;

export default function PatientManagement() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<SidebarView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [form, setForm] = useState<PatientForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  // Master List filters - MUST be before early return
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("all");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [filterLastVisit, setFilterLastVisit] = useState<LastVisitFilter>("all");
  const [filterServiceType, setFilterServiceType] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Auth protection - Check if user is logged in
  useEffect(() => {
    if (loading) return; // Wait for auth to load
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, loading, navigate]);

  // Role-based redirect
  useEffect(() => {
    if (!user) return;
    if (!ALLOWED_ROLES.includes(user.role as typeof ALLOWED_ROLES[number])) {
      navigate("/staff");
    }
  }, [user, navigate]);

  // Show nothing while loading
  if (loading || !isLoggedIn) return null;

  // Next Patient ID based on highest existing numeric ID
  const nextPatientId = (() => {
    const nums = patients
      .map((p) => parseInt(p.id.replace(/^P/, ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `P${String(max + 1).padStart(3, "0")}`;
  })();

  function setField<K extends keyof PatientForm>(key: K, value: PatientForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleAddPatient() {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Full name is required.");
    if (!form.dob) errors.push("Date of birth is required.");
    if (!form.gender) errors.push("Gender is required.");
    if (!form.barangay) errors.push("Barangay is required.");
    if (!form.contactNumber.trim()) errors.push("Contact number is required.");
    if (!form.serviceType) errors.push("Service type is required.");
    if (errors.length) {
      setFormErrors(errors);
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const newPatient: Patient = {
      id: nextPatientId,
      name: form.name.trim(),
      photo: null,
      dob: form.dob,
      gender: form.gender as "Male" | "Female",
      barangay: form.barangay,
      address: form.address.trim() || `${form.barangay}, Bongabong, Oriental Mindoro`,
      contactNumber: form.contactNumber.trim(),
      philhealthId: form.philhealthId.trim() || null,
      bloodGroup: form.bloodGroup.trim() || "Unknown",
      allergies: form.allergies.trim() || "None",
      serviceType: form.serviceType as ServiceType,
      email: form.email.trim() || undefined,
      lastVisit: today,
      totalVisits: 1,
    };
    setPatients((prev) => [newPatient, ...prev]);
    setSuccessId(newPatient.id);
    setForm(EMPTY_FORM);
    setFormErrors([]);
    setShowAddDialog(false);
    setCurrentView("list");
  }

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBarangay, filterAgeGroup, filterGender, filterLastVisit, filterServiceType]);

  function openProfile(patient: Patient) {
    setSelectedPatient(patient);
    setShowProfileModal(true);
  }

  function handleGenerateQR(patient: Patient) {
    setSelectedPatient(patient);
    setCurrentView("qr");
  }

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  function renderDashboard() {
    const now = new Date();
    const thisMonth = patients.filter((p) => {
      const lv = new Date(p.lastVisit);
      return lv.getMonth() === now.getMonth() && lv.getFullYear() === now.getFullYear();
    });
    const seniors = patients.filter((p) => getAgeGroup(p.dob) === "Senior");
    const withPhilHealth = patients.filter((p) => p.philhealthId !== null);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of MHO Bongabong patient statistics</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-health-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-health-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">Total</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            <p className="text-sm text-gray-500 mt-1">Registered Patients</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">This Month</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{thisMonth.length}</p>
            <p className="text-sm text-gray-500 mt-1">Visits This Month</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">60+</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{seniors.length}</p>
            <p className="text-sm text-gray-500 mt-1">Senior Citizens</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-400">PhilHealth</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{withPhilHealth.length}</p>
            <p className="text-sm text-gray-500 mt-1">With PhilHealth</p>
          </div>
        </div>

        {/* Service Distribution + Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top Services</h3>
            <div className="space-y-3">
              {SERVICE_TYPES.map((st) => {
                const count = patients.filter((p) => p.serviceType === st).length;
                if (count === 0) return null;
                const pct = ((count / patients.length) * 100).toFixed(0);
                return (
                  <div key={st}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{st}</span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-health-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Age Group Distribution</h3>
            <div className="space-y-3">
              {((["Child", "Teen", "Adult", "Senior"] as AgeGroup[])).map((ag) => {
                const count = patients.filter((p) => getAgeGroup(p.dob) === ag).length;
                const pct = ((count / patients.length) * 100).toFixed(0);
                const color =
                  ag === "Child" ? "bg-green-500" :
                  ag === "Teen" ? "bg-blue-500" :
                  ag === "Adult" ? "bg-health-500" : "bg-purple-500";
                return (
                  <div key={ag}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{ag}</span>
                      <span className="text-sm font-bold text-gray-900">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 p-3 bg-health-50 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-health-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {patients.filter((p) => p.gender === "Male").length} Male
                  </p>
                  <p className="text-xs text-gray-400">
                    {patients.length > 0 ? ((patients.filter((p) => p.gender === "Male").length / patients.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-pink-50 rounded-xl">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {patients.filter((p) => p.gender === "Female").length} Female
                  </p>
                  <p className="text-xs text-gray-400">
                    {patients.length > 0 ? ((patients.filter((p) => p.gender === "Female").length / patients.length) * 100).toFixed(0) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Patients Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Patients</h3>
            <button
              onClick={() => setCurrentView("list")}
              className="text-sm text-health-600 hover:text-health-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Patient</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Barangay</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Service</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase">Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 6).map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-50 hover:bg-health-50 cursor-pointer transition-colors"
                    onClick={() => openProfile(p)}
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-health-500 to-health-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-700">{p.barangay}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getServiceBadge(p.serviceType)}`}>
                        {p.serviceType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{formatLastVisit(p.lastVisit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ─── Patient Master List ────────────────────────────────────────────────────
  function renderMasterList() {
    // Apply filters
    const filteredPatients = patients.filter((p) => {
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !p.name.toLowerCase().includes(q) &&
        !p.id.toLowerCase().includes(q) &&
        !p.barangay.toLowerCase().includes(q)
      )
        return false;
      if (filterBarangay !== "all" && p.barangay !== filterBarangay) return false;
      if (filterGender !== "all" && p.gender.toLowerCase() !== filterGender) return false;
      if (filterAgeGroup !== "all" && getAgeGroup(p.dob) !== filterAgeGroup) return false;
      if (filterServiceType !== "all" && p.serviceType !== filterServiceType) return false;
      if (filterLastVisit !== "all") {
        const now = new Date();
        const lv = new Date(p.lastVisit);
        if (filterLastVisit === "this-month") {
          if (lv.getMonth() !== now.getMonth() || lv.getFullYear() !== now.getFullYear())
            return false;
        } else if (filterLastVisit === "this-year") {
          if (lv.getFullYear() !== now.getFullYear()) return false;
        }
      }
      return true;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

    const hasFilters =
      searchQuery ||
      filterBarangay !== "all" ||
      filterAgeGroup !== "all" ||
      filterGender !== "all" ||
      filterLastVisit !== "all" ||
      filterServiceType !== "all";

    return (
      <div className="space-y-4">
        {/* Header */}
        {successId && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
            <span className="text-lg">✓</span>
            <span className="text-sm font-medium">
              Patient record created — ID: <span className="font-mono font-bold">{successId}</span>
            </span>
            <button onClick={() => setSuccessId(null)} className="ml-auto text-green-500 hover:text-green-700">
              ✕
            </button>
          </div>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Master List</h1>
            <p className="text-gray-500 mt-0.5 text-sm">
              {filteredPatients.length} of {patients.length} patients
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-health-500 to-health-600 flex-1 sm:flex-none"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add Patient</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, barangay, or Patient ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-health-400 focus:border-transparent"
            />
          </div>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            <Select value={filterBarangay} onValueChange={setFilterBarangay}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-44">
                <SelectValue placeholder="All Barangays" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Barangays</SelectItem>
                {BONGABONG_BARANGAYS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterAgeGroup} onValueChange={setFilterAgeGroup}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-36">
                <SelectValue placeholder="Age Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="Child">Child (0-12)</SelectItem>
                <SelectItem value="Teen">Teen (13-17)</SelectItem>
                <SelectItem value="Adult">Adult (18-59)</SelectItem>
                <SelectItem value="Senior">Senior (60+)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGender} onValueChange={setFilterGender}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-32">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLastVisit} onValueChange={(v) => setFilterLastVisit(v as LastVisitFilter)}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-36">
                <SelectValue placeholder="Last Visit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterServiceType} onValueChange={setFilterServiceType}>
              <SelectTrigger className="h-8 text-xs w-full sm:w-44">
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {SERVICE_TYPES.map((st) => (
                  <SelectItem key={st} value={st}>{st}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterBarangay("all");
                  setFilterAgeGroup("all");
                  setFilterGender("all");
                  setFilterLastVisit("all");
                  setFilterServiceType("all");
                }}
                className="h-8 px-3 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 border border-gray-200 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center"
              >
                <X className="w-3 h-3" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Table - Desktop View */}
        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Age / DOB</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Gender</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Barangay</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">PhilHealth ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Visit</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center text-gray-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="font-medium">No patients match your criteria</p>
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-50 hover:bg-health-50 cursor-pointer transition-colors group"
                      onClick={() => openProfile(p)}
                    >
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs font-semibold text-health-600 bg-health-50 px-2 py-0.5 rounded">
                          {p.id}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-health-500 to-health-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                          </div>
                          <span className="font-medium text-gray-900 group-hover:text-health-600 transition-colors">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{getAge(p.dob)} yrs</p>
                        <p className="text-xs text-gray-400">
                          {new Date(p.dob).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          p.gender === "Male" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700">{p.barangay}</td>
                      <td className="py-3 px-4 font-mono text-xs text-gray-700">{p.contactNumber}</td>
                      <td className="py-3 px-4">
                        {p.philhealthId
                          ? <span className="font-mono text-xs text-gray-700">{p.philhealthId}</span>
                          : <span className="text-gray-300">—</span>
                        }
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-700">{formatLastVisit(p.lastVisit)}</p>
                        <p className="text-xs text-gray-400">{p.serviceType}</p>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-health-100 text-health-600"
                          onClick={(e) => { e.stopPropagation(); openProfile(p); }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card View - Mobile & Tablet */}
        <div className="lg:hidden space-y-3">
          {paginatedPatients.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-gray-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No patients match your criteria</p>
            </div>
          ) : (
            paginatedPatients.map((p) => (
              <div
                key={p.id}
                onClick={() => openProfile(p)}
                className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-health-500 to-health-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                    <p className="text-xs text-gray-500 font-mono">{p.id}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        p.gender === "Male" ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700"
                      }`}>
                        {p.gender}
                      </span>
                      <span className="text-xs text-gray-500">{getAge(p.dob)} yrs</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); openProfile(p); }}
                    className="p-2 rounded-lg hover:bg-health-50 text-health-600"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Barangay</p>
                    <p className="font-medium text-gray-900">{p.barangay}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Contact</p>
                    <p className="font-medium text-gray-900 font-mono text-xs">{p.contactNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Last Visit</p>
                    <p className="font-medium text-gray-900 text-xs">{formatLastVisit(p.lastVisit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Service</p>
                    <p className="font-medium text-gray-900 text-xs truncate">{p.serviceType}</p>
                  </div>
                </div>

                {/* PhilHealth Badge */}
                {p.philhealthId && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400">PhilHealth: <span className="font-mono text-gray-700">{p.philhealthId}</span></p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <div className="flex flex-col gap-4">
            {/* Pagination Info & Items Per Page */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                <span className="font-semibold">{Math.min(endIndex, filteredPatients.length)}</span> of{" "}
                <span className="font-semibold">{filteredPatients.length}</span> patients
              </p>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per page</SelectItem>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination Navigation */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent className="flex-wrap justify-center">
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {/* Page Numbers - Simplified for mobile */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // On mobile, show fewer page numbers
                    const isMobile = totalPages > 5;
                    const showPage = isMobile
                      ? page === 1 || page === totalPages || page === currentPage
                      : page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsisBefore = page === currentPage - 1 && currentPage > 2 && isMobile;
                    const showEllipsisAfter = page === currentPage + 1 && currentPage < totalPages - 1 && isMobile;

                    if (showEllipsisBefore || showEllipsisAfter) {
                      return (
                        <PaginationItem key={page} className="hidden sm:inline-flex">
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── QR Card View ──────────────────────────────────────────────────────────
  function renderQR() {
    if (!selectedPatient) return null;
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setCurrentView("list")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
        </Button>
        <Card className="border-2 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Patient ID Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-health-500 to-health-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-1">MHO Bongabong</h3>
                  <p className="text-health-100 text-sm">Municipal Health Office</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                  <Activity className="w-7 h-7 text-health-600" />
                </div>
              </div>
              <div className="flex items-center gap-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                  {selectedPatient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <h4 className="text-2xl font-bold mb-1">{selectedPatient.name}</h4>
                  <p className="text-health-100">Patient ID: {selectedPatient.id}</p>
                  <p className="text-health-100">
                    DOB: {new Date(selectedPatient.dob).toLocaleDateString("en-PH")}
                  </p>
                  <p className="text-health-100">Brgy. {selectedPatient.barangay}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 text-gray-900">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-48 h-48 bg-white border-4 border-health-200 rounded-xl flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-health-600" />
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600">Scan QR code to access patient record</p>
              </div>
              <div className="mt-6 pt-6 border-t border-health-400 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-health-100 mb-1">Blood Group</p>
                  <p className="font-semibold">{selectedPatient.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-health-100 mb-1">PhilHealth ID</p>
                  <p className="font-semibold">{selectedPatient.philhealthId ?? "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 bg-gradient-to-r from-health-500 to-health-600">
                <Download className="w-4 h-4 mr-2" /> Download Card
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" /> Print Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Merge View ────────────────────────────────────────────────────────────
  function renderMerge() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Merge Duplicate Records</h1>
          <p className="text-gray-600 mt-1">Find and merge duplicate patient profiles</p>
        </div>
        <Card className="border-2">
          <CardHeader><CardTitle>Duplicate Detection</CardTitle></CardHeader>
          <CardContent>
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
              <Merge className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="font-medium text-gray-600">No duplicate records found</p>
              <p className="text-sm text-gray-400 mt-1">The system will flag potential duplicates automatically</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderContent() {
    switch (currentView) {
      case "dashboard": return renderDashboard();
      case "list": return renderMasterList();
      case "qr": return renderQR();
      case "merge": return renderMerge();
      default: return null;
    }
  }

  // ─── Layout ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
            <div className="w-9 h-9 bg-gradient-to-br from-health-500 to-health-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-health-700">MHO Bongabong</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => { logout(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Backdrop overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed top-0 left-0 z-50 h-screen w-56 flex-shrink-0 border-r border-slate-200 bg-white p-4 space-y-1 flex flex-col overflow-y-auto transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:flex"
        }`}>
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-2 md:hidden">
            <span className="text-sm font-bold text-health-700">Navigation</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {(
            [
              { view: "dashboard" as SidebarView, icon: Home, label: "Dashboard" },
              { view: "list" as SidebarView, icon: Users, label: "Patient Master List" },
              { view: "merge" as SidebarView, icon: Merge, label: "Merge Records" },
            ] as const
          ).map(({ view, icon: Icon, label }) => (
            <button
              key={view}
              onClick={() => { setCurrentView(view); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                currentView === view
                  ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-sm"
                  : "hover:bg-health-50 text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <div className="pt-3 mt-3 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-3">Quick Actions</p>
            <button
              onClick={() => setShowAddDialog(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-health-50 text-gray-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Add Patient</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>

      {/* Patient Profile Modal */}
      {selectedPatient && (
        <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Patient Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-5">
              {/* Hero banner */}
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-health-500 to-health-600 rounded-xl text-white">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
                  {selectedPatient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-health-100 text-sm">{selectedPatient.id} · Brgy. {selectedPatient.barangay}</p>
                  <p className="text-health-100 text-sm">
                    {getAge(selectedPatient.dob)} yrs · {selectedPatient.gender} · {getAgeGroup(selectedPatient.dob)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/20 whitespace-nowrap`}>
                  {selectedPatient.serviceType}
                </span>
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Date of Birth</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedPatient.dob).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Contact Number</p>
                  <p className="font-medium text-gray-900 font-mono">{selectedPatient.contactNumber}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-400 mb-1">Full Address</p>
                  <p className="font-medium text-gray-900 text-sm">{selectedPatient.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">PhilHealth ID</p>
                  <p className={`font-medium ${selectedPatient.philhealthId ? "text-gray-900 font-mono text-sm" : "text-gray-400 italic"}`}>
                    {selectedPatient.philhealthId ?? "Not registered"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Total Visits</p>
                  <p className="font-medium text-gray-900">{selectedPatient.totalVisits} visits</p>
                </div>
                {selectedPatient.email && (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-gray-900 text-sm">{selectedPatient.email}</p>
                  </div>
                )}
              </div>

              {/* Medical Info */}
              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">Medical Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Blood Group</p>
                    <p className="font-bold text-red-600 text-xl">{selectedPatient.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Known Allergies</p>
                    <p className={`font-medium ${selectedPatient.allergies !== "None" ? "text-orange-600" : "text-gray-500"}`}>
                      {selectedPatient.allergies}
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Visit */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-3">Last Visit</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedPatient.lastVisit).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatLastVisit(selectedPatient.lastVisit)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Service Type</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getServiceBadge(selectedPatient.serviceType)}`}>
                      {selectedPatient.serviceType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => { handleGenerateQR(selectedPatient); setShowProfileModal(false); }}
              >
                <QrCode className="w-4 h-4 mr-2" /> Get QR Card
              </Button>
              <Button className="bg-gradient-to-r from-health-500 to-health-600">
                <Edit className="w-4 h-4 mr-2" /> Edit Patient
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Patient Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) { setForm(EMPTY_FORM); setFormErrors([]); }}}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Patient Record</DialogTitle>
            <DialogDescription>Fill in the details below. A Patient ID will be auto-generated upon submission.</DialogDescription>
          </DialogHeader>

          {/* Validation errors */}
          {formErrors.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm space-y-1">
              {formErrors.map((e, i) => <p key={i}>• {e}</p>)}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {/* Auto Patient ID */}
            <div className="col-span-2">
              <Label>Patient ID (auto-generated)</Label>
              <Input
                className="mt-2 bg-gray-50 font-mono text-health-600 font-semibold"
                value={nextPatientId}
                readOnly
              />
            </div>

            {/* Full Name */}
            <div className="col-span-2">
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Juan Dela Cruz"
                className="mt-2"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </div>

            {/* DOB */}
            <div>
              <Label>Date of Birth <span className="text-red-500">*</span></Label>
              <Input
                type="date"
                className="mt-2"
                value={form.dob}
                onChange={(e) => setField("dob", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
              {form.dob && (
                <p className="text-xs text-gray-400 mt-1">
                  Age: {getAge(form.dob)} yrs · {getAgeGroup(form.dob)}
                </p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label>Gender <span className="text-red-500">*</span></Label>
              <Select value={form.gender} onValueChange={(v) => setField("gender", v as "Male" | "Female")}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Barangay */}
            <div>
              <Label>Barangay <span className="text-red-500">*</span></Label>
              <Select value={form.barangay} onValueChange={(v) => setField("barangay", v)}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select barangay" /></SelectTrigger>
                <SelectContent>
                  {BONGABONG_BARANGAYS.map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Contact */}
            <div>
              <Label>Contact Number <span className="text-red-500">*</span></Label>
              <Input
                placeholder="09xx-xxx-xxxx"
                className="mt-2"
                value={form.contactNumber}
                onChange={(e) => setField("contactNumber", e.target.value)}
              />
            </div>

            {/* Service Type */}
            <div>
              <Label>Service Type <span className="text-red-500">*</span></Label>
              <Select value={form.serviceType} onValueChange={(v) => setField("serviceType", v as ServiceType)}>
                <SelectTrigger className="mt-2"><SelectValue placeholder="Select service" /></SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((st) => (
                    <SelectItem key={st} value={st}>{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* PhilHealth */}
            <div>
              <Label>PhilHealth ID <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input
                placeholder="12-xxxxxxxxx-x"
                className="mt-2 font-mono"
                value={form.philhealthId}
                onChange={(e) => setField("philhealthId", e.target.value)}
              />
            </div>

            {/* Blood Group */}
            <div>
              <Label>Blood Group</Label>
              <Input
                placeholder="A+"
                className="mt-2"
                value={form.bloodGroup}
                onChange={(e) => setField("bloodGroup", e.target.value)}
              />
            </div>

            {/* Allergies */}
            <div>
              <Label>Known Allergies</Label>
              <Input
                placeholder="None"
                className="mt-2"
                value={form.allergies}
                onChange={(e) => setField("allergies", e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input
                type="email"
                placeholder="patient@email.com"
                className="mt-2"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <Label>Full Address</Label>
              <Textarea
                placeholder="Purok 1, Brgy. Poblacion, Bongabong, Oriental Mindoro"
                className="mt-2"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddDialog(false); setForm(EMPTY_FORM); setFormErrors([]); }}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-health-500 to-health-600" onClick={handleAddPatient}>
              Create Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
