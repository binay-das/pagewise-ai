import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { 
  Github, 
  ArrowRight,
  Star,
  Heart,
  FileText
} from "lucide-react";

function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function Footer() {
  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-neutral-900 dark:bg-white rounded-xl flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">P</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-neutral-900 dark:text-white">PageWise AI</span>
                  <Badge variant="secondary" className="ml-2 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200">Give it a try!</Badge>
                </div>
              </div>
              
              <p className="text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                Transform your static PDFs into intelligent conversation partners with advanced RAG technology. 
                Experience the future of document interaction today.
              </p>

              <div className="flex items-center space-x-2 mb-8">
                <FileText className="w-5 h-5 text-neutral-900 dark:text-white" />
                <span className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Chat with your PDF
                </span>
              </div>
              
              <div className="mb-4">
                <Link 
                  href="https://github.com/binay-das/pagewise-ai" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 group shadow-sm hover:shadow-md"
                >
                  <Github className="w-4 h-4" />
                  <span>Star on GitHub</span>
                  <Star className="w-4 h-4 group-hover:text-yellow-500 transition-colors duration-200" />
                </Link>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3">
                  👨‍💻 Developer
                </h4>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Built with passion by a full-stack developer specializing in AI-powered applications.
                </p>
                <Link 
                  href="https://github.com/binay-das" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 font-medium transition-colors duration-200 group"
                >
                  <Github className="w-5 h-5" />
                  <span>@binay-das</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                Quick Links
              </h4>
              <div className="space-y-4">
                <Link 
                  href="https://github.com/binay-das/pagewise-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
                
                <Link 
                  href="https://github.com/binay-das/pagewise-ai/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs">🐛</span>
                  <span>Report Issues</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>

                <Link 
                  href="https://github.com/binay-das"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200 group"
                >
                  <span className="w-4 h-4 flex items-center justify-center text-xs">👤</span>
                  <span>Developer Profile</span>
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              © {getCurrentYear()} PageWise AI. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>by</span>
              <Link 
                href="https://github.com/binay-das" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-neutral-900 dark:text-white hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors duration-200 font-medium group"
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
