import Header from "@/components/Header";
import {
  Activity,
  Users,
  Stethoscope,
  Heart,
  UserCheck,
  PlayCircle,
  Syringe,
  Baby,
  Microscope,
  Pill,
  Award,
  Clock,
  Shield,
  BookOpen,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section - Home */}
      <section id="home" className="relative overflow-hidden pt-12 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Get Ready For Your Best Ever Medical Experience
                </h1>
                <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                  MHO Bongabong provides comprehensive healthcare services to the community of Bongabong, Oriental Mindoro. We are committed to delivering quality medical care with compassion and excellence.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <button className="flex items-center gap-3 text-gray-700 font-semibold hover:text-cyan-600 transition-colors">
                  <div className="w-14 h-14 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                    <PlayCircle className="w-7 h-7 text-white fill-white" />
                  </div>
                  See How We Work
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-8">
                <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center">
                    <Users className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">93%</p>
                    <p className="text-sm text-gray-600 font-medium">Satisfaction Rate</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 shadow-lg border border-gray-100">
                  <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center">
                    <UserCheck className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-gray-900">21+</p>
                    <p className="text-sm text-gray-600 font-medium">Expert Doctors</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Doctor Image with Cards */}
            <div className="relative lg:pl-8">
              {/* Large cyan circle background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-cyan-300 to-cyan-400 rounded-full opacity-90"></div>
              
              <div className="relative z-10">
                {/* Emergency Contact Card - Top Left */}
                <div className="absolute top-16 -left-4 lg:left-0 bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 z-20 border border-gray-100">
                  <div className="w-14 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">24 Hrs Emergency</p>
                    <p className="font-bold text-gray-900 text-lg">+63 912 345 6789</p>
                  </div>
                </div>

                {/* Patients Love It Card - Bottom Left */}
                <div className="absolute bottom-24 left-0 bg-white rounded-2xl shadow-2xl px-6 py-5 z-20 border border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-3">1.5K+ Patients Love It</p>
                  <div className="flex -space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 border-4 border-white"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-4 border-white"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-4 border-white"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-4 border-white"></div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 border-4 border-white"></div>
                    <div className="w-12 h-12 rounded-full bg-red-500 border-4 border-white flex items-center justify-center">
                      <span className="text-white text-lg font-bold">+</span>
                    </div>
                  </div>
                </div>

                {/* 24 Hrs Doctor Card - Bottom Right */}
                <div className="absolute bottom-8 right-0 lg:right-8 bg-white rounded-2xl shadow-2xl px-6 py-5 z-20 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <UserCheck className="w-7 h-7 text-cyan-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">24 Hrs Service</p>
                      <p className="text-sm text-gray-600">Providing Top Medical Care</p>
                    </div>
                  </div>
                </div>

                {/* Doctor Image Placeholder - Center */}
                <div className="relative mx-auto w-full max-w-md aspect-square flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Stethoscope className="w-64 h-64 text-white/40" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-gradient-to-br from-cyan-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About MHO Bongabong</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Committed to delivering accessible, quality healthcare to every barangay in Bongabong, Oriental Mindoro
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide comprehensive, accessible, and quality primary healthcare services to all residents of Bongabong, promoting health and wellness through community-based programs and professional medical care.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A healthier Bongabong community where every resident has access to quality healthcare services, leading to improved quality of life and reduced health disparities across all barangays.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Compassion, Excellence, Integrity, and Community. We believe in treating every patient with dignity and respect while maintaining the highest standards of medical care.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center bg-white rounded-2xl p-6 shadow-md">
              <p className="text-5xl font-bold text-cyan-600 mb-2">20</p>
              <p className="text-gray-600 font-medium">Barangays Served</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-md">
              <p className="text-5xl font-bold text-cyan-600 mb-2">15K+</p>
              <p className="text-gray-600 font-medium">Patients Annually</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-md">
              <p className="text-5xl font-bold text-cyan-600 mb-2">21+</p>
              <p className="text-gray-600 font-medium">Healthcare Staff</p>
            </div>
            <div className="text-center bg-white rounded-2xl p-6 shadow-md">
              <p className="text-5xl font-bold text-cyan-600 mb-2">24/7</p>
              <p className="text-gray-600 font-medium">Emergency Services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services designed to meet the needs of our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <Stethoscope className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">OPD Consultation</h3>
              <p className="text-gray-600 leading-relaxed">
                General health consultations, medical examinations, and treatment for common illnesses.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                <Baby className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Maternal Care</h3>
              <p className="text-gray-600 leading-relaxed">
                Prenatal check-ups, safe delivery services, postnatal care, and family planning.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <Syringe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Immunization</h3>
              <p className="text-gray-600 leading-relaxed">
                Complete vaccination programs for infants, children, and adults following DOH guidelines.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Pill className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">TB-DOTS</h3>
              <p className="text-gray-600 leading-relaxed">
                Tuberculosis detection, treatment, and monitoring using the DOTS strategy.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Microscope className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Laboratory</h3>
              <p className="text-gray-600 leading-relaxed">
                Basic diagnostic tests including blood tests, urinalysis, and other laboratory services.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pharmacy</h3>
              <p className="text-gray-600 leading-relaxed">
                Essential medicines and medical supplies available at affordable prices.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Health Education</h3>
              <p className="text-gray-600 leading-relaxed">
                Community seminars on nutrition, disease prevention, and healthy lifestyle.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency Care</h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 emergency response and first aid services for urgent medical needs.
              </p>
            </div>
          </div>

          {/* All In One Treatment Section - Moved Inside Services */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mt-24">
            {/* Left - Images */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-3xl overflow-hidden shadow-xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <Activity className="w-20 h-20 text-cyan-600/30" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4 pt-12">
                  <div className="aspect-[3/4] bg-gradient-to-br from-cyan-200 to-cyan-300 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-24 h-24 text-white/40" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  All In One Treatment And Health Solution
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  MHO Bongabong offers a full range of primary healthcare services including consultations, maternal and child health, immunization programs, and health education for our community.
                </p>
              </div>

              <div className="border-l-4 border-cyan-400 pl-6 py-3 bg-cyan-50/50 rounded-r-xl">
                <p className="text-gray-700 leading-relaxed">
                  Our dedicated team of healthcare professionals is committed to promoting wellness and providing accessible medical services to all barangays in Bongabong. We work closely with the community to ensure everyone receives the care they need.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-6 pt-4">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Stethoscope className="w-9 h-9 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Health Consultations</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Professional medical consultations and health assessments for all ages</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Heart className="w-9 h-9 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Maternal & Child Care</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Comprehensive prenatal, postnatal, and pediatric healthcare services</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                    <Users className="w-9 h-9 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg">Community Programs</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Immunization drives, health education, and barangay outreach programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Medical Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dedicated healthcare professionals committed to serving the Bongabong community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Doctor 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-full aspect-square bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl mb-6 flex items-center justify-center">
                <Stethoscope className="w-24 h-24 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Maria Santos</h3>
              <p className="text-cyan-600 font-medium mb-3">Municipal Health Officer</p>
              <p className="text-sm text-gray-600 mb-4">General Practice & Public Health</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>15+ years experience</span>
              </div>
            </div>

            {/* Doctor 2 */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-full aspect-square bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6 flex items-center justify-center">
                <Heart className="w-24 h-24 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Carlo Buenaventura</h3>
              <p className="text-cyan-600 font-medium mb-3">Medical Officer</p>
              <p className="text-sm text-gray-600 mb-4">Family Medicine</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>10+ years experience</span>
              </div>
            </div>

            {/* Nurse 1 */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-full aspect-square bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl mb-6 flex items-center justify-center">
                <UserCheck className="w-24 h-24 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Elena Cruz</h3>
              <p className="text-cyan-600 font-medium mb-3">Senior Nurse</p>
              <p className="text-sm text-gray-600 mb-4">Patient Care & Emergency Response</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>12+ years experience</span>
              </div>
            </div>

            {/* Midwife */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mb-6 flex items-center justify-center">
                <Baby className="w-24 h-24 text-white/40" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ana Lopez</h3>
              <p className="text-cyan-600 font-medium mb-3">Chief Midwife</p>
              <p className="text-sm text-gray-600 mb-4">Maternal & Child Health</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>8+ years experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Health News & Updates</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Stay informed with the latest health programs, announcements, and wellness tips
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <Syringe className="w-20 h-20 text-white/40" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>January 15, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  2025 Immunization Schedule Released
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  MHO Bongabong announces the immunization schedule for all barangays. Free vaccines available for all children and eligible adults.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all">
                  Read More <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Blog Post 2 */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Heart className="w-20 h-20 text-white/40" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>January 10, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Maternal Health Program Expansion
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  New prenatal care services now available in remote barangays. Free consultations and nutritional support for expecting mothers.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all">
                  Read More <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Blog Post 3 */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <TrendingUp className="w-20 h-20 text-white/40" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>January 5, 2025</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  Health Statistics: 2024 Year in Review
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  MHO Bongabong reports significant improvements in community health indicators. See the progress we've made together.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:gap-3 transition-all">
                  Read More <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">MHO Bongabong</span>
              </div>
              <p className="text-gray-400 text-sm">
                Providing quality healthcare services to our community.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Doctors</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Bongabong, Oriental Mindoro</li>
                <li>+63 912 345 6789</li>
                <li>info@mhobongabong.gov.ph</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 MHO Bongabong. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
