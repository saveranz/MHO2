import { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CalendarDays,
  LayoutGrid,
  AlertTriangle,
  Zap,
  Bell,
  Check,
  Trash2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShiftType =
  | "Morning OPD"
  | "Afternoon Clinic"
  | "24-hour Duty"
  | "Field Work"
  | "Vaccination Duty";

interface Assignment {
  id: string;
  staffId: string;
  staffName: string;
  initials: string;
  shiftType: ShiftType;
  date: string; // YYYY-MM-DD
}

type ViewMode = "week" | "month";

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIFT_CONFIG: Record<
  ShiftType,
  { color: string; bg: string; border: string; dot: string; label: string }
> = {
  "Morning OPD":      { color: "text-health-700",   bg: "bg-health-100",   border: "border-health-300",   dot: "bg-health-500",   label: "Morning OPD" },
  "Afternoon Clinic": { color: "text-blue-700",      bg: "bg-blue-100",     border: "border-blue-300",     dot: "bg-blue-500",     label: "Afternoon Clinic" },
  "24-hour Duty":     { color: "text-red-700",       bg: "bg-red-100",      border: "border-red-300",      dot: "bg-red-500",      label: "24-hour Duty" },
  "Field Work":       { color: "text-emerald-700",   bg: "bg-emerald-100",  border: "border-emerald-300",  dot: "bg-emerald-500",  label: "Field Work" },
  "Vaccination Duty": { color: "text-violet-700",    bg: "bg-violet-100",   border: "border-violet-300",   dot: "bg-violet-500",   label: "Vaccination Duty" },
};

const SHIFT_TYPES: ShiftType[] = [
  "Morning OPD",
  "Afternoon Clinic",
  "24-hour Duty",
  "Field Work",
  "Vaccination Duty",
];

const STAFF = [
  { id: "s1", name: "Dr. Maria Santos",       initials: "MS", position: "Municipal Health Officer" },
  { id: "s2", name: "Elena Cruz",             initials: "EC", position: "Public Health Nurse" },
  { id: "s3", name: "Ana Lopez",              initials: "AL", position: "Midwife" },
  { id: "s4", name: "Mark Reyes",             initials: "MR", position: "Admin Clerk" },
  { id: "s5", name: "Liza Fernandez",         initials: "LF", position: "Public Health Nurse" },
  { id: "s6", name: "Ramon Dela Cruz",        initials: "RD", position: "Sanitary Inspector" },
  { id: "s7", name: "Gloria Macaraeg",        initials: "GM", position: "Barangay Health Worker" },
  { id: "s8", name: "Dr. Carlo Buenaventura", initials: "CB", position: "Doctor" },
];

type TemplateEntry = { staffId: string; shiftType: ShiftType; dayOffset: number };

const TEMPLATES: { id: string; label: string; description: string; entries: TemplateEntry[] }[] = [
  {
    id: "standard",
    label: "Standard Week",
    description: "Morning OPD + Afternoon Clinic coverage Mon–Fri",
    entries: [
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s1", shiftType: "Morning OPD" as ShiftType, dayOffset: d })),
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s2", shiftType: "Afternoon Clinic" as ShiftType, dayOffset: d })),
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s5", shiftType: "Afternoon Clinic" as ShiftType, dayOffset: d })),
    ],
  },
  {
    id: "vaccination",
    label: "Vaccination Week",
    description: "Standard week + Vaccination Duty on Tue & Thu",
    entries: [
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s1", shiftType: "Morning OPD" as ShiftType, dayOffset: d })),
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s2", shiftType: "Afternoon Clinic" as ShiftType, dayOffset: d })),
      { staffId: "s2", shiftType: "Vaccination Duty" as ShiftType, dayOffset: 1 },
      { staffId: "s5", shiftType: "Vaccination Duty" as ShiftType, dayOffset: 1 },
      { staffId: "s2", shiftType: "Vaccination Duty" as ShiftType, dayOffset: 3 },
      { staffId: "s5", shiftType: "Vaccination Duty" as ShiftType, dayOffset: 3 },
    ],
  },
  {
    id: "outreach",
    label: "Field Outreach Week",
    description: "Standard week + Friday barangay field work",
    entries: [
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s1", shiftType: "Morning OPD" as ShiftType, dayOffset: d })),
      ...[0, 1, 2, 3, 4].map((d) => ({ staffId: "s2", shiftType: "Afternoon Clinic" as ShiftType, dayOffset: d })),
      { staffId: "s6", shiftType: "Field Work" as ShiftType, dayOffset: 4 },
      { staffId: "s7", shiftType: "Field Work" as ShiftType, dayOffset: 4 },
      { staffId: "s3", shiftType: "Field Work" as ShiftType, dayOffset: 4 },
    ],
  },
  {
    id: "24hr",
    label: "24-Hour Duty Coverage",
    description: "Skeleton: 24-hour duty assigned Mon, Wed, Fri",
    entries: [
      { staffId: "s8", shiftType: "24-hour Duty" as ShiftType, dayOffset: 0 },
      { staffId: "s1", shiftType: "24-hour Duty" as ShiftType, dayOffset: 2 },
      { staffId: "s8", shiftType: "24-hour Duty" as ShiftType, dayOffset: 4 },
    ],
  },
];

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Returns the Monday of the week containing d. */
function getMonday(d: Date): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function addMonths(d: Date, n: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function buildInitialAssignments(): Assignment[] {
  const monday = getMonday(new Date());
  const result: Assignment[] = [];

  // Mon–Fri: Dr. Santos Morning OPD
  [0, 1, 2, 3, 4].forEach((d) => {
    result.push({
      id: uid(), staffId: "s1", staffName: "Dr. Maria Santos", initials: "MS",
      shiftType: "Morning OPD", date: toISO(addDays(monday, d)),
    });
  });
  // Mon, Wed, Fri: Elena Cruz Afternoon Clinic
  [0, 2, 4].forEach((d) => {
    result.push({
      id: uid(), staffId: "s2", staffName: "Elena Cruz", initials: "EC",
      shiftType: "Afternoon Clinic", date: toISO(addDays(monday, d)),
    });
  });
  // Tue, Thu: Ana Lopez Field Work
  [1, 3].forEach((d) => {
    result.push({
      id: uid(), staffId: "s3", staffName: "Ana Lopez", initials: "AL",
      shiftType: "Field Work", date: toISO(addDays(monday, d)),
    });
  });
  // Wednesday: Vaccination Duty
  result.push({
    id: uid(), staffId: "s2", staffName: "Elena Cruz", initials: "EC",
    shiftType: "Vaccination Duty", date: toISO(addDays(monday, 2)),
  });
  result.push({
    id: uid(), staffId: "s5", staffName: "Liza Fernandez", initials: "LF",
    shiftType: "Vaccination Duty", date: toISO(addDays(monday, 2)),
  });

  return result;
}

// ─── Assign modal ─────────────────────────────────────────────────────────────

function AssignModal({
  date,
  onAssign,
  onClose,
  existingForDay,
}: {
  date: string;
  onAssign: (a: Omit<Assignment, "id">) => void;
  onClose: () => void;
  existingForDay: Assignment[];
}) {
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedShift, setSelectedShift] = useState<ShiftType>("Morning OPD");
  const [error, setError] = useState("");

  const labelDate = new Date(date + "T00:00:00").toLocaleDateString("en-PH", {
    weekday: "long", month: "long", day: "numeric",
  });

  const alreadyAssigned =
    selectedStaff
      ? existingForDay.some((a) => a.staffId === selectedStaff && a.shiftType === selectedShift)
      : false;

  function handleSubmit() {
    if (!selectedStaff) { setError("Please select a staff member."); return; }
    const staff = STAFF.find((s) => s.id === selectedStaff)!;
    onAssign({
      staffId: staff.id,
      staffName: staff.name,
      initials: staff.initials,
      shiftType: selectedShift,
      date,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">Assign Duty</h2>
            <p className="text-sm text-slate-500">{labelDate}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Shift type */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Shift Type
            </label>
            <div className="flex flex-col gap-1.5">
              {SHIFT_TYPES.map((shift) => {
                const cfg = SHIFT_CONFIG[shift];
                return (
                  <button
                    key={shift}
                    type="button"
                    onClick={() => setSelectedShift(shift)}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      selectedShift === shift
                        ? `${cfg.bg} ${cfg.border} ${cfg.color} border`
                        : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                    {shift}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Staff member */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => { setSelectedStaff(e.target.value); setError(""); }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
            >
              <option value="">Select a staff member…</option>
              {STAFF.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — {s.position}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            {alreadyAssigned && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                This staff member already has this shift today.
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-health-600 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Publish modal ────────────────────────────────────────────────────────────

function PublishModal({
  weekLabel,
  assignments,
  onPublish,
  onClose,
}: {
  weekLabel: string;
  assignments: Assignment[];
  onPublish: () => void;
  onClose: () => void;
}) {
  const byStaff = STAFF.map((s) => ({
    ...s,
    duties: assignments.filter((a) => a.staffId === s.id),
  })).filter((s) => s.duties.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-16">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Publish Schedule</h2>
            <p className="text-sm text-slate-500">Week of {weekLabel}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 p-6">
          <p className="text-sm text-slate-600">
            Publishing will notify all assigned staff of their duties for the week. Review the
            assignment summary below before confirming.
          </p>

          {byStaff.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">
              No assignments this week. Add duties before publishing.
            </p>
          ) : (
            byStaff.map((s) => (
              <div key={s.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                <p className="font-semibold text-slate-900">{s.name}</p>
                <p className="text-xs text-slate-500">{s.duties.length} duty assignment{s.duties.length !== 1 ? "s" : ""}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {s.duties.map((d) => {
                    const cfg = SHIFT_CONFIG[d.shiftType];
                    return (
                      <span
                        key={d.id}
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.color}`}
                      >
                        {new Date(d.date + "T00:00:00").toLocaleDateString("en-PH", {
                          weekday: "short", month: "short", day: "numeric",
                        })} · {d.shiftType}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={byStaff.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-health-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-health-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Bell className="h-4 w-4" />
            Publish & Notify Staff
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DutySchedule() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = toISO(today);

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()));
  const [monthStart, setMonthStart] = useState<Date>(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [assignments, setAssignments] = useState<Assignment[]>(buildInitialAssignments);
  const [assigningDate, setAssigningDate] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [published, setPublished] = useState(false);

  // ── Derived: week dates ──
  const weekDates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = addDays(weekStart, i);
        return { date: d, iso: toISO(d) };
      }),
    [weekStart]
  );

  // ── Derived: assignments by date ──
  const byDate = useMemo(() => {
    const map: Record<string, Assignment[]> = {};
    assignments.forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push(a);
    });
    return map;
  }, [assignments]);

  // ── Derived: warnings for current week ──
  const warnings = useMemo(() => {
    const w: string[] = [];
    weekDates.forEach(({ date, iso }) => {
      const dayName = date.toLocaleDateString("en-PH", { weekday: "long" });
      const dayAssignments = byDate[iso] ?? [];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      // Understaffing on weekdays
      if (!isWeekend && dayAssignments.length < 2) {
        w.push(
          `${dayName}: understaffed — ${dayAssignments.length} assigned (minimum 2 recommended)`
        );
      }

      // Duplicate shift: same staff + same shift type on same day
      const seen = new Set<string>();
      dayAssignments.forEach((a) => {
        const key = `${a.staffId}-${a.shiftType}`;
        if (seen.has(key)) {
          w.push(`${dayName}: ${a.staffName} is assigned to "${a.shiftType}" more than once`);
        }
        seen.add(key);
      });
    });
    return [...new Set(w)];
  }, [weekDates, byDate]);

  // ── Derived: week label ──
  const weekLabel = useMemo(() => {
    const start = weekDates[0].date;
    const end = weekDates[6].date;
    const sameMonth = start.getMonth() === end.getMonth();
    if (sameMonth) {
      return `${start.toLocaleDateString("en-PH", { month: "long", day: "numeric" })} – ${end.toLocaleDateString("en-PH", { day: "numeric", year: "numeric" })}`;
    }
    return `${start.toLocaleDateString("en-PH", { month: "short", day: "numeric" })} – ${end.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}`;
  }, [weekDates]);

  // ── Derived: month calendar grid ──
  const monthDays = useMemo(() => {
    const year = monthStart.getFullYear();
    const month = monthStart.getMonth();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
    const totalDays = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Mon-first
    const cells: (Date | null)[] = Array(startOffset).fill(null);
    for (let i = 1; i <= totalDays; i++) cells.push(new Date(year, month, i));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [monthStart]);

  // ── Derived: this week's assignments only ──
  const weekAssignments = useMemo(() => {
    const isos = new Set(weekDates.map((d) => d.iso));
    return assignments.filter((a) => isos.has(a.date));
  }, [assignments, weekDates]);

  const totalThisWeek = weekAssignments.length;
  const staffThisWeek = new Set(weekAssignments.map((a) => a.staffId)).size;

  // ── Handlers ──
  const handleAssign = useCallback((a: Omit<Assignment, "id">) => {
    setAssignments((prev) => [...prev, { ...a, id: uid() }]);
    setPublished(false);
    setAssigningDate(null);
  }, []);

  const handleRemove = useCallback((id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setPublished(false);
  }, []);

  const handleApplyTemplate = useCallback(
    (templateId: string) => {
      const template = TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;
      const weekIsos = new Set(weekDates.map((d) => d.iso));
      const newEntries: Assignment[] = template.entries.map((e) => {
        const staff = STAFF.find((s) => s.id === e.staffId)!;
        return {
          id: uid(),
          staffId: staff.id,
          staffName: staff.name,
          initials: staff.initials,
          shiftType: e.shiftType,
          date: toISO(addDays(weekStart, e.dayOffset)),
        };
      });
      setAssignments((prev) => [
        ...prev.filter((a) => !weekIsos.has(a.date)),
        ...newEntries,
      ]);
      setPublished(false);
    },
    [weekStart, weekDates]
  );

  const handleClearWeek = useCallback(() => {
    const weekIsos = new Set(weekDates.map((d) => d.iso));
    setAssignments((prev) => prev.filter((a) => !weekIsos.has(a.date)));
    setPublished(false);
  }, [weekDates]);

  const handlePublish = useCallback(() => {
    setShowPublish(false);
    setPublished(true);
  }, []);

  function goToday() {
    if (viewMode === "week") {
      setWeekStart(getMonday(new Date()));
    } else {
      const d = new Date();
      d.setDate(1);
      d.setHours(0, 0, 0, 0);
      setMonthStart(d);
    }
  }

  return (
    <>
      <div className="space-y-4">
        {/* ── Top toolbar ── */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View toggle */}
          <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white">
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                viewMode === "week" ? "bg-health-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CalendarDays className="h-4 w-4" />
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                viewMode === "month" ? "bg-health-600 text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Monthly
            </button>
          </div>

          {/* Navigation + period label */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                viewMode === "week"
                  ? setWeekStart((w) => addDays(w, -7))
                  : setMonthStart((m) => addMonths(m, -1))
              }
              className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[190px] text-center text-sm font-semibold text-slate-800">
              {viewMode === "week"
                ? weekLabel
                : `${MONTH_NAMES[monthStart.getMonth()]} ${monthStart.getFullYear()}`}
            </span>
            <button
              type="button"
              onClick={() =>
                viewMode === "week"
                  ? setWeekStart((w) => addDays(w, 7))
                  : setMonthStart((m) => addMonths(m, 1))
              }
              className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Today
            </button>
          </div>

          {/* Publish button */}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setShowPublish(true)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                published
                  ? "border border-emerald-200 bg-emerald-100 text-emerald-700"
                  : "bg-health-600 text-white hover:bg-health-700"
              }`}
            >
              {published ? (
                <>
                  <Check className="h-4 w-4" /> Published
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" /> Publish Schedule
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── Warnings ── */}
        {viewMode === "week" && warnings.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  {warnings.length} schedule warning{warnings.length !== 1 ? "s" : ""}
                </p>
                <ul className="mt-1 space-y-0.5 text-sm text-amber-700">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ── Main grid ── */}
        <div className="grid gap-4 xl:grid-cols-[1fr_276px]">
          {/* Calendar */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* ── Weekly view ── */}
            {viewMode === "week" && (
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 border-b border-slate-100">
                    {weekDates.map(({ date, iso }, i) => {
                      const isToday = iso === todayISO;
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      const dayAssignments = byDate[iso] ?? [];
                      const hasWarning = !isWeekend && dayAssignments.length < 2;
                      return (
                        <div
                          key={iso}
                          className={`border-r border-slate-100 px-2 py-3 text-center last:border-r-0 ${
                            isWeekend ? "bg-slate-50/60" : ""
                          }`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase tracking-wider ${
                              isWeekend ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {WEEKDAY_LABELS[i]}
                          </p>
                          <div className="mt-1 flex items-center justify-center">
                            {isToday ? (
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-health-600 text-sm font-bold text-white">
                                {date.getDate()}
                              </span>
                            ) : (
                              <span
                                className={`text-lg font-bold ${
                                  isWeekend ? "text-slate-400" : "text-slate-800"
                                }`}
                              >
                                {date.getDate()}
                              </span>
                            )}
                          </div>
                          {hasWarning && (
                            <AlertTriangle
                              className="mx-auto mt-1 h-3 w-3 text-amber-500"
                              aria-label="Understaffed"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Assignment cells */}
                  <div className="grid grid-cols-7">
                    {weekDates.map(({ date, iso }) => {
                      const dayAssignments = byDate[iso] ?? [];
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                        <div
                          key={iso}
                          className={`min-h-[220px] border-r border-slate-100 p-2 last:border-r-0 ${
                            isWeekend ? "bg-slate-50/40" : ""
                          }`}
                        >
                          <div className="space-y-1.5">
                            {dayAssignments.map((a) => {
                              const cfg = SHIFT_CONFIG[a.shiftType];
                              return (
                                <div
                                  key={a.id}
                                  className={`group flex items-start justify-between gap-1 rounded-lg border px-2 py-1.5 text-xs ${cfg.bg} ${cfg.border} ${cfg.color}`}
                                >
                                  <div className="min-w-0">
                                    <p className="truncate font-bold leading-tight">{a.initials}</p>
                                    <p className="truncate leading-snug opacity-80">{a.shiftType}</p>
                                  </div>
                                  <button
                                    type="button"
                                    title="Remove assignment"
                                    onClick={() => handleRemove(a.id)}
                                    className="mt-0.5 shrink-0 rounded p-0.5 opacity-0 transition-opacity hover:bg-black/10 group-hover:opacity-100"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>

                          <button
                            type="button"
                            onClick={() => setAssigningDate(iso)}
                            className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 py-1.5 text-xs text-slate-400 transition-colors hover:border-health-300 hover:bg-health-50 hover:text-health-600"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Monthly view ── */}
            {viewMode === "month" && (
              <div className="p-4">
                {/* Day-of-week labels */}
                <div className="mb-1 grid grid-cols-7 text-center">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <p
                      key={d}
                      className="py-2 text-xs font-semibold uppercase tracking-wider text-slate-400"
                    >
                      {d}
                    </p>
                  ))}
                </div>

                {/* Calendar cells */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((date, i) => {
                    if (!date)
                      return <div key={`empty-${i}`} className="aspect-[4/3]" />;
                    const iso = toISO(date);
                    const dayAssignments = byDate[iso] ?? [];
                    const isToday = iso === todayISO;
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                      <button
                        key={iso}
                        type="button"
                        title={`${date.toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" })} — ${dayAssignments.length} assignment${dayAssignments.length !== 1 ? "s" : ""}`}
                        onClick={() => {
                          setWeekStart(getMonday(date));
                          setViewMode("week");
                        }}
                        className={`aspect-[4/3] rounded-xl p-1.5 text-left transition-colors ${
                          isToday
                            ? "bg-health-600 text-white"
                            : isWeekend
                            ? "bg-slate-50 text-slate-400 hover:bg-slate-100"
                            : "hover:bg-health-50 hover:text-health-700"
                        }`}
                      >
                        <p
                          className={`text-sm font-bold ${
                            isToday ? "text-white" : isWeekend ? "text-slate-400" : "text-slate-800"
                          }`}
                        >
                          {date.getDate()}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayAssignments.slice(0, 4).map((a) => {
                            const cfg = SHIFT_CONFIG[a.shiftType];
                            return (
                              <span
                                key={a.id}
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isToday ? "bg-white/70" : cfg.dot
                                }`}
                              />
                            );
                          })}
                          {dayAssignments.length > 4 && (
                            <span
                              className={`text-[8px] font-bold leading-none ${
                                isToday ? "text-white/70" : "text-slate-400"
                              }`}
                            >
                              +{dayAssignments.length - 4}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Click any day to open the weekly view for that week.
                </p>
              </div>
            )}
          </div>

          {/* ── Right panel ── */}
          <div className="space-y-4">
            {/* Shift legend */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Shift Types
              </p>
              <div className="space-y-1.5">
                {SHIFT_TYPES.map((shift) => {
                  const cfg = SHIFT_CONFIG[shift];
                  return (
                    <div
                      key={shift}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold ${cfg.bg} ${cfg.border} ${cfg.color}`}
                    >
                      <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                      {shift}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Templates */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-health-600" />
                <p className="text-sm font-bold text-slate-800">Quick Templates</p>
              </div>
              <p className="mb-3 text-xs text-slate-500">
                Applies a preset roster to the current week, replacing existing assignments.
              </p>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-slate-200 p-3">
                    <p className="text-sm font-semibold text-slate-800">{t.label}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
                    <button
                      type="button"
                      onClick={() => handleApplyTemplate(t.id)}
                      className="mt-2 rounded-lg border border-health-200 bg-health-50 px-3 py-1 text-xs font-semibold text-health-700 hover:bg-health-100"
                    >
                      Apply to this week
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly summary + publish */}
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                This Week
              </p>
              <div className="space-y-2">
                {[
                  { label: "Total assignments", value: String(totalThisWeek) },
                  { label: "Staff scheduled",   value: String(staffThisWeek) },
                  {
                    label: "Warnings",
                    value: warnings.length > 0
                      ? `${warnings.length} issue${warnings.length !== 1 ? "s" : ""}`
                      : "None",
                    className: warnings.length > 0 ? "font-bold text-amber-600" : "font-bold text-emerald-600",
                  },
                  {
                    label: "Status",
                    value: published ? "Published" : "Draft",
                    className: published ? "font-bold text-emerald-600" : "font-bold text-slate-500",
                  },
                ].map(({ label, value, className }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className={className ?? "font-bold text-slate-900"}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowPublish(true)}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                    published
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-health-600 text-white hover:bg-health-700"
                  }`}
                >
                  {published ? (
                    <>
                      <Check className="h-4 w-4" /> Schedule Published
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" /> Publish Schedule
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClearWeek}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear This Week
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {assigningDate && (
        <AssignModal
          date={assigningDate}
          onAssign={handleAssign}
          onClose={() => setAssigningDate(null)}
          existingForDay={byDate[assigningDate] ?? []}
        />
      )}

      {showPublish && (
        <PublishModal
          weekLabel={weekLabel}
          assignments={weekAssignments}
          onPublish={handlePublish}
          onClose={() => setShowPublish(false)}
        />
      )}
    </>
  );
}
