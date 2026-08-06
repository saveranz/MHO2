import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffDirectory from "./StaffDirectory";
import DutySchedule from "./DutySchedule";
import AdminSettings from "./Settings";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  ArrowUpRight,
  BellRing,
  CalendarDays,
  CheckCheck,
  ClipboardList,
  Download,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

type AdminTabKey =
  | "overview"
  | "staff"
  | "schedule"
  | "tasks"
  | "approvals"
  | "reports"
  | "settings";

const adminTabs: {
  id: AdminTabKey;
  label: string;
  icon: typeof LayoutDashboard;
  helper: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    helper: "Today's on-duty staff, pending requests and quick stats",
  },
  {
    id: "staff",
    label: "Staff",
    icon: Users,
    helper: "Directory, role assignments, and add/edit actions",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: CalendarDays,
    helper: "Calendar and roster builder for daily coverage",
  },
  {
    id: "tasks",
    label: "Tasks & Requests",
    icon: ClipboardList,
    helper: "Assigned work items and incoming patient requests",
  },
  {
    id: "approvals",
    label: "Approvals",
    icon: CheckCheck,
    helper: "Pending leave requests and office approvals",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    helper: "Quick summaries and export-ready reports",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    helper: "Manage roles, shift types, leave types and office hours",
  },
];

const quickStats = [
  { label: "On-duty staff", value: "12", note: "2 doctors · 6 nurses · 4 support", trend: "+2", icon: Users, color: "cyan" },
  { label: "Pending requests", value: "18", note: "For triage and office action", trend: "-3", icon: ClipboardList, color: "amber" },
  { label: "Approvals waiting", value: "4", note: "Leave and supply requests", trend: "+1", icon: CheckCheck, color: "emerald" },
  { label: "Reports ready", value: "3", note: "Weekly, monthly, and program summary", trend: "0", icon: FileText, color: "purple" },
];

const onDutyStaff = [
  { name: "Dr. Maria Santos", role: "Municipal Health Officer", shift: "8:00 AM – 5:00 PM", status: "active" },
  { name: "Nurse Elena Cruz", role: "Immunization Nurse", shift: "8:00 AM – 4:00 PM", status: "active" },
  { name: "Mark Reyes", role: "Records Staff", shift: "9:00 AM – 5:00 PM", status: "break" },
  { name: "Ana Lopez", role: "Maternal Care Midwife", shift: "8:00 AM – 3:00 PM", status: "active" },
];

const taskRequests = [
  { title: "Review medicine inventory update", owner: "Admin Office", priority: "High", status: "In progress" },
  { title: "Verify barangay outreach schedule", owner: "Community Program Team", priority: "Medium", status: "Pending" },
  { title: "Respond to resident referral letters", owner: "Records Staff", priority: "High", status: "Queued" },
  { title: "Prepare vaccination campaign materials", owner: "Immunization Unit", priority: "Low", status: "Planned" },
];

const INITIAL_APPROVAL_ITEMS = [
  { id: 1, request: "2-day leave request", requester: "Liza Fernandez", type: "Leave", due: "Today" },
  { id: 2, request: "Medical supply restock", requester: "Immunization Unit", type: "Supplies", due: "Tomorrow" },
  { id: 3, request: "Community seminar travel clearance", requester: "Outreach Team", type: "Travel", due: "This week" },
];

const reportCards = [
  { 
    id: "weekly-consultation",
    title: "Weekly consultation summary", 
    summary: "128 resident visits recorded this week.",
    type: "consultation",
    period: "Week of May 6-12, 2026"
  },
  { 
    id: "immunization-progress",
    title: "Immunization progress report", 
    summary: "84% of scheduled vaccine recipients were covered.",
    type: "immunization",
    period: "May 2026"
  },
  { 
    id: "maternal-health",
    title: "Maternal health monitoring", 
    summary: "19 active follow-up cases tracked for this month.",
    type: "maternal",
    period: "May 2026"
  },
];

const recentActivities = [
  { action: "New staff member added", user: "Admin", time: "2 hours ago" },
  { action: "Schedule updated for next week", user: "Dr. Santos", time: "4 hours ago" },
  { action: "Leave request approved", user: "Admin", time: "5 hours ago" },
  { action: "Report generated", user: "System", time: "1 day ago" },
];

export default function SuperAdminDashboard() {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [approvalItems, setApprovalItems] = useState(INITIAL_APPROVAL_ITEMS);

  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!isLoggedIn || (user?.role !== "super_admin" && user?.role !== "admin")) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate, loading]);

  const handleApprove = (id: number, request: string, requester: string) => {
    // Remove the item from the list
    setApprovalItems(items => items.filter(item => item.id !== id));
    
    // Show success toast
    toast({
      title: "Request Approved",
      description: `${request} from ${requester} has been approved successfully.`,
      variant: "default",
    });
  };

  const handleReject = (id: number, request: string, requester: string) => {
    // Remove the item from the list
    setApprovalItems(items => items.filter(item => item.id !== id));
    
    // Show rejection toast
    toast({
      title: "Request Rejected",
      description: `${request} from ${requester} has been rejected.`,
      variant: "destructive",
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading || !isLoggedIn) {
    return null;
  }

  const activeTabMeta = adminTabs.find((tab) => tab.id === activeTab);

  // Function to generate report content
  const generateReportContent = (reportId: string) => {
    const report = reportCards.find(r => r.id === reportId);
    if (!report) return null;

    const reportData: Record<string, any> = {
      "weekly-consultation": {
        totalVisits: 128,
        breakdown: [
          { service: "General Consultation", count: 45, percentage: "35%" },
          { service: "Immunization", count: 32, percentage: "25%" },
          { service: "Maternal Care", count: 28, percentage: "22%" },
          { service: "Medicine Distribution", count: 23, percentage: "18%" },
        ],
        dailyStats: [
          { day: "Monday", visits: 24 },
          { day: "Tuesday", visits: 28 },
          { day: "Wednesday", visits: 22 },
          { day: "Thursday", visits: 26 },
          { day: "Friday", visits: 28 },
        ]
      },
      "immunization-progress": {
        totalScheduled: 150,
        completed: 126,
        percentage: "84%",
        vaccines: [
          { type: "BCG", administered: 45, target: 50 },
          { type: "Hepatitis B", administered: 38, target: 45 },
          { type: "DPT", administered: 43, target: 55 },
        ],
        ageGroups: [
          { group: "0-1 years", coverage: "92%" },
          { group: "1-2 years", coverage: "85%" },
          { group: "2-5 years", coverage: "78%" },
        ]
      },
      "maternal-health": {
        activeCases: 19,
        newCases: 5,
        completedCheckups: 14,
        services: [
          { service: "Prenatal Checkup", count: 12 },
          { service: "Postnatal Care", count: 7 },
          { service: "Nutrition Counseling", count: 8 },
        ],
        riskCategories: [
          { category: "Low Risk", count: 12 },
          { category: "Medium Risk", count: 5 },
          { category: "High Risk", count: 2 },
        ]
      }
    };

    return reportData[reportId];
  };

  // Function to download report as PDF (simulated)
  const downloadReport = (reportId: string, format: 'pdf' | 'csv') => {
    const report = reportCards.find(r => r.id === reportId);
    if (!report) return;

    const content = generateReportContent(reportId);
    
    if (format === 'pdf') {
      // Generate properly formatted PDF content
      const pdfContent = `
═══════════════════════════════════════════════════════════════
                MEDICAL HEALTH OFFICE - BONGABONG
                     ${report.title.toUpperCase()}
═══════════════════════════════════════════════════════════════

Period: ${report.period}
Generated: ${new Date().toLocaleString('en-PH', { 
  dateStyle: 'full', 
  timeStyle: 'short' 
})}

SUMMARY
---------------------------------------------------------------
${report.summary}

DETAILED DATA
---------------------------------------------------------------
${formatContentForPDF(content)}

═══════════════════════════════════════════════════════════════
                    End of Report
═══════════════════════════════════════════════════════════════
      `.trim();
      
      const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Generate properly formatted CSV for Excel
      let csvContent = '';
      
      // Add header with BOM for Excel UTF-8 support
      csvContent = '\uFEFF'; // UTF-8 BOM
      
      // Title and metadata
      csvContent += `"${report.title}"\n`;
      csvContent += `"Period: ${report.period}"\n`;
      csvContent += `"Generated: ${new Date().toLocaleString('en-PH')}"\n`;
      csvContent += '\n';
      
      // Data section
      if (content) {
        Object.entries(content).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            // Section header
            csvContent += `"${key.toUpperCase().replace(/_/g, ' ')}"\n`;
            
            // Column headers
            const headers = Object.keys(value[0]);
            csvContent += headers.map(h => `"${h.replace(/_/g, ' ').toUpperCase()}"`).join(',') + '\n';
            
            // Data rows
            value.forEach((item: any) => {
              const row = headers.map(h => {
                const val = item[h];
                // Escape quotes and wrap in quotes for Excel
                if (val === null || val === undefined) return '""';
                const str = String(val).replace(/"/g, '""');
                return `"${str}"`;
              });
              csvContent += row.join(',') + '\n';
            });
            csvContent += '\n';
          } else if (typeof value === 'object' && value !== null) {
            // Key-value pairs
            csvContent += `"${key.replace(/_/g, ' ').toUpperCase()}"\n`;
            Object.entries(value).forEach(([k, v]) => {
              csvContent += `"${k.replace(/_/g, ' ')}","${v}"\n`;
            });
            csvContent += '\n';
          }
        });
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '-')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Helper function to format content for PDF
  const formatContentForPDF = (content: any): string => {
    if (!content) return 'No data available';
    
    let formatted = '';
    Object.entries(content).forEach(([key, value]) => {
      formatted += `\n${key.toUpperCase().replace(/_/g, ' ')}\n`;
      formatted += '-'.repeat(60) + '\n';
      
      if (Array.isArray(value)) {
        value.forEach((item: any, index: number) => {
          formatted += `\n[${index + 1}]\n`;
          Object.entries(item).forEach(([k, v]) => {
            formatted += `  ${k.replace(/_/g, ' ')}: ${v}\n`;
          });
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([k, v]) => {
          formatted += `  ${k.replace(/_/g, ' ')}: ${v}\n`;
        });
      } else {
        formatted += `  ${value}\n`;
      }
      formatted += '\n';
    });
    
    return formatted;
  };

  // Function to download export files
  const downloadExport = (exportType: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    const exportData: Record<string, any> = {
      "monthly-summary": {
        filename: "Monthly-Office-Summary",
        format: "pdf",
        content: `
═══════════════════════════════════════════════════════════════
           MEDICAL HEALTH OFFICE - BONGABONG
                MONTHLY OFFICE SUMMARY
═══════════════════════════════════════════════════════════════

Report Period: May 2026
Generated: ${new Date().toLocaleString('en-PH', { dateStyle: 'full', timeStyle: 'short' })}

OVERVIEW
---------------------------------------------------------------
Total Consultations                    : 542
Total Immunizations                    : 126
Maternal Care Visits                   : 78
Medicine Distributed                   : 234 items

STAFF PERFORMANCE
---------------------------------------------------------------
Dr. Maria Santos                       : 145 consultations
Nurse Elena Cruz                       : 98 immunizations
Midwife Ana Lopez                      : 67 maternal care visits

RESOURCE UTILIZATION
---------------------------------------------------------------
Consultation Rooms                     : 85% utilization
Medical Supplies                       : 78% stock level
Equipment Status                       : All operational
Medicine Inventory                     : Adequate

RECOMMENDATIONS
---------------------------------------------------------------
• Increase staffing for peak hours (10AM - 2PM)
• Restock vitamins and basic medications
• Schedule equipment maintenance for June

═══════════════════════════════════════════════════════════════
                         End of Report
═══════════════════════════════════════════════════════════════
        `.trim()
      },
      "consultation-log": {
        filename: "Consultation-Log-Export",
        format: "csv",
        content: '\uFEFF' + `"CONSULTATION LOG - MHO BONGABONG"
"Period: May 2026"
"Generated: ${new Date().toLocaleString('en-PH')}"

"DATE","PATIENT ID","PATIENT NAME","DOCTOR","SERVICE TYPE","DURATION","STATUS"
"2026-05-13","P001","Juan Dela Cruz","Dr. Santos","General Consultation","30 min","Completed"
"2026-05-13","P002","Maria Garcia","Dr. Santos","Follow-up","20 min","Completed"
"2026-05-13","P003","Pedro Reyes","Dr. Buenaventura","General Consultation","25 min","Completed"
"2026-05-12","P004","Ana Lopez","Dr. Santos","Maternal Care","40 min","Completed"
"2026-05-12","P005","Carlos Mendoza","Dr. Buenaventura","General Consultation","30 min","Completed"
"2026-05-12","P006","Rosa Santos","Dr. Santos","Immunization","15 min","Completed"
"2026-05-11","P007","Miguel Torres","Dr. Buenaventura","General Consultation","35 min","Completed"
"2026-05-11","P008","Linda Cruz","Dr. Santos","Maternal Care","45 min","Completed"

"SUMMARY"
"Total Consultations","8"
"Average Duration","28.75 min"
"Completion Rate","100%"`
      },
      "immunization-summary": {
        filename: "Immunization-Progress-Summary",
        format: "pdf",
        content: `
═══════════════════════════════════════════════════════════════
           MEDICAL HEALTH OFFICE - BONGABONG
           IMMUNIZATION PROGRESS SUMMARY
═══════════════════════════════════════════════════════════════

Report Period: May 2026
Generated: ${new Date().toLocaleString('en-PH', { dateStyle: 'full', timeStyle: 'short' })}

VACCINATION COVERAGE OVERVIEW
---------------------------------------------------------------
Total Scheduled                        : 150 children
Completed Vaccinations                 : 126 children
Coverage Rate                          : 84%
Pending Follow-ups                     : 24 children

VACCINE BREAKDOWN
---------------------------------------------------------------
BCG (Bacillus Calmette-Guérin)        : 45/50 (90%)
Hepatitis B                            : 38/45 (84%)
DPT (Diphtheria, Pertussis, Tetanus)  : 43/55 (78%)
Polio Vaccine                          : 40/50 (80%)

AGE GROUP COVERAGE
---------------------------------------------------------------
0-1 years                              : 92%
1-2 years                              : 85%
2-5 years                              : 78%

BARANGAY PERFORMANCE
---------------------------------------------------------------
Barangay Poblacion                     : 95% coverage
Barangay Camburay                      : 88% coverage
Barangay Hagan                         : 82% coverage
Barangay Labasan                       : 75% coverage

RECOMMENDATIONS
---------------------------------------------------------------
• Conduct outreach program for 2-5 age group in Labasan
• Schedule catch-up immunization sessions
• Follow up with 24 children with incomplete vaccinations
• Increase health education on vaccine importance

═══════════════════════════════════════════════════════════════
                         End of Report
═══════════════════════════════════════════════════════════════
        `.trim()
      },
      "staff-attendance": {
        filename: "Staff-Attendance-Report",
        format: "csv",
        content: '\uFEFF' + `"STAFF ATTENDANCE REPORT - MHO BONGABONG"
"Period: May 2026"
"Generated: ${new Date().toLocaleString('en-PH')}"

"STAFF NAME","ROLE","DAYS PRESENT","DAYS ABSENT","LEAVE DAYS","ATTENDANCE RATE"
"Dr. Maria Santos","Municipal Health Officer","22","0","0","100%"
"Dr. Carlo Buenaventura","Doctor","22","0","0","100%"
"Nurse Elena Cruz","Public Health Nurse","21","1","0","95%"
"Midwife Ana Lopez","Midwife","20","0","2","100%"
"Mark Reyes","Admin Clerk","22","0","0","100%"
"Ramon Dela Cruz","Sanitary Inspector","21","1","0","95%"
"Gloria Macaraeg","Barangay Health Worker","22","0","0","100%"

"SUMMARY"
"Total Staff","7"
"Average Attendance Rate","98.57%"
"Total Leave Days","2"
"Total Absent Days","2"`
      }
    };

    const data = exportData[exportType];
    if (!data) return;

    const mimeType = data.format === 'pdf' ? 'text/plain;charset=utf-8' : 'text/csv;charset=utf-8';
    const blob = new Blob([data.content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.filename}_${today}.${data.format === 'pdf' ? 'txt' : 'csv'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-cyan-50/20 to-gray-50">
        {/* ── Mobile top bar ── */}
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-xl px-4 py-3 shadow-sm md:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-600">MHO Bongabong</p>
              <p className="text-sm font-bold text-gray-800">Admin Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {/* ── Backdrop overlay (mobile) ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ── */}
        <aside className={`fixed top-0 left-0 z-50 h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 md:sticky md:translate-x-0 md:flex ${
          sidebarOpen ? "flex translate-x-0" : "-translate-x-full md:flex"
        }`}>
          {/* Branding block */}
          <div className="border-b border-gray-100 bg-gradient-to-br from-cyan-500 via-cyan-600 to-cyan-700 px-6 py-6 text-white">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                      MHO Bongabong
                    </p>
                    <h2 className="text-lg font-bold leading-snug">Admin Portal</h2>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3">
                  <p className="text-xs text-cyan-100">Logged in as</p>
                  <p className="truncate text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-cyan-100 capitalize mt-0.5">{user?.role?.replace("_", " ")}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="ml-2 shrink-0 rounded-lg p-1.5 text-white/70 hover:bg-white/20 md:hidden"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-cyan-50 to-transparent">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-cyan-600" />
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Today</p>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 p-4">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30"
                      : "text-gray-600 hover:bg-cyan-50 hover:text-cyan-700"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Sidebar footer: logout ── */}
          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-gray-600 transition-all hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pt-20 md:pt-6 md:px-8 md:py-8">
          {/* Header */}
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{activeTabMeta?.label}</h2>
                <p className="mt-1 text-gray-600">{activeTabMeta?.helper}</p>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <BellRing className="h-5 w-5 text-gray-600" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </section>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                const colorClasses = {
                  cyan: "from-cyan-500 to-cyan-600",
                  amber: "from-amber-500 to-amber-600",
                  emerald: "from-emerald-500 to-emerald-600",
                  purple: "from-purple-500 to-purple-600",
                };
                return (
                  <div key={stat.label} className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        {stat.trend}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="mt-1 text-xs text-gray-500">{stat.note}</p>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {/* On-duty Staff */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Today's on-duty staff</h3>
                  </div>
                  <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700">View All</button>
                </div>
                <div className="space-y-3">
                  {onDutyStaff.map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-transparent p-4 border border-gray-100 hover:border-cyan-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          member.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                          {member.status === "active" ? "Active" : "On Break"}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{member.shift}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Pending Requests */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Urgent Alerts</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-900">
                      <span className="font-semibold">6</span> resident follow-up requests need triage review.
                    </li>
                    <li className="rounded-xl bg-cyan-50 border border-cyan-200 p-3 text-cyan-900">
                      <span className="font-semibold">4</span> supply replenishment requests awaiting confirmation.
                    </li>
                    <li className="rounded-xl bg-purple-50 border border-purple-200 p-3 text-purple-900">
                      <span className="font-semibold">8</span> records and referral requests remain open.
                    </li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-cyan-500 to-cyan-600 p-6 shadow-lg text-white">
                  <h3 className="mb-4 text-lg font-bold">Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      "Review roster changes",
                      "Approve urgent requests",
                      "Open weekly reports",
                    ].map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="flex w-full items-center justify-between rounded-xl bg-white/20 backdrop-blur-sm px-4 py-3 text-left text-sm font-semibold transition-all hover:bg-white/30"
                      >
                        {action}
                        <ArrowUpRight className="h-4 w-4" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                    <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">by {activity.user}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "staff" && <StaffDirectory />}

        {activeTab === "schedule" && <DutySchedule />}

        {activeTab === "tasks" && (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-gray-900">Assigned tasks</h3>
              <div className="space-y-3">
                {taskRequests.map((task) => (
                  <div key={task.title} className="rounded-xl border border-gray-200 p-4 hover:border-cyan-300 hover:bg-cyan-50/50 transition-all">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">{task.title}</p>
                        <p className="text-sm text-gray-600">Owner: {task.owner}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          task.priority === "High" ? "bg-red-100 text-red-700" :
                          task.priority === "Medium" ? "bg-amber-100 text-amber-700" :
                          "bg-gray-100 text-gray-700"
                        }`}>
                          {task.priority}
                        </span>
                        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-xl font-bold text-gray-900">Incoming patient requests</h3>
              <div className="space-y-3 text-sm">
                <div className="rounded-xl bg-gradient-to-r from-cyan-50 to-transparent border border-cyan-200 p-4">
                  <span className="font-bold text-cyan-900">5</span> requests for medical certificate release
                </div>
                <div className="rounded-xl bg-gradient-to-r from-purple-50 to-transparent border border-purple-200 p-4">
                  <span className="font-bold text-purple-900">3</span> follow-up requests for maternal checkup records
                </div>
                <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-transparent border border-emerald-200 p-4">
                  <span className="font-bold text-emerald-900">6</span> medicine availability enquiries from residents
                </div>
                <div className="rounded-xl bg-gradient-to-r from-amber-50 to-transparent border border-amber-200 p-4">
                  <span className="font-bold text-amber-900">4</span> referrals awaiting admin routing
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Pending approvals</h3>
            </div>

            <div className="space-y-4">
              {approvalItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCheck className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-500">No pending approvals at this time.</p>
                </div>
              ) : (
                approvalItems.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 rounded-xl border border-gray-200 p-5 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{item.request}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.requester} · <span className="font-medium">{item.type}</span> · Due <span className="font-medium text-amber-600">{item.due}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => handleReject(item.id, item.request, item.requester)}
                        className="rounded-xl border-2 border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleApprove(item.id, item.request, item.requester)}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 font-semibold text-white hover:shadow-lg transition-all"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
              {/* Reports List */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Available Reports</h3>
                {reportCards.map((report) => (
                  <div key={report.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{report.period}</p>
                      </div>
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
                        {report.type}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed mb-4">{report.summary}</p>
                    
                    <div className="flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setSelectedReport(report.id)}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        <FileText className="h-4 w-4" />
                        View Report
                      </button>
                      <button 
                        type="button"
                        onClick={() => downloadReport(report.id, 'pdf')}
                        className="px-4 py-2.5 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-all"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exports Section */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Download className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Quick Exports</h3>
                  </div>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => downloadExport('monthly-summary')}
                      className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-4 py-4 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <FileText className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Monthly office summary</p>
                          <p className="text-xs text-gray-500">PDF Format</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-cyan-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadExport('consultation-log')}
                      className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-4 py-4 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                          <ClipboardList className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Consultation log export</p>
                          <p className="text-xs text-gray-500">CSV Format</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-cyan-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadExport('immunization-summary')}
                      className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-4 py-4 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Immunization progress summary</p>
                          <p className="text-xs text-gray-500">PDF Format</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-cyan-600" />
                    </button>

                    <button
                      type="button"
                      onClick={() => downloadExport('staff-attendance')}
                      className="flex w-full items-center justify-between rounded-xl border-2 border-gray-200 px-4 py-4 text-left transition-all hover:border-cyan-300 hover:bg-cyan-50 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                          <Users className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Staff attendance report</p>
                          <p className="text-xs text-gray-500">CSV Format</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-cyan-600" />
                    </button>
                  </div>

                  <div className="mt-6 rounded-xl bg-gradient-to-r from-cyan-50 to-purple-50 border border-cyan-200 p-4 text-sm text-gray-700">
                    <p className="font-semibold mb-1">📊 Export Information</p>
                    <p className="text-xs">Reports are generated in real-time with the latest data. PDF files contain detailed summaries, while CSV files are optimized for spreadsheet analysis.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Viewer Modal */}
            {selectedReport && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-transparent">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {reportCards.find(r => r.id === selectedReport)?.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {reportCards.find(r => r.id === selectedReport)?.period}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReport(null)}
                      className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    {(() => {
                      const content = generateReportContent(selectedReport);
                      const report = reportCards.find(r => r.id === selectedReport);
                      
                      if (selectedReport === 'weekly-consultation' && content) {
                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                                <p className="text-sm text-cyan-600 font-semibold">Total Visits</p>
                                <p className="text-3xl font-bold text-cyan-900 mt-1">{content.totalVisits}</p>
                              </div>
                              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <p className="text-sm text-emerald-600 font-semibold">Period</p>
                                <p className="text-lg font-bold text-emerald-900 mt-1">{report?.period}</p>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Service Breakdown</h3>
                              <div className="space-y-2">
                                {content.breakdown.map((item: any) => (
                                  <div key={item.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-900">{item.service}</span>
                                    <div className="flex items-center gap-3">
                                      <span className="text-gray-600">{item.count} visits</span>
                                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">{item.percentage}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Daily Statistics</h3>
                              <div className="grid grid-cols-5 gap-2">
                                {content.dailyStats.map((stat: any) => (
                                  <div key={stat.day} className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 text-center border border-cyan-200">
                                    <p className="text-xs text-cyan-600 font-semibold">{stat.day}</p>
                                    <p className="text-2xl font-bold text-cyan-900 mt-1">{stat.visits}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (selectedReport === 'immunization-progress' && content) {
                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <p className="text-sm text-blue-600 font-semibold">Scheduled</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{content.totalScheduled}</p>
                              </div>
                              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <p className="text-sm text-emerald-600 font-semibold">Completed</p>
                                <p className="text-3xl font-bold text-emerald-900 mt-1">{content.completed}</p>
                              </div>
                              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <p className="text-sm text-purple-600 font-semibold">Coverage</p>
                                <p className="text-3xl font-bold text-purple-900 mt-1">{content.percentage}</p>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Vaccine Administration</h3>
                              <div className="space-y-3">
                                {content.vaccines.map((vaccine: any) => (
                                  <div key={vaccine.type} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-semibold text-gray-900">{vaccine.type}</span>
                                      <span className="text-sm text-gray-600">{vaccine.administered}/{vaccine.target}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <div 
                                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all"
                                        style={{ width: `${(vaccine.administered / vaccine.target) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Age Group Coverage</h3>
                              <div className="grid grid-cols-3 gap-3">
                                {content.ageGroups.map((group: any) => (
                                  <div key={group.group} className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 text-center border border-emerald-200">
                                    <p className="text-sm text-emerald-600 font-semibold">{group.group}</p>
                                    <p className="text-2xl font-bold text-emerald-900 mt-2">{group.coverage}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (selectedReport === 'maternal-health' && content) {
                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                                <p className="text-sm text-pink-600 font-semibold">Active Cases</p>
                                <p className="text-3xl font-bold text-pink-900 mt-1">{content.activeCases}</p>
                              </div>
                              <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                                <p className="text-sm text-cyan-600 font-semibold">New Cases</p>
                                <p className="text-3xl font-bold text-cyan-900 mt-1">{content.newCases}</p>
                              </div>
                              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <p className="text-sm text-emerald-600 font-semibold">Completed</p>
                                <p className="text-3xl font-bold text-emerald-900 mt-1">{content.completedCheckups}</p>
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Services Provided</h3>
                              <div className="space-y-2">
                                {content.services.map((service: any) => (
                                  <div key={service.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-900">{service.service}</span>
                                    <span className="px-4 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">{service.count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-3">Risk Categories</h3>
                              <div className="grid grid-cols-3 gap-3">
                                {content.riskCategories.map((risk: any, index: number) => {
                                  const colors = ['emerald', 'amber', 'red'];
                                  const color = colors[index];
                                  return (
                                    <div key={risk.category} className={`bg-${color}-50 rounded-lg p-4 text-center border border-${color}-200`}>
                                      <p className={`text-sm text-${color}-600 font-semibold`}>{risk.category}</p>
                                      <p className={`text-2xl font-bold text-${color}-900 mt-2`}>{risk.count}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* Modal Footer */}
                  <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-sm text-gray-600">
                      Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => downloadReport(selectedReport, 'csv')}
                        className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export CSV
                      </button>
                      <button
                        onClick={() => downloadReport(selectedReport, 'pdf')}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && <AdminSettings />}
        </main>
    </div>
  );
}
