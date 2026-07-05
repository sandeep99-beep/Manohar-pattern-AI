/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  Trash2, 
  ArrowDownCircle, 
  Cpu, 
  Code, 
  ChevronRight,
  Lightbulb,
  Copy,
  Check
} from "lucide-react";
import { ChatMessage } from "../types";

interface AIAssistantProps {
  currentCode?: string;
  activeTab: "auditor" | "ml-playground";
  mlContext?: string; // Optional custom string with ML hyperparameters or fitting state
}

export default function AIAssistant({ currentCode, activeTab, mlContext }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load chat messages from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`copilot_chat_${activeTab}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat messages", e);
      }
    } else {
      // Set default greetings depending on the active tab
      const defaultGreeting: ChatMessage = {
        id: "greet-1",
        role: "model",
        content: activeTab === "auditor" 
          ? "Hi there! I am your AI Code Auditor Copilot. Send me your code snippets or ask me to explain potential vulnerabilities, suggest optimization patches, or explain best practices!"
          : "Welcome to the Machine Learning Playground! I can help explain linear/polynomial regression, machine learning hyperparameters, model overfitting/underfitting, or help analyze decision attributions.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([defaultGreeting]);
    }
  }, [activeTab]);

  // Save chat to localStorage on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`copilot_chat_${activeTab}`, JSON.stringify(messages));
    }
  }, [messages, activeTab]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      // Slight timeout to let animations complete
      setTimeout(() => scrollToBottom("auto"), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Show button if we are scrolled up more than 150px from bottom
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 150);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Construct historical context
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Extra system context about current tab
      const systemContext = activeTab === "auditor" 
        ? "The user is currently reviewing static code and identifying potential issues like performance, security, and styling consistency."
        : `The user is inside the ML Simulator playground. Current details: ${mlContext || "No custom model loaded yet."}`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeTab === "auditor" ? currentCode : undefined,
          messages: [...chatHistory, { role: "user", content: text }],
          systemContext
        })
      });

      if (!response.ok) {
        throw new Error("Chat request failed.");
      }

      const data = await response.json();

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: "Sorry, Manohar ran into an error connecting to the AI model. Please check that GEMINI_API_KEY is configured correctly and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem(`copilot_chat_${activeTab}`);
    const defaultGreeting: ChatMessage = {
      id: `greet-${Date.now()}`,
      role: "model",
      content: activeTab === "auditor" 
        ? "Hi there! I am your AI Code Auditor Copilot. Send me your code snippets or ask me to explain potential vulnerabilities, suggest optimization patches, or explain best practices!"
        : "Welcome to the Machine Learning Playground! I can help explain linear/polynomial regression, machine learning hyperparameters, model overfitting/underfitting, or help analyze decision attributions.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([defaultGreeting]);
  };

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Quick preset questions depending on the tab
  const presets = activeTab === "auditor" 
    ? [
        { label: "Explain security risks here", query: "Can you analyze this code and explain the highest priority security risks?" },
        { label: "How can I optimize performance?", query: "How would you optimize the algorithm complexity or memory usage of this code?" },
        { label: "Check style & best practices", query: "What styling or SOLID best practice issues do you see in this code snippet?" }
      ]
    : [
        { label: "What is model overfitting?", query: "Can you explain what overfitting means, and how adjusting learning rates and epochs can help prevent it?" },
        { label: "Explain polynomial regression math", query: "How does the quadratic (degree 2) and cubic (degree 3) fitting polynomial formula compare to linear fitting mathematically?" },
        { label: "What is feature importance?", query: "What are local feature importances and how does an AI explain its decision attributions to humans?" }
      ];

  // Helper to render message content with simple markdown (code blocks, bold, etc)
  const formatMessageContent = (content: string, msgId: string) => {
    const parts = content.split(/(\`\`\`[a-z]*\n[\s\S]*?\n\`\`\`)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const language = lines[0].replace("```", "").trim();
        const codeText = lines.slice(1, -1).join("\n");
        const codeBlockId = `${msgId}-code-${index}`;

        return (
          <div key={index} className="my-3 border border-slate-200 rounded-lg overflow-hidden font-mono text-xs shadow-xs">
            <div className="bg-slate-100 px-3 py-1.5 flex justify-between items-center text-[10px] text-slate-500 font-sans border-b border-slate-200">
              <span className="uppercase font-bold tracking-wider">{language || "code"}</span>
              <button 
                onClick={() => handleCopyCode(codeText, codeBlockId)}
                className="flex items-center gap-1 hover:text-slate-800 transition"
              >
                {copiedId === codeBlockId ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 text-slate-100 p-3 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Format bold and backtick codes inside inline text
      const inlineParts = part.split(/(\*\*.*?\*\*|\`.*?\`)/g);
      return (
        <span key={index} className="whitespace-pre-wrap">
          {inlineParts.map((subPart, subIndex) => {
            if (subPart.startsWith("**") && subPart.endsWith("**")) {
              return <strong key={subIndex} className="font-bold text-slate-900">{subPart.slice(2, -2)}</strong>;
            }
            if (subPart.startsWith("`") && subPart.endsWith("`")) {
              return <code key={subIndex} className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded-sm font-mono text-xs">{subPart.slice(1, -1)}</code>;
            }
            return subPart;
          })}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Copilot launcher bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="btn-copilot-launcher"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-sans text-xs font-semibold tracking-wide py-3 px-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 cursor-pointer border border-indigo-500/30"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span>Ask Manohar</span>
        </motion.button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click away */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900 z-45"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[460px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      Ask Manohar Workspace Copilot
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      MODE: {activeTab === "auditor" ? "Code Security & Performance" : "ML Sandbox Analyst"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    id="btn-copilot-clear"
                    onClick={handleClearChat}
                    title="Clear Conversation"
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    id="btn-copilot-close"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code Context Alert Indicator (Only in Auditor) */}
              {activeTab === "auditor" && currentCode && (
                <div className="px-4 py-2 bg-indigo-50/50 border-b border-slate-100 flex items-center justify-between gap-2 text-[10px] shrink-0 font-sans">
                  <span className="text-indigo-700 flex items-center gap-1.5 font-medium">
                    <Code className="w-3.5 h-3.5" /> Current code loaded in context ({currentCode.split("\n").length} lines)
                  </span>
                  <span className="text-indigo-400 font-mono">Ref: Active Editor</span>
                </div>
              )}

              {/* Scrollable Chat Message Window */}
              <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
              >
                {messages.map((msg, index) => {
                  const isUser = msg.role === "user";
                  return (
                    <motion.div
                      key={msg.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {/* Avatar */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                        isUser 
                          ? "bg-slate-800 text-white border-slate-700" 
                          : "bg-indigo-600 text-white border-indigo-500"
                      }`}>
                        {isUser ? (
                          <span className="text-[10px] font-bold font-sans">ME</span>
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                      </div>

                      {/* Message bubble */}
                      <div className="space-y-1">
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-xs ${
                          isUser 
                            ? "bg-indigo-600 text-white rounded-tr-none" 
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                        }`}>
                          {formatMessageContent(msg.content, msg.id)}
                        </div>
                        <div className={`text-[9px] text-slate-400 font-mono px-1 ${isUser ? "text-right" : "text-left"}`}>
                          {msg.timestamp}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%] mr-auto items-start animate-pulse">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2 shadow-xs">
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span>Manohar is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll down button */}
              {showScrollBtn && (
                <button
                  onClick={() => scrollToBottom("smooth")}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white/90 hover:bg-white text-slate-600 border border-slate-200 p-1.5 rounded-full shadow-md flex items-center gap-1.5 text-[10px] font-sans hover:text-slate-900 transition z-10 backdrop-blur-xs"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-indigo-600" />
                  <span>New messages below</span>
                </button>
              )}

              {/* Preset suggestions & input dock */}
              <div className="p-3 border-t border-slate-200 bg-white shrink-0 space-y-2.5">
                {/* Suggestions Carousel */}
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block px-1">
                    Suggested Questions
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
                    {presets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(preset.query)}
                        className="flex-none bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition border border-slate-200 flex items-center gap-1 cursor-pointer shadow-2xs whitespace-nowrap"
                      >
                        <Lightbulb className="w-3 h-3 text-indigo-600" />
                        {preset.label}
                        <ChevronRight className="w-2.5 h-2.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input textfield */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputValue);
                  }}
                  className="flex gap-2 items-center"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      activeTab === "auditor" 
                        ? "Ask about security risks, memory leaks, etc..."
                        : "Ask about MSE, regression formulas, hyper-tuning..."
                    }
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-sans focus:border-indigo-500 focus:bg-white focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-xs hover:shadow-md transition shrink-0 flex items-center justify-center cursor-pointer border border-indigo-500/20"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
