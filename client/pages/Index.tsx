import Header from "@/components/Header";
import {
  Activity,
  Users,
  Stethoscope,
  Heart,
  UserCheck,
  PlayCircle,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20">
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

      {/* All In One Treatment Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
