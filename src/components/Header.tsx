/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Terminal, Cpu, AlertTriangle, PlayCircle } from "lucide-react";

interface HeaderProps {
  activeTab: "auditor" | "ml-playground";
  setActiveTab: (tab: "auditor" | "ml-playground") => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-sans font-semibold tracking-tight text-slate-900">
              AI Code Auditor & ML Testing Suite
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              v1.0.0 • Fully AI-Powered Interactive Workspace
            </p>
          </div>
        </div>

        {/* Unified Segmented Controller (No sidebar navigation!) */}
        <div className="bg-slate-100 p-1 rounded-lg flex items-center border border-slate-200">
          <button
            id="tab-auditor"
            onClick={() => setActiveTab("auditor")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition-all duration-150 cursor-pointer ${
              activeTab === "auditor"
                ? "text-indigo-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {activeTab === "auditor" && (
              <motion.div
                layoutId="activeHeaderTab"
                className="absolute inset-0 bg-white rounded-md shadow-xs border border-slate-200/40"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              Code Auditor & Bug Fixer
            </span>
          </button>
          <button
            id="tab-ml-playground"
            onClick={() => setActiveTab("ml-playground")}
            className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide uppercase transition-all duration-150 cursor-pointer ${
              activeTab === "ml-playground"
                ? "text-indigo-600 font-bold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            {activeTab === "ml-playground" && (
              <motion.div
                layoutId="activeHeaderTab"
                className="absolute inset-0 bg-white rounded-md shadow-xs border border-slate-200/40"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              ML Tester & Playground
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
