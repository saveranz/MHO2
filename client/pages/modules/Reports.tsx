import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Calendar,
  Download,
  FileText,
  Activity,
  Home,
  LogOut,
  Filter,
  Eye,
  UserCheck,
  Pill,
  Clock,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

// Mock data for reports
const mockReportData = {
  overview: {
    totalPatients: 1247,
    patientsChange: 12.5,
    totalRevenue: 125840,
    revenueChange: 8.3,
    totalAppointments: 342,
    appointmentsChange: -3.2,
    medicineStock: 892,
    stockChange: 5.1,
  },
  monthlyPatients: [
    { month: "Jan", count: 98 },
    { month: "Feb", count: 112 },
    { month: "Mar", count: 105 },
    { month: "Apr", count: 128 },
    { month: "May", count: 134 },
    { month: "Jun", count: 142 },
  ],
  monthlyRevenue: [
    { month: "Jan", amount: 18500 },
    { month: "Feb", amount: 21300 },
    { month: "Mar", amount: 19800 },
    { month: "Apr", amount: 23400 },
    { month: "May", amount: 25200 },
    { month: "Jun", amount: 17640 },
  ],
  medicineUsage: [
    { name: "Paracetamol", usage: 245, stock: 500 },
    { name: "Amoxicillin", usage: 156, stock: 300 },
    { name: "Ibuprofen", usage: 189, stock: 400 },
    { name: "Aspirin", usage: 134, stock: 350 },
    { name: "Metformin", usage: 98, stock: 250 },
  ],
  userActivity: [
    { user: "Dr. Michael Brown", role: "Doctor", actions: 234, lastActive: "2 hours ago" },
    { user: "Dr. Sarah Smith", role: "Doctor", actions: 198, lastActive: "1 hour ago" },
    { user: "Admin User", role: "Admin", actions: 156, lastActive: "30 minutes ago" },
    { user: "Nurse Johnson", role: "Nurse", actions: 289, lastActive: "5 minutes ago" },
    { user: "Receptionist Mary", role: "Staff", actions: 312, lastActive: "10 minutes ago" },
  ],
  recentReports: [
    {
      id: "RPT001",
      title: "Monthly Patient Summary",
      type: "Patient Report",
      date: "2024-02-01",
      generatedBy: "Admin User",
    },
    {
      id: "RPT002",
      title: "Revenue Analysis Q1",
      type: "Financial Report",
      date: "2024-01-31",
      generatedBy: "Admin User",
    },
    {
      id: "RPT003",
      title: "Medicine Inventory",
      type: "Inventory Report",
      date: "2024-02-15",
      generatedBy: "Pharmacist",
    },
  ],
};

type SidebarView = "dashboard" | "patients" | "financial" | "inventory" | "activity" | "appointments" | "custom";

export default function Reports() {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn, loading } = useAuth();
  const [currentView, setCurrentView] = useState<SidebarView>("dashboard");
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Auth protection
  useEffect(() => {
    if (loading) return; // Wait for auth to load
    if (!isLoggedIn) navigate("/login");
  }, [isLoggedIn, loading, navigate]);

  // Show nothing while loading
  if (loading || !isLoggedIn) return null;

  const maxPatientCount = Math.max(...mockReportData.monthlyPatients.map(m => m.count));
  const maxRevenue = Math.max(...mockReportData.monthlyRevenue.map(m => m.amount));

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of key metrics and performance indicators</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </Button>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-blue-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-10 h-10 text-blue-600" />
                    <Badge
                      variant="outline"
                      className={`${
                        mockReportData.overview.patientsChange > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } flex items-center gap-1`}
                    >
                      {mockReportData.overview.patientsChange > 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(mockReportData.overview.patientsChange)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{mockReportData.overview.totalPatients}</p>
                  <p className="text-xs text-gray-500 mt-1">Registered in system</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-10 h-10 text-green-600" />
                    <Badge
                      variant="outline"
                      className={`${
                        mockReportData.overview.revenueChange > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } flex items-center gap-1`}
                    >
                      {mockReportData.overview.revenueChange > 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(mockReportData.overview.revenueChange)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${mockReportData.overview.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Current period</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Calendar className="w-10 h-10 text-purple-600" />
                    <Badge
                      variant="outline"
                      className={`${
                        mockReportData.overview.appointmentsChange > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } flex items-center gap-1`}
                    >
                      {mockReportData.overview.appointmentsChange > 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(mockReportData.overview.appointmentsChange)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Appointments</p>
                  <p className="text-3xl font-bold text-gray-900">{mockReportData.overview.totalAppointments}</p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-10 h-10 text-orange-600" />
                    <Badge
                      variant="outline"
                      className={`${
                        mockReportData.overview.stockChange > 0
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } flex items-center gap-1`}
                    >
                      {mockReportData.overview.stockChange > 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(mockReportData.overview.stockChange)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Medicine Stock</p>
                  <p className="text-3xl font-bold text-gray-900">{mockReportData.overview.medicineStock}</p>
                  <p className="text-xs text-gray-500 mt-1">Items in inventory</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Trends */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Patient Visit Trends</span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockReportData.monthlyPatients.map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{data.month}</span>
                          <span className="text-gray-900 font-bold">{data.count} patients</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                            style={{ width: `${(data.count / maxPatientCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Trends */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Revenue Analysis</span>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockReportData.monthlyRevenue.map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{data.month}</span>
                          <span className="text-gray-900 font-bold">${data.amount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all"
                            style={{ width: `${(data.amount / maxRevenue) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Recent Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-health-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-health-100 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-health-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.title}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{new Date(report.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>By {report.generatedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "patients":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Patient Reports</h1>
                <p className="text-gray-600 mt-1">Detailed insights on patient visits and demographics</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date From</Label>
                    <Input type="date" className="mt-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label>Date To</Label>
                    <Input type="date" className="mt-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-health-500 to-health-600">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">New Patients</p>
                    <p className="text-4xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Total Visits</p>
                    <p className="text-4xl font-bold text-purple-600">789</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Average per Day</p>
                    <p className="text-4xl font-bold text-green-600">26</p>
                    <p className="text-xs text-gray-500 mt-2">Patients</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Patient Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Regular", count: 542, color: "blue" },
                    { category: "Walk-in", count: 298, color: "green" },
                    { category: "Senior Citizen", count: 187, color: "purple" },
                    { category: "Pregnant", count: 134, color: "pink" },
                    { category: "Child", count: 86, color: "orange" },
                  ].map((item) => (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.category}</span>
                        <span className="font-bold">{item.count} patients</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-${item.color}-500 h-3 rounded-full`}
                          style={{ width: `${(item.count / 1247) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "financial":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
                <p className="text-gray-600 mt-1">Revenue analysis and financial insights</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Date From</Label>
                    <Input type="date" className="mt-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label>Date To</Label>
                    <Input type="date" className="mt-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-health-500 to-health-600">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <DollarSign className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">$125,840</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Average per Day</p>
                  <p className="text-3xl font-bold text-gray-900">$4,195</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200">
                <CardContent className="pt-6">
                  <Calendar className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Consultations</p>
                  <p className="text-3xl font-bold text-gray-900">$78,500</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-orange-200">
                <CardContent className="pt-6">
                  <Pill className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Pharmacy Sales</p>
                  <p className="text-3xl font-bold text-gray-900">$47,340</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Monthly Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.monthlyRevenue.map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{data.month} 2024</span>
                        <span className="text-gray-900 font-bold">${data.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full transition-all"
                          style={{ width: `${(data.amount / maxRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Reports</h1>
                <p className="text-gray-600 mt-1">Medicine stock levels and usage analytics</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2 border-orange-200">
                <CardContent className="pt-6">
                  <Package className="w-8 h-8 text-orange-600 mb-2" />
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">892</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="pt-6">
                  <Activity className="w-8 h-8 text-red-600 mb-2" />
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">23</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Monthly Usage</p>
                  <p className="text-3xl font-bold text-gray-900">822</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Top Medicine Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReportData.medicineUsage.map((med) => (
                    <div key={med.name} className="p-4 border-2 border-gray-200 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{med.name}</h3>
                        <Badge variant="outline" className="bg-orange-100 text-orange-700">
                          {med.stock} in stock
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Usage this month</span>
                          <span className="font-bold text-gray-900">{med.usage} units</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full"
                            style={{ width: `${(med.usage / med.stock) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "activity":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Activity Reports</h1>
                <p className="text-gray-600 mt-1">Track actions and activity by system users</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Filter Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Date From</Label>
                    <Input type="date" className="mt-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label>Date To</Label>
                    <Input type="date" className="mt-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                  <div>
                    <Label>User Role</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="nurse">Nurse</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button className="w-full bg-gradient-to-r from-health-500 to-health-600">
                      <Filter className="w-4 h-4 mr-2" />
                      Apply Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>User Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportData.userActivity.map((activity) => (
                    <div
                      key={activity.user}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-health-300 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-health-500 to-health-600 rounded-full flex items-center justify-center text-white font-bold">
                          {activity.user.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{activity.user}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <Badge variant="outline" className="bg-health-100 text-health-700">
                              {activity.role}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.lastActive}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{activity.actions}</p>
                        <p className="text-xs text-gray-500">Total actions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appointment Reports</h1>
                <p className="text-gray-600 mt-1">Analysis of appointment trends and statistics</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  PDF
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-3xl font-bold text-gray-900">234</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <UserCheck className="w-8 h-8 text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-900">198</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="pt-6">
                  <Activity className="w-8 h-8 text-red-600 mb-2" />
                  <p className="text-sm text-gray-600">Cancelled</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-200">
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">No-Shows</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Appointment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: "Completed", count: 198, percentage: 84.6, color: "green" },
                    { status: "Scheduled", count: 234, percentage: 100, color: "blue" },
                    { status: "Cancelled", count: 12, percentage: 5.1, color: "red" },
                    { status: "No-Shows", count: 8, percentage: 3.4, color: "orange" },
                  ].map((item) => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.status}</span>
                        <span className="font-bold">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`bg-${item.color}-500 h-3 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "custom":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Custom Report Generator</h1>
              <p className="text-gray-600 mt-1">Create customized reports with specific parameters</p>
            </div>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Report Title</Label>
                  <Input placeholder="Enter report title" className="mt-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Date From</Label>
                    <Input type="date" className="mt-2" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                  </div>
                  <div>
                    <Label>Date To</Label>
                    <Input type="date" className="mt-2" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient Report</SelectItem>
                      <SelectItem value="financial">Financial Report</SelectItem>
                      <SelectItem value="inventory">Inventory Report</SelectItem>
                      <SelectItem value="appointments">Appointments Report</SelectItem>
                      <SelectItem value="activity">User Activity Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Include Charts</Label>
                  <Select>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select charts to include" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Charts</SelectItem>
                      <SelectItem value="trends">Trends Only</SelectItem>
                      <SelectItem value="distribution">Distribution Only</SelectItem>
                      <SelectItem value="none">No Charts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <Button className="flex-1 bg-gradient-to-r from-health-500 to-health-600">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Activity className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">Automated Monthly Summary</h3>
                    <p className="text-sm text-amber-800 mb-3">
                      System automatically generates comprehensive monthly performance summaries on the 1st of each month,
                      including patient statistics, revenue analysis, inventory status, and user activity logs.
                    </p>
                    <Button variant="outline" size="sm" className="border-amber-300 bg-white hover:bg-amber-100">
                      View Auto-Generated Reports
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-white to-health-100 gradient-mesh flex flex-col">
      {/* Top Navigation Bar */}
      <header className="glass border-b border-health-200/50 shadow-lg backdrop-blur-xl sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all group">
              <div className="w-10 h-10 bg-gradient-to-br from-health-500 to-health-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">MediHub</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={() => setShowLogoutDialog(true)} className="hover:bg-health-50">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex w-full">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 border-r border-health-200 bg-white/50 backdrop-blur-sm p-4">
            <div className="sticky top-20">
              <nav className="space-y-2">
                <button
                  onClick={() => setCurrentView("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "dashboard"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Dashboard</span>
                </button>

                <button
                  onClick={() => setCurrentView("patients")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "patients"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Patient Reports</span>
                </button>

                <button
                  onClick={() => setCurrentView("financial")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "financial"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">Financial Reports</span>
                </button>

                <button
                  onClick={() => setCurrentView("inventory")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "inventory"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Inventory Reports</span>
                </button>

                <button
                  onClick={() => setCurrentView("appointments")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "appointments"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Appointments</span>
                </button>

                <button
                  onClick={() => setCurrentView("activity")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "activity"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span className="font-medium">User Activity</span>
                </button>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button
                    onClick={() => setCurrentView("custom")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentView === "custom"
                        ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                        : "hover:bg-health-50 text-gray-700"
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Custom Report</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to sign in again to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => { 
                logout(); 
                navigate("/"); 
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
