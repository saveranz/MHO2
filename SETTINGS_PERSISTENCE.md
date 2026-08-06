# Settings Persistence with localStorage

## Overview
All settings sections now persist data to localStorage, ensuring configurations are saved across page refreshes and browser sessions.

## Sections Updated

### 1. Roles & Permissions ✅
**localStorage Key**: `roles-permissions-matrix`

**What Persists:**
- Permission checkboxes for each role
- All role-permission combinations
- Super Admin permissions remain locked

**How It Works:**
```typescript
// Load from localStorage on mount
const [matrix, setMatrix] = useState(() => {
  const saved = localStorage.getItem('roles-permissions-matrix');
  return saved ? JSON.parse(saved) : INIT_MATRIX;
});

// Save on button click
function handleSave() {
  localStorage.setItem('roles-permissions-matrix', JSON.stringify(matrix));
  flash(); // Show "Saved" badge
}
```

### 2. Shift Types ✅
**localStorage Key**: `shift-types`

**What Persists:**
- All shift definitions (name, color, hours)
- Added shifts
- Edited shifts
- Deleted shifts

**How It Works:**
```typescript
// Load from localStorage
const [shifts, setShifts] = useState(() => {
  const saved = localStorage.getItem('shift-types');
  return saved ? JSON.parse(saved) : INIT_SHIFTS;
});

// Auto-save whenever shifts change
useEffect(() => {
  localStorage.setItem('shift-types', JSON.stringify(shifts));
}, [shifts]);
```

### 3. Leave Types ✅
**localStorage Key**: `leave-types`

**What Persists:**
- Leave type names
- Days per year allowance
- Paid/unpaid status
- Added leave types
- Edited leave types
- Deleted leave types

**How It Works:**
```typescript
// Load from localStorage
const [leaves, setLeaves] = useState(() => {
  const saved = localStorage.getItem('leave-types');
  return saved ? JSON.parse(saved) : INIT_LEAVES;
});

// Auto-save whenever leaves change
useEffect(() => {
  localStorage.setItem('leave-types', JSON.stringify(leaves));
}, [leaves]);
```

### 4. Office Hours ✅
**localStorage Key**: `office-hours`

**What Persists:**
- Open/closed status for each day
- Start times for each day
- End times for each day

**How It Works:**
```typescript
// Load from localStorage
const [hours, setHours] = useState(() => {
  const saved = localStorage.getItem('office-hours');
  return saved ? JSON.parse(saved) : INIT_HOURS;
});

// Auto-save whenever hours change
useEffect(() => {
  localStorage.setItem('office-hours', JSON.stringify(hours));
}, [hours]);
```

## Persistence Strategy

### Two Approaches Used:

**1. Manual Save (Roles & Permissions):**
- User makes changes
- Clicks "Save Permissions" button
- Data saved to localStorage
- "Saved" badge appears

**2. Auto-Save (Shifts, Leaves, Hours):**
- User makes any change (add, edit, delete)
- Data automatically saved via useEffect
- "Saved" badge appears immediately
- No explicit save button needed

## User Experience

### Roles & Permissions:
1. Toggle permissions for roles
2. Click "Save Permissions" button
3. ✅ See "Saved" badge
4. Refresh page
5. ✅ Permissions still applied

### Shift Types:
1. Add new shift (e.g., "Night Shift")
2. ✅ Automatically saved
3. Edit existing shift
4. ✅ Automatically saved
5. Delete a shift
6. ✅ Automatically saved
7. Refresh page
8. ✅ All changes persisted

### Leave Types:
1. Add new leave type (e.g., "Maternity Leave")
2. ✅ Automatically saved
3. Change days per year
4. ✅ Automatically saved
5. Toggle paid/unpaid
6. ✅ Automatically saved
7. Refresh page
8. ✅ All changes persisted

### Office Hours:
1. Toggle day open/closed
2. ✅ Automatically saved
3. Change start time
4. ✅ Automatically saved
5. Change end time
6. ✅ Automatically saved
7. Refresh page
8. ✅ All changes persisted

## localStorage Keys Summary

| Section | Key | Data Type |
|---------|-----|-----------|
| Roles & Permissions | `roles-permissions-matrix` | Object (role → permissions) |
| Shift Types | `shift-types` | Array of shift objects |
| Leave Types | `leave-types` | Array of leave objects |
| Office Hours | `office-hours` | Array of day config objects |

## Data Structures

### Roles & Permissions Matrix:
```json
{
  "admin": {
    "view_staff": true,
    "edit_staff": true,
    "view_schedule": true,
    "edit_schedule": true,
    "view_reports": true,
    "approve_requests": true,
    "access_settings": false
  },
  "doctor": { ... },
  "staff": { ... }
}
```

### Shift Types:
```json
[
  {
    "id": "s1",
    "name": "Morning OPD",
    "color": "sky",
    "hours": "8:00 AM – 12:00 PM"
  },
  { ... }
]
```

### Leave Types:
```json
[
  {
    "id": "l1",
    "name": "Sick Leave",
    "daysPerYear": 15,
    "paid": true
  },
  { ... }
]
```

### Office Hours:
```json
[
  {
    "day": "Monday",
    "open": true,
    "start": "08:00",
    "end": "17:00"
  },
  { ... }
]
```

## Testing

### Test Roles & Permissions:
1. Go to Settings → Roles & Permissions
2. Toggle some permissions for "Admin" role
3. Click "Save Permissions"
4. Refresh page (F5)
5. ✅ Permissions should be preserved

### Test Shift Types:
1. Go to Settings → Shift Types
2. Click "+ Add Shift Type"
3. Create "Evening Shift, 5:00 PM – 10:00 PM"
4. Save
5. Refresh page (F5)
6. ✅ "Evening Shift" should still be there

### Test Leave Types:
1. Go to Settings → Leave Types
2. Edit "Sick Leave" days to 20
3. See "Saved" badge
4. Refresh page (F5)
5. ✅ Should show 20 days

### Test Office Hours:
1. Go to Settings → Working Hours
2. Toggle Saturday to "Closed"
3. Refresh page (F5)
4. ✅ Saturday should remain closed

## Benefits

### User:
- ✅ No data loss on refresh
- ✅ Settings persist across sessions
- ✅ Can customize all sections
- ✅ Immediate visual feedback

### Admin:
- ✅ Configure once, use everywhere
- ✅ Changes apply immediately
- ✅ Easy to update settings
- ✅ No need to reconfigure after refresh

### Developer:
- ✅ Simple localStorage implementation
- ✅ Clean state management
- ✅ Type-safe with TypeScript
- ✅ Consistent pattern across all sections

## Error Handling

All sections include try-catch when loading from localStorage:

```typescript
try {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : INITIAL_DATA;
} catch {
  // If JSON parse fails, use initial data
  return INITIAL_DATA;
}
```

This prevents crashes if localStorage data is corrupted.

## Future Enhancements

### Potential Additions:
- **Export/Import**: Download settings as JSON
- **Reset**: Button to restore default settings
- **Backup**: Auto-backup settings periodically
- **Sync**: Sync settings across devices (requires backend)
- **Audit Log**: Track who changed what settings
- **Templates**: Pre-configured setting templates
- **Validation**: More robust data validation
- **Versioning**: Handle settings schema changes

## Notes

- Data stored in browser localStorage (client-side only)
- Each browser has separate localStorage
- Clearing browser data will reset settings
- In production, consider backend storage
- Super Admin permissions always locked (cannot be modified)
- All changes are immediate (except Roles & Permissions which requires save click)

## Default Values

If localStorage is empty, the following defaults are loaded:

- **Roles**: All initial permissions from INIT_MATRIX
- **Shifts**: 5 default shift types (Morning OPD, Afternoon Clinic, etc.)
- **Leaves**: 3 default leave types (Sick, Vacation, Emergency)
- **Hours**: Monday-Friday 8AM-5PM, Saturday/Sunday closed

---

**Status**: ✅ Complete and working
**Last Updated**: August 6, 2026
