"use client";

import { SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { CopyButton } from "./copy-button";
import { ExportChatButton } from "./export-chat-button";
import { TypingIndicator } from "./typing-indicator";
import { logger } from "@/lib/logger";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

interface ChatInterfaceProps {
  documentId: string;
  documentTitle?: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatInterface = ({ documentId, documentTitle, messages, setMessages, isLoading, setIsLoading }: ChatInterfaceProps) => {
  const [input, setInput] = useState("");
  const [isWaitingForFirstToken, setIsWaitingForFirstToken] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setIsWaitingForFirstToken(true);



    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, messages: newMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error("API request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessageId = Date.now().toString() + "-ai";
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "" },
      ]);

      let fullResponse = "";
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (isFirstChunk) {
          setIsWaitingForFirstToken(false);
          isFirstChunk = false;
        }

        const chunk = decoder.decode(value);
        fullResponse += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }



    } catch (error) {
      const { maskId } = await import("@/lib/logger");
      logger.error({ error, documentId: maskId(documentId) }, "Error during chat");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: "Something went wrong. Try again!",
        },
      ]);

      setIsWaitingForFirstToken(false);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black transition-colors">
      {messages.length > 0 && (
        <div className="flex items-center justify-end px-3 py-2 border-b border-gray-200 dark:border-gray-800">
          <ExportChatButton
            messages={messages}
            documentTitle={documentTitle || "Untitled Document"}
          />
        </div>
      )}

      <div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">{messages.map((m) => (
        <div
          key={m.id}
          className={`group relative max-w-[75%] w-fit ${m.role === "user" ? "ml-auto" : ""
            }`}
        >
          <div
            className={`p-2 rounded-2xl shadow-sm transition-colors whitespace-pre-wrap text-sm ${m.role === "user"
              ? "bg-blue-500 text-white rounded-br-none"
              : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none"
              }`}
          >
            {m.role === "assistant" ? (
              <>
                {m.content && <MarkdownRenderer content={m.content} />}
              </>
            ) : (
              m.content
            )}

          </div>
          <div
            className={`absolute top-1 opacity-0 group-hover:opacity-100 transition-opacity ${m.role === "user" ? "-left-8" : "-right-8"
              }`}
          >
            <CopyButton text={m.content} />
          </div>
        </div>
      ))}

        {isWaitingForFirstToken && (
          <div className="group relative max-w-[75%] w-fit">
            <div className="p-2 rounded-2xl shadow-sm bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-none">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2 transition-colors"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder="Ask about the document..."
          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-3 py-2 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <SendHorizontal />
        </button>
      </form>
    </div>
  );
};
