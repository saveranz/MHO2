import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  Lock,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Section navigation ───────────────────────────────────────────────────────

type SettingsSection = "roles" | "shifts" | "leaves" | "hours";

const SECTIONS: { id: SettingsSection; label: string }[] = [
  { id: "roles", label: "Roles & Permissions" },
  { id: "shifts", label: "Shift Types" },
  { id: "leaves", label: "Leave Types" },
  { id: "hours", label: "Office Hours" },
];

// ── Shared helpers ───────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function useSaved() {
  const [saved, setSaved] = useState(false);
  function flash() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
  return { saved, flash };
}

function SavedBadge({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
      <Check className="h-4 w-4" /> Saved!
    </span>
  );
}

// ── Roles & Permissions ──────────────────────────────────────────────────────

type RoleDef = { id: string; label: string; locked: boolean };
type PermDef = { id: string; label: string };
type PermMatrix = Record<string, Record<string, boolean>>;

const ROLES: RoleDef[] = [
  { id: "super_admin", label: "Super Admin", locked: true },
  { id: "admin", label: "Admin", locked: false },
  { id: "doctor", label: "Doctor / Nurse", locked: false },
  { id: "staff", label: "Support Staff", locked: false },
];

const PERMS: PermDef[] = [
  { id: "view_staff", label: "View Staff" },
  { id: "edit_staff", label: "Edit Staff" },
  { id: "view_schedule", label: "View Schedule" },
  { id: "edit_schedule", label: "Edit Schedule" },
  { id: "view_reports", label: "View Reports" },
  { id: "approve_requests", label: "Approve Requests" },
  { id: "access_settings", label: "Settings Access" },
];

const INIT_MATRIX: PermMatrix = {
  super_admin: {
    view_staff: true, edit_staff: true, view_schedule: true,
    edit_schedule: true, view_reports: true, approve_requests: true, access_settings: true,
  },
  admin: {
    view_staff: true, edit_staff: true, view_schedule: true,
    edit_schedule: true, view_reports: true, approve_requests: true, access_settings: false,
  },
  doctor: {
    view_staff: true, edit_staff: false, view_schedule: true,
    edit_schedule: false, view_reports: true, approve_requests: false, access_settings: false,
  },
  staff: {
    view_staff: true, edit_staff: false, view_schedule: true,
    edit_schedule: false, view_reports: false, approve_requests: false, access_settings: false,
  },
};

function RolesSection() {
  const [matrix, setMatrix] = useState<PermMatrix>(() => {
    // Try to load from localStorage first
    const saved = localStorage.getItem('roles-permissions-matrix');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return JSON.parse(JSON.stringify(INIT_MATRIX));
      }
    }
    return JSON.parse(JSON.stringify(INIT_MATRIX));
  });
  const { saved, flash } = useSaved();

  function toggle(roleId: string, permId: string) {
    if (roleId === "super_admin") return;
    setMatrix((prev) => ({
      ...prev,
      [roleId]: { ...prev[roleId], [permId]: !prev[roleId][permId] },
    }));
  }

  function handleSave() {
    // Save to localStorage
    localStorage.setItem('roles-permissions-matrix', JSON.stringify(matrix));
    flash();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Super Admin permissions are locked and cannot be modified.
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left font-semibold text-slate-600">Role</th>
              {PERMS.map((p) => (
                <th
                  key={p.id}
                  className="whitespace-nowrap px-3 py-3 text-center font-semibold text-slate-600"
                >
                  {p.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ROLES.map((role) => (
              <tr key={role.id} className={role.locked ? "bg-slate-50/50" : ""}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    {role.locked && <Lock className="h-3.5 w-3.5 text-slate-400" />}
                    <span className="font-semibold text-slate-800">{role.label}</span>
                  </div>
                </td>
                {PERMS.map((perm) => {
                  const checked = matrix[role.id]?.[perm.id] ?? false;
                  return (
                    <td key={perm.id} className="px-3 py-4 text-center">
                      <button
                        type="button"
                        disabled={role.locked}
                        onClick={() => toggle(role.id, perm.id)}
                        className={cn(
                          "mx-auto flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
                          checked
                            ? "border-health-600 bg-health-600 text-white"
                            : "border-slate-300 bg-white",
                          role.locked
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer hover:border-health-400"
                        )}
                      >
                        {checked && <Check className="h-3 w-3" />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-xl bg-health-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-health-700"
        >
          <Save className="h-4 w-4" /> Save Permissions
        </button>
        <SavedBadge saved={saved} />
      </div>
    </div>
  );
}

// ── Shift Types ──────────────────────────────────────────────────────────────

type ShiftTypeDef = { id: string; name: string; color: string; hours: string };

const COLOR_OPTIONS = ["sky", "emerald", "violet", "amber", "rose", "indigo", "teal", "orange"] as const;
type ShiftColor = (typeof COLOR_OPTIONS)[number];

// Full static class strings so Tailwind does not purge them
const COLOR_MAP: Record<ShiftColor, { bg: string; text: string; dot: string }> = {
  sky:     { bg: "bg-sky-100",     text: "text-sky-700",     dot: "bg-sky-500"     },
  emerald: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  violet:  { bg: "bg-violet-100",  text: "text-violet-700",  dot: "bg-violet-500"  },
  amber:   { bg: "bg-amber-100",   text: "text-amber-700",   dot: "bg-amber-500"   },
  rose:    { bg: "bg-rose-100",    text: "text-rose-700",    dot: "bg-rose-500"    },
  indigo:  { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-500"  },
  teal:    { bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-500"    },
  orange:  { bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-500"  },
};

const INIT_SHIFTS: ShiftTypeDef[] = [
  { id: "s1", name: "Morning OPD",       color: "sky",     hours: "8:00 AM – 12:00 PM"           },
  { id: "s2", name: "Afternoon Clinic",  color: "emerald", hours: "1:00 PM – 5:00 PM"            },
  { id: "s3", name: "24-hour Duty",      color: "violet",  hours: "8:00 AM – 8:00 AM (next day)" },
  { id: "s4", name: "Field Work",        color: "amber",   hours: "7:00 AM – 3:00 PM"            },
  { id: "s5", name: "Vaccination Duty",  color: "rose",    hours: "8:00 AM – 12:00 PM"           },
];

type ShiftDraft = { name: string; color: string; hours: string };
const EMPTY_SHIFT: ShiftDraft = { name: "", color: "sky", hours: "" };

function ShiftEditRow({
  draft,
  setDraft,
  onSave,
  onCancel,
  bg = "bg-slate-50",
}: {
  draft: ShiftDraft;
  setDraft: (d: ShiftDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  bg?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-end", bg)}>
      <div className="flex-1 space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Shift name
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
          placeholder="e.g. Evening Clinic"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </div>
      <div className="w-36 space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Color
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
          value={draft.color}
          onChange={(e) => setDraft({ ...draft, color: e.target.value })}
        >
          {COLOR_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Hours
        </label>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
          placeholder="e.g. 8:00 AM – 5:00 PM"
          value={draft.hours}
          onChange={(e) => setDraft({ ...draft, hours: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.name.trim()}
          className="rounded-xl bg-health-600 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ShiftsSection() {
  const [shifts, setShifts] = useState<ShiftTypeDef[]>(() => {
    const saved = localStorage.getItem('shift-types');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INIT_SHIFTS;
      }
    }
    return INIT_SHIFTS;
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ShiftDraft>(EMPTY_SHIFT);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<ShiftDraft>(EMPTY_SHIFT);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { saved, flash } = useSaved();

  // Save to localStorage whenever shifts change
  useEffect(() => {
    localStorage.setItem('shift-types', JSON.stringify(shifts));
  }, [shifts]);

  function startEdit(s: ShiftTypeDef) {
    setEditId(s.id);
    setEditDraft({ name: s.name, color: s.color, hours: s.hours });
  }

  function saveEdit() {
    if (!editDraft.name.trim()) return;
    setShifts((prev) => prev.map((s) => (s.id === editId ? { ...s, ...editDraft } : s)));
    setEditId(null);
    flash();
  }

  function addShift() {
    if (!addDraft.name.trim()) return;
    setShifts((prev) => [...prev, { id: uid(), ...addDraft }]);
    setAdding(false);
    setAddDraft(EMPTY_SHIFT);
    flash();
  }

  function deleteShift(id: string) {
    setShifts((prev) => prev.filter((s) => s.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {shifts.map((s) => {
            const cm = COLOR_MAP[s.color as ShiftColor] ?? COLOR_MAP.sky;

            if (editId === s.id) {
              return (
                <ShiftEditRow
                  key={s.id}
                  draft={editDraft}
                  setDraft={setEditDraft}
                  onSave={saveEdit}
                  onCancel={() => setEditId(null)}
                />
              );
            }

            if (deleteConfirm === s.id) {
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 bg-red-50 p-4"
                >
                  <p className="text-sm text-slate-700">
                    Delete <strong>{s.name}</strong>? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => deleteShift(s.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                      cm.bg,
                      cm.text
                    )}
                  >
                    <span className={cn("h-2 w-2 rounded-full", cm.dot)} />
                    {s.name}
                  </span>
                  <span className="text-sm text-slate-500">{s.hours}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(s.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {adding && (
            <ShiftEditRow
              draft={addDraft}
              setDraft={setAddDraft}
              onSave={addShift}
              onCancel={() => { setAdding(false); setAddDraft(EMPTY_SHIFT); }}
              bg="bg-health-50"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!adding && !editId && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-health-300 px-4 py-2 text-sm font-semibold text-health-700 transition-colors hover:bg-health-50"
          >
            <Plus className="h-4 w-4" /> Add Shift Type
          </button>
        )}
        <SavedBadge saved={saved} />
      </div>
    </div>
  );
}

// ── Leave Types ──────────────────────────────────────────────────────────────

type LeaveTypeDef = { id: string; name: string; daysPerYear: number; paid: boolean };
type LeaveDraft = { name: string; daysPerYear: number; paid: boolean };
const EMPTY_LEAVE: LeaveDraft = { name: "", daysPerYear: 15, paid: true };

const INIT_LEAVES: LeaveTypeDef[] = [
  { id: "l1", name: "Sick Leave",      daysPerYear: 15,  paid: true  },
  { id: "l2", name: "Vacation Leave",  daysPerYear: 15,  paid: true  },
  { id: "l3", name: "Emergency Leave", daysPerYear: 5,   paid: true  },
  { id: "l4", name: "Maternity Leave", daysPerYear: 105, paid: true  },
  { id: "l5", name: "Paternity Leave", daysPerYear: 7,   paid: true  },
  { id: "l6", name: "Study Leave",     daysPerYear: 6,   paid: false },
];

function LeaveEditRow({
  draft,
  setDraft,
  onSave,
  onCancel,
  bg = "bg-slate-50",
}: {
  draft: LeaveDraft;
  setDraft: (d: LeaveDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  bg?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3 p-4 sm:flex-row sm:items-end", bg)}>
      <div className="flex-1 space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Leave type name
        </label>
        <input
          autoFocus
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
          placeholder="e.g. Bereavement Leave"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </div>
      <div className="w-32 space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Days / year
        </label>
        <input
          type="number"
          min={1}
          max={365}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-health-400 focus:outline-none"
          value={draft.daysPerYear}
          onChange={(e) =>
            setDraft({ ...draft, daysPerYear: Math.max(1, parseInt(e.target.value) || 1) })
          }
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2 pb-2">
        <button
          type="button"
          onClick={() => setDraft({ ...draft, paid: !draft.paid })}
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded border-2 transition-colors",
            draft.paid
              ? "border-health-600 bg-health-600 text-white"
              : "border-slate-300 bg-white"
          )}
        >
          {draft.paid && <Check className="h-3 w-3" />}
        </button>
        <span className="text-sm text-slate-700">Paid</span>
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onSave}
          disabled={!draft.name.trim()}
          className="rounded-xl bg-health-600 px-4 py-2 text-sm font-semibold text-white hover:bg-health-700 disabled:opacity-50"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function LeavesSection() {
  const [leaves, setLeaves] = useState<LeaveTypeDef[]>(() => {
    const saved = localStorage.getItem('leave-types');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INIT_LEAVES;
      }
    }
    return INIT_LEAVES;
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<LeaveDraft>(EMPTY_LEAVE);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<LeaveDraft>(EMPTY_LEAVE);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { saved, flash } = useSaved();

  // Save to localStorage whenever leaves change
  useEffect(() => {
    localStorage.setItem('leave-types', JSON.stringify(leaves));
  }, [leaves]);

  function startEdit(l: LeaveTypeDef) {
    setEditId(l.id);
    setEditDraft({ name: l.name, daysPerYear: l.daysPerYear, paid: l.paid });
  }

  function saveEdit() {
    if (!editDraft.name.trim()) return;
    setLeaves((prev) => prev.map((l) => (l.id === editId ? { ...l, ...editDraft } : l)));
    setEditId(null);
    flash();
  }

  function addLeave() {
    if (!addDraft.name.trim()) return;
    setLeaves((prev) => [...prev, { id: uid(), ...addDraft }]);
    setAdding(false);
    setAddDraft(EMPTY_LEAVE);
    flash();
  }

  function deleteLeave(id: string) {
    setLeaves((prev) => prev.filter((l) => l.id !== id));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {leaves.map((l) => {
            if (editId === l.id) {
              return (
                <LeaveEditRow
                  key={l.id}
                  draft={editDraft}
                  setDraft={setEditDraft}
                  onSave={saveEdit}
                  onCancel={() => setEditId(null)}
                />
              );
            }

            if (deleteConfirm === l.id) {
              return (
                <div
                  key={l.id}
                  className="flex items-center justify-between gap-4 bg-red-50 p-4"
                >
                  <p className="text-sm text-slate-700">
                    Delete <strong>{l.name}</strong>? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => deleteLeave(l.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={l.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold text-slate-800">{l.name}</span>
                  <span className="text-sm text-slate-500">{l.daysPerYear} days/year</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      l.paid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {l.paid ? "Paid" : "Unpaid"}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(l)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirm(l.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {adding && (
            <LeaveEditRow
              draft={addDraft}
              setDraft={setAddDraft}
              onSave={addLeave}
              onCancel={() => { setAdding(false); setAddDraft(EMPTY_LEAVE); }}
              bg="bg-health-50"
            />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!adding && !editId && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-dashed border-health-300 px-4 py-2 text-sm font-semibold text-health-700 transition-colors hover:bg-health-50"
          >
            <Plus className="h-4 w-4" /> Add Leave Type
          </button>
        )}
        <SavedBadge saved={saved} />
      </div>
    </div>
  );
}

// ── Office Hours ─────────────────────────────────────────────────────────────

type DayConfig = { day: string; open: boolean; start: string; end: string };

const INIT_HOURS: DayConfig[] = [
  { day: "Monday",    open: true,  start: "08:00", end: "17:00" },
  { day: "Tuesday",   open: true,  start: "08:00", end: "17:00" },
  { day: "Wednesday", open: true,  start: "08:00", end: "17:00" },
  { day: "Thursday",  open: true,  start: "08:00", end: "17:00" },
  { day: "Friday",    open: true,  start: "08:00", end: "17:00" },
  { day: "Saturday",  open: false, start: "08:00", end: "12:00" },
  { day: "Sunday",    open: false, start: "08:00", end: "12:00" },
];

function fmt24to12(t: string) {
  if (!t) return "";
  const [hh, mm] = t.split(":");
  const h = parseInt(hh);
  return `${h % 12 || 12}:${mm} ${h >= 12 ? "PM" : "AM"}`;
}

function OfficeHoursSection() {
  const [hours, setHours] = useState<DayConfig[]>(() => {
    const saved = localStorage.getItem('office-hours');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INIT_HOURS;
      }
    }
    return INIT_HOURS;
  });
  const { saved, flash } = useSaved();

  // Save to localStorage whenever hours change
  useEffect(() => {
    localStorage.setItem('office-hours', JSON.stringify(hours));
  }, [hours]);

  function toggleDay(idx: number) {
    setHours((prev) => prev.map((d, i) => (i === idx ? { ...d, open: !d.open } : d)));
  }

  function setField(idx: number, field: "start" | "end", val: string) {
    setHours((prev) => prev.map((d, i) => (i === idx ? { ...d, [field]: val } : d)));
  }

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {hours.map((d, i) => (
            <div
              key={d.day}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-6"
            >
              {/* Toggle + day label */}
              <div className="flex w-36 shrink-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors",
                    d.open ? "bg-health-600" : "bg-slate-200"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform",
                      d.open ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    d.open ? "text-slate-800" : "text-slate-400"
                  )}
                >
                  {d.day}
                </span>
              </div>

              {d.open ? (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-500">Open</label>
                    <input
                      type="time"
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:border-health-400 focus:outline-none"
                      value={d.start}
                      onChange={(e) => setField(i, "start", e.target.value)}
                    />
                  </div>
                  <span className="text-slate-400">–</span>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-500">Close</label>
                    <input
                      type="time"
                      className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm focus:border-health-400 focus:outline-none"
                      value={d.end}
                      onChange={(e) => setField(i, "end", e.target.value)}
                    />
                  </div>
                  <span className="text-xs text-slate-400">
                    {fmt24to12(d.start)} – {fmt24to12(d.end)}
                  </span>
                </div>
              ) : (
                <span className="text-sm italic text-slate-400">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={flash}
          className="inline-flex items-center gap-2 rounded-xl bg-health-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-health-700"
        >
          <Save className="h-4 w-4" /> Save Office Hours
        </button>
        <SavedBadge saved={saved} />
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("roles");

  return (
    <div className="space-y-6">
      {/* Inner nav */}
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
              activeSection === s.id
                ? "bg-health-600 text-white shadow"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-health-50 hover:text-health-700"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section content */}
      {activeSection === "roles"  && <RolesSection />}
      {activeSection === "shifts" && <ShiftsSection />}
      {activeSection === "leaves" && <LeavesSection />}
      {activeSection === "hours"  && <OfficeHoursSection />}
    </div>
  );
}
