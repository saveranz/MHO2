# localStorage Usage Examples

## Quick Start

There are two ways to use localStorage in your components:

### Method 1: Using the `useLocalStorage` Hook (Recommended for React State)

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

function MyComponent() {
  const [data, setData] = useLocalStorage('my-key', defaultValue);
  // Use it exactly like useState!
}
```

### Method 2: Using the Storage Utilities (For Direct Access)

```typescript
import { staffStorage, appointmentStorage, taskStorage } from "@/lib/persistentStorage";

// Direct CRUD operations
const staff = staffStorage.getAll();
staffStorage.add(newMember);
staffStorage.update(id, updates);
staffStorage.remove(id);
```

---

## Real Examples

### Example 1: Persist Dashboard Tab Selection

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

function Dashboard() {
  // Tab selection persists across page refreshes
  const [activeTab, setActiveTab] = useLocalStorage('dashboard-tab', 'overview');
  
  return (
    <div>
      <button onClick={() => setActiveTab('overview')}>Overview</button>
      <button onClick={() => setActiveTab('staff')}>Staff</button>
      <button onClick={() => setActiveTab('reports')}>Reports</button>
      
      {activeTab === 'overview' && <OverviewContent />}
      {activeTab === 'staff' && <StaffContent />}
      {activeTab === 'reports' && <ReportsContent />}
    </div>
  );
}
```

### Example 2: Staff Directory with Persistence

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
}

function StaffDirectory() {
  const [staff, setStaff] = useLocalStorage<StaffMember[]>('staff-directory', []);
  const [searchTerm, setSearchTerm] = useLocalStorage('staff-search', '');
  
  const addStaff = (member: StaffMember) => {
    setStaff([...staff, member]);
  };
  
  const removeStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };
  
  const updateStaff = (id: string, updates: Partial<StaffMember>) => {
    setStaff(staff.map(s => s.id === id ? { ...s, ...updates } : s));
  };
  
  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search staff..."
      />
      
      <button onClick={() => addStaff({
        id: Date.now().toString(),
        name: 'New Staff',
        role: 'Nurse',
        email: 'staff@example.com'
      })}>
        Add Staff
      </button>
      
      {filteredStaff.map(member => (
        <div key={member.id}>
          <h3>{member.name}</h3>
          <p>{member.role} - {member.email}</p>
          <button onClick={() => removeStaff(member.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Appointment Booking with Auto-Save

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
}

function AppointmentBooking() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  
  // Form draft that auto-saves as user types
  const [draft, setDraft] = useLocalStorage('appointment-draft', {
    patientName: '',
    date: '',
    time: '',
    doctor: ''
  });
  
  const bookAppointment = () => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...draft
    };
    
    setAppointments([...appointments, newAppointment]);
    
    // Clear draft after booking
    setDraft({
      patientName: '',
      date: '',
      time: '',
      doctor: ''
    });
  };
  
  return (
    <div>
      <h2>Book Appointment</h2>
      
      <input
        value={draft.patientName}
        onChange={(e) => setDraft({ ...draft, patientName: e.target.value })}
        placeholder="Patient Name"
      />
      
      <input
        type="date"
        value={draft.date}
        onChange={(e) => setDraft({ ...draft, date: e.target.value })}
      />
      
      <input
        type="time"
        value={draft.time}
        onChange={(e) => setDraft({ ...draft, time: e.target.value })}
      />
      
      <select
        value={draft.doctor}
        onChange={(e) => setDraft({ ...draft, doctor: e.target.value })}
      >
        <option value="">Select Doctor</option>
        <option value="Dr. Santos">Dr. Santos</option>
        <option value="Dr. Cruz">Dr. Cruz</option>
      </select>
      
      <button onClick={bookAppointment}>Book Appointment</button>
      
      <h3>Upcoming Appointments</h3>
      {appointments.map(apt => (
        <div key={apt.id}>
          <p>{apt.patientName} - {apt.date} at {apt.time}</p>
          <p>Doctor: {apt.doctor}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Task Management

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
}

function TaskManager() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useLocalStorage<'all' | 'pending' | 'completed'>('task-filter', 'all');
  
  const addTask = (title: string, priority: Task['priority']) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      priority,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setTasks([...tasks, newTask]);
  };
  
  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };
  
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };
  
  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });
  
  return (
    <div>
      <h2>Task Manager</h2>
      
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>
      
      <button onClick={() => addTask('New Task', 'medium')}>Add Task</button>
      
      {filteredTasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <span>Priority: {task.priority}</span>
          <span>Status: {task.status}</span>
          
          <button onClick={() => updateTaskStatus(task.id, 'in-progress')}>
            Start
          </button>
          <button onClick={() => updateTaskStatus(task.id, 'completed')}>
            Complete
          </button>
          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Example 5: User Settings/Preferences

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  dateFormat: string;
}

function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<Settings>('user-settings', {
    theme: 'light',
    notifications: true,
    language: 'en',
    dateFormat: 'MM/DD/YYYY'
  });
  
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings({ ...settings, [key]: value });
  };
  
  return (
    <div>
      <h2>Settings</h2>
      
      <div>
        <label>Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', e.target.value as 'light' | 'dark')}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={(e) => updateSetting('notifications', e.target.checked)}
          />
          Enable Notifications
        </label>
      </div>
      
      <div>
        <label>Language</label>
        <select
          value={settings.language}
          onChange={(e) => updateSetting('language', e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      
      <div>
        <label>Date Format</label>
        <select
          value={settings.dateFormat}
          onChange={(e) => updateSetting('dateFormat', e.target.value)}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );
}
```

### Example 6: Using Storage Utilities Directly

```typescript
import { staffStorage, appointmentStorage, taskStorage } from "@/lib/persistentStorage";

function AdminPanel() {
  // Get all staff
  const allStaff = staffStorage.getAll();
  
  // Add new staff member
  const addNewStaff = () => {
    staffStorage.add({
      id: Date.now().toString(),
      name: 'John Doe',
      role: 'Nurse',
      email: 'john@example.com',
      status: 'active'
    });
  };
  
  // Update staff member
  const updateStaffRole = (id: string, newRole: string) => {
    staffStorage.update(id, { role: newRole });
  };
  
  // Remove staff member
  const removeStaff = (id: string) => {
    staffStorage.remove(id);
  };
  
  // Get appointments for today
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointmentStorage.getByDate(today);
  
  // Get high priority tasks
  const highPriorityTasks = taskStorage.getByPriority('high');
  
  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Total Staff: {allStaff.length}</p>
      <p>Today's Appointments: {todayAppointments.length}</p>
      <p>High Priority Tasks: {highPriorityTasks.length}</p>
    </div>
  );
}
```

### Example 7: Form Auto-Save

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useEffect } from "react";

function PatientForm() {
  const [formData, setFormData] = useLocalStorage('patient-form-draft', {
    name: '',
    age: '',
    gender: '',
    symptoms: '',
    medicalHistory: ''
  });
  
  // Auto-save indicator
  const [lastSaved, setLastSaved] = useLocalStorage('form-last-saved', '');
  
  useEffect(() => {
    // Update last saved time whenever form changes
    setLastSaved(new Date().toLocaleTimeString());
  }, [formData]);
  
  const handleSubmit = () => {
    // Submit form data
    console.log('Submitting:', formData);
    
    // Clear draft after successful submission
    setFormData({
      name: '',
      age: '',
      gender: '',
      symptoms: '',
      medicalHistory: ''
    });
  };
  
  return (
    <div>
      <h2>Patient Form</h2>
      {lastSaved && <p className="text-sm text-gray-500">Last saved: {lastSaved}</p>}
      
      <input
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Patient Name"
      />
      
      <input
        value={formData.age}
        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        placeholder="Age"
      />
      
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      
      <textarea
        value={formData.symptoms}
        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
        placeholder="Symptoms"
      />
      
      <textarea
        value={formData.medicalHistory}
        onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
        placeholder="Medical History"
      />
      
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

## Tips

1. **Always provide default values** to avoid undefined errors
2. **Use descriptive keys** like 'staff-directory' instead of 'data'
3. **Type your data** with TypeScript interfaces
4. **Clear drafts** after successful submissions
5. **Show save indicators** for better UX
6. **Handle errors** gracefully with try-catch

## Testing

Open DevTools → Application → Local Storage to see your data in real-time!
