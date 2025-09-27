import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Upload,
  Brain,
  MessageCircle,
  Shield,
  Zap,
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  Cpu,
  Database,
  Lock,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Powered by Advanced RAG Technology
                </span>
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Go Beyond
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  just that Page.
                </span>
              </h1>

              <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                Transform your dense PDFs into
                <span className="text-purple-600 dark:text-purple-400 font-semibold">
                  {" "}
                  intelligent conversation partners
                </span>
                . Every answer is grounded in fact with
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {" "}
                  Retrieval-Augmented Generation
                </span>
                .
              </p>

              <Link href={"/documents"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 group rounded-full mb-12"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <div className="flex items-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>100+ users</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>1000+ documents processed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>4.9/5 rating</span>
                </div>
              </div>
            </div>

            <Image
              src="/image.png"
              width={990}
              height={800}
              alt="Demo"
              className="rounded"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                1000+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Pages Analyzed
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                99.99%
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Accuracy Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                2.1s
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Avg Response
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                150+
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                Languages
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                From Static
              </span>
              <span className="text-gray-900 dark:text-white"> to Dynamic</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our advanced RAG pipeline transforms any PDF into an intelligent
              conversation partner in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-green-500 via-purple-500 to-blue-500"></div>

            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 hover:shadow-2xl transition-all duration-300 group relative">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Secure Upload
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Drag, drop or select any PDF document. Enterprise-grade
                  encryption ensures your data stays private and secure
                  throughout the entire process.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <Lock className="w-4 h-4" />
                  <span>End-to-end encrypted</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 hover:shadow-2xl transition-all duration-300 group relative">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-4 bg-purple-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  AI Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our advanced{" "}
                  <span className="text-purple-600 dark:text-purple-400 font-semibold">
                    RAG system
                  </span>{" "}
                  creates a comprehensive vector index, making every sentence,
                  table, and diagram instantly searchable and contextually
                  aware.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                  <Cpu className="w-4 h-4" />
                  <span>Advanced ML models</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group relative">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-3 left-4 bg-blue-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Intelligent Chat
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Ask questions naturally and receive precise, citation-backed
                  answers in seconds. Every response includes source references
                  for complete transparency.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Natural conversation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Unlock the </span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Knowledge Within
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: "Citation-Backed Answers",
                description:
                  "Every response includes precise source references from your document, ensuring complete accuracy and transparency.",
                color: "from-blue-500 to-purple-600",
                textColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Get comprehensive summaries and answers in under 3 seconds, powered by optimized vector search technology.",
                color: "from-yellow-500 to-orange-600",
                textColor: "text-orange-600 dark:text-orange-400",
              },
              {
                icon: Database,
                title: "Smart Data Extraction",
                description:
                  "Extract specific figures, dates, names, and data points with natural language queries.",
                color: "from-green-500 to-emerald-600",
                textColor: "text-green-600 dark:text-green-400",
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description:
                  "Enterprise level security ensure your documents stay private.",
                color: "from-red-500 to-pink-600",
                textColor: "text-red-600 dark:text-red-400",
              },
              {
                icon: Globe,
                title: "150+ Languages",
                description:
                  "Process documents in any language and get responses in your preferred language automatically.",
                color: "from-indigo-500 to-purple-600",
                textColor: "text-indigo-600 dark:text-indigo-400",
              },
              {
                icon: Smartphone,
                title: "Cross-Platform",
                description:
                  "Access your intelligent documents from any device - web, mobile, or through our comprehensive API.",
                color: "from-teal-500 to-cyan-600",
                textColor: "text-teal-600 dark:text-teal-400",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${feature.textColor}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Use Cases
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-gray-900 dark:text-white">Built for </span>
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Every Professional
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Students & Researchers",
                description:
                  "Transform textbooks, papers, and research documents into study partners",
                icon: "👨‍🎓",
                benefits: [
                  "Quick summaries",
                  "Citation extraction",
                  "Concept explanations",
                ],
              },
              {
                title: "Legal Professionals",
                description:
                  "Navigate contracts, cases, and legal documents with precision",
                icon: "⚖️",
                benefits: [
                  "Clause analysis",
                  "Risk identification",
                  "Precedent research",
                ],
              },
              {
                title: "Business Analysts",
                description:
                  "Extract insights from reports, presentations, and market research",
                icon: "📊",
                benefits: [
                  "Data extraction",
                  "Trend analysis",
                  "Executive summaries",
                ],
              },
              {
                title: "Healthcare Workers",
                description:
                  "Quickly access information from medical literature and guidelines",
                icon: "🏥",
                benefits: [
                  "Protocol lookup",
                  "Research findings",
                  "Guidelines compliance",
                ],
              },
            ].map((useCase, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4">{useCase.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {useCase.description}
                  </p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Ready to Transform
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Your Documents?
            </span>
          </h2>

          <p className="text-xl text-blue-100 mb-12 leading-relaxed max-w-2xl mx-auto">
            Join thousands of professionals who have revolutionized their
            document workflow. Start your free trial today and experience the
            future of document interaction.
          </p>

          <Link href={"/documents"}>
            <Button
              size="lg"
              className="bg-white text-purple-700 hover:bg-gray-100 font-semibold px-10 py-6 text-lg shadow-xl transition-all duration-300 group rounded-full"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Link>

          <div className="mt-12 text-center text-white text-sm">
            Trusted by leading organizations
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
