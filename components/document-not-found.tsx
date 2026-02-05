"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DocumentNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-65px)] w-full bg-background relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 max-w-md w-full px-6 text-center"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="mx-auto w-24 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-3xl flex items-center justify-center mb-8 shadow-sm border border-neutral-200 dark:border-neutral-800"
                >
                    <SearchX className="w-10 h-10 text-neutral-500 dark:text-neutral-400" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl font-bold tracking-tight text-foreground mb-3"
                >
                    Document Not Found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-muted-foreground mb-8 text-base leading-relaxed"
                >
                    The document you are looking for might have been deleted, moved, or you may not have permission to view it.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Link href="/documents">
                        <Button
                            size="lg"
                            className="group px-8 rounded-full bg-foreground text-background hover:opacity-90 transition-all font-medium"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Documents
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
