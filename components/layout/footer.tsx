import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  ArrowRight,
  Star,
  Heart,
  FileText
} from "lucide-react";

// Function to get current year
function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">PageWise AI</span>
                  <Badge variant="secondary" className="ml-2 text-xs">Give it a try!</Badge>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Transform your static PDFs into intelligent conversation partners with advanced RAG technology. 
                Experience the future of document interaction today.
              </p>

              {/* Tagline */}
              <div className="flex items-center space-x-2 mb-8">
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Chat with your PDF
                </span>
              </div>
              
              <div className="mb-4">
                <Link 
                  href="https://github.com/binay-das/pagewise-ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 group shadow-lg hover:shadow-xl"
                >
                  <Github className="w-4 h-4" />
                  <span>Star on GitHub</span>
                  <Star className="w-4 h-4 group-hover:text-yellow-500 transition-colors duration-200" />
                </Link>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  👨‍💻 Developer
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Built with passion by a full-stack developer specializing in AI-powered applications.
                </p>
                <Link 
                  href="https://github.com/binay-das" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200 group"
                >
                  <Github className="w-5 h-5" />
                  <span>@binay-das</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Quick Links
              </h4>
              <div className="space-y-4">
                <Link 
                  href="https://github.com/binay-das/pagewise-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
                
                <Link 
                  href="https://github.com/binay-das/pagewise-ai/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs">🐛</span>
                  <span>Report Issues</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>

                <Link 
                  href="https://github.com/binay-das"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs">👤</span>
                  <span>Developer Profile</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {getCurrentYear()} PageWise AI. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <Link 
                href="https://github.com/binay-das" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium group"
              >
                <Github className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                <span>Binay Das</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
