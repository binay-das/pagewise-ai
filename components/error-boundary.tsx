"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("Error caught by boundary:", error, errorInfo);

        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render(): ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-[400px] p-6">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-foreground">
                                Something went wrong
                            </h2>
                            <p className="text-muted-foreground">
                                {this.state.error?.message || "An unexpected error occurred"}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={this.handleReset}
                                variant="default"
                                className="gap-2"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                Try Again
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="gap-2"
                            >
                                <Link href="/">
                                    <Home className="w-4 h-4" />
                                    Go Home
                                </Link>
                            </Button>
                        </div>

                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                    Error Details (Dev Only)
                                </summary>
                                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-48">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
