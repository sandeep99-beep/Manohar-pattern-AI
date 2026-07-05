import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Terminal, 
  FlaskConical, 
  Database, 
  Cpu, 
  Trophy, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Book, 
  Sun, 
  Moon, 
  Play, 
  Activity, 
  Boxes, 
  TrendingUp, 
  Award,
  Lock,
  ChevronRight,
  RefreshCw,
  Send
} from "lucide-react";

interface HomePanelProps {
  onNavigate: (tab: "auditor" | "ml-playground" | "datasets" | "leaderboard" | "docs" | "community") => void;
}

export default function HomePanel({ onNavigate }: HomePanelProps) {
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ id: string; sender: "user" | "manohar"; text: string }[]>([]);
  const [isManoharThinking, setIsManoharThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetChips = [
    "How do I train a model?",
    "What's the best algorithm for image recognition?",
    "Explain overfitting in simple terms",
    "Show me a dataset for classification"
  ];

  const stats = [
    { value: "10K+", label: "Models Trained", prefix: "🚀" },
    { value: "25K+", label: "Tests Run", prefix: "🧪" },
    { value: "5K+", label: "Active Users", prefix: "👥" },
    { value: "99.9%", label: "Uptime", prefix: "⚡" }
  ];

  const bentoCards = [
    {
      id: "train",
      title: "Train Models",
      desc: "Upload data, choose algorithms and train powerful models.",
      icon: Boxes,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
      arrowColor: "bg-blue-500 hover:bg-blue-600",
      targetTab: "auditor" as const
    },
    {
      id: "test",
      title: "Test & Evaluate",
      desc: "Test your models against real scenarios and metrics.",
      icon: TrendingUp,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      arrowColor: "bg-emerald-500 hover:bg-emerald-600",
      targetTab: "ml-playground" as const
    },
    {
      id: "patterns",
      title: "Recognize Patterns",
      desc: "Discover patterns and insights from your data.",
      icon: Activity,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border-purple-500/20",
      arrowColor: "bg-purple-500 hover:bg-purple-600",
      targetTab: "datasets" as const
    },
    {
      id: "deploy",
      title: "Deploy & Share",
      desc: "Deploy your best models and share with the community.",
      icon: Award,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
      arrowColor: "bg-amber-500 hover:bg-amber-600",
      targetTab: "ml-playground" as const
    }
  ];

  // Handle asking Manohar (Manohar AI Copilot)
  const handleAskManohar = async (queryText: string) => {
    if (!queryText.trim() || isManoharThinking) return;

    const userMessage = {
      id: "u-" + Date.now(),
      sender: "user" as const,
      text: queryText
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsManoharThinking(true);

    try {
      // Use our backend chat endpoint to get custom responses from Manohar!
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: queryText }],
          systemContext: "You are Manohar, a brilliant, friendly AI assistant specializing in pattern recognition, deep neural networks, and model fitting. Keep your answers beautifully structured, compact and highly professional."
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      
      setChatMessages((prev) => [
        ...prev,
        {
          id: "m-" + Date.now(),
          sender: "manohar" as const,
          text: data.content
        }
      ]);
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: "m-err-" + Date.now(),
          sender: "manohar" as const,
          text: "Hi! This is Manohar. I experienced a tiny connection hiccup. However, remember that pattern analysis usually succeeds when network optimization weights match the parameters perfectly! Feel free to adjust the sliders in the Playground tab or try another query!"
        }
      ]);
    } finally {
      setIsManoharThinking(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isManoharThinking]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#030409] via-[#060815] to-[#04050d] p-8 relative custom-scrollbar">
      {/* Dynamic Cosmic Background glow decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-pink-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* TOP HEADER MENU */}
      <div className="flex items-center justify-end gap-3 mb-10 relative z-10">
        <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800/80 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80 transition cursor-pointer">
          <Book className="w-3.5 h-3.5 text-indigo-400" /> Docs
        </button>

        <button 
          onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 border border-slate-800/80 bg-slate-950/40 hover:bg-slate-950/80 transition cursor-pointer"
        >
          {themeMode === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        <button className="px-5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-90 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 border border-indigo-500/10 transition cursor-pointer">
          Sign In
        </button>
      </div>

      {/* MAIN HERO DISPLAY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 relative z-10">
        
        {/* Left Side Branding & Main Action Text */}
        <div className="lg:col-span-7 space-y-6">
          {/* Animated Chip badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest"
          >
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            Build. Train. Test. Improve.
          </motion.div>

          {/* Heading lines */}
          <div className="space-y-1.5">
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="font-sans font-extrabold text-slate-100 text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight"
            >
              Train AI Models.
            </motion.h2>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="font-sans font-extrabold text-slate-100 text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight"
            >
              Recognize Patterns.
            </motion.h2>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="font-sans font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 text-3xl sm:text-4xl md:text-5xl leading-none tracking-tight"
            >
              Shape Intelligence.
            </motion.h2>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl font-sans font-normal">
            A complete platform to train your AI models, test their performance, and explore machine learning like never before. Adjust live vectors and visualize model attributions in real time.
          </p>

          {/* Dual Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate("auditor")}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wide shadow-lg shadow-indigo-600/25 transition duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-white/10" /> Start Training
            </button>

            <button
              onClick={() => onNavigate("ml-playground")}
              className="flex items-center gap-2 border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80 text-slate-300 font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wide transition duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <FlaskConical className="w-4 h-4 text-indigo-400" /> Test a Model
            </button>
          </div>

          {/* Core Metrics list */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-900/80">
            {stats.map((stat, idx) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx + 0.3 }}
                className="bg-[#0b0d1a]/40 border border-slate-900 rounded-xl p-3 shadow-sm hover:border-indigo-500/10 transition duration-150"
              >
                <div className="text-lg font-bold text-slate-100 flex items-center gap-1.5 font-sans">
                  <span className="text-sm">{stat.prefix}</span> {stat.value}
                </div>
                <div className="text-[10px] font-semibold text-slate-500 font-mono uppercase tracking-wider mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Right Side 3D Cosmic Space Robot Illustration & Greeting Bubble */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative min-h-[350px]">
          
          {/* Orbital glowing tracks */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* outer orbital */}
            <div className="w-[300px] h-[300px] rounded-full border border-dashed border-indigo-500/15 animate-spin-slow absolute" />
            {/* middle glowing path */}
            <div className="w-[240px] h-[240px] rounded-full border border-indigo-500/10 absolute flex items-center justify-center">
              {/* glowing star nodes */}
              <div className="absolute top-0 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
              <div className="absolute bottom-6 left-6 w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
              <div className="absolute top-1/2 right-0 w-2.5 h-2.5 rounded-full bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse" />
            </div>
            {/* inner glow orbit */}
            <div className="w-[180px] h-[180px] rounded-full bg-indigo-600/5 blur-xl absolute" />
          </div>

          {/* ROBOT CHARACTER ILLUSTRATION (High-quality glassmorphism animated vector) */}
          <motion.div 
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 1.5, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10 w-44 h-44 flex items-center justify-center select-none"
          >
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_30px_rgba(99,102,241,0.25)]">
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e1b4b" />
                  <stop offset="50%" stopColor="#312e81" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="screenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#080711" />
                  <stop offset="100%" stopColor="#13112c" />
                </linearGradient>
                <linearGradient id="faceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Glowing Halo backing */}
              <circle cx="100" cy="100" r="75" fill="url(#ringGlow)" />

              {/* Robot Shoulders / Base */}
              <path d="M60 150 C 60 120, 140 120, 140 150 Z" fill="url(#bodyGrad)" stroke="#4338ca" strokeWidth="1.5" />
              <rect x="80" y="125" width="40" height="20" rx="6" fill="#13113c" stroke="#4f46e5" strokeWidth="1" />
              <circle cx="100" cy="135" r="5" fill="#38bdf8" />

              {/* Robot Head Outer Structure */}
              <rect x="45" y="45" width="110" height="90" rx="36" fill="url(#bodyGrad)" stroke="#6366f1" strokeWidth="2.5" />

              {/* Robot Side Ear Antennas / Dial wheels */}
              <circle cx="41" cy="90" r="8" fill="#4f46e5" stroke="#818cf8" strokeWidth="1" />
              <rect x="34" y="85" width="4" height="10" rx="1" fill="#22d3ee" />
              <circle cx="159" cy="90" r="8" fill="#4f46e5" stroke="#818cf8" strokeWidth="1" />
              <rect x="162" y="85" width="4" height="10" rx="1" fill="#a855f7" />

              {/* Top Sensor Antenna */}
              <rect x="97" y="32" width="6" height="15" rx="3" fill="#4338ca" />
              <circle cx="100" cy="27" r="6" fill="#ec4899" className="animate-pulse" />
              <circle cx="100" cy="27" r="6" fill="none" stroke="#f472b6" strokeWidth="1" className="animate-ping" style={{ animationDuration: "2s" }} />

              {/* Robot Glass Face Screen */}
              <rect x="54" y="54" width="92" height="72" rx="24" fill="url(#screenGrad)" stroke="#312e81" strokeWidth="1.5" />

              {/* Waving Glowing Robot Eyes */}
              <path d="M 68 85 A 12 12 0 0 1 92 85" fill="none" stroke="url(#faceGlow)" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 108 85 A 12 12 0 0 1 132 85" fill="none" stroke="url(#faceGlow)" strokeWidth="5.5" strokeLinecap="round" />

              {/* Smiling mouth */}
              <path d="M 90 102 Q 100 114 110 102" fill="none" stroke="url(#faceGlow)" strokeWidth="4" strokeLinecap="round" />

              {/* Cheeks blush circles */}
              <circle cx="68" cy="98" r="4.5" fill="#f43f5e" opacity="0.65" />
              <circle cx="132" cy="98" r="4.5" fill="#f43f5e" opacity="0.65" />

              {/* Glass shine reflections overlay */}
              <path d="M 58 64 Q 100 56 142 64" fill="none" stroke="#ffffff" opacity="0.12" strokeWidth="2.5" />
            </svg>

            {/* Waving Right Hand (Overlaying above SVG, fully interactive!) */}
            <motion.div 
              animate={{ 
                rotate: [0, 20, -10, 20, 0]
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 3.5,
                ease: "easeInOut"
              }}
              className="absolute -left-3 bottom-12 w-12 h-12"
              style={{ transformOrigin: "bottom right" }}
            >
              <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
                {/* Arm linkage */}
                <rect x="18" y="16" width="22" height="8" rx="4" fill="#312e81" stroke="#6366f1" strokeWidth="1.5" transform="rotate(-30 18 16)" />
                {/* Cute glowing robotic mitten hand */}
                <circle cx="12" cy="10" r="8.5" fill="#4f46e5" stroke="#818cf8" strokeWidth="1.5" />
                <path d="M 10 10 Q 7 3 10 2" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>

          {/* Glassmorphism Speech bubble dialogue widget next to robot */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="absolute right-0 bottom-4 bg-[#0a0c1b]/95 border border-indigo-500/20 rounded-2xl p-4 max-w-[210px] shadow-2xl backdrop-blur-md relative"
          >
            <span className="text-slate-100 font-bold text-xs flex items-center gap-1.5 font-sans">
              Hi there! 👋
            </span>
            <p className="text-slate-400 text-[10px] leading-relaxed mt-1 font-sans font-medium">
              I'm your AI assistant, <strong className="text-indigo-400">Manohar</strong>. What would you like to build or explore today?
            </p>
            {/* Little glowing indicator light */}
            <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]" />
          </motion.div>

        </div>

      </div>

      {/* CORE ACTION BENTO CARDS (4 Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 relative z-10">
        {bentoCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 + 0.3 }}
              whileHover={{ y: -4, scale: 1.01 }}
              onClick={() => onNavigate(card.targetTab)}
              className="bg-[#080914]/90 border border-slate-900 hover:border-slate-800/80 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:shadow-indigo-950/20 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-[180px] relative overflow-hidden"
            >
              {/* Subtle accent hover background card glow */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/2 rounded-full blur-xl group-hover:bg-indigo-500/5 transition-colors duration-300" />

              <div>
                {/* Icon Circle badge */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${card.iconBg} mb-4 shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-4.5 h-4.5 ${card.iconColor}`} />
                </div>

                {/* Card Title */}
                <h3 className="font-sans font-extrabold text-slate-200 text-xs tracking-wide uppercase">
                  {card.title}
                </h3>

                {/* Subtitle description */}
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1.5 group-hover:text-slate-400 transition-colors">
                  {card.desc}
                </p>
              </div>

              {/* Bottom Arrow Circle right icon */}
              <div className="flex justify-end pt-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors ${card.arrowColor}`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CHAT DOCK DIALOG CONTAINER (Appears when active Manohar messages exist!) */}
      <AnimatePresence>
        {chatMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-6 bg-gradient-to-b from-[#090b16] to-[#04050a] border border-slate-800 rounded-2xl p-5 relative z-10 shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-4.5"
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" /> Manohar Dialogue Stream ({chatMessages.length})
              </span>
              <button 
                onClick={() => setChatMessages([])}
                className="text-[9px] font-mono text-slate-500 hover:text-slate-300 transition uppercase tracking-wide cursor-pointer"
              >
                Clear History
              </button>
            </div>

            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-2xl px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                      msg.sender === "user" 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-slate-950/80 text-slate-300 border border-slate-900 rounded-tl-none font-sans"
                    }`}
                  >
                    {msg.sender === "manohar" && (
                      <span className="text-[9px] font-mono font-bold text-indigo-400 block mb-1">
                        MANOHAR
                      </span>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}

              {isManoharThinking && (
                <div className="flex justify-start">
                  <div className="bg-slate-950/80 text-slate-400 border border-slate-900 px-4 py-3 rounded-2xl rounded-tl-none text-xs flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    <span>Manohar is computing pattern attributions...</span>
                  </div>
                </div>
              )}
            </div>
            <div ref={chatEndRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM CHAT DOCK INPUT BAR */}
      <div className="relative z-10 space-y-4">
        
        {/* Dock Input wrapper with glowing indigo/pink border */}
        <div className="relative group">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-[1.5px] opacity-75 group-focus-within:opacity-100 transition duration-300" />
          
          <div className="relative bg-[#060814]/98 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1">
              <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskManohar(chatInput)}
                placeholder="Ask me anything about AI, ML or Pattern Recognition..."
                className="bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm font-sans w-full focus:outline-none focus:ring-0 select-text border-none"
              />
            </div>

            {/* Glowing active voice wave visualizer bar panel */}
            <div className="flex items-center gap-4 shrink-0">
              {/* wave bars */}
              <div className="flex items-center gap-0.5 h-6 px-1.5 rounded-lg bg-indigo-500/5 border border-indigo-500/10">
                {[0.8, 1.4, 0.5, 1.8, 1.0, 1.6, 0.4].map((v, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["6px", `${16 * v}px`, "6px"] }}
                    transition={{
                      duration: 0.8 + i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-[1.5px] bg-indigo-400 rounded-full"
                  />
                ))}
              </div>

              {/* Submit send button */}
              <button 
                onClick={() => handleAskManohar(chatInput)}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white cursor-pointer hover:scale-105 active:scale-95 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Preset query prompt chips */}
        <div className="flex flex-wrap items-center gap-2.5 overflow-x-auto py-1 justify-center sm:justify-start">
          {presetChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleAskManohar(chip)}
              className="px-4 py-2 rounded-xl text-[10px] font-sans font-medium text-slate-400 hover:text-slate-200 border border-slate-900 hover:border-slate-800 bg-[#070914]/80 hover:bg-[#0c0e20] transition duration-150 cursor-pointer text-center whitespace-nowrap"
            >
              {chip}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
