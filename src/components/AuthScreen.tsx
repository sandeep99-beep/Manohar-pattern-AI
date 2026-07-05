import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Github, 
  Chrome,
  Terminal,
  Layers,
  ShieldCheck,
  UserCheck
} from "lucide-react";

interface AuthScreenProps {
  onLoginSuccess: (user: { username: string; email: string; role: string; plan: string }) => void;
  onExploreAsGuest: () => void;
}

export default function AuthScreen({ onLoginSuccess, onExploreAsGuest }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Senior AI Architect");
  const [showPassword, setShowPassword] = useState(false);
  
  // UX states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load registered accounts from local storage, or initialize with defaults
  const getStoredAccounts = () => {
    const raw = localStorage.getItem("p_registered_accounts");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    // Default account
    return [
      {
        username: "Sandeep NN",
        email: "sandeepnn71@gmail.com",
        password: "password123",
        role: "Senior AI Architect",
        plan: "Developer Pro"
      }
    ];
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    if (!email || !password) {
      setErrorMessage("Please fill in all mandatory fields.");
      return;
    }

    if (isSignUp) {
      if (!username) {
        setErrorMessage("Please enter a username.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const accounts = getStoredAccounts();
        const exists = accounts.find((acc: any) => acc.email.toLowerCase() === email.toLowerCase());
        
        if (exists) {
          setErrorMessage("An account with this email already exists.");
          setLoading(false);
          return;
        }

        const newAccount = {
          username,
          email: email.toLowerCase(),
          password,
          role,
          plan: "FREE PLAN"
        };

        accounts.push(newAccount);
        localStorage.setItem("p_registered_accounts", JSON.stringify(accounts));
        
        setSuccessMessage("Account created successfully! Proceeding to log in...");
        
        setTimeout(() => {
          // Log in
          localStorage.setItem("p_is_authenticated", "true");
          localStorage.setItem("p_username", username);
          localStorage.setItem("p_email", email.toLowerCase());
          localStorage.setItem("p_role", role);
          localStorage.setItem("p_plan", "FREE PLAN");
          
          onLoginSuccess(newAccount);
          setLoading(false);
        }, 1200);

      }, 1000);

    } else {
      // Sign In
      setLoading(true);
      setTimeout(() => {
        const accounts = getStoredAccounts();
        const matched = accounts.find(
          (acc: any) => acc.email.toLowerCase() === email.toLowerCase() && acc.password === password
        );

        if (!matched) {
          setErrorMessage("Invalid email or password credentials.");
          setLoading(false);
          return;
        }

        // Successfully authenticated!
        localStorage.setItem("p_is_authenticated", "true");
        localStorage.setItem("p_username", matched.username);
        localStorage.setItem("p_email", matched.email);
        localStorage.setItem("p_role", matched.role);
        localStorage.setItem("p_plan", matched.plan || "FREE PLAN");

        setSuccessMessage(`Welcome back, ${matched.username}! Syncing workspace...`);
        
        setTimeout(() => {
          onLoginSuccess({
            username: matched.username,
            email: matched.email,
            role: matched.role,
            plan: matched.plan || "FREE PLAN"
          });
          setLoading(false);
        }, 1200);

      }, 1000);
    }
  };

  // Helper for fast-fill login demo
  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
    setIsSignUp(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Dynamic Background Halos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute inset-0 bg-[radial-gradient(#080916_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      <div className="w-full max-w-md z-10">
        {/* Brand Intro Header */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-600/20 mb-4"
          >
            <Cpu className="w-7 h-7 text-white" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-slate-100 tracking-tight font-sans"
          >
            PatternAI Workspace Portal
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-xs font-sans mt-1"
          >
            Train intelligence, verify secure models, and manage code weights.
          </motion.p>
        </div>

        {/* Main interactive form card container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#080a14]/90 border border-slate-800/80 rounded-2xl p-6.5 shadow-2xl backdrop-blur-md relative"
        >
          {/* Sign In vs Sign Up Header Tabs Toggle */}
          <div className="flex border-b border-slate-900/80 pb-4 mb-5">
            <button
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 text-center py-1.5 text-xs uppercase tracking-wider font-extrabold transition-colors duration-200 cursor-pointer ${
                !isSignUp ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 text-center py-1.5 text-xs uppercase tracking-wider font-extrabold transition-colors duration-200 cursor-pointer ${
                isSignUp ? "text-indigo-400 border-b-2 border-indigo-500" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Feedback messages */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-[11px] text-rose-400 flex items-start gap-2.5 font-sans"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[11px] text-emerald-400 flex items-start gap-2.5 font-sans"
                >
                  <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 transition font-sans"
                />
              </div>
            </div>

            {/* Username field (Only Sign Up) */}
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    required
                    placeholder="Sandeep NN"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 transition font-sans"
                  />
                </div>
              </motion.div>
            )}

            {/* System Designation field (Only Sign Up) */}
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Workspace Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 focus:outline-none rounded-xl px-3 py-2.5 text-xs text-slate-300 font-sans"
                >
                  <option value="Senior AI Architect">Senior AI Architect</option>
                  <option value="Machine Learning Lead">Machine Learning Lead</option>
                  <option value="Security DevOps Engineer">Security DevOps Engineer</option>
                  <option value="Workspace Developer">Workspace Developer</option>
                </select>
              </motion.div>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {!isSignUp && (
                  <button 
                    type="button" 
                    onClick={() => alert("Password reset vectors dispatched to mock email relay.")}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-200 transition font-mono"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field (Only Sign Up) */}
            {isSignUp && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-1.5"
              >
                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 focus:border-indigo-500/40 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 transition font-mono"
                  />
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Signatures...
                </>
              ) : (
                <>
                  {isSignUp ? "Initialize Identity" : "Authorize Session"}
                  <ArrowRight className="w-4 h-4 text-white animate-pulse" />
                </>
              )}
            </button>
          </form>

          {/* Preset Demo Access (Ideal for testing of this specific assignment!) */}
          {!isSignUp && (
            <div className="mt-5 pt-4.5 border-t border-slate-900/60">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-2.5 text-center">
                Instant Account Verification
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleQuickLogin("sandeepnn71@gmail.com")}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-900/80 rounded-xl text-left text-xs transition-colors group cursor-pointer"
                >
                  <div>
                    <span className="text-indigo-400 font-extrabold font-sans block leading-none">
                      Sandeep NN
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono mt-0.5 block leading-none">
                      sandeepnn71@gmail.com
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400/80 uppercase bg-indigo-950/40 px-2 py-1 rounded-md border border-indigo-900/40 font-bold tracking-wider group-hover:bg-indigo-900/60">
                    Verify Pro
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Third party federated login simulations */}
          <div className="mt-5 space-y-3.5">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-900" />
              <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-500 uppercase tracking-widest">or federated</span>
              <div className="flex-grow border-t border-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => {
                  alert("Syncing Google OAuth credential layer...");
                  handleQuickLogin("sandeepnn71@gmail.com");
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#0c0e1a]/80 border border-slate-900 hover:border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <Chrome className="w-3.5 h-3.5 text-indigo-400" /> Google SSO
              </button>
              <button 
                onClick={() => {
                  alert("Syncing GitHub OAuth credential layer...");
                  handleQuickLogin("sandeepnn71@gmail.com");
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 bg-[#0c0e1a]/80 border border-slate-900 hover:border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                <Github className="w-3.5 h-3.5 text-purple-400" /> GitHub Auth
              </button>
            </div>
          </div>

          {/* Explore Guest link */}
          <div className="text-center mt-6">
            <button 
              onClick={onExploreAsGuest}
              className="text-[10px] text-slate-400 hover:text-slate-200 underline font-mono tracking-wider cursor-pointer transition-colors"
            >
              Continue anonymously (Guest mode)
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
