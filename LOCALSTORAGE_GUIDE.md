# localStorage Persistence Guide

## Overview
Your application now has full localStorage support! Data will persist even after page refresh.

## What's Already Persisted

### 1. User Authentication
- **Location**: `AuthContext.tsx`
- **Key**: `user`
- **Data**: User login information (email, name, role, organization)
- **Behavior**: Automatically saves on login, loads on page refresh, clears on logout

## How to Add More Persistent Data

### Using the `useLocalStorage` Hook

We've created a custom hook that makes localStorage easy to use. It works just like `useState` but automatically saves to localStorage!

#### Basic Example

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

function MyComponent() {
  // Just like useState, but persists!
  const [tasks, setTasks] = useLocalStorage('my-tasks', []);
  
  const addTask = (task: string) => {
    setTasks([...tasks, task]);
    // Automatically saved to localStorage!
  };
  
  return (
    <div>
      {tasks.map(task => <div key={task}>{task}</div>)}
      <button onClick={() => addTask('New Task')}>Add Task</button>
    </div>
  );
}
```

### Real-World Examples

#### 1. Persist Dashboard Preferences

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

function Dashboard() {
  const [activeTab, setActiveTab] = useLocalStorage('dashboard-tab', 'overview');
  const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar-open', true);
  
  // These values will persist across page refreshes!
}
```

#### 2. Persist Form Data

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

function PatientForm() {
  const [formData, setFormData] = useLocalStorage('patient-form-draft', {
    name: '',
    age: '',
    symptoms: ''
  });
  
  // Form data is automatically saved as user types
  // If they refresh, their progress is preserved!
}
```

#### 3. Persist Staff Directory Data

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
  
  const addStaff = (member: StaffMember) => {
    setStaff([...staff, member]);
  };
  
  const removeStaff = (id: string) => {
    setStaff(staff.filter(s => s.id !== id));
  };
  
  // All changes persist automatically!
}
```

#### 4. Persist Appointments

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  doctor: string;
}

function Appointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  
  const bookAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };
  
  // Appointments persist even after refresh!
}
```

#### 5. Persist User Settings

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

function Settings() {
  const [settings, setSettings] = useLocalStorage<Settings>('user-settings', {
    theme: 'light',
    notifications: true,
    language: 'en'
  });
  
  const updateTheme = (theme: 'light' | 'dark') => {
    setSettings({ ...settings, theme });
  };
  
  // Settings persist across sessions!
}
```

## Utility Functions

### Remove Specific Data

```typescript
import { removeFromLocalStorage } from "@/hooks/use-local-storage";

// Remove specific item
removeFromLocalStorage('my-tasks');
```

### Clear All Data

```typescript
import { clearLocalStorage } from "@/hooks/use-local-storage";

// Clear everything (use with caution!)
clearLocalStorage();
```

## Best Practices

### 1. Use Descriptive Keys
```typescript
// Good
const [tasks, setTasks] = useLocalStorage('admin-dashboard-tasks', []);

// Bad
const [tasks, setTasks] = useLocalStorage('t', []);
```

### 2. Provide Default Values
```typescript
// Always provide a sensible default
const [settings, setSettings] = useLocalStorage('settings', {
  theme: 'light',
  notifications: true
});
```

### 3. Type Your Data
```typescript
interface Task {
  id: string;
  title: string;
  completed: boolean;
}

// Use TypeScript for type safety
const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
```

### 4. Handle Large Data
```typescript
// For large datasets, consider:
// - Pagination
// - Only storing IDs and fetching details from server
// - Using IndexedDB for very large data

// Good for small-medium data
const [recentPatients, setRecentPatients] = useLocalStorage('recent-patients', []);

// For large data, store references only
const [patientIds, setPatientIds] = useLocalStorage('patient-ids', []);
```

## Storage Limits

- **localStorage limit**: ~5-10MB per domain
- **Best for**: User preferences, small datasets, form drafts, UI state
- **Not ideal for**: Large files, images, videos, massive datasets

## Cross-Tab Synchronization

The hook automatically syncs data across browser tabs! If you change data in one tab, other tabs will update automatically.

```typescript
// Tab 1: User updates settings
setSettings({ theme: 'dark' });

// Tab 2: Automatically receives the update!
// No manual refresh needed
```

## Migration from Current Code

If you want to add persistence to existing state:

### Before
```typescript
const [activeTab, setActiveTab] = useState('overview');
```

### After
```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";

const [activeTab, setActiveTab] = useLocalStorage('dashboard-active-tab', 'overview');
```

That's it! Just replace `useState` with `useLocalStorage` and add a unique key.

## Testing localStorage

Open your browser's DevTools:
1. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
2. Click **Local Storage** → Your domain
3. See all stored data in real-time
4. Manually edit or delete items for testing

## Example: Complete Feature with Persistence

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

function NotesApp() {
  const [notes, setNotes] = useLocalStorage<Note[]>('medical-notes', []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const addNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString()
    };
    
    setNotes([...notes, newNote]);
    setTitle('');
    setContent('');
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  return (
    <div>
      <h2>Medical Notes (Persisted)</h2>
      
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      
      <textarea 
        value={content} 
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      
      <button onClick={addNote}>Add Note</button>
      
      <div>
        {notes.map(note => (
          <div key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>{new Date(note.createdAt).toLocaleString()}</small>
            <button onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Summary

✅ **User authentication** already persists  
✅ **Custom hook** ready to use (`useLocalStorage`)  
✅ **Works like useState** but with automatic persistence  
✅ **Cross-tab sync** included  
✅ **TypeScript support** built-in  
✅ **Easy migration** from existing useState code  

Just import the hook and start using it! Your data will automatically persist across page refreshes.
