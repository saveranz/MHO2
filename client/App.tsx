import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import SuperAdmin from "./pages/modules/SuperAdmin";
import StaffDashboard from "./pages/modules/StaffDashboard";
import PatientManagement from "./pages/modules/PatientManagement";
import Appointments from "./pages/modules/Appointments";
import Pharmacy from "./pages/modules/Pharmacy";
import Billing from "./pages/modules/Billing";
import Reports from "./pages/modules/Reports";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<SuperAdmin />} />
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/patients" element={<PatientManagement />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
