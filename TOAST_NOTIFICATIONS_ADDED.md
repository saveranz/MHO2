# Toast Notifications for Pending Approvals

## Overview
Added toast notifications to the Admin Portal's Pending Approvals section. When approving or rejecting requests, users now see confirmation messages.

## Changes Made

### 1. SuperAdminDashboard.tsx

**Imports Added:**
```typescript
import { useToast } from "@/hooks/use-toast";
```

**Hook Added:**
```typescript
const { toast } = useToast();
```

**Handler Functions:**
```typescript
const handleApprove = (request: string, requester: string) => {
  toast({
    title: "Request Approved",
    description: `${request} from ${requester} has been approved successfully.`,
    variant: "default",
  });
};

const handleReject = (request: string, requester: string) => {
  toast({
    title: "Request Rejected",
    description: `${request} from ${requester} has been rejected.`,
    variant: "destructive",
  });
};
```

**Buttons Updated:**
- Changed "Review" button to "Reject" with `onClick={() => handleReject(item.request, item.requester)}`
- Updated "Approve" button with `onClick={() => handleApprove(item.request, item.requester)}`

## Features

### Approve Action
- ✅ Shows success toast with green styling
- ✅ Displays request name and requester
- ✅ Title: "Request Approved"
- ✅ Message: "[Request] from [Requester] has been approved successfully."

### Reject Action
- ✅ Shows destructive toast with red styling
- ✅ Displays request name and requester
- ✅ Title: "Request Rejected"
- ✅ Message: "[Request] from [Requester] has been rejected."

## Toast Appearance

**Approve Toast (Success):**
```
┌─────────────────────────────────────┐
│ ✓ Request Approved                  │
│ Leave Request - Dr. Santos from     │
│ Maria Santos has been approved      │
│ successfully.                        │
└─────────────────────────────────────┘
```

**Reject Toast (Destructive):**
```
┌─────────────────────────────────────┐
│ ✕ Request Rejected                  │
│ Leave Request - Dr. Santos from     │
│ Maria Santos has been rejected.     │
└─────────────────────────────────────┘
```

## Testing

1. Go to Admin Dashboard
2. Click on "Pending Approvals" tab
3. Click "Approve" button → See green success toast
4. Click "Reject" button → See red destructive toast

## Toast System

The toast system uses:
- **Component**: `@/components/ui/toaster` (already included in App.tsx)
- **Hook**: `@/hooks/use-toast`
- **Auto-dismiss**: Toasts automatically disappear after a few seconds
- **Position**: Bottom-right corner of screen
- **Styling**: Matches the MHO Bongabong cyan theme

## Example Approval Items

Current mock data includes:
1. Leave Request - Dr. Santos
2. Equipment Purchase - Nurse Cruz
3. Schedule Change - Admin Reyes

Each will show personalized toast messages when approved or rejected.
