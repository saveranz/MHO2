import { useState, useMemo, useRef, useCallback } from "react";
import {
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
  Phone,
  MapPin,
  Calendar,
  BadgeCheck,
  FileText,
  ChevronRight,
  Pencil,
  Archive,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Download,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StaffStatus = "On Duty" | "On Leave" | "Field Work" | "Off";
export type EmploymentType = "Regular/Permanent" | "Contractual/Seasonal";

export interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  department: string;
  station: string;
  contact: string;
  status: StaffStatus;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyRelation: string;
  prcLicense?: string;
  startDate: string;
  contractEndDate?: string;
  employmentType: EmploymentType;
  notes: string;
  initials: string;
  avatarColor: string;
  archived: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "s1",
    firstName: "Maria",
    lastName: "Santos",
    position: "Municipal Health Officer",
    department: "Health Administration",
    station: "Main Office",
    contact: "+63 912 345 6789",
    status: "On Duty",
    email: "m.santos@mhobongabong.gov.ph",
    address: "Barangay Poblacion, Bongabong, Oriental Mindoro",
    emergencyContact: "Jose Santos",
    emergencyRelation: "Spouse",
    prcLicense: "PRC-MED-001234",
    startDate: "2018-06-01",
    employmentType: "Regular/Permanent",
    notes: "Municipal Health Officer since 2018. Oversees all public health programs.",
    initials: "MS",
    avatarColor: "bg-health-600",
    archived: false,
  },
  {
    id: "s2",
    firstName: "Elena",
    lastName: "Cruz",
    position: "Public Health Nurse",
    department: "Nursing Services",
    station: "North Station",
    contact: "+63 917 234 5678",
    status: "On Duty",
    email: "e.cruz@mhobongabong.gov.ph",
    address: "Sitio Ilaya, Bongabong, Oriental Mindoro",
    emergencyContact: "Pedro Cruz",
    emergencyRelation: "Brother",
    prcLicense: "PRC-NUR-045678",
    startDate: "2020-03-15",
    employmentType: "Regular/Permanent",
    notes: "Specializes in immunization and maternal health outreach.",
    initials: "EC",
    avatarColor: "bg-emerald-600",
    archived: false,
  },
  {
    id: "s3",
    firstName: "Ana",
    lastName: "Lopez",
    position: "Midwife",
    department: "Maternal & Child Health",
    station: "South Station",
    contact: "+63 919 876 5432",
    status: "Field Work",
    email: "a.lopez@mhobongabong.gov.ph",
    address: "Barangay Labasan, Bongabong, Oriental Mindoro",
    emergencyContact: "Carlos Lopez",
    emergencyRelation: "Husband",
    prcLicense: "PRC-MID-078912",
    startDate: "2019-09-01",
    employmentType: "Regular/Permanent",
    notes: "Home-birthing and antenatal care specialist. Active in barangay visits.",
    initials: "AL",
    avatarColor: "bg-pink-600",
    archived: false,
  },
  {
    id: "s4",
    firstName: "Mark",
    lastName: "Reyes",
    position: "Admin Clerk",
    department: "Health Administration",
    station: "Main Office",
    contact: "+63 905 321 4321",
    status: "On Duty",
    email: "m.reyes@mhobongabong.gov.ph",
    address: "Barangay Caguray, Bongabong, Oriental Mindoro",
    emergencyContact: "Rosa Reyes",
    emergencyRelation: "Mother",
    startDate: "2021-01-10",
    employmentType: "Regular/Permanent",
    notes: "Manages records, filing, and front-desk patient assistance.",
    initials: "MR",
    avatarColor: "bg-blue-600",
    archived: false,
  },
  {
    id: "s5",
    firstName: "Liza",
    lastName: "Fernandez",
    position: "Public Health Nurse",
    department: "Nursing Services",
    station: "South Station",
    contact: "+63 906 654 9870",
    status: "On Leave",
    email: "l.fernandez@mhobongabong.gov.ph",
    address: "Barangay Hagan, Bongabong, Oriental Mindoro",
    emergencyContact: "Juan Fernandez",
    emergencyRelation: "Father",
    prcLicense: "PRC-NUR-056789",
    startDate: "2020-11-01",
    employmentType: "Regular/Permanent",
    notes: "On approved medical leave until further notice.",
    initials: "LF",
    avatarColor: "bg-violet-600",
    archived: false,
  },
  {
    id: "s6",
    firstName: "Ramon",
    lastName: "Dela Cruz",
    position: "Sanitary Inspector",
    department: "Environmental Health",
    station: "North Station",
    contact: "+63 908 112 3344",
    status: "Field Work",
    email: "r.delacruz@mhobongabong.gov.ph",
    address: "Barangay Bagong Sikat, Bongabong, Oriental Mindoro",
    emergencyContact: "Teresa Dela Cruz",
    emergencyRelation: "Wife",
    prcLicense: "PRC-SI-023456",
    startDate: "2017-04-18",
    employmentType: "Regular/Permanent",
    notes: "Handles food establishment inspections and water quality monitoring.",
    initials: "RD",
    avatarColor: "bg-amber-600",
    archived: false,
  },
  {
    id: "s7",
    firstName: "Gloria",
    lastName: "Macaraeg",
    position: "Barangay Health Worker",
    department: "Community Health",
    station: "North Station",
    contact: "+63 910 445 6677",
    status: "On Duty",
    email: "g.macaraeg@mhobongabong.gov.ph",
    address: "Barangay Camburay, Bongabong, Oriental Mindoro",
    emergencyContact: "Natividad Macaraeg",
    emergencyRelation: "Sister",
    startDate: "2022-06-01",
    contractEndDate: "2026-12-31",
    employmentType: "Contractual/Seasonal",
    notes: "Conducts home visits for TB and nutrition monitoring.",
    initials: "GM",
    avatarColor: "bg-teal-600",
    archived: false,
  },
  {
    id: "s8",
    firstName: "Carlo",
    lastName: "Buenaventura",
    position: "Doctor",
    department: "Medical Services",
    station: "Main Office",
    contact: "+63 915 778 2233",
    status: "Off",
    email: "c.buenaventura@mhobongabong.gov.ph",
    address: "Barangay Poblacion, Bongabong, Oriental Mindoro",
    emergencyContact: "Maria Buenaventura",
    emergencyRelation: "Spouse",
    prcLicense: "PRC-MED-098765",
    startDate: "2023-01-16",
    employmentType: "Regular/Permanent",
    notes: "Handles general outpatient consultations on Mondays, Wednesdays, Fridays.",
    initials: "CB",
    avatarColor: "bg-red-600",
    archived: false,
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const POSITIONS_FILTER = [
  "All Positions",
  "Municipal Health Officer",
  "Doctor",
  "Public Health Nurse",
  "Midwife",
  "Barangay Health Worker",
  "Sanitary Inspector",
  "Admin Clerk",
];

const POSITIONS_FORM = [
  "Municipal Health Officer",
  "Doctor",
  "Public Health Nurse",
  "Midwife",
  "Barangay Health Worker",
  "Sanitary Inspector",
  "Admin Clerk",
];

const DEPARTMENTS: Record<string, string> = {
  "Municipal Health Officer": "Health Administration",
  "Doctor": "Medical Services",
  "Public Health Nurse": "Nursing Services",
  "Midwife": "Maternal & Child Health",
  "Barangay Health Worker": "Community Health",
  "Sanitary Inspector": "Environmental Health",
  "Admin Clerk": "Health Administration",
};

const LICENSED_POSITIONS = [
  "Municipal Health Officer",
  "Doctor",
  "Public Health Nurse",
  "Midwife",
  "Sanitary Inspector",
];

const STATUSES_FILTER: ("All" | StaffStatus)[] = ["All", "On Duty", "On Leave", "Field Work", "Off"];
const STATUSES_FORM: StaffStatus[] = ["On Duty", "On Leave", "Field Work", "Off"];
const STATIONS = ["All Stations", "Main Office", "North Station", "South Station"];
const STATIONS_FORM = ["Main Office", "North Station", "South Station"];

const AVATAR_COLORS = [
  "bg-health-600", "bg-emerald-600", "bg-pink-600", "bg-blue-600",
  "bg-violet-600", "bg-amber-600", "bg-teal-600", "bg-red-600",
  "bg-cyan-600", "bg-orange-600", "bg-lime-600", "bg-fuchsia-600",
];

const CSV_HEADERS = "firstName,lastName,position,station,contact,email,address,emergencyContact,emergencyRelation,prcLicense,startDate,contractEndDate,employmentType,notes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusStyle(status: StaffStatus) {
  switch (status) {
    case "On Duty":
      return "bg-emerald-100 text-emerald-700";
    case "On Leave":
      return "bg-amber-100 text-amber-700";
    case "Field Work":
      return "bg-blue-100 text-blue-700";
    case "Off":
      return "bg-slate-100 text-slate-600";
  }
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeInitials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function pickColor(id: string) {
  const idx = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return AVATAR_COLORS[idx % AVATAR_COLORS.length];
}

function uid() {
  return `s${Date.now()}`;
}

/** Simple CSV parser — handles quoted fields */
function parseCSV(text: string): string[][] {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      const cells: string[] = [];
      let cur = "";
      let inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQ = !inQ; }
        else if (ch === "," && !inQ) { cells.push(cur.trim()); cur = ""; }
        else { cur += ch; }
      }
      cells.push(cur.trim());
      return cells;
    });
}

function downloadTemplate() {
  const example = `${CSV_HEADERS}\nJuan,Dela Cruz,Barangay Health Worker,South Station,+63 900 000 0001,j.delacruz@mhobongabong.gov.ph,"Barangay Sample, Bongabong",Aling Nena,Mother,,2026-01-01,2026-12-31,Contractual/Seasonal,New BHW hire`;
  const blob = new Blob([example], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "staff_import_template.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}

// ─── Form types ───────────────────────────────────────────────────────────────

type FormData = {
  firstName: string;
  lastName: string;
  position: string;
  station: string;
  contact: string;
  email: string;
  address: string;
  emergencyContact: string;
  emergencyRelation: string;
  prcLicense: string;
  startDate: string;
  contractEndDate: string;
  employmentType: EmploymentType;
  status: StaffStatus;
  notes: string;
};

const EMPTY_FORM: FormData = {
  firstName: "", lastName: "", position: "Public Health Nurse",
  station: "Main Office", contact: "", email: "", address: "",
  emergencyContact: "", emergencyRelation: "", prcLicense: "",
  startDate: "", contractEndDate: "", employmentType: "Regular/Permanent",
  status: "On Duty", notes: "",
};

// ─── Field / inputCls helpers ─────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-xl border ${
    hasError ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"
  } px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100`;
}

// ─── Staff Form Modal ─────────────────────────────────────────────────────────

function StaffFormModal({
  initial,
  onSave,
  onClose,
}: {
  initial: FormData;
  onSave: (data: FormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const isEditing = !!initial.firstName;

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
        ...(field === "position" ? { department: DEPARTMENTS[e.target.value] ?? "" } : {}),
      }));

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.contact.trim()) e.contact = "Required";
    if (!form.startDate) e.startDate = "Required";
    if (form.employmentType === "Contractual/Seasonal" && !form.contractEndDate)
      e.contractEndDate = "Required for contractual staff";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (validate()) onSave(form);
  }

  const needsLicense = LICENSED_POSITIONS.includes(form.position);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-10">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEditing ? "Edit Staff Member" : "Add New Staff Member"}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditing ? "Update the details below." : "Fill in the details for the new hire."}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Employment type toggle */}
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Employment Type
            </label>
            <div className="flex overflow-hidden rounded-xl border border-slate-200">
              {(["Regular/Permanent", "Contractual/Seasonal"] as EmploymentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, employmentType: t }))}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                    form.employmentType === t
                      ? "bg-health-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First Name" error={errors.firstName}>
              <input value={form.firstName} onChange={set("firstName")}
                className={inputCls(!!errors.firstName)} placeholder="e.g. Maria" />
            </Field>
            <Field label="Last Name" error={errors.lastName}>
              <input value={form.lastName} onChange={set("lastName")}
                className={inputCls(!!errors.lastName)} placeholder="e.g. Santos" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Position / Role">
              <select value={form.position} onChange={set("position")} className={inputCls(false)}>
                {POSITIONS_FORM.map((p) => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Station">
              <select value={form.station} onChange={set("station")} className={inputCls(false)}>
                {STATIONS_FORM.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact Number" error={errors.contact}>
              <input value={form.contact} onChange={set("contact")}
                className={inputCls(!!errors.contact)} placeholder="+63 9XX XXX XXXX" />
            </Field>
            <Field label="Email Address">
              <input type="email" value={form.email} onChange={set("email")}
                className={inputCls(false)} placeholder="staff@mhobongabong.gov.ph" />
            </Field>
          </div>

          <Field label="Home Address">
            <input value={form.address} onChange={set("address")}
              className={inputCls(false)} placeholder="Barangay, Bongabong, Oriental Mindoro" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start Date" error={errors.startDate}>
              <input type="date" value={form.startDate} onChange={set("startDate")}
                className={inputCls(!!errors.startDate)} />
            </Field>
            {form.employmentType === "Contractual/Seasonal" && (
              <Field label="Contract End Date" error={errors.contractEndDate}>
                <input type="date" value={form.contractEndDate} onChange={set("contractEndDate")}
                  className={inputCls(!!errors.contractEndDate)} />
              </Field>
            )}
          </div>

          <Field label="Current Status">
            <select value={form.status} onChange={set("status")} className={inputCls(false)}>
              {STATUSES_FORM.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>

          {needsLicense && (
            <Field label="PRC License Number (optional)">
              <input value={form.prcLicense} onChange={set("prcLicense")}
                className={inputCls(false)} placeholder="e.g. PRC-NUR-045678" />
            </Field>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emergency Contact Name">
              <input value={form.emergencyContact} onChange={set("emergencyContact")}
                className={inputCls(false)} placeholder="Full name" />
            </Field>
            <Field label="Relationship">
              <input value={form.emergencyRelation} onChange={set("emergencyRelation")}
                className={inputCls(false)} placeholder="e.g. Spouse, Parent" />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea value={form.notes} onChange={set("notes")} rows={3}
              className={`${inputCls(false)} resize-none`}
              placeholder="Any relevant remarks about this staff member…" />
          </Field>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="rounded-xl bg-health-600 px-6 py-2.5 font-semibold text-white hover:bg-health-700">
              {isEditing ? "Save Changes" : "Add Staff Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Archive confirm modal ────────────────────────────────────────────────────

function ArchiveModal({
  member,
  onConfirm,
  onClose,
}: {
  member: StaffMember;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
          <AlertTriangle className="h-7 w-7 text-amber-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Archive staff member?</h2>
        <p className="mt-2 text-slate-600">
          <span className="font-semibold">{member.firstName} {member.lastName}</span> will be moved
          to the archived list. Their record is preserved but they will no longer appear in active
          staff views. You can restore them later.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            className="rounded-xl bg-amber-500 px-5 py-2.5 font-semibold text-white hover:bg-amber-600">
            Archive
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Restore confirm modal ────────────────────────────────────────────────────

function RestoreModal({
  member,
  onConfirm,
  onClose,
}: {
  member: StaffMember;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-6">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-health-100">
          <CheckCircle2 className="h-7 w-7 text-health-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Restore staff member?</h2>
        <p className="mt-2 text-slate-600">
          <span className="font-semibold">{member.firstName} {member.lastName}</span> will be moved
          back to the active staff directory.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={onConfirm}
            className="rounded-xl bg-health-600 px-5 py-2.5 font-semibold text-white hover:bg-health-700">
            Restore
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CSV Import modal ─────────────────────────────────────────────────────────

interface ImportRow {
  data: Partial<StaffMember> & { _raw: string[] };
  valid: boolean;
  error?: string;
}

function ImportModal({
  onImport,
  onClose,
}: {
  onImport: (rows: StaffMember[]) => void;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [step, setStep] = useState<"upload" | "preview">("upload");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const all = parseCSV(text);
      const dataRows = all[0]?.[0]?.toLowerCase() === "firstname" ? all.slice(1) : all;
      const parsed: ImportRow[] = dataRows.map((cells) => {
        const [
          firstName = "", lastName = "", position = "", station = "",
          contact = "", email = "", address = "", emergencyContact = "",
          emergencyRelation = "", prcLicense = "", startDate = "",
          contractEndDate = "", employmentType = "", notes = "",
        ] = cells;

        const valid = !!(firstName && lastName && contact && startDate);
        const id = uid() + Math.random();
        const emp: EmploymentType =
          employmentType === "Contractual/Seasonal" ? "Contractual/Seasonal" : "Regular/Permanent";
        const pos = POSITIONS_FORM.includes(position) ? position : "Admin Clerk";

        return {
          data: {
            id, firstName, lastName,
            position: pos,
            department: DEPARTMENTS[pos] ?? "Health Administration",
            station: STATIONS_FORM.includes(station) ? station : "Main Office",
            contact, email, address, emergencyContact, emergencyRelation,
            prcLicense: prcLicense || undefined,
            startDate, contractEndDate: contractEndDate || undefined,
            employmentType: emp, notes,
            status: "On Duty",
            initials: makeInitials(firstName, lastName),
            avatarColor: pickColor(id),
            archived: false,
            _raw: cells,
          },
          valid,
          error: valid ? undefined : "Missing required fields (first name, last name, contact, start date)",
        };
      });
      setRows(parsed);
      setStep("preview");
    };
    reader.readAsText(file);
  }

  const validRows = rows.filter((r) => r.valid);

  function handleConfirm() {
    onImport(validRows.map((r) => r.data as StaffMember));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 pt-10">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Import from CSV</h2>
            <p className="text-sm text-slate-500">
              {step === "upload"
                ? "Upload a CSV file to add multiple staff at once."
                : `${rows.length} rows detected · ${validRows.length} valid · ${rows.length - validRows.length} with errors`}
            </p>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === "upload" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-slate-800">Download the CSV template first</p>
                  <p className="text-sm text-slate-500">
                    Use the template to ensure the right column order and format.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
                >
                  <Download className="h-4 w-4" />
                  Template
                </button>
              </div>

              <div
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-health-200 bg-health-50/40 px-6 py-12 transition-colors hover:bg-health-50"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="h-10 w-10 text-health-500" />
                <p className="font-semibold text-slate-700">Click to select a CSV file</p>
                <p className="text-sm text-slate-400">Only .csv files are accepted</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Expected columns (in order)
                </p>
                <p className="font-mono text-xs text-slate-600 break-all leading-6">
                  {CSV_HEADERS}
                </p>
              </div>
            </div>
          )}

          {step === "preview" && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full min-w-[600px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Station</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.map((row, i) => (
                      <tr key={i} className={row.valid ? "" : "bg-red-50"}>
                        <td className="px-4 py-3">
                          {row.valid ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <div title={row.error}>
                              <AlertTriangle className="h-4 w-4 text-red-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900">
                          {row.data.firstName} {row.data.lastName}
                          {!row.valid && (
                            <p className="text-xs text-red-500">{row.error}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{row.data.position}</td>
                        <td className="px-4 py-3 text-slate-600">{row.data.station}</td>
                        <td className="px-4 py-3 text-slate-600">{row.data.contact}</td>
                        <td className="px-4 py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                            row.data.employmentType === "Contractual/Seasonal"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-health-100 text-health-700"
                          }`}>
                            {row.data.employmentType === "Contractual/Seasonal" ? "Contractual" : "Regular"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={() => { setRows([]); setStep("upload"); }}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Upload different file
                </button>
                <div className="flex gap-3">
                  <button type="button" onClick={onClose}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={validRows.length === 0}
                    className="rounded-xl bg-health-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-health-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Import {validRows.length} valid row{validRows.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────

function StaffDetailPanel({
  member,
  onClose,
  onEdit,
  onArchive,
  onRestore,
}: {
  member: StaffMember;
  onClose: () => void;
  onEdit: (m: StaffMember) => void;
  onArchive: (m: StaffMember) => void;
  onRestore: (m: StaffMember) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto bg-white shadow-2xl">
        {/* Colored header */}
        <div
          className={`flex items-center gap-4 px-6 py-5 text-white ${member.avatarColor}`}
        >
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
            {member.initials}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold leading-tight">
              {member.firstName} {member.lastName}
            </p>
            <p className="text-sm text-white/85">{member.position}</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyle(member.status)}`}>
                {member.status}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                member.employmentType === "Contractual/Seasonal"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-white/20 text-white"
              }`}>
                {member.employmentType}
              </span>
              {member.archived && (
                <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                  Archived
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex gap-2 border-b border-slate-100 px-6 py-3">
          <button
            type="button"
            onClick={() => onEdit(member)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
          {member.archived ? (
            <button
              type="button"
              onClick={() => onRestore(member)}
              className="inline-flex items-center gap-2 rounded-xl border border-health-200 px-3 py-2 text-sm font-semibold text-health-700 hover:bg-health-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Restore
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onArchive(member)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50"
            >
              <Archive className="h-4 w-4" /> Archive
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 space-y-6 p-6">
          {/* Basic info */}
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Basic Information
            </p>
            <div className="space-y-3">
              <InfoRow icon={<BadgeCheck className="h-4 w-4 text-health-600" />} label="Position" value={member.position} />
              <InfoRow icon={<MapPin className="h-4 w-4 text-health-600" />} label="Department" value={member.department} />
              <InfoRow icon={<MapPin className="h-4 w-4 text-health-600" />} label="Station" value={member.station} />
              <InfoRow icon={<Phone className="h-4 w-4 text-health-600" />} label="Contact" value={member.contact} />
              <InfoRow icon={<FileText className="h-4 w-4 text-health-600" />} label="Email" value={member.email || "—"} />
              <InfoRow icon={<MapPin className="h-4 w-4 text-health-600" />} label="Address" value={member.address || "—"} />
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-health-600" />}
                label="Start Date"
                value={formatDate(member.startDate)}
              />
              {member.contractEndDate && (
                <InfoRow
                  icon={<Calendar className="h-4 w-4 text-amber-600" />}
                  label="Contract End Date"
                  value={formatDate(member.contractEndDate)}
                />
              )}
            </div>
          </section>

          {/* PRC License */}
          {member.prcLicense && (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Professional License
              </p>
              <div className="rounded-2xl border border-health-100 bg-health-50 px-4 py-3">
                <p className="text-sm text-slate-500">PRC License Number</p>
                <p className="mt-0.5 font-bold text-slate-900">{member.prcLicense}</p>
              </div>
            </section>
          )}

          {/* Emergency contact */}
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              Emergency Contact
            </p>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-semibold text-slate-900">{member.emergencyContact || "—"}</p>
              <p className="text-sm text-slate-500">{member.emergencyRelation || "—"}</p>
            </div>
          </section>

          {/* Notes */}
          {member.notes && (
            <section>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Notes
              </p>
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                {member.notes}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-50 px-3 py-2">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StaffDirectory() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("All Positions");
  const [filterStatus, setFilterStatus] = useState<"All" | StaffStatus>("All");
  const [filterStation, setFilterStation] = useState("All Stations");
  const [showFilters, setShowFilters] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  // Modals / panels
  const [detailMember, setDetailMember] = useState<StaffMember | null>(null);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<StaffMember | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<StaffMember | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const active = useMemo(() => staffList.filter((s) => !s.archived), [staffList]);
  const archived = useMemo(() => staffList.filter((s) => s.archived), [staffList]);

  const filtered = useMemo(() => {
    const list = showArchived ? archived : active;
    const q = search.toLowerCase();
    return list.filter((s) => {
      const matchesSearch =
        !q ||
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
        s.position.toLowerCase().includes(q);
      const matchesPos = filterPosition === "All Positions" || s.position === filterPosition;
      const matchesStatus = filterStatus === "All" || s.status === filterStatus;
      const matchesStation = filterStation === "All Stations" || s.station === filterStation;
      return matchesSearch && matchesPos && matchesStatus && matchesStation;
    });
  }, [staffList, search, filterPosition, filterStatus, filterStation, showArchived, active, archived]);

  const hasActiveFilter =
    filterPosition !== "All Positions" ||
    filterStatus !== "All" ||
    filterStation !== "All Stations";

  function clearFilters() {
    setFilterPosition("All Positions");
    setFilterStatus("All");
    setFilterStation("All Stations");
  }

  const handleAdd = useCallback((data: FormData) => {
    const id = uid();
    const newMember: StaffMember = {
      id,
      firstName: data.firstName,
      lastName: data.lastName,
      position: data.position,
      department: DEPARTMENTS[data.position] ?? "Health Administration",
      station: data.station,
      contact: data.contact,
      email: data.email,
      address: data.address,
      emergencyContact: data.emergencyContact,
      emergencyRelation: data.emergencyRelation,
      prcLicense: data.prcLicense || undefined,
      startDate: data.startDate,
      contractEndDate: data.contractEndDate || undefined,
      employmentType: data.employmentType,
      status: data.status,
      notes: data.notes,
      initials: makeInitials(data.firstName, data.lastName),
      avatarColor: pickColor(id),
      archived: false,
    };
    setStaffList((prev) => [newMember, ...prev]);
    setShowAddForm(false);
  }, []);

  const handleEdit = useCallback(
    (data: FormData) => {
      if (!editTarget) return;
      setStaffList((prev) =>
        prev.map((s) =>
          s.id !== editTarget.id
            ? s
            : {
                ...s,
                ...data,
                department: DEPARTMENTS[data.position] ?? s.department,
                prcLicense: data.prcLicense || undefined,
                contractEndDate: data.contractEndDate || undefined,
                initials: makeInitials(data.firstName, data.lastName),
              }
        )
      );
      setEditTarget(null);
      setDetailMember(null);
    },
    [editTarget]
  );

  const handleArchive = useCallback(() => {
    if (!archiveTarget) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === archiveTarget.id ? { ...s, archived: true } : s))
    );
    setArchiveTarget(null);
    setDetailMember(null);
  }, [archiveTarget]);

  const handleRestore = useCallback(() => {
    if (!restoreTarget) return;
    setStaffList((prev) =>
      prev.map((s) => (s.id === restoreTarget.id ? { ...s, archived: false } : s))
    );
    setRestoreTarget(null);
    setDetailMember(null);
  }, [restoreTarget]);

  const handleImport = useCallback((rows: StaffMember[]) => {
    setStaffList((prev) => [...rows, ...prev]);
    setShowImport(false);
  }, []);

  function toFormData(m: StaffMember): FormData {
    return {
      firstName: m.firstName,
      lastName: m.lastName,
      position: m.position,
      station: m.station,
      contact: m.contact,
      email: m.email,
      address: m.address,
      emergencyContact: m.emergencyContact,
      emergencyRelation: m.emergencyRelation,
      prcLicense: m.prcLicense ?? "",
      startDate: m.startDate,
      contractEndDate: m.contractEndDate ?? "",
      employmentType: m.employmentType,
      status: m.status,
      notes: m.notes,
    };
  }

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* ── Toolbar ── */}
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Staff Directory</h3>
              <p className="text-sm text-slate-500">
                {active.length} active · {archived.length} archived
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowImport(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                Import CSV
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-health-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-health-700"
              >
                <UserPlus className="h-4 w-4" />
                Add Staff
              </button>
            </div>
          </div>

          {/* Active / Archived toggle */}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                !showArchived ? "bg-health-600 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Active ({active.length})
            </button>
            <button
              type="button"
              onClick={() => setShowArchived(true)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                showArchived ? "bg-amber-500 text-white" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Archived ({archived.length})
            </button>
          </div>

          {/* Search + filter toggle */}
          <div className="mt-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-800 placeholder-slate-400 focus:border-health-400 focus:outline-none focus:ring-2 focus:ring-health-100"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                showFilters || hasActiveFilter
                  ? "border-health-300 bg-health-50 text-health-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilter && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-health-600 text-[10px] font-bold text-white">
                  !
                </span>
              )}
            </button>
          </div>

          {/* Filter row */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              <select
                value={filterPosition}
                onChange={(e) => setFilterPosition(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-sm text-slate-700 focus:border-health-400 focus:outline-none"
              >
                {POSITIONS_FILTER.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-sm text-slate-700 focus:border-health-400 focus:outline-none"
              >
                {STATUSES_FILTER.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select
                value={filterStation}
                onChange={(e) => setFilterStation(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-7 text-sm text-slate-700 focus:border-health-400 focus:outline-none"
              >
                {STATIONS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">Staff Member</th>
                <th className="px-5 py-3">Position / Role</th>
                <th className="px-5 py-3">Station</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No staff members match your search or filter.
                  </td>
                </tr>
              ) : (
                filtered.map((member) => (
                  <tr
                    key={member.id}
                    className={`cursor-pointer transition-colors hover:bg-health-50/60 ${member.archived ? "opacity-60" : ""}`}
                    onClick={() => setDetailMember(member)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${member.avatarColor}`}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-slate-400">{member.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">{member.position}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{member.station}</td>
                    <td className="px-5 py-4 text-sm text-slate-600">{member.contact}</td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        member.employmentType === "Contractual/Seasonal"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-health-100 text-health-700"
                      }`}>
                        {member.employmentType === "Contractual/Seasonal" ? "Contractual" : "Regular"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(member.status)}`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => setEditTarget(member)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-health-700"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {member.archived ? (
                          <button
                            type="button"
                            title="Restore"
                            onClick={() => setRestoreTarget(member)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-health-50 hover:text-health-700"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="Archive"
                            onClick={() => setArchiveTarget(member)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Archive className="h-4 w-4" />
                          </button>
                        )}
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAddForm && (
        <StaffFormModal
          initial={EMPTY_FORM}
          onSave={handleAdd}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editTarget && (
        <StaffFormModal
          initial={toFormData(editTarget)}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {archiveTarget && (
        <ArchiveModal
          member={archiveTarget}
          onConfirm={handleArchive}
          onClose={() => setArchiveTarget(null)}
        />
      )}

      {restoreTarget && (
        <RestoreModal
          member={restoreTarget}
          onConfirm={handleRestore}
          onClose={() => setRestoreTarget(null)}
        />
      )}

      {showImport && (
        <ImportModal
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {detailMember && (
        <StaffDetailPanel
          member={detailMember}
          onClose={() => setDetailMember(null)}
          onEdit={(m) => { setDetailMember(null); setEditTarget(m); }}
          onArchive={(m) => { setDetailMember(null); setArchiveTarget(m); }}
          onRestore={(m) => { setDetailMember(null); setRestoreTarget(m); }}
        />
      )}
    </>
  );
}
