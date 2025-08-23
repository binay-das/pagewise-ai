"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, X, SparklesIcon } from "lucide-react";
import { ModeToggle } from "../theme-toggle";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg shadow-gray-200/5 dark:shadow-gray-900/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">
                  <SparklesIcon />
                </span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-600/20 to-pink-600/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                PageWise AI
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Chat with your PDF
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-10">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#use-cases", label: "Use Cases" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold px-6 py-2.5 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 rounded-full">
              Get Started
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden w-10 h-10 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="px-4 py-6 space-y-4">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How It Works" },
                { href: "#use-cases", label: "Use Cases" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
