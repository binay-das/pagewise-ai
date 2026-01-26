import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Upload,
  Brain,
  MessageCircle,
  Shield,
  Zap,
  Search,
  ArrowRight,
  Database,
  Globe,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ExtractionVisualization } from "@/components/home/extraction-visualization";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/documents");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
      <Header />

      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-neutral-100 dark:bg-neutral-900 rounded-full px-3 py-1 mb-8 border border-neutral-200 dark:border-neutral-800">
                <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium px-2">
                  Powered by Advanced RAG Technology
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-neutral-950 dark:text-white">
                Turn Documents into
                <br />
                <span className="text-neutral-500 dark:text-neutral-400">
                  Knowledge.
                </span>
              </h1>

              <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed max-w-lg">
                Stop searching, start asking. Upload your PDFs and chat with them instantly using our advanced RAG technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href={"/documents"}>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium px-8 py-6 rounded-full transition-all duration-200"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href={"#how-it-works"}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium px-8 py-6 rounded-full transition-all duration-200"
                  >
                    How it Works
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Operational 99.9%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <ExtractionVisualization />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Pages Analyzed", value: "10k+" },
              { label: "Accuracy", value: "99.9%" },
              { label: "Response Time", value: "<2s" },
              { label: "Supported Formats", value: "PDF" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-1 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900 dark:text-white tracking-tight">
              From Static to Dynamic
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
              Three simple steps to transform your documents into intelligent knowledge bases.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload",
                desc: "Securely upload your PDF documents.",
              },
              {
                icon: Brain,
                step: "02",
                title: "Analyze",
                desc: "AI processes and indexes your content.",
              },
              {
                icon: MessageCircle,
                step: "03",
                title: "Chat",
                desc: "Ask questions and get instant answers.",
              },
            ].map((item, index) => (
              <div key={index} className="group relative">
                <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-900 dark:text-white">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400 dark:text-neutral-600">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-neutral-900/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-neutral-900 dark:text-white tracking-tight">
              Unlock the Knowledge Within
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "Citation-Backed",
                description:
                  "Precise source references for every answer.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Comprehensive summaries in seconds.",
              },
              {
                icon: Database,
                title: "Smart Extraction",
                description:
                  "Extract data points with natural language.",
              },
              {
                icon: Shield,
                title: "Secure by Design",
                description:
                  "Enterprise level security for your data.",
              },
              {
                icon: Globe,
                title: "Global Support",
                description:
                  "Process documents in any language.",
              },
              {
                icon: Smartphone,
                title: "Anywhere Access",
                description:
                  "Access from web, mobile, or API.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-sm transition-all duration-200"
              >
                <feature.icon className="w-6 h-6 text-neutral-900 dark:text-white mb-4" />
                <h3 className="text-base font-bold mb-2 text-neutral-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900 dark:text-white tracking-tight">
            Ready to Transform Your Documents?
          </h2>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-10 leading-relaxed">
            Join thousands of professionals who have revolutionized their
            document workflow.
          </p>

          <Link href={"/documents"}>
            <Button
              size="lg"
              className="bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 font-medium px-10 py-6 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
