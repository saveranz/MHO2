import { useAuth } from "@/context/AuthContext";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  Clock,
  FileText,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  User,
  LayoutDashboard,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StaffTabKey = "overview" | "schedule" | "tasks" | "leave" | "profile";

type ShiftType =
  | "Morning OPD"
  | "Afternoon Clinic"
  | "24-hour Duty"
  | "Field Work"
  | "Vaccination Duty";

interface Assignment {
  id: string;
  staffId: string;
  shiftType: ShiftType;
  date: string; // YYYY-MM-DD
}

type LeaveStatus = "Pending" | "Approved" | "Rejected";
interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  adminNote?: string;
}

type TaskCategory = "Daily Duty" | "Field Assignment" | "Patient Task";
type TaskPriority = "High" | "Medium" | "Low";
type TaskStatus = "Pending" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  notes: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIFT_CONFIG: Record<ShiftType, { bg: string; text: string; border: string; dot: string }> = {
  "Morning OPD":       { bg: "bg-sky-100",     text: "text-sky-800",     border: "border-sky-200",     dot: "bg-sky-500"     },
  "Afternoon Clinic":  { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-200", dot: "bg-emerald-500" },
  "24-hour Duty":      { bg: "bg-violet-100",  text: "text-violet-800",  border: "border-violet-200",  dot: "bg-violet-500"  },
  "Field Work":        { bg: "bg-amber-100",   text: "text-amber-800",   border: "border-amber-200",   dot: "bg-amber-500"   },
  "Vaccination Duty":  { bg: "bg-rose-100",    text: "text-rose-800",    border: "border-rose-200",    dot: "bg-rose-500"    },
};

// Maps auth user email → scheduleStaffId and profile info
const STAFF_MAP: Record<string, { staffId: string; position: string; station: string; license: string; phone: string; address: string; emergencyContact: string; emergencyPhone: string; joinDate: string; leaveBalance: Record<string, number> }> = {
  "nurse.elena@mho.gov.ph": {
    staffId: "s2", position: "Public Health Nurse", station: "Main RHU",
    license: "PRC-N-123456", phone: "09171234567", address: "Poblacion, Bongabong, Oriental Mindoro",
    emergencyContact: "Roberto Cruz", emergencyPhone: "09181234567",
    joinDate: "2019-06-01",
    leaveBalance: { "Sick Leave": 14, "Vacation Leave": 11, "Emergency Leave": 5 },
  },
  "midwife.ana@mho.gov.ph": {
    staffId: "s3", position: "Midwife", station: "Barangay Hagan",
    license: "PRC-M-654321", phone: "09201234567", address: "Barangay Hagan, Bongabong",
    emergencyContact: "Pedro Lopez", emergencyPhone: "09211234567",
    joinDate: "2021-01-15",
    leaveBalance: { "Sick Leave": 15, "Vacation Leave": 15, "Emergency Leave": 5 },
  },
  "clerk.mark@mho.gov.ph": {
    staffId: "s4", position: "Admin Clerk", station: "Main RHU",
    license: "N/A", phone: "09261234567", address: "Sitio Malaya, Bongabong",
    emergencyContact: "Rowena Reyes", emergencyPhone: "09271234567",
    joinDate: "2020-03-10",
    leaveBalance: { "Sick Leave": 10, "Vacation Leave": 8, "Emergency Leave": 3 },
  },
  "dr.santos@mho.gov.ph": {
    staffId: "s1", position: "Municipal Health Officer", station: "Main RHU",
    license: "PRC-D-789012", phone: "09151234567", address: "Poblacion, Bongabong, Oriental Mindoro",
    emergencyContact: "Luis Santos", emergencyPhone: "09161234567",
    joinDate: "2015-07-01",
    leaveBalance: { "Sick Leave": 15, "Vacation Leave": 15, "Emergency Leave": 5 },
  },
  "dr.carlo@mho.gov.ph": {
    staffId: "s8", position: "Doctor", station: "Main RHU",
    license: "PRC-D-345678", phone: "09301234567", address: "Labasan, Bongabong",
    emergencyContact: "Maria Buenaventura", emergencyPhone: "09311234567",
    joinDate: "2022-08-01",
    leaveBalance: { "Sick Leave": 15, "Vacation Leave": 12, "Emergency Leave": 5 },
  },
};

// ─── Date helpers ─────────────────────────────────────────────────────────────

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getMonday(d: Date) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function uid() { return Math.random().toString(36).slice(2, 9); }

// ─── Build sample schedule data for each staff member ────────────────────────

function buildSchedule(): Assignment[] {
  const monday = getMonday(new Date());
  const result: Assignment[] = [];
  const entries: { staffId: string; shiftType: ShiftType; dayOffset: number }[] = [
    // Dr. Santos Morning OPD Mon-Fri
    ...[0,1,2,3,4].map(d => ({ staffId: "s1", shiftType: "Morning OPD" as ShiftType, dayOffset: d })),
    // Elena Afternoon Clinic Mon/Wed/Fri + Vaccination Tue
    ...[0,2,4].map(d => ({ staffId: "s2", shiftType: "Afternoon Clinic" as ShiftType, dayOffset: d })),
    { staffId: "s2", shiftType: "Vaccination Duty", dayOffset: 1 },
    // Ana Field Work Tue/Thu
    { staffId: "s3", shiftType: "Field Work", dayOffset: 1 },
    { staffId: "s3", shiftType: "Field Work", dayOffset: 3 },
    { staffId: "s3", shiftType: "Morning OPD", dayOffset: 0 },
    { staffId: "s3", shiftType: "Morning OPD", dayOffset: 2 },
    // Mark admin support Mon-Fri morning
    ...[0,1,2,3,4].map(d => ({ staffId: "s4", shiftType: "Morning OPD" as ShiftType, dayOffset: d })),
    // Dr. Carlo OPD Wed + 24hr duty Fri
    { staffId: "s8", shiftType: "Morning OPD", dayOffset: 2 },
    { staffId: "s8", shiftType: "24-hour Duty", dayOffset: 4 },
  ];
  for (const e of entries) {
    result.push({ id: uid(), staffId: e.staffId, shiftType: e.shiftType, date: toISO(addDays(monday, e.dayOffset)) });
  }
  return result;
}

const ALL_ASSIGNMENTS = buildSchedule();

// ─── Sidebar nav ──────────────────────────────────────────────────────────────

const TABS: { id: StaffTabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview",  label: "Overview",     icon: LayoutDashboard },
  { id: "schedule",  label: "My Schedule",  icon: CalendarDays    },
  { id: "tasks",     label: "My Tasks",     icon: ClipboardList   },
  { id: "leave",     label: "My Leave",     icon: CalendarDays    },
  { id: "profile",   label: "My Profile",   icon: User            },
];

// ─── Overview tab ─────────────────────────────────────────────────────────────

function OverviewTab({ staffId, leaveBalance }: { staffId: string; leaveBalance: Record<string, number> }) {
  const todayISO = toISO(new Date());
  const todayAssignments = ALL_ASSIGNMENTS.filter((a) => a.staffId === staffId && a.date === todayISO);

  const monday = getMonday(new Date());
  const weekDates = Array.from({ length: 7 }, (_, i) => toISO(addDays(monday, i)));
  const weekAssignments = ALL_ASSIGNMENTS.filter((a) => a.staffId === staffId && weekDates.includes(a.date));

  return (
    <div className="space-y-5">
      {/* Today's duties */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-800">Today's Duties</h3>
        {todayAssignments.length === 0 ? (
          <p className="text-sm italic text-slate-400">No duties assigned for today.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {todayAssignments.map((a) => {
              const cfg = SHIFT_CONFIG[a.shiftType];
              return (
                <span key={a.id} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold border", cfg.bg, cfg.text, cfg.border)}>
                  <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
                  {a.shiftType}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* This week */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-800">This Week's Assignments</h3>
        {weekAssignments.length === 0 ? (
          <p className="text-sm italic text-slate-400">No assignments scheduled this week.</p>
        ) : (
          <div className="space-y-2">
            {weekAssignments.map((a) => {
              const cfg = SHIFT_CONFIG[a.shiftType];
              const day = new Date(a.date + "T00:00:00").toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5">
                  <span className="w-28 shrink-0 text-sm font-semibold text-slate-500">{day}</span>
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border", cfg.bg, cfg.text, cfg.border)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                    {a.shiftType}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Leave balances */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-800">Leave Balances</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(leaveBalance).map(([type, days]) => (
            <div key={type} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
              <p className="text-2xl font-bold text-health-700">{days}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">{type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Schedule tab ─────────────────────────────────────────────────────────────

function ScheduleTab({ staffId }: { staffId: string }) {
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const todayISO = toISO(new Date());

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i);
      return { date: d, iso: toISO(d) };
    }), [weekStart]);

  const myAssignments = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    for (const a of ALL_ASSIGNMENTS) {
      if (a.staffId !== staffId) continue;
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    }
    return map;
  }, [staffId]);

  const weekLabel = useMemo(() => {
    const s = weekDates[0].date;
    const e = weekDates[6].date;
    const fmt = (d: Date) => d.toLocaleDateString("en-PH", { month: "long", day: "numeric" });
    return `${fmt(s)} – ${fmt(e)}, ${s.getFullYear()}`;
  }, [weekDates]);

  return (
    <div className="space-y-4">
      {/* Week navigation */}
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setWeekStart(d => addDays(d, -7))} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="flex-1 text-center text-sm font-semibold text-slate-700">{weekLabel}</span>
        <button type="button" onClick={() => setWeekStart(d => addDays(d, 7))} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setWeekStart(getMonday(new Date()))} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50">
          Today
        </button>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid min-w-[560px]" style={{ gridTemplateColumns: "repeat(7, 1fr)" }}>
          {weekDates.map(({ date, iso }) => {
            const isToday = iso === todayISO;
            const dayName = date.toLocaleDateString("en-PH", { weekday: "short" });
            const dayNum = date.getDate();
            const assignments = myAssignments[iso] ?? [];
            return (
              <div key={iso} className={cn("min-h-[120px] border-r border-slate-100 p-3 last:border-r-0", isToday && "bg-health-50/60")}>
                <div className={cn("mb-2 flex flex-col items-center")}>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{dayName}</span>
                  <span className={cn("mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold", isToday ? "bg-health-600 text-white" : "text-slate-700")}>
                    {dayNum}
                  </span>
                </div>
                <div className="space-y-1">
                  {assignments.length === 0 ? (
                    <p className="text-center text-[11px] italic text-slate-300">—</p>
                  ) : (
                    assignments.map((a) => {
                      const cfg = SHIFT_CONFIG[a.shiftType];
                      return (
                        <div key={a.id} className={cn("rounded-lg px-2 py-1 text-[11px] font-semibold leading-tight", cfg.bg, cfg.text)}>
                          {a.shiftType}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.entries(SHIFT_CONFIG) as [ShiftType, typeof SHIFT_CONFIG[ShiftType]][]).map(([type, cfg]) => (
          <span key={type} className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border", cfg.bg, cfg.text, cfg.border)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Tasks tab ────────────────────────────────────────────────────────────────

const PRIORITY_STYLE: Record<TaskPriority, { badge: string; dot: string }> = {
  High:   { badge: "bg-red-100 text-red-700",    dot: "bg-red-500"    },
  Medium: { badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500"  },
  Low:    { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400"  },
};

const STATUS_TASK_STYLE: Record<TaskStatus, string> = {
  Pending:     "bg-slate-100 text-slate-600",
  "In Progress": "bg-blue-100 text-blue-700",
  Done:        "bg-emerald-100 text-emerald-700",
};

const CATEGORY_ICON: Record<TaskCategory, typeof ClipboardList> = {
  "Daily Duty":       ClipboardList,
  "Field Assignment": MapPin,
  "Patient Task":     FileText,
};

const INIT_TASKS: Task[] = [
  {
    id: "t1",
    title: "Handle OPD consultations",
    description: "Morning out-patient department coverage. Attend to walk-in patients and document consultations.",
    category: "Daily Duty",
    priority: "High",
    status: "In Progress",
    dueDate: toISO(new Date()),
    notes: "",
  },
  {
    id: "t2",
    title: "Submit daily census report",
    description: "Fill out the FHSIS daily census form and submit to the admin office before 5:00 PM.",
    category: "Daily Duty",
    priority: "High",
    status: "Pending",
    dueDate: toISO(new Date()),
    notes: "",
  },
  {
    id: "t3",
    title: "Immunization drive – Brgy. Hagan",
    description: "Conduct vaccination for children 0–5 years old. Bring vaccine cooler, syringes, and record forms.",
    category: "Field Assignment",
    priority: "High",
    status: "Pending",
    dueDate: toISO(addDays(new Date(), 2)),
    notes: "",
  },
  {
    id: "t4",
    title: "Issue medical certificate – Juan Dela Cruz",
    description: "Patient Juan Dela Cruz (OR#2241) is requesting a medical certificate for employment purposes.",
    category: "Patient Task",
    priority: "Medium",
    status: "Pending",
    dueDate: toISO(addDays(new Date(), 1)),
    notes: "",
  },
  {
    id: "t5",
    title: "Maternal checkup follow-ups",
    description: "Call and follow up on 3 pending maternal care cases: Mrs. Garcia, Mrs. Reyes, Mrs. Villanueva.",
    category: "Patient Task",
    priority: "Medium",
    status: "Done",
    dueDate: toISO(addDays(new Date(), -1)),
    notes: "All three patients confirmed. Garcia rescheduled to Thursday.",
  },
  {
    id: "t6",
    title: "Sanitary inspection – Brgy. Aplaya",
    description: "Conduct environmental sanitation inspection. Check water sources and waste disposal areas.",
    category: "Field Assignment",
    priority: "Low",
    status: "Pending",
    dueDate: toISO(addDays(new Date(), 4)),
    notes: "",
  },
];

type TaskFilter = "All" | TaskStatus;

function TasksTab() {
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [filter, setFilter] = useState<TaskFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<Record<string, string>>({});

  const filtered = tasks.filter((t) => filter === "All" || t.status === filter);

  const counts: Record<TaskFilter, number> = {
    All:          tasks.length,
    Pending:      tasks.filter((t) => t.status === "Pending").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    Done:         tasks.filter((t) => t.status === "Done").length,
  };

  function setStatus(id: string, status: TaskStatus) {
    const note = notesInput[id] ?? "";
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, notes: note || t.notes } : t))
    );
    setExpandedId(null);
  }

  const FILTER_TABS: TaskFilter[] = ["All", "Pending", "In Progress", "Done"];

  return (
    <div className="space-y-5">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors",
              filter === f
                ? "bg-health-600 text-white shadow"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-health-50 hover:text-health-700"
            )}
          >
            {f}
            <span className={cn("ml-1.5 rounded-full px-1.5 py-0.5 text-xs", filter === f ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500")}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-8 text-center text-sm italic text-slate-400">
            No tasks in this category.
          </div>
        )}
        {filtered.map((t) => {
          const CatIcon = CATEGORY_ICON[t.category];
          const prStyle = PRIORITY_STYLE[t.priority];
          const stStyle = STATUS_TASK_STYLE[t.status];
          const isDone = t.status === "Done";
          const isExpanded = expandedId === t.id;
          const isOverdue = !isDone && t.dueDate < toISO(new Date());

          return (
            <div
              key={t.id}
              className={cn(
                "rounded-2xl border bg-white shadow-sm transition-all",
                isDone ? "border-slate-100 opacity-70" : isOverdue ? "border-red-200" : "border-slate-200"
              )}
            >
              {/* Main row */}
              <div className="flex items-start gap-4 p-4">
                {/* Category icon */}
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <CatIcon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className={cn("font-semibold text-slate-900", isDone && "line-through text-slate-400")}>
                      {t.title}
                    </p>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", prStyle.badge)}>
                      {t.priority}
                    </span>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", stStyle)}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2">{t.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className={cn("flex items-center gap-1 text-xs font-semibold", isOverdue ? "text-red-600" : "text-slate-400")}>
                      <Clock className="h-3 w-3" />
                      {isOverdue ? "Overdue · " : "Due: "}
                      {new Date(t.dueDate + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <CatIcon className="h-3 w-3" />
                      {t.category}
                    </span>
                    {t.notes && (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <MessageSquare className="h-3 w-3" />
                        Has notes
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand toggle */}
                {!isDone && (
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : t.id)}
                    className="ml-2 shrink-0 rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50"
                  >
                    <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                  </button>
                )}
              </div>

              {/* Expanded: notes + actions */}
              {isExpanded && !isDone && (
                <div className="border-t border-slate-100 p-4 pt-3 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Add a note (optional)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
                      placeholder="e.g. Completed 3 out of 4 sessions..."
                      value={notesInput[t.id] ?? t.notes}
                      onChange={(e) => setNotesInput((prev) => ({ ...prev, [t.id]: e.target.value }))}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {t.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => setStatus(t.id, "In Progress")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <Clock className="h-4 w-4" /> Mark In Progress
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setStatus(t.id, "Done")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check className="h-4 w-4" /> Mark as Done
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(null)}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Show saved notes on done tasks */}
              {isDone && t.notes && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-1">Notes</p>
                  <p className="text-sm text-slate-500 italic">{t.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Leave tab ────────────────────────────────────────────────────────────────

const LEAVE_TYPES = ["Sick Leave", "Vacation Leave", "Emergency Leave", "Maternity Leave", "Paternity Leave", "Study Leave"];

const STATUS_STYLE: Record<LeaveStatus, { badge: string; icon: typeof Check }> = {
  Pending:  { badge: "bg-amber-100 text-amber-700",   icon: Clock      },
  Approved: { badge: "bg-emerald-100 text-emerald-700", icon: Check    },
  Rejected: { badge: "bg-red-100 text-red-700",        icon: X         },
};

function countDays(start: string, end: string) {
  const ms = new Date(end + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime();
  return Math.round(ms / 86400000) + 1;
}

function balanceColor(days: number) {
  if (days <= 3)  return "border-red-200 bg-red-50 text-red-700";
  if (days <= 7)  return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-slate-200 bg-slate-50 text-health-700";
}

const INIT_LEAVES: LeaveRequest[] = [
  { id: "l1", type: "Vacation Leave", startDate: "2026-03-10", endDate: "2026-03-12", reason: "Family event out of town.", status: "Approved", adminNote: "Enjoy your leave!" },
  { id: "l2", type: "Sick Leave",     startDate: "2026-02-14", endDate: "2026-02-14", reason: "Fever and rest.",          status: "Approved" },
  { id: "l3", type: "Emergency Leave", startDate: "2026-01-20", endDate: "2026-01-21", reason: "Family emergency.",      status: "Rejected", adminNote: "Insufficient coverage that week. Please refile." },
];

function LeaveTab({ leaveBalance }: { leaveBalance: Record<string, number> }) {
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INIT_LEAVES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: LEAVE_TYPES[0], startDate: "", endDate: "", reason: "" });
  const [formError, setFormError] = useState("");

  function submitRequest() {
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }
    if (form.endDate < form.startDate) {
      setFormError("End date cannot be before start date.");
      return;
    }
    setLeaves((prev) => [
      {
        id: uid(),
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason.trim(),
        status: "Pending",
      },
      ...prev,
    ]);
    setShowForm(false);
    setForm({ type: LEAVE_TYPES[0], startDate: "", endDate: "", reason: "" });
    setFormError("");
  }

  const pendingCount = leaves.filter((l) => l.status === "Pending").length;

  return (
    <div className="space-y-5">
      {/* Leave balances */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-bold text-slate-700">Remaining Leave Balance</h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(leaveBalance).map(([type, days]) => (
            <div key={type} className={cn("rounded-xl border px-4 py-3 text-center min-w-[90px]", balanceColor(days))}>
              <p className="text-2xl font-bold">{days}</p>
              <p className="mt-0.5 text-xs font-semibold opacity-80">{type}</p>
              <p className="text-[10px] opacity-60">days left</p>
            </div>
          ))}
        </div>
        {Object.values(leaveBalance).some((d) => d <= 3) && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            One or more leave types are running low.
          </div>
        )}
      </div>

      {/* File request button / form */}
      {showForm ? (
        <div className="rounded-2xl border border-health-200 bg-health-50 p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">File a Leave Request</h3>
            <button type="button" onClick={() => { setShowForm(false); setFormError(""); }} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Leave Type</label>
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Start Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">End Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
                  value={form.endDate}
                  onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                />
              </div>
            </div>
            {form.startDate && form.endDate && form.endDate >= form.startDate && (
              <p className="text-xs font-semibold text-health-700">
                Duration: {countDays(form.startDate, form.endDate)} day{countDays(form.startDate, form.endDate) !== 1 ? "s" : ""}
              </p>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Reason</label>
              <textarea
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
                placeholder="Brief reason for leave..."
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}
            <div className="flex gap-3">
              <button type="button" onClick={submitRequest} className="rounded-xl bg-health-600 px-5 py-2 text-sm font-semibold text-white hover:bg-health-700">
                Submit Request
              </button>
              <button type="button" onClick={() => { setShowForm(false); setFormError(""); }} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-health-300 px-4 py-2.5 text-sm font-semibold text-health-700 hover:bg-health-50"
        >
          <Plus className="h-4 w-4" /> File a Leave Request
        </button>
      )}

      {/* Leave history */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3 flex items-center justify-between">
          <p className="text-sm font-bold text-slate-700">Leave History</p>
          {pendingCount > 0 && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              {pendingCount} pending
            </span>
          )}
        </div>
        {leaves.length === 0 ? (
          <p className="px-5 py-4 text-sm italic text-slate-400">No leave requests yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {leaves.map((l) => {
              const st = STATUS_STYLE[l.status];
              const StatusIcon = st.icon;
              const days = countDays(l.startDate, l.endDate);
              return (
                <div key={l.id} className="px-5 py-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-800">{l.type}</p>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs font-semibold text-slate-500">{days} day{days !== 1 ? "s" : ""}</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {new Date(l.startDate + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                        {" – "}
                        {new Date(l.endDate + "T00:00:00").toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      <p className="mt-0.5 text-sm italic text-slate-400">{l.reason}</p>
                      {l.adminNote && (
                        <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                          <MessageSquare className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
                          <span><strong>Admin:</strong> {l.adminNote}</span>
                        </div>
                      )}
                    </div>
                    <span className={cn("inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-xs font-semibold sm:mt-1", st.badge)}>
                      <StatusIcon className="h-3 w-3" />
                      {l.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Profile tab ──────────────────────────────────────────────────────────────

function ProfileTab({
  userName,
  email,
  profile,
}: {
  userName: string;
  email: string;
  profile: (typeof STAFF_MAP)[string];
}) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyContact);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyPhone);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-44 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Avatar */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-health-100 text-2xl font-bold text-health-700">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-bold text-slate-900">{userName}</p>
            <p className="text-sm text-slate-500">{profile.position} · {profile.station}</p>
          </div>
        </div>

        {/* Static info */}
        <div className="divide-y divide-slate-100">
          <Row label="Email" value={email} />
          <Row label="Position" value={profile.position} />
          <Row label="Station" value={profile.station} />
          <Row label="License No." value={profile.license} />
          <Row label="Date Joined" value={new Date(profile.joinDate + "T00:00:00").toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })} />
        </div>
      </div>

      {/* Editable info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Contact & Emergency Details</h3>
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            {[
              { label: "Phone Number", value: phone, set: setPhone },
              { label: "Home Address", value: address, set: setAddress },
              { label: "Emergency Contact Name", value: emergencyContact, set: setEmergencyContact },
              { label: "Emergency Contact Phone", value: emergencyPhone, set: setEmergencyPhone },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
                <input
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                />
              </div>
            ))}
            <div className="flex gap-3">
              <button type="button" onClick={handleSave} className="rounded-xl bg-health-600 px-5 py-2 text-sm font-semibold text-white hover:bg-health-700">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {[
              { label: "Phone Number", value: phone },
              { label: "Home Address", value: address },
              { label: "Emergency Contact", value: emergencyContact },
              { label: "Emergency Phone", value: emergencyPhone },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-0.5 py-3 sm:flex-row sm:items-center sm:gap-4">
                <span className="w-44 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
                <span className="text-sm font-medium text-slate-800">{value}</span>
              </div>
            ))}
          </div>
        )}

        {saved && (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <Check className="h-4 w-4" /> Changes saved!
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function StaffDashboard() {
  const { user, isLoggedIn, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StaffTabKey>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!isLoggedIn) navigate("/login");
    else if (user?.role === "super_admin" || user?.role === "admin") navigate("/admin");
  }, [isLoggedIn, user, navigate, loading]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading || !isLoggedIn || !user) return null;

  const profile = STAFF_MAP[user.email] ?? {
    staffId: "s4",
    position: "Staff Member",
    station: "Main RHU",
    license: "N/A",
    phone: "N/A",
    address: "N/A",
    emergencyContact: "N/A",
    emergencyPhone: "N/A",
    joinDate: "2024-01-01",
    leaveBalance: { "Sick Leave": 15, "Vacation Leave": 15, "Emergency Leave": 5 },
  };

  const tabMeta = TABS.find((t) => t.id === activeTab);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Mobile top bar ── */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-health-600">MHO · Bongabong</p>
          <p className="text-sm font-bold text-slate-800">Staff Portal</p>
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
        {/* Branding */}
        <div className="border-b border-slate-100 bg-gradient-to-br from-health-700 to-emerald-600 px-5 py-5 text-white">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-health-100">
                MHO · Bongabong
              </p>
              <h2 className="mt-1 text-lg font-bold leading-snug">Staff Portal</h2>
              <p className="mt-1 truncate text-xs text-white/75">{profile.position}</p>
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
            {new Date().toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                  isActive ? "bg-health-600 text-white shadow" : "text-slate-600 hover:bg-health-50 hover:text-health-700"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer: user + logout */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-health-100 text-sm font-bold text-health-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
              <p className="truncate text-xs capitalize text-slate-400">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
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
          <h2 className="text-2xl font-bold text-slate-900">{tabMeta?.label}</h2>
        </section>

        {activeTab === "overview"  && <OverviewTab staffId={profile.staffId} leaveBalance={profile.leaveBalance} />}
        {activeTab === "schedule"  && <ScheduleTab staffId={profile.staffId} />}
        {activeTab === "tasks"     && <TasksTab />}
        {activeTab === "leave"     && <LeaveTab leaveBalance={profile.leaveBalance} />}
        {activeTab === "profile"   && <ProfileTab userName={user.name} email={user.email} profile={profile} />}
      </main>
    </div>
  );
}
