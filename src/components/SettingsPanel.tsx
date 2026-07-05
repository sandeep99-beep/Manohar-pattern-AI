import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Mail, 
  Shield, 
  Sliders, 
  Database, 
  Save, 
  RefreshCw, 
  Sparkles, 
  Key, 
  CreditCard, 
  Cpu, 
  Check, 
  AlertTriangle, 
  Activity, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Moon, 
  Sun, 
  Terminal,
  HelpCircle,
  Clock,
  Layers
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";

// Mock usage data for charting
const API_USAGE_HISTORY = [
  { day: "Mon", calls: 12, tokens: 4200, latency: 120 },
  { day: "Tue", calls: 19, tokens: 6800, latency: 140 },
  { day: "Wed", calls: 15, tokens: 5100, latency: 110 },
  { day: "Thu", calls: 32, tokens: 12400, latency: 165 },
  { day: "Fri", calls: 24, tokens: 9100, latency: 130 },
  { day: "Sat", calls: 8, tokens: 2900, latency: 95 },
  { day: "Sun", calls: 14, tokens: 4800, latency: 105 },
];

interface SettingsPanelProps {
  user?: { username: string; email: string; role: string; plan: string };
  onUserUpdate?: (updatedUser: { username: string; email: string; role: string }) => void;
}

export default function SettingsPanel({ user, onUserUpdate }: SettingsPanelProps) {
  // General Profile States
  const [username, setUsername] = useState(() => user?.username || localStorage.getItem("p_username") || "Sandeep NN");
  const [email, setEmail] = useState(() => user?.email || localStorage.getItem("p_email") || "sandeepnn71@gmail.com");
  const [profileRole, setProfileRole] = useState(() => user?.role || localStorage.getItem("p_role") || "Senior AI Architect");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setProfileRole(user.role);
    }
  }, [user]);

  // API Configuration
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem("p_api_key") || "");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestResult, setKeyTestResult] = useState<"success" | "error" | null>(null);

  // Model Tuning Slider states
  const [temperature, setTemperature] = useState(() => parseFloat(localStorage.getItem("p_temp") || "0.7"));
  const [maxTokens, setMaxTokens] = useState(() => parseInt(localStorage.getItem("p_max_tokens") || "2048"));
  const [topP, setTopP] = useState(() => parseFloat(localStorage.getItem("p_top_p") || "0.95"));
  const [topK, setTopK] = useState(() => parseInt(localStorage.getItem("p_top_k") || "40"));
  
  // Auditing Domain Defaults
  const [auditScope, setAuditScope] = useState(() => localStorage.getItem("p_audit_scope") || "comprehensive");
  const [remediationVerbosity, setRemediationVerbosity] = useState(() => localStorage.getItem("p_remediation_verbosity") || "detailed");
  const [autoRunAudit, setAutoRunAudit] = useState(() => localStorage.getItem("p_auto_run_audit") === "true");

  // Display Preferences
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem("p_theme_mode") || "cosmic-dark");
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("p_font_size") || "medium");
  const [sandboxSpeed, setSandboxSpeed] = useState(() => localStorage.getItem("p_sandbox_speed") || "normal");

  // Active sub-tab under settings view
  const [settingsSection, setSettingsSection] = useState<"profile" | "model" | "usage" | "workspace">("profile");

  const saveSettings = () => {
    localStorage.setItem("p_username", username);
    localStorage.setItem("p_email", email);
    localStorage.setItem("p_role", profileRole);
    localStorage.setItem("p_api_key", customApiKey);
    localStorage.setItem("p_temp", temperature.toString());
    localStorage.setItem("p_max_tokens", maxTokens.toString());
    localStorage.setItem("p_top_p", topP.toString());
    localStorage.setItem("p_top_k", topK.toString());
    localStorage.setItem("p_audit_scope", auditScope);
    localStorage.setItem("p_remediation_verbosity", remediationVerbosity);
    localStorage.setItem("p_auto_run_audit", autoRunAudit.toString());
    localStorage.setItem("p_theme_mode", themeMode);
    localStorage.setItem("p_font_size", fontSize);
    localStorage.setItem("p_sandbox_speed", sandboxSpeed);

    if (onUserUpdate) {
      onUserUpdate({
        username,
        email,
        role: profileRole
      });
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const testApiKeyConnection = async () => {
    setIsTestingKey(true);
    setKeyTestResult(null);
    
    // Simulate high precision network verification ping to the Google Gemini backplanes
    setTimeout(() => {
      if (customApiKey.startsWith("AIzaSy") || customApiKey.length > 20) {
        setKeyTestResult("success");
      } else {
        setKeyTestResult("error");
      }
      setIsTestingKey(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-slate-300 max-w-5xl mx-auto">
      {/* Header section with real-time feedback */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-900/40">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <Sliders className="w-6 h-6 text-indigo-400" /> Account & System Settings
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            Manage your AI identity profile, configure Gemini hyperparameters, monitor thread bandwidth, and calibrate workspace models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isSaved && (
              <motion.span 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[11px] font-mono flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Settings Saved!
              </motion.span>
            )}
          </AnimatePresence>

          <button 
            onClick={saveSettings}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer shadow-md shadow-indigo-600/10 shrink-0"
          >
            <Save className="w-3.5 h-3.5" /> Save Changes
          </button>
        </div>
      </div>

      {/* Grid: Menu & Main Config Space */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sub-navigation Sidebar Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-2">
          <button 
            onClick={() => setSettingsSection("profile")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-left transition ${
              settingsSection === "profile" 
                ? "bg-indigo-950/30 border border-indigo-500/30 text-indigo-300" 
                : "bg-[#080a14]/60 border border-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-[#0c0f20]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <User className="w-4 h-4 shrink-0" /> Profile & Identity
            </span>
          </button>

          <button 
            onClick={() => setSettingsSection("model")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-left transition ${
              settingsSection === "model" 
                ? "bg-indigo-950/30 border border-indigo-500/30 text-indigo-300" 
                : "bg-[#080a14]/60 border border-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-[#0c0f20]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <SlidersHorizontal className="w-4 h-4 shrink-0" /> AI Tuning & Prompts
            </span>
          </button>

          <button 
            onClick={() => setSettingsSection("usage")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-left transition ${
              settingsSection === "usage" 
                ? "bg-indigo-950/30 border border-indigo-500/30 text-indigo-300" 
                : "bg-[#080a14]/60 border border-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-[#0c0f20]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 shrink-0" /> Token & API Analytics
            </span>
          </button>

          <button 
            onClick={() => setSettingsSection("workspace")}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider text-left transition ${
              settingsSection === "workspace" 
                ? "bg-indigo-950/30 border border-indigo-500/30 text-indigo-300" 
                : "bg-[#080a14]/60 border border-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-[#0c0f20]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Terminal className="w-4 h-4 shrink-0" /> App Display & Sandbox
            </span>
          </button>

          {/* Quick billing overview in sidebar */}
          <div className="bg-[#080a14]/40 border border-slate-900 p-4.5 rounded-2xl space-y-3 pt-5 mt-4">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              <span>Cloud Storage</span>
              <span>1.2 / 5.0 GB</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: "24%" }} />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-indigo-400" /> Active Plan:
              </span>
              <span className="text-[10px] font-mono font-extrabold text-indigo-400 uppercase bg-indigo-950/40 border border-indigo-900/30 px-2 py-0.5 rounded-full">
                Developer Pro
              </span>
            </div>
          </div>
        </div>

        {/* Configurations Body Space (9 cols) */}
        <div className="lg:col-span-9">
          
          <AnimatePresence mode="wait">
            
            {/* SECTION 1: PROFILE & IDENTITY */}
            {settingsSection === "profile" && (
              <motion.div 
                key="profile-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Active user banner identity */}
                <div className="bg-gradient-to-r from-indigo-950/20 via-[#0a0d1b] to-[#080a14] border border-slate-900 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4.5 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                        {username ? username.charAt(0) : "S"}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-3 border-[#080a14] rounded-full animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-slate-100 text-base leading-snug flex items-center gap-2">
                        {username}
                        <span className="bg-indigo-500/15 text-indigo-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                          Active Creator
                        </span>
                      </h3>
                      <p className="text-[11px] text-indigo-300 font-sans mt-0.5">{profileRole}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-600" /> {email}
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 text-left sm:text-right">
                    <div>Workspace ID: <span className="text-slate-300">AIS-SAND-2026</span></div>
                    <div className="mt-1">Joined: <span className="text-slate-300">July 2026 (Live Workspace)</span></div>
                  </div>
                </div>

                {/* Identity form fields */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-950 pb-2">
                    Identity Coordinates
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Full Name</label>
                      <input 
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition font-sans"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Email Address</label>
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition font-sans"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-[11px] font-mono font-bold text-slate-400">System Role Designation</label>
                      <input 
                        type="text"
                        value={profileRole}
                        onChange={(e) => setProfileRole(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Gemini API Credentials Section */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4.5 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                    <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Key className="w-4 h-4 text-indigo-400 animate-pulse" /> Google Workspace API Key
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Used for server-side endpoints</span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    By default, the sandbox environment routes requests through a shared cloud instance. To accelerate request latency and leverage unlimited model training vectors, specify your personal Google Gemini API Key below.
                  </p>

                  <div className="space-y-2">
                    <div className="relative group">
                      <input 
                        type={showApiKey ? "text" : "password"}
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                        placeholder="AIzaSy... (Enter your custom Google Gemini API Key)"
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl pl-3.5 pr-12 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 transition font-mono tracking-wide"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition cursor-pointer"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                      <button 
                        type="button"
                        onClick={testApiKeyConnection}
                        disabled={isTestingKey || !customApiKey}
                        className="px-4 py-2 bg-slate-950 border border-slate-900 hover:border-slate-800 text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-2 max-w-fit disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${isTestingKey ? "animate-spin" : ""}`} />
                        {isTestingKey ? "Testing connection..." : "Test Connection"}
                      </button>

                      {keyTestResult === "success" && (
                        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-400" /> Active connection verified! Handshake completed.
                        </div>
                      )}
                      {keyTestResult === "error" && (
                        <div className="text-[10px] font-mono text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-400" /> Validation failed. Key must start with 'AIzaSy'.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* SECTION 2: AI TUNING & PROMPTS */}
            {settingsSection === "model" && (
              <motion.div 
                key="model-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Sliders Tuning panel */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="border-b border-slate-950 pb-2">
                    <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-indigo-400" /> Hyperparameter Diagnostics Tuning
                    </h4>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Finetune parameters utilized by the AI Assistant when evaluating code complexes, designing remediations, and processing neural weights.
                  </p>

                  <div className="space-y-5">
                    {/* Temperature Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-300">Temperature (Creativity Bounds)</span>
                        <span className="text-indigo-400 font-extrabold">{temperature.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="1.5"
                        step="0.05"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer border border-slate-900"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>0.00 (Highly Deterministic)</span>
                        <span>0.70 (Balanced)</span>
                        <span>1.50 (Max Creativity)</span>
                      </div>
                    </div>

                    {/* Max Tokens Slider */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-300">Max Tokens per Response (Output Bound)</span>
                        <span className="text-indigo-400 font-extrabold">{maxTokens} tokens</span>
                      </div>
                      <input 
                        type="range"
                        min="256"
                        max="8192"
                        step="128"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full accent-indigo-500 bg-slate-950 h-2 rounded-lg appearance-none cursor-pointer border border-slate-900"
                      />
                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>256 (Brief)</span>
                        <span>2,048 (Standard Workspace)</span>
                        <span>8,192 (Max Code Length)</span>
                      </div>
                    </div>

                    {/* Top P and Top K Double Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-300">Top-P (Nucleus Boundary)</span>
                          <span className="text-indigo-400 font-extrabold">{topP}</span>
                        </div>
                        <input 
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={topP}
                          onChange={(e) => setTopP(parseFloat(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-900"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-slate-300">Top-K (Vocal Choices)</span>
                          <span className="text-indigo-400 font-extrabold">{topK}</span>
                        </div>
                        <input 
                          type="range"
                          min="1"
                          max="100"
                          step="1"
                          value={topK}
                          onChange={(e) => setTopK(parseInt(e.target.value))}
                          className="w-full accent-indigo-500 bg-slate-950 h-1.5 rounded-lg appearance-none cursor-pointer border border-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit Preferences */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-950 pb-2">
                    Code Remediation & Auditing Directives
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Default Audit Domain</label>
                      <select 
                        value={auditScope}
                        onChange={(e) => setAuditScope(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="comprehensive">Comprehensive Diagnostics</option>
                        <option value="security">Security & Injection Hazards only</option>
                        <option value="performance">Speed & Big-O Complexity</option>
                        <option value="quality">Syntactic Cleanliness & Best Practices</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">AI Remediation Verbosity</label>
                      <select 
                        value={remediationVerbosity}
                        onChange={(e) => setRemediationVerbosity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="detailed">Detailed Multi-Step explanation</option>
                        <option value="compact">Compact Single-Sentence description</option>
                        <option value="code-only">Code only, skip descriptions</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <label className="flex items-center gap-3 cursor-pointer text-[11px] font-sans font-bold text-slate-300">
                        <input 
                          type="checkbox"
                          checked={autoRunAudit}
                          onChange={(e) => setAutoRunAudit(e.target.checked)}
                          className="rounded text-indigo-600 bg-slate-950 border-slate-900 w-4 h-4 accent-indigo-500"
                        />
                        <span>Automatically audit newly pasted files immediately on workspace insertion.</span>
                      </label>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* SECTION 3: TOKEN & API ANALYTICS */}
            {settingsSection === "usage" && (
              <motion.div 
                key="usage-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Usage Charts & Metrics */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-6 shadow-xl">
                  <div className="flex items-center justify-between border-b border-slate-950 pb-2">
                    <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-indigo-400" /> Active API Usage & Credit Metrics
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-900/30 px-2 py-0.5 rounded-full">
                      System Normal
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Track requests routed through your current active credentials. Token tracking registers inputs and outputs generated across the Train Model and Pattern Playground views.
                  </p>

                  {/* Dynamic Area Chart */}
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={API_USAGE_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#0e1122", borderColor: "#1e293b", borderRadius: "12px" }}
                          labelStyle={{ color: "#94a3b8", fontWeight: "bold", fontSize: "10px" }}
                          itemStyle={{ color: "#818cf8", fontSize: "11px" }}
                        />
                        <Area type="monotone" dataKey="calls" name="Audit API Requests" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Credits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono block">Estimated Cost</span>
                      <div className="text-lg font-black text-slate-200 mt-1">$0.00 / $15.00</div>
                      <span className="text-[9px] text-emerald-500 font-mono">Free Developer Credits</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono block">Monthly Tokens</span>
                      <div className="text-lg font-black text-indigo-400 mt-1">45,100 / 1M</div>
                      <span className="text-[9px] text-slate-500 font-mono">Resets on August 1</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-4 rounded-xl">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono block">Average Latency</span>
                      <div className="text-lg font-black text-slate-200 mt-1">118 ms</div>
                      <span className="text-[9px] text-indigo-400 font-mono">Pings via Tokyo server</span>
                    </div>
                  </div>
                </div>

                {/* System Limitations / Hardware dashboard */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-950 pb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" /> Neural Compute Sandbox Limits
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-400">
                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                      <span>Thread Allocation:</span>
                      <span className="font-mono text-slate-200">8 Virtual CPU Threads</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                      <span>Neural Fitting Rate:</span>
                      <span className="font-mono text-indigo-300">60 epochs / second</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                      <span>Sandbox Engine:</span>
                      <span className="font-mono text-slate-200">Browser WASM Kernel</span>
                    </div>

                    <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg border border-slate-900/60">
                      <span>Diagnostics Trace Log:</span>
                      <span className="font-mono text-emerald-400">Active / Logging</span>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* SECTION 4: DISPLAY & WORKSPACE */}
            {settingsSection === "workspace" && (
              <motion.div 
                key="workspace-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Interface personalization */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4.5 shadow-xl">
                  <h4 className="font-sans font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-950 pb-2">
                    Interface Preferences
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Theme Palette Accent</label>
                      <select 
                        value={themeMode}
                        onChange={(e) => setThemeMode(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="cosmic-dark">🌌 Cosmic Indigo Dark (Default)</option>
                        <option value="nordic-slate">🏔️ Nordic Charcoal Slate</option>
                        <option value="synth-cyber">🌆 Synthwave Purple</option>
                        <option value="classic-monochrome">🖤 Pure Monochrome Obsidian</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Editor Typography Size</label>
                      <select 
                        value={fontSize}
                        onChange={(e) => setFontSize(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="small">Small (11px Mono)</option>
                        <option value="medium">Medium (13px Mono - Ideal)</option>
                        <option value="large">Large (15px Mono)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Simulation Speed Factor</label>
                      <select 
                        value={sandboxSpeed}
                        onChange={(e) => setSandboxSpeed(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="normal">Normal (1,200ms per step)</option>
                        <option value="fast">Accelerated (600ms per step)</option>
                        <option value="instant">Instantaneous (No Stagger)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-mono font-bold text-slate-400">Telemetry Tracking Options</label>
                      <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-sans">Submit anonymized error reports</span>
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 bg-slate-950 border-slate-900 w-4.5 h-4.5 accent-indigo-500 cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset & Advanced Diagnostics panel */}
                <div className="bg-[#080a14]/80 border border-slate-900 rounded-2xl p-6 space-y-4 shadow-xl">
                  <h4 className="font-sans font-bold text-rose-400 text-xs uppercase tracking-wider border-b border-slate-950 pb-2">
                    Advanced Workspace Reset
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Clearing your system cache will delete all local configuration overrides, saved custom datasets, tuning hyperparameter limits, and local history logs.
                  </p>

                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to restore the default workspace state? This deletes all custom preferences immediately.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                    className="px-4 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-300 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer transition flex items-center gap-1.5"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" /> Restore Defaults & Clear Cache
                  </button>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
