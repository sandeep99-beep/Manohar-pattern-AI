import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Home, 
  Terminal, 
  FlaskConical, 
  Database, 
  Cpu, 
  Trophy, 
  BookOpen, 
  Users, 
  Star, 
  ChevronDown, 
  Settings, 
  LogOut, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export type SidebarTab = 
  | "home" 
  | "auditor" 
  | "ml-playground" 
  | "datasets" 
  | "leaderboard" 
  | "docs" 
  | "community"
  | "settings";

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  onUpgradeClick?: () => void;
  onLogout?: () => void;
  user?: { username: string; email: string; role: string; plan: string };
}

export default function Sidebar({ activeTab, setActiveTab, onUpgradeClick, onLogout, user }: SidebarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "auditor", label: "Train Model", icon: Terminal },
    { id: "ml-playground", label: "Test Models", icon: FlaskConical },
    { id: "datasets", label: "Datasets", icon: Database },
    { id: "playground", label: "Playground", icon: Cpu, mapTo: "ml-playground" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "docs", label: "Docs", icon: BookOpen },
    { id: "community", label: "Community", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleTabClick = (itemId: string, mapTo?: string) => {
    setActiveTab((mapTo || itemId) as SidebarTab);
  };

  return (
    <div className="w-64 bg-[#080a14] border-r border-slate-800/80 flex flex-col justify-between h-screen shrink-0 select-none text-slate-300">
      {/* Top Brand Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-white/10 blur-[2px]" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-slate-100 text-lg tracking-tight flex items-center gap-1.5">
              PatternAI
            </h1>
            <span className="text-[9px] font-mono font-bold text-indigo-400 tracking-widest uppercase block -mt-1">
              Shape Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links list */}
      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const isSelected = activeTab === item.id || (item.mapTo && activeTab === item.mapTo);

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id, item.mapTo)}
              className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 relative group cursor-pointer"
            >
              {isSelected && (
                <motion.div
                  layoutId="activeSidebarIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-indigo-950/80 to-purple-950/40 border-l-[3px] border-indigo-500 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}

              <span className={`relative z-10 flex items-center gap-3 transition-colors ${
                isSelected ? "text-indigo-400 font-bold" : "text-slate-400 group-hover:text-slate-200"
              }`}>
                <item.icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isSelected ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                {item.label}
              </span>

              {/* Little badge for exciting tabs */}
              {item.id === "playground" && (
                <span className="relative z-10 text-[8px] font-mono bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded-full border border-pink-500/30 scale-90">
                  New
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Promo & Profile area at bottom */}
      <div className="p-4 border-t border-slate-800/50 space-y-4">
        {/* Upgrade to Pro Bento Card */}
        <div className="bg-gradient-to-b from-[#111326] to-[#0a0c1a] border border-indigo-500/10 rounded-2xl p-4 relative overflow-hidden shadow-lg group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
              <Star className="w-4 h-4 fill-indigo-400/20 text-indigo-400 animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 font-sans">Upgrade to Pro</h4>
              <p className="text-[10px] text-slate-500">More GPU power</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
            Unlock advanced training, custom weight vectors and unlimited tests.
          </p>
          <button
            onClick={onUpgradeClick}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition duration-300 shadow-md shadow-indigo-600/20 cursor-pointer text-center flex items-center justify-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-white" /> Upgrade Now
          </button>
        </div>

        {/* User Profile dropdown panel */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/40 border border-transparent hover:border-slate-800/60 transition duration-150 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md uppercase">
                  {user?.username ? user.username.charAt(0) : "S"}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#080a14] rounded-full animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[11px] font-bold text-slate-200 font-sans block leading-none max-w-[120px] truncate">
                  {user?.username || "AI Enthusiast"}
                </span>
                <span className="text-[9px] text-slate-500 font-mono">
                  {user?.plan || "FREE PLAN"}
                </span>
              </div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
              showProfileMenu ? "rotate-180 text-slate-200" : ""
            }`} />
          </button>

          {/* Floating Dropdown profile settings */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-0 w-full mb-2 bg-[#0e1122] border border-slate-800 rounded-xl shadow-xl p-1.5 space-y-1 z-50">
              <button 
                onClick={() => {
                  setActiveTab("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition text-left cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Account Status
              </button>
              <button 
                onClick={() => {
                  setActiveTab("settings");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition text-left cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Settings
              </button>
              <div className="h-px bg-slate-800 my-1" />
              <button 
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  } else {
                    alert("PatternAI secure logout sequence completed.");
                  }
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] uppercase tracking-wide font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
