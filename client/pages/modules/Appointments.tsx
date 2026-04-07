import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Activity,
  Home,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  Loader,
  Settings,
  Bell,
  AlertCircle,
  Search,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";

// Mock data for patients
const mockPatients = [
  { id: "P001", name: "Sarah Johnson" },
  { id: "P002", name: "Michael Chen" },
  { id: "P003", name: "Emily Rodriguez" },
  { id: "P004", name: "James Wilson" },
  { id: "P005", name: "Isabella Martinez" },
];

// Mock data for appointments
const mockAppointments = [
  {
    id: "APT001",
    patientName: "Sarah Johnson",
    patientId: "P001",
    doctorName: "Dr. Michael Brown",
    doctorId: "D001",
    date: "2024-02-25",
    time: "09:00",
    duration: 30,
    status: "scheduled" as const,
    reason: "Annual Checkup",
    notes: "Regular health screening",
  },
  {
    id: "APT002",
    patientName: "Michael Chen",
    patientId: "P002",
    doctorName: "Dr. Sarah Smith",
    doctorId: "D002",
    date: "2024-02-25",
    time: "10:00",
    duration: 45,
    status: "ongoing" as const,
    reason: "Follow-up Consultation",
    notes: "Check blood pressure medication effectiveness",
  },
  {
    id: "APT003",
    patientName: "Emily Rodriguez",
    patientId: "P003",
    doctorName: "Dr. Michael Brown",
    doctorId: "D001",
    date: "2024-02-25",
    time: "11:00",
    duration: 30,
    status: "scheduled" as const,
    reason: "Prenatal Checkup",
    notes: "Second trimester visit",
  },
  {
    id: "APT004",
    patientName: "James Wilson",
    patientId: "P004",
    doctorName: "Dr. Sarah Smith",
    doctorId: "D002",
    date: "2024-02-25",
    time: "14:00",
    duration: 30,
    status: "completed" as const,
    reason: "Consultation",
    notes: "Initial consultation completed",
  },
  {
    id: "APT005",
    patientName: "Isabella Martinez",
    patientId: "P005",
    doctorName: "Dr. Michael Brown",
    doctorId: "D001",
    date: "2024-02-26",
    time: "09:30",
    duration: 30,
    status: "cancelled" as const,
    reason: "Vaccination",
    notes: "Patient requested cancellation",
  },
];

const mockDoctors = [
  {
    id: "D001",
    name: "Dr. Michael Brown",
    specialty: "General Practitioner",
    availability: {
      monday: { available: true, hours: "09:00-17:00" },
      tuesday: { available: true, hours: "09:00-17:00" },
      wednesday: { available: true, hours: "09:00-17:00" },
      thursday: { available: true, hours: "09:00-17:00" },
      friday: { available: true, hours: "09:00-15:00" },
      saturday: { available: false, hours: "" },
      sunday: { available: false, hours: "" },
    },
  },
  {
    id: "D002",
    name: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    availability: {
      monday: { available: true, hours: "10:00-18:00" },
      tuesday: { available: true, hours: "10:00-18:00" },
      wednesday: { available: true, hours: "10:00-18:00" },
      thursday: { available: false, hours: "" },
      friday: { available: true, hours: "10:00-16:00" },
      saturday: { available: true, hours: "09:00-13:00" },
      sunday: { available: false, hours: "" },
    },
  },
];

type AppointmentStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
type SidebarView = "calendar" | "queue" | "list" | "availability" | "bulk";
type CalendarView = "month" | "week";

export default function Appointments() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<SidebarView>("calendar");
  const [calendarView, setCalendarView] = useState<CalendarView>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<typeof mockAppointments[0] | null>(null);
  const [patientCode, setPatientCode] = useState("");
  const [patientName, setPatientName] = useState("");

  const handlePatientCodeChange = (code: string) => {
    setPatientCode(code.toUpperCase());
    const patient = mockPatients.find(p => p.id === code.toUpperCase());
    if (patient) {
      setPatientName(patient.name);
    } else {
      setPatientName("");
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-700 border-blue-300",
      ongoing: "bg-yellow-100 text-yellow-700 border-yellow-300",
      completed: "bg-green-100 text-green-700 border-green-300",
      cancelled: "bg-red-100 text-red-700 border-red-300",
    };
    return styles[status];
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
      case "scheduled":
        return <CalendarIcon className="w-3 h-3" />;
      case "ongoing":
        return <Loader className="w-3 h-3 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-3 h-3" />;
      case "cancelled":
        return <XCircle className="w-3 h-3" />;
    }
  };

  const filteredAppointments = mockAppointments.filter((apt) => {
    if (selectedDoctor !== "all" && apt.doctorId !== selectedDoctor) return false;
    return true;
  });

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const renderContent = () => {
    switch (currentView) {
      case "calendar":
        return (
          <div className="space-y-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Appointment Calendar</h1>
                <p className="text-gray-600 mt-1">Manage and view all scheduled appointments</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={calendarView} onValueChange={(v) => setCalendarView(v as CalendarView)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-health-500 to-health-600 hover:shadow-glow"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            </div>

            {/* Calendar Controls */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() - (calendarView === "week" ? 7 : 30));
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-bold">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newDate = new Date(selectedDate);
                        newDate.setDate(newDate.getDate() + (calendarView === "week" ? 7 : 30));
                        setSelectedDate(newDate);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Doctors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Doctors</SelectItem>
                      {mockDoctors.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Week View */}
                {calendarView === "week" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-8 gap-2">
                      <div className="text-sm font-semibold text-gray-600">Time</div>
                      {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                        const date = new Date(selectedDate);
                        date.setDate(date.getDate() - date.getDay() + offset);
                        return (
                          <div key={offset} className="text-center">
                            <div className="text-sm font-semibold text-gray-900">
                              {getDayName(date)}
                            </div>
                            <div className="text-xs text-gray-600">{date.getDate()}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Time slots */}
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {Array.from({ length: 10 }, (_, i) => i + 8).map((hour) => (
                        <div key={hour} className="grid grid-cols-8 gap-2">
                          <div className="text-sm text-gray-600 py-2">
                            {hour.toString().padStart(2, "0")}:00
                          </div>
                          {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                            const date = new Date(selectedDate);
                            date.setDate(date.getDate() - date.getDay() + offset);
                            const dateStr = formatDate(date);
                            const timeStr = `${hour.toString().padStart(2, "0")}:00`;
                            
                            const appointment = filteredAppointments.find(
                              (apt) => apt.date === dateStr && apt.time === timeStr
                            );

                            return (
                              <div
                                key={offset}
                                className="border-2 border-gray-200 rounded-lg p-2 min-h-[80px] hover:border-health-300 transition-all cursor-pointer"
                              >
                                {appointment && (
                                  <div
                                    className={`p-2 rounded-lg ${getStatusBadge(appointment.status)} border-2`}
                                  >
                                    <div className="flex items-center gap-1 mb-1">
                                      {getStatusIcon(appointment.status)}
                                      <span className="text-xs font-semibold truncate">
                                        {appointment.patientName}
                                      </span>
                                    </div>
                                    <p className="text-xs truncate">{appointment.reason}</p>
                                    <p className="text-xs truncate mt-1">{appointment.doctorName}</p>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Month View */}
                {calendarView === "month" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 35 }, (_, i) => {
                        const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                        const startOffset = firstDay.getDay();
                        const date = new Date(firstDay);
                        date.setDate(date.getDate() - startOffset + i);
                        
                        const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                        const dateStr = formatDate(date);
                        const dayAppointments = filteredAppointments.filter((apt) => apt.date === dateStr);

                        return (
                          <div
                            key={i}
                            className={`border-2 rounded-lg p-2 min-h-[100px] ${
                              isCurrentMonth ? "border-gray-200 hover:border-health-300" : "border-gray-100 bg-gray-50"
                            } transition-all cursor-pointer`}
                          >
                            <div className={`text-sm font-semibold ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                              {date.getDate()}
                            </div>
                            <div className="space-y-1 mt-2">
                              {dayAppointments.slice(0, 3).map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`text-xs p-1 rounded ${getStatusBadge(apt.status)} truncate`}
                                >
                                  {apt.time} - {apt.patientName}
                                </div>
                              ))}
                              {dayAppointments.length > 3 && (
                                <div className="text-xs text-gray-600">
                                  +{dayAppointments.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-2 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Scheduled</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {mockAppointments.filter((a) => a.status === "scheduled").length}
                      </p>
                    </div>
                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ongoing</p>
                      <p className="text-3xl font-bold text-yellow-600">
                        {mockAppointments.filter((a) => a.status === "ongoing").length}
                      </p>
                    </div>
                    <Loader className="w-8 h-8 text-yellow-600 animate-spin" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-3xl font-bold text-green-600">
                        {mockAppointments.filter((a) => a.status === "completed").length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Cancelled</p>
                      <p className="text-3xl font-bold text-red-600">
                        {mockAppointments.filter((a) => a.status === "cancelled").length}
                      </p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "queue":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Real-Time Queue Tracker</h1>
              <p className="text-gray-600 mt-1">Monitor ongoing and waiting patients per doctor</p>
            </div>

            {mockDoctors.map((doctor) => {
              const doctorAppointments = mockAppointments.filter((apt) => apt.doctorId === doctor.id);
              const ongoing = doctorAppointments.find((apt) => apt.status === "ongoing");
              const scheduled = doctorAppointments.filter((apt) => apt.status === "scheduled");

              return (
                <Card key={doctor.id} className="border-2">
                  <CardHeader className="bg-gradient-to-r from-health-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-4 border-health-200">
                          <AvatarFallback className="bg-gradient-to-br from-health-500 to-health-600 text-white text-xl font-bold">
                            {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-600">{doctor.specialty}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-health-100 text-health-700 border-health-300">
                        {scheduled.length} in queue
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Current Patient */}
                      {ongoing ? (
                        <div className="p-4 border-2 border-yellow-300 rounded-xl bg-yellow-50">
                          <div className="flex items-center gap-2 mb-2">
                            <Loader className="w-5 h-5 text-yellow-600 animate-spin" />
                            <span className="font-semibold text-yellow-900">Currently Seeing</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">{ongoing.patientName}</p>
                              <p className="text-sm text-gray-600">{ongoing.reason}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-gray-900">{ongoing.time}</p>
                              <p className="text-xs text-gray-600">{ongoing.duration} min</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-center">
                          <p className="text-gray-600">No ongoing appointment</p>
                        </div>
                      )}

                      {/* Queue */}
                      {scheduled.length > 0 ? (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-3">Waiting Queue</h4>
                          <div className="space-y-2">
                            {scheduled.map((apt, index) => (
                              <div
                                key={apt.id}
                                className="p-4 border-2 border-blue-200 rounded-xl bg-blue-50 hover:border-blue-400 transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{apt.patientName}</p>
                                      <p className="text-sm text-gray-600">{apt.reason}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
                                    <p className="text-xs text-gray-600">{apt.duration} min</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border-2 border-gray-200 rounded-xl bg-gray-50 text-center">
                          <p className="text-gray-600">No patients in queue</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );

      case "list":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Appointments</h1>
                <p className="text-gray-600 mt-1">Complete list of all appointments</p>
              </div>
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-to-r from-health-500 to-health-600 hover:shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {mockAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-health-300 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
                          <p className="text-xs text-gray-600">{apt.duration}m</p>
                        </div>
                        <div className="w-px h-12 bg-gray-300"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-gray-900">{apt.patientName}</h3>
                            <Badge variant="outline" className={`${getStatusBadge(apt.status)} flex items-center gap-1`}>
                              {getStatusIcon(apt.status)}
                              {apt.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{apt.reason}</span>
                            <span>•</span>
                            <span>{apt.doctorName}</span>
                            <span>•</span>
                            <span>{new Date(apt.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "availability":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Doctor Availability Settings</h1>
              <p className="text-gray-600 mt-1">Configure doctor schedules and availability hours</p>
            </div>

            {mockDoctors.map((doctor) => (
              <Card key={doctor.id} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-4 border-health-200">
                      <AvatarFallback className="bg-gradient-to-br from-health-500 to-health-600 text-white text-xl font-bold">
                        {doctor.name.split(" ").slice(1).map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(doctor.availability).map(([day, schedule]) => (
                      <div
                        key={day}
                        className={`p-4 border-2 rounded-xl ${
                          schedule.available ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold capitalize">{day}</span>
                          <Badge
                            variant="outline"
                            className={schedule.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                          >
                            {schedule.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                        {schedule.available && (
                          <p className="text-sm text-gray-600">{schedule.hours}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 bg-gradient-to-r from-health-500 to-health-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Availability
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "bulk":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Rescheduling</h1>
              <p className="text-gray-600 mt-1">Move multiple appointments when a doctor is unavailable</p>
            </div>

            <Card className="border-2 border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-2">How Bulk Rescheduling Works</h3>
                    <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                      <li>Select a doctor and date range</li>
                      <li>View all affected appointments</li>
                      <li>Choose new dates and times</li>
                      <li>Patients will be automatically notified</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Select Appointments to Reschedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Doctor</Label>
                      <Select>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDoctors.map((doc) => (
                            <SelectItem key={doc.id} value={doc.id}>
                              {doc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date Range</Label>
                      <Input type="date" className="mt-2" />
                    </div>
                  </div>

                  <div className="border-2 border-gray-200 rounded-xl p-4 space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Affected Appointments (3)</h4>
                    {mockAppointments.slice(0, 3).map((apt) => (
                      <div key={apt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" className="w-4 h-4" defaultChecked />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{apt.patientName}</p>
                          <p className="text-sm text-gray-600">
                            {apt.date} at {apt.time} - {apt.reason}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-health-500 to-health-600">
                    Proceed to Reschedule
                  </Button>
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
              <Button variant="outline" size="sm" onClick={logout} className="hover:bg-health-50">
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
                  onClick={() => setCurrentView("calendar")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "calendar"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Calendar View</span>
                </button>

                <button
                  onClick={() => setCurrentView("queue")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "queue"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Queue Tracker</span>
                </button>

                <button
                  onClick={() => setCurrentView("list")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "list"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">All Appointments</span>
                </button>

                <button
                  onClick={() => setCurrentView("availability")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "availability"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Availability</span>
                </button>

                <button
                  onClick={() => setCurrentView("bulk")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    currentView === "bulk"
                      ? "bg-gradient-to-r from-health-500 to-health-600 text-white shadow-lg"
                      : "hover:bg-health-50 text-gray-700"
                  }`}
                >
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Bulk Reschedule</span>
                </button>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">
                    Quick Actions
                  </p>
                  <button
                    onClick={() => setShowAddDialog(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-health-50 text-gray-700"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">New Appointment</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-health-50 text-gray-700"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Send Reminders</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
        </div>
      </div>

      {/* Add Appointment Dialog */}
      <Dialog 
        open={showAddDialog} 
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            // Reset form when dialog closes
            setPatientCode("");
            setPatientName("");
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>Fill in the details to create a new appointment</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label>Patient Code *</Label>
              <Input 
                placeholder="e.g., P001" 
                className="mt-2"
                value={patientCode}
                onChange={(e) => handlePatientCodeChange(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the patient code</p>
            </div>
            <div>
              <Label>Patient Name</Label>
              <Input 
                placeholder="Auto-filled from code" 
                className="mt-2 bg-gray-50"
                value={patientName}
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">
                {patientName ? "✓ Patient found" : "Enter valid patient code"}
              </p>
            </div>
            <div>
              <Label>Doctor</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" className="mt-2" />
            </div>
            <div>
              <Label>Time</Label>
              <Input type="time" className="mt-2" />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input type="number" placeholder="30" className="mt-2" />
            </div>
            <div>
              <Label>Status</Label>
              <Select>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Reason for Visit</Label>
              <Input placeholder="e.g., Annual Checkup" className="mt-2" />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea placeholder="Additional notes..." className="mt-2" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-health-500 to-health-600">
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
