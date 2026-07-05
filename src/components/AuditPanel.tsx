/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  AlertOctagon, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Code,
  FileCode,
  ArrowRight
} from "lucide-react";
import { AuditResult, AuditIssue } from "../types";
import { CODE_PRESETS, CodePreset } from "../utils/presets";

interface AuditPanelProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  domain: string;
  setDomain: (domain: string) => void;
  auditResult: AuditResult | null;
  setAuditResult: (result: AuditResult | null) => void;
  isAuditing: boolean;
  setIsAuditing: (loading: boolean) => void;
  onTriggerFix: (issue: AuditIssue) => void;
  isFixing: boolean;
}

export default function AuditPanel({
  code,
  setCode,
  language,
  setLanguage,
  domain,
  setDomain,
  auditResult,
  setAuditResult,
  isAuditing,
  setIsAuditing,
  onTriggerFix,
  isFixing
}: AuditPanelProps) {
  const [error, setError] = useState<string | null>(null);
  const [expandedIssueIndex, setExpandedIssueIndex] = useState<number | null>(null);

  // Load default code preset on initial mount if code is empty
  useEffect(() => {
    if (!code) {
      handleLoadPreset(CODE_PRESETS[0]);
    }
  }, []);

  const handleLoadPreset = (preset: CodePreset) => {
    setCode(preset.code);
    setLanguage(preset.language);
    setDomain(preset.domain);
    setAuditResult(null);
    setError(null);
    setExpandedIssueIndex(null);
  };

  const handleRunAudit = async () => {
    if (!code.trim()) {
      setError("Please paste or load some code to analyze.");
      return;
    }

    setIsAuditing(true);
    setError(null);
    setAuditResult(null);
    setExpandedIssueIndex(null);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, domain }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "An error occurred during auditing.");
      }

      const data = await response.json();
      setAuditResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to reach the audit server.");
    } finally {
      setIsAuditing(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />;
      case "high":
        return <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />;
      case "medium":
        return <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />;
      case "low":
        return <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0" />;
      case "positive":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      default:
        return <Code className="w-5 h-5 text-gray-500 shrink-0" />;
    }
  };

  const getSeverityColorClasses = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return {
          border: "border-rose-100 bg-rose-50/30",
          tag: "bg-rose-100 text-rose-800 border-rose-200",
          bg: "bg-rose-50"
        };
      case "high":
        return {
          border: "border-amber-100 bg-amber-50/30",
          tag: "bg-amber-100 text-amber-800 border-amber-200",
          bg: "bg-amber-50"
        };
      case "medium":
        return {
          border: "border-yellow-100 bg-yellow-50/20",
          tag: "bg-yellow-100 text-yellow-800 border-yellow-200",
          bg: "bg-yellow-50/50"
        };
      case "low":
        return {
          border: "border-indigo-100 bg-indigo-50/20",
          tag: "bg-indigo-100 text-indigo-800 border-indigo-200",
          bg: "bg-indigo-50/50"
        };
      case "positive":
        return {
          border: "border-emerald-100 bg-emerald-50/30",
          tag: "bg-emerald-100 text-emerald-800 border-emerald-200",
          bg: "bg-emerald-50"
        };
      default:
        return {
          border: "border-gray-100 bg-gray-50/30",
          tag: "bg-gray-100 text-gray-800 border-gray-200",
          bg: "bg-gray-50"
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 stroke-emerald-500";
    if (score >= 50) return "text-amber-500 stroke-amber-500";
    return "text-rose-500 stroke-rose-500";
  };

  // Split code into lines for the editor gutter
  const codeLines = code.split("\n");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Input Code Editor */}
      <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[700px]">
        {/* Editor Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-indigo-600" />
            <span className="font-sans font-bold text-slate-900 text-sm">Source Editor</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              id="lang-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="javascript">JavaScript / TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="html">HTML / CSS</option>
            </select>

            {/* Domain Selector */}
            <select
              id="domain-select"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 shadow-xs"
            >
              <option value="comprehensive">Comprehensive Audit</option>
              <option value="security">Security Checks</option>
              <option value="performance">Performance & Scalability</option>
              <option value="quality">Code Quality & SOLID</option>
              <option value="python">Pythonic Verification</option>
              <option value="javascript">JS/TS Best Practices</option>
              <option value="java">Java Patterns Check</option>
              <option value="architecture">Architectural Cohesion</option>
              <option value="testing">Testability & Edge Cases</option>
            </select>
          </div>
        </div>

        {/* Quick Presets Drawer */}
        <div className="bg-slate-50/50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider shrink-0">Presets:</span>
          {CODE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              id={`preset-${preset.name}`}
              onClick={() => handleLoadPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-xs transition"
            >
              {preset.label.split(" (")[0]}
            </button>
          ))}
          <button
            id="clear-code"
            onClick={() => setCode("")}
            className="text-xs px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-medium transition ml-auto flex items-center gap-1 shadow-xs"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </button>
        </div>

        {/* Interactive Editor Gutter + Area */}
        <div className="flex-1 flex overflow-hidden font-mono text-xs leading-relaxed bg-[#0f172a] text-slate-300">
          {/* Gutter Line Numbers */}
          <div className="w-12 bg-slate-900/50 border-r border-slate-800/40 text-slate-500 text-right select-none py-4 pr-3 flex flex-col overflow-hidden">
            {codeLines.map((_, i) => (
              <span key={i} className="h-[21.5px] block text-xs">{i + 1}</span>
            ))}
          </div>

          {/* Text Area Input */}
          <textarea
            id="code-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="// Paste your code here to begin analysis..."
            className="flex-1 bg-transparent resize-none p-4 text-slate-200 font-mono text-xs leading-relaxed border-none outline-none focus:ring-0 overflow-y-auto"
            style={{ minHeight: "100%", whiteSpace: "pre" }}
          />
        </div>

        {/* Execution Drawer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50/80 flex justify-between items-center shrink-0">
          <p className="text-xs text-slate-400 font-mono">
            Line count: {codeLines.length} • Characters: {code.length}
          </p>

          <button
            id="btn-run-audit"
            disabled={isAuditing}
            onClick={handleRunAudit}
            className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg text-xs uppercase tracking-wide shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isAuditing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Auditing with Manohar...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Audit Code with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Audit Results & Scoring */}
      <div className="lg:col-span-6 flex flex-col h-[700px]">
        {error && (
          <div className="bg-rose-50 border border-slate-200 text-rose-700 p-4 rounded-xl text-sm mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!auditResult && !isAuditing && (
            <motion.div
              key="ready-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 bg-white border border-slate-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-xs"
            >
              <div className="w-12 h-12 bg-indigo-50 border border-slate-200 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-sans font-bold text-slate-900 text-base mb-1">Ready for Analysis</h3>
              <p className="text-slate-500 text-xs max-w-sm mb-6 leading-relaxed">
                Load a vulnerable preset or paste your custom code on the left, then click <strong>Audit Code with AI</strong> to generate deep technical quality and security audits.
              </p>
            </motion.div>
          )}

          {isAuditing && (
            <motion.div
              key="auditing-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex-1 bg-white border border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-xs"
            >
              <div className="w-12 h-12 bg-indigo-50 border border-slate-200 text-indigo-600 rounded-lg flex items-center justify-center mb-4 relative">
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>
              <h3 className="font-sans font-bold text-slate-900 text-base mb-1 animate-pulse">Running Manohar Code Diagnostics</h3>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
                Our AI Auditor is conducting security vulnerability scans, complexity verification, design pattern audits, and error propagation tests...
              </p>
            </motion.div>
          )}

          {auditResult && (
            <motion.div
              key="results-state"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xs"
            >
            {/* Scoring Dashboard */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center gap-6 shrink-0">
              {/* Overall Health Score Wheel */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-slate-200"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    className={getScoreColor(auditResult.summary.overallScore)}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={213.6}
                    initial={{ strokeDashoffset: 213.6 }}
                    animate={{ strokeDashoffset: 213.6 - (213.6 * auditResult.summary.overallScore) / 100 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                  className="absolute flex flex-col items-center"
                >
                  <span className="text-xl font-bold text-slate-900 leading-none">
                    {auditResult.summary.overallScore}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Score
                  </span>
                </motion.div>
              </div>

              {/* Counts Dashboard */}
              <div className="flex-1 grid grid-cols-5 gap-1.5 w-full">
                {[
                  { label: "Critical", count: auditResult.summary.criticalCount, bg: "bg-rose-50/60", border: "border-slate-200/60", text: "text-rose-700", textLabel: "text-rose-500" },
                  { label: "High", count: auditResult.summary.highCount, bg: "bg-amber-50/60", border: "border-slate-200/60", text: "text-amber-700", textLabel: "text-amber-500" },
                  { label: "Med", count: auditResult.summary.mediumCount, bg: "bg-yellow-50/60", border: "border-slate-200/60", text: "text-yellow-700", textLabel: "text-yellow-500" },
                  { label: "Low", count: auditResult.summary.lowCount, bg: "bg-indigo-50/60", border: "border-slate-200/60", text: "text-indigo-700", textLabel: "text-indigo-500" },
                  { label: "Pos", count: auditResult.summary.positiveCount, bg: "bg-emerald-50/60", border: "border-slate-200/60", text: "text-emerald-700", textLabel: "text-emerald-500" },
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: idx * 0.05 + 0.2, duration: 0.3, type: "spring", stiffness: 120 }}
                    className={`${item.bg} border ${item.border} p-2 rounded-lg text-center shadow-xs`}
                  >
                    <div className={`${item.text} font-bold text-sm`}>{item.count}</div>
                    <div className={`text-[9px] font-semibold ${item.textLabel} uppercase tracking-wider`}>{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Scrollable List of Findings */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                  Diagnostic Findings ({auditResult.issues.length})
                </h4>
                <span className="text-xs text-indigo-600 font-sans font-semibold">
                  Click to expand suggestions & fixes
                </span>
              </div>

              {auditResult.issues.map((issue, idx) => {
                const isExpanded = expandedIssueIndex === idx;
                const colors = getSeverityColorClasses(issue.severity);

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    className={`border rounded-xl transition duration-150 overflow-hidden ${colors.border} ${isExpanded ? "ring-1 ring-indigo-500/50 shadow-xs" : ""}`}
                  >
                    {/* Header summary of issue */}
                    <button
                      onClick={() => setExpandedIssueIndex(isExpanded ? null : idx)}
                      className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(issue.severity)}
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-sans font-bold text-slate-900 leading-snug">
                              {issue.title}
                            </span>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${colors.tag}`}>
                              {issue.severity}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md capitalize">
                              {issue.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1 font-sans">
                            {issue.location ? `Location: ${issue.location}` : "Global Scope"}
                            {issue.priority && ` • Priority: ${issue.priority}/10`}
                          </div>
                        </div>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Expandable detailed review panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className={`px-5 pb-5 border-t border-dashed border-slate-200 pt-4 space-y-4 ${colors.bg}`}>
                            {/* Description */}
                            <div>
                              <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Impact & Context
                              </h5>
                              <p className="text-xs text-slate-700 leading-relaxed mt-1 font-sans">
                                {issue.description}
                              </p>
                            </div>

                            {/* Performance Specific Metrics */}
                            {(issue.currentComplexity || issue.optimizedComplexity || issue.improvement) && (
                              <div className="grid grid-cols-3 gap-3 bg-white border border-slate-200 p-3 rounded-lg">
                                {issue.currentComplexity && (
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Original</span>
                                    <span className="font-mono text-xs text-rose-600 font-bold">{issue.currentComplexity}</span>
                                  </div>
                                )}
                                {issue.optimizedComplexity && (
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Optimized</span>
                                    <span className="font-mono text-xs text-emerald-600 font-bold">{issue.optimizedComplexity}</span>
                                  </div>
                                )}
                                {issue.improvement && (
                                  <div>
                                    <span className="text-[9px] font-mono text-slate-400 block uppercase">Improvement</span>
                                    <span className="text-xs font-sans text-indigo-700 font-semibold">{issue.improvement}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Recommendation */}
                            <div>
                              <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                                Actionable Suggestion
                              </h5>
                              <p className="text-xs text-slate-700 leading-relaxed mt-1 font-sans">
                                {issue.suggestion}
                              </p>
                            </div>

                            {/* Code snippet example of solution */}
                            {issue.example && (
                              <div>
                                <h5 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Solution Reference
                                </h5>
                                <pre className="bg-[#0f172a] text-slate-300 text-xs p-4 rounded-lg font-mono overflow-x-auto leading-relaxed max-h-[160px] border border-slate-800">
                                  {issue.example}
                                </pre>
                              </div>
                            )}

                            {/* Fix Trigger Button (If not a generic positive note) */}
                            {issue.severity.toLowerCase() !== "positive" && (
                              <div className="flex justify-end pt-2">
                                <button
                                  id={`fix-btn-${idx}`}
                                  disabled={isFixing}
                                  onClick={() => onTriggerFix(issue)}
                                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3.5 rounded-lg text-xs shadow-xs transition cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5" />
                                  Repair with AI
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
  );
}
