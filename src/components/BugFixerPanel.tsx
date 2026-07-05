/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Check, Copy, AlertTriangle, CheckCircle } from "lucide-react";

interface BugFixerPanelProps {
  issueTitle: string;
  originalCode: string;
  fixedCode: string;
  explanation: string;
  onApplyFix: () => void;
  onCancel: () => void;
}

export default function BugFixerPanel({
  issueTitle,
  originalCode,
  fixedCode,
  explanation,
  onApplyFix,
  onCancel
}: BugFixerPanelProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-lg flex items-center justify-center border border-emerald-200 shadow-xs shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50/50 border border-emerald-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Gemini Automated Repair
            </span>
            <h3 className="font-sans font-semibold text-slate-900 text-base mt-1">
              Fixed: {issueTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-cancel-fix"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 border border-slate-300 bg-white shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Auditor
          </button>
          <button
            id="btn-copy-fixed"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 border border-slate-300 bg-white shadow-xs hover:bg-slate-50 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Before */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[400px]"
        >
          <div className="bg-rose-50/60 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-sans font-bold text-xs text-rose-800 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Vulnerable Code
            </span>
            <span className="font-mono text-[9px] text-rose-500 uppercase tracking-wide font-bold">Original</span>
          </div>
          <pre className="flex-1 bg-[#0f172a] p-4 font-mono text-xs overflow-auto text-slate-300 select-all leading-relaxed">
            {originalCode}
          </pre>
        </motion.div>

        {/* After */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="border border-slate-200 rounded-xl overflow-hidden flex flex-col h-[400px]"
        >
          <div className="bg-emerald-50/60 px-4 py-2 border-b border-slate-200/80 flex items-center justify-between">
            <span className="font-sans font-bold text-xs text-emerald-800 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" /> Remediated Code
            </span>
            <span className="font-mono text-[9px] text-emerald-600 uppercase tracking-wide font-bold">Fixed</span>
          </div>
          <pre className="flex-1 bg-[#0f172a] p-4 font-mono text-xs overflow-auto text-slate-200 select-all leading-relaxed">
            {fixedCode}
          </pre>
        </motion.div>
      </div>

      {/* Explanation Details */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-slate-50 border border-slate-200 rounded-xl p-5"
      >
        <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
          Remediation Explanation
        </h4>
        <div className="text-xs text-slate-700 font-sans space-y-2 whitespace-pre-line leading-relaxed">
          {explanation}
        </div>
      </motion.div>

      {/* Interactive Actions Footer */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          id="btn-cancel-fix-bottom"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs uppercase tracking-wide transition cursor-pointer"
        >
          Discard Change
        </button>
        <button
          id="btn-apply-fix"
          onClick={onApplyFix}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-xs uppercase tracking-wide transition cursor-pointer"
        >
          <Check className="w-4 h-4" /> Apply Repairs to Workspace
        </button>
      </div>
    </motion.div>
  );
}
