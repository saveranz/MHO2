import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-50 via-white to-health-100 gradient-mesh">
      <Header />
      
      <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          {/* 404 Illustration */}
          <div className="relative mb-12">
            <div className="text-[200px] md:text-[250px] font-bold text-gradient leading-none">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 bg-health-200 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse-slow"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Oops! The page you're looking for doesn't exist or has been moved.
              <br />
              Let's get you back on track.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                to="/"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-health-500 to-health-600 text-white font-semibold rounded-xl hover:shadow-glow transition-all hover:scale-105"
              >
                <Home className="w-5 h-5" />
                Back to Home
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/#features"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-health-200 text-health-700 font-semibold rounded-xl hover:bg-health-50 hover:border-health-300 transition-all hover:shadow-lg"
              >
                <Search className="w-5 h-5" />
                Explore Features
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-10 w-20 h-20 bg-health-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute bottom-1/4 right-10 w-24 h-24 bg-health-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
