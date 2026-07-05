/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar, { SidebarTab } from "./components/Sidebar";
import HomePanel from "./components/HomePanel";
import AuditPanel from "./components/AuditPanel";
import BugFixerPanel from "./components/BugFixerPanel";
import MLPlaygroundPanel from "./components/MLPlaygroundPanel";
import { DatasetsView, LeaderboardView, DocsView, CommunityView } from "./components/ExtraPanels";
import SettingsPanel from "./components/SettingsPanel";
import AIAssistant from "./components/AIAssistant";
import { AuditResult, AuditIssue } from "./types";
import { Sparkles, ArrowUpRight } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<SidebarTab>("home");

  // Code state
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [domain, setDomain] = useState<string>("comprehensive");

  // Auditing status
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  // AI Fixing status
  const [isFixing, setIsFixing] = useState<boolean>(false);
  const [activeFix, setActiveFix] = useState<{
    originalCode: string;
    fixedCode: string;
    explanation: string;
    issueTitle: string;
  } | null>(null);

  const [globalError, setGlobalError] = useState<string | null>(null);

  // Execute AI Code Remediation (Fix)
  const handleTriggerFix = async (issue: AuditIssue) => {
    setIsFixing(true);
    setGlobalError(null);

    try {
      const response = await fetch("/api/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          issueTitle: issue.title,
          suggestion: issue.suggestion,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fix code.");
      }

      const data = await response.json();

      setActiveFix({
        originalCode: code,
        fixedCode: data.fixedCode,
        explanation: data.explanation,
        issueTitle: issue.title,
      });
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || "Failed to trigger AI code repair.");
    } finally {
      setIsFixing(false);
    }
  };

  // Apply the fixed code to our workspace and clear the fix screen
  const handleApplyFix = async () => {
    if (!activeFix) return;

    const newCode = activeFix.fixedCode;
    setCode(newCode);
    setActiveFix(null);

    // Automatically re-run the audit on the fixed code to show resolution status!
    setIsAuditing(true);
    setAuditResult(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newCode, domain }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to audit repaired code.");
      }

      const data = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setGlobalError("Re-audit of repaired code failed: " + err.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCancelFix = () => {
    setActiveFix(null);
  };

  const handleUpgradeClick = () => {
    alert("PatternAI Pro features requested! This activates dedicated high-speed server GPU nodes for neural fitting weights analysis.");
  };

  return (
    <div className="min-h-screen bg-[#030408] text-slate-100 font-sans flex overflow-hidden">
      {/* Premium Left Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onUpgradeClick={handleUpgradeClick}
      />

      {/* Main Workspace Frame container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Global Error Alert */}
        <AnimatePresence>
          {globalError && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 left-6 right-6 z-50"
            >
              <div className="bg-rose-950/80 border border-rose-500/30 text-rose-200 p-4 rounded-xl text-xs flex justify-between items-center shadow-lg backdrop-blur-md">
                <span>{globalError}</span>
                <button
                  onClick={() => setGlobalError(null)}
                  className="text-xs font-bold text-rose-400 hover:text-rose-100 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading repair spinner overlay */}
        <AnimatePresence>
          {isFixing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="bg-[#0e1122] p-8 rounded-2xl max-w-sm text-center shadow-2xl border border-slate-800 flex flex-col items-center"
              >
                <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 rounded-full flex items-center justify-center mb-4 relative">
                  <Sparkles className="w-6 h-6 animate-pulse text-indigo-400" />
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
                <h4 className="font-sans font-bold text-slate-100 text-base">Manohar Code Remediation Active</h4>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Injecting security patches, optimizing complexity bounds, and restructuring variables...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Stage Content body depending on Tab state */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            
            {activeTab === "home" && (
              <motion.div
                key="home-tab"
                className="flex-1 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HomePanel onNavigate={(target) => setActiveTab(target)} />
              </motion.div>
            )}

            {activeTab === "auditor" && (
              <motion.div
                key="auditor-tab"
                className="flex-1 overflow-y-auto p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeFix ? (
                  <BugFixerPanel
                    issueTitle={activeFix.issueTitle}
                    originalCode={activeFix.originalCode}
                    fixedCode={activeFix.fixedCode}
                    explanation={activeFix.explanation}
                    onApplyFix={handleApplyFix}
                    onCancel={handleCancelFix}
                  />
                ) : (
                  <AuditPanel
                    code={code}
                    setCode={setCode}
                    language={language}
                    setLanguage={setLanguage}
                    domain={domain}
                    setDomain={setDomain}
                    auditResult={auditResult}
                    setAuditResult={setAuditResult}
                    isAuditing={isAuditing}
                    setIsAuditing={setIsAuditing}
                    onTriggerFix={handleTriggerFix}
                    isFixing={isFixing}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "ml-playground" && (
              <motion.div
                key="ml-playground-tab"
                className="flex-1 overflow-y-auto p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MLPlaygroundPanel />
              </motion.div>
            )}

            {activeTab === "datasets" && (
              <motion.div
                key="datasets-tab"
                className="flex-1 overflow-y-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DatasetsView />
              </motion.div>
            )}

            {activeTab === "leaderboard" && (
              <motion.div
                key="leaderboard-tab"
                className="flex-1 overflow-y-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <LeaderboardView />
              </motion.div>
            )}

            {activeTab === "docs" && (
              <motion.div
                key="docs-tab"
                className="flex-1 overflow-y-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <DocsView />
              </motion.div>
            )}

            {activeTab === "community" && (
              <motion.div
                key="community-tab"
                className="flex-1 overflow-y-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CommunityView />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings-tab"
                className="flex-1 overflow-y-auto p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SettingsPanel />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sleek bottom footer bar */}
        <footer className="bg-[#04050d] border-t border-slate-900/60 py-3.5 text-center text-[10px] text-slate-500 font-mono shrink-0">
          <div className="px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>PatternAI Code Auditor and Neural Weights Workshop</span>
            <a
              href="https://ai.studio/build"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 font-sans font-medium"
            >
              Google AI Studio Build <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </footer>

      </div>

      {/* AI Assistant Copilot Panel (Only active when on auditing or ML playground views!) */}
      {(activeTab === "auditor" || activeTab === "ml-playground") && (
        <AIAssistant currentCode={code} activeTab={activeTab === "auditor" ? "auditor" : "ml-playground"} />
      )}
    </div>
  );
}
