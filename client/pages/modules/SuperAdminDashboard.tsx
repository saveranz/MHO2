import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffDirectory from "./StaffDirectory";
import DutySchedule from "./DutySchedule";
import AdminSettings from "./Settings";
import {
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
  Users,
  X,
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
  { label: "On-duty staff", value: "12", note: "2 doctors · 6 nurses · 4 support" },
  { label: "Pending requests", value: "18", note: "For triage and office action" },
  { label: "Approvals waiting", value: "4", note: "Leave and supply requests" },
  { label: "Reports ready", value: "3", note: "Weekly, monthly, and program summary" },
];

const onDutyStaff = [
  { name: "Dr. Maria Santos", role: "Municipal Health Officer", shift: "8:00 AM – 5:00 PM" },
  { name: "Nurse Elena Cruz", role: "Immunization Nurse", shift: "8:00 AM – 4:00 PM" },
  { name: "Mark Reyes", role: "Records Staff", shift: "9:00 AM – 5:00 PM" },
  { name: "Ana Lopez", role: "Maternal Care Midwife", shift: "8:00 AM – 3:00 PM" },
];

const taskRequests = [
  { title: "Review medicine inventory update", owner: "Admin Office", priority: "High", status: "In progress" },
  { title: "Verify barangay outreach schedule", owner: "Community Program Team", priority: "Medium", status: "Pending" },
  { title: "Respond to resident referral letters", owner: "Records Staff", priority: "High", status: "Queued" },
  { title: "Prepare vaccination campaign materials", owner: "Immunization Unit", priority: "Low", status: "Planned" },
];

const approvalItems = [
  { request: "2-day leave request", requester: "Liza Fernandez", type: "Leave", due: "Today" },
  { request: "Medical supply restock", requester: "Immunization Unit", type: "Supplies", due: "Tomorrow" },
  { request: "Community seminar travel clearance", requester: "Outreach Team", type: "Travel", due: "This week" },
];

const reportCards = [
  { title: "Weekly consultation summary", summary: "128 resident visits recorded this week." },
  { title: "Immunization progress report", summary: "84% of scheduled vaccine recipients were covered." },
  { title: "Maternal health monitoring", summary: "19 active follow-up cases tracked for this month." },
];

export default function SuperAdminDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || (user?.role !== "super_admin" && user?.role !== "admin")) {
      navigate("/login");
    }
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  const activeTabMeta = adminTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex min-h-screen bg-slate-50">
        {/* ── Mobile top bar ── */}
        <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-health-600">MHO · Bongabong</p>
            <p className="text-sm font-bold text-slate-800">Admin Dashboard</p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
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
        <aside className={`fixed top-0 left-0 z-50 h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white shadow-sm transition-transform duration-300 md:sticky md:translate-x-0 md:flex ${
          sidebarOpen ? "flex translate-x-0" : "-translate-x-full md:flex"
        }`}>
          {/* Branding block */}
          <div className="border-b border-slate-100 bg-gradient-to-br from-health-700 to-emerald-600 px-5 py-5 text-white">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-health-100">
                  MHO · Bongabong
                </p>
                <h2 className="mt-1 text-lg font-bold leading-snug">Admin Dashboard</h2>
                <p className="mt-2 truncate text-xs text-white/75">{user?.name}</p>
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
          <div className="border-b border-slate-100 px-5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Today</p>
            <p className="mt-0.5 text-sm font-semibold text-slate-700">
              {new Date().toLocaleDateString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 p-3">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                    isActive
                      ? "bg-health-600 text-white shadow"
                      : "text-slate-600 hover:bg-health-50 hover:text-health-700"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* ── Sidebar footer: user + logout ── */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-health-100 text-sm font-bold text-health-700">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="truncate text-xs capitalize text-slate-400">{user?.role?.replace("_", " ")}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pt-20 md:pt-6 md:px-8 md:py-8">
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">{activeTabMeta?.label}</h2>
            <p className="mt-1 text-slate-500">{activeTabMeta?.helper}</p>
          </section>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.note}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Today's on-duty staff</h3>
                  <Users className="h-5 w-5 text-health-600" />
                </div>
                <div className="space-y-3">
                  {onDutyStaff.map((member) => (
                    <div key={member.name} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="text-sm text-slate-600">{member.role}</p>
                      </div>
                      <span className="rounded-full bg-health-100 px-3 py-1 text-xs font-semibold text-health-700">
                        {member.shift}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-health-600" />
                    <h3 className="text-xl font-bold text-slate-900">Pending requests</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="rounded-2xl bg-slate-50 p-3">6 resident follow-up requests need triage review.</li>
                    <li className="rounded-2xl bg-slate-50 p-3">4 supply replenishment requests are awaiting confirmation.</li>
                    <li className="rounded-2xl bg-slate-50 p-3">8 records and referral requests remain open.</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">Quick actions</h3>
                  <div className="grid gap-3">
                    {[
                      "Review roster changes",
                      "Approve urgent requests",
                      "Open weekly reports",
                    ].map((action) => (
                      <button
                        key={action}
                        type="button"
                        className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-health-300 hover:bg-health-50"
                      >
                        {action}
                        <ArrowUpRight className="h-4 w-4 text-health-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "staff" && <StaffDirectory />}

        {activeTab === "schedule" && <DutySchedule />}

        {activeTab === "tasks" && (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Assigned tasks</h3>
              <div className="space-y-3">
                {taskRequests.map((task) => (
                  <div key={task.title} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-sm text-slate-600">Owner: {task.owner}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                          {task.priority}
                        </span>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-slate-900">Incoming patient requests</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <div className="rounded-2xl bg-slate-50 p-4">5 requests for medical certificate release</div>
                <div className="rounded-2xl bg-slate-50 p-4">3 follow-up requests for maternal checkup records</div>
                <div className="rounded-2xl bg-slate-50 p-4">6 medicine availability enquiries from residents</div>
                <div className="rounded-2xl bg-slate-50 p-4">4 referrals awaiting admin routing</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-health-600" />
              <h3 className="text-xl font-bold text-slate-900">Pending approvals</h3>
            </div>

            <div className="space-y-4">
              {approvalItems.map((item) => (
                <div key={item.request} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{item.request}</p>
                    <p className="text-sm text-slate-600">
                      {item.requester} · {item.type} · Due {item.due}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                      Review
                    </button>
                    <button type="button" className="rounded-xl bg-health-600 px-4 py-2 font-semibold text-white hover:bg-health-700">
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="grid gap-4">
              {reportCards.map((report) => (
                <div key={report.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-900">{report.title}</h3>
                  <p className="mt-2 text-slate-600">{report.summary}</p>
                  <button type="button" className="mt-4 inline-flex items-center gap-2 font-semibold text-health-700 hover:text-health-800">
                    Open report <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Download className="h-5 w-5 text-health-600" />
                <h3 className="text-xl font-bold text-slate-900">Exports</h3>
              </div>
              <div className="space-y-3">
                {[
                  "Monthly office summary (PDF)",
                  "Consultation log export (CSV)",
                  "Immunization progress summary (PDF)",
                  "Staff attendance report (CSV)",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:border-health-300 hover:bg-health-50"
                  >
                    {item}
                    <Download className="h-4 w-4 text-health-600" />
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-health-50 p-4 text-sm text-slate-700">
                Reports and exports are arranged for simple review and quick administrative sharing.
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && <AdminSettings />}
        </main>
    </div>
  );
}
