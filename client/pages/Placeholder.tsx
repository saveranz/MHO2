import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { ArrowLeft, Lightbulb } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function Placeholder({ title, description, icon }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-health-50 to-white">
      <Header />

      <div className="container mx-auto px-4 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-health-600 hover:text-health-700 font-medium mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-br from-health-100 to-health-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-health-600">
              {icon || <Lightbulb className="w-10 h-10" />}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-health-900">
            {title}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            {description}
          </p>

          <div className="bg-health-50 border-2 border-health-200 rounded-lg p-8 mt-8">
            <h3 className="font-semibold text-health-900 mb-2">Ready to build this module?</h3>
            <p className="text-gray-600 mb-4">
              Continue chatting with the assistant to fill in this page with the full implementation.
            </p>
            <button className="px-6 py-2 bg-health-500 text-white font-medium rounded-lg hover:bg-health-600 transition-colors">
              Request Implementation
            </button>
          </div>

          <div className="mt-12 p-8 border border-health-200 rounded-lg bg-white">
            <h3 className="font-semibold text-health-900 mb-4">Typical Features for This Module:</h3>
            <ul className="text-left space-y-2 text-gray-600 max-w-md mx-auto">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-health-500 rounded-full flex-shrink-0"></div>
                <span>Dashboard and analytics</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-health-500 rounded-full flex-shrink-0"></div>
                <span>Data management and search</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-health-500 rounded-full flex-shrink-0"></div>
                <span>Reports and exports</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-health-500 rounded-full flex-shrink-0"></div>
                <span>User access controls</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
