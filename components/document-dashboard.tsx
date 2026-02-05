"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/chat/chat-interface";
import {
    ArrowLeft,
    FileText,
    MessageSquare,
    FileCheck,
    Brain,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SummaryTab } from "@/components/summary-tab";

interface DocumentDashboardProps {
    document: {
        id: string;
        title: string | null;
        originalFileUrl: string;
        summaryText: string | null;
        extractedText: string | null;
        fileName: string | null;
    };
}

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
};

export function DocumentDashboard({ document }: DocumentDashboardProps) {
    const [isPdfVisible, setIsPdfVisible] = useState(true);
    const [summary, setSummary] = useState(document.summaryText || "");
    const [isGenerating, setIsGenerating] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isMessagesLoaded, setIsMessagesLoaded] = useState(false);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`/api/chat/${document.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setMessages(data.messages || []);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
            } finally {
                setIsMessagesLoaded(true);
            }
        };

        if (!isMessagesLoaded) {
            fetchChatHistory();
        }
    }, [document.id, isMessagesLoaded]);

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-card">
                <div className="flex items-center space-x-4">
                    <Link
                        href="documents"
                        className="inline-flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-primary/10 rounded-md">
                            <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-sm truncate max-w-[300px]">
                            {document.title || document.fileName || "Untitled Document"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsPdfVisible(!isPdfVisible)}
                        className="text-muted-foreground hover:text-foreground gap-2"
                    >
                        {isPdfVisible ? (
                            <>
                                <PanelLeftClose className="w-4 h-4" />
                                <span className="text-xs hidden lg:inline">Hide PDF</span>
                                <span className="text-xs lg:hidden">Switch to Assistant</span>
                            </>
                        ) : (
                            <>
                                <PanelLeftOpen className="w-4 h-4" />
                                <span className="text-xs hidden lg:inline">Show PDF</span>
                                <span className="text-xs lg:hidden">Switch to PDF</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden relative flex-col lg:flex-row">

                <div
                    className={`
                        flex flex-col bg-muted/20 transition-all duration-300 ease-in-out overflow-hidden
                        ${isPdfVisible
                            ? "h-full w-full lg:h-full lg:w-1/2 opacity-100"
                            : "h-0 w-full lg:h-full lg:w-0 opacity-0 lg:border-none"
                        }
                        border-b lg:border-b-0 lg:border-r
                    `}
                >
                    <iframe
                        src={`/api/pdf?url=${encodeURIComponent(document.originalFileUrl)}#zoom=page-fit`}
                        className="flex-1 w-full border-0"
                        title={document.title ?? "PDF Document"}
                    />
                </div>

                <div
                    className={`
                        flex flex-col transition-all duration-300 ease-in-out overflow-hidden
                        ${isPdfVisible
                            ? "h-0 w-full lg:h-full lg:w-1/2"
                            : "h-full w-full lg:h-full lg:w-full"
                        }
                    `}
                >
                    <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full overflow-hidden">
                        <TabsList className="grid w-full grid-cols-3 rounded-none bg-muted/50 p-1 h-12 flex-shrink-0 border-b">
                            <TabsTrigger
                                value="chat"
                                className="flex items-center justify-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm py-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span className="hidden sm:inline">Chat</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="summary"
                                className="flex items-center justify-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm py-2"
                            >
                                <Brain className="w-4 h-4" />
                                <span className="hidden sm:inline">Summary</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="extracted"
                                className="flex items-center justify-center space-x-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all text-sm py-2"
                            >
                                <FileCheck className="w-4 h-4" />
                                <span className="hidden sm:inline">Extracted Info</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="chat"
                            className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden relative"
                        >
                            <div className="absolute inset-0 flex flex-col">
                                <ChatInterface documentId={document.id} messages={messages} setMessages={setMessages} />
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="summary"
                            className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
                        >
                            <SummaryTab
                                documentId={document.id}
                                initialSummary={document.summaryText}
                                extractedText={document.extractedText}
                                summary={summary}
                                setSummary={setSummary}
                                isGenerating={isGenerating}
                                setIsGenerating={setIsGenerating}
                            />
                        </TabsContent>

                        <TabsContent
                            value="extracted"
                            className="flex-1 p-0 m-0 data-[state=inactive]:hidden overflow-hidden"
                        >
                            <div className="h-full flex flex-col overflow-y-auto">
                                <div className="p-4">
                                    <div className="bg-muted/30 rounded-lg p-4 border font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                        {document.extractedText}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
