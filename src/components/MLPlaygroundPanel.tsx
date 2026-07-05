/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Play, 
  RotateCcw, 
  Info, 
  Sparkles, 
  HelpCircle, 
  Sliders, 
  Brain,
  Grid,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { MLModelDefinition, MLSimulateResponse, DataPoint } from "../types";

// Static ML presets
const ML_PRESETS: MLModelDefinition[] = [
  {
    id: "spam-filter",
    name: "Spam Email Filter (Classification)",
    description: "Detects fraudulent or unsolicited marketing emails using behavioral signals.",
    type: "classification",
    features: [
      { name: "Subject Urgently", type: "categorical", description: "Subject line has urgent keywords (Yes/No)", placeholder: "Yes" },
      { name: "Link Count", type: "numeric", description: "Number of links in email", placeholder: "4" },
      { name: "Grammar Errors", type: "numeric", description: "Number of distinct grammatical errors", placeholder: "3" },
      { name: "Domain Authenticated", type: "categorical", description: "Is domain SPF/DKIM authenticated (Yes/No)", placeholder: "No" }
    ],
    classes: ["Spam", "Legit"],
    parameters: [
      { name: "learningRate", label: "Learning Rate", min: 0.001, max: 0.5, defaultValue: 0.01, step: 0.005 },
      { name: "epochs", label: "Training Epochs", min: 5, max: 150, defaultValue: 50, step: 5 },
      { name: "batchSize", label: "Batch Size", min: 8, max: 128, defaultValue: 32, step: 8 }
    ]
  },
  {
    id: "real-estate",
    name: "Real Estate Valuator (Regression)",
    description: "Predicts fair market housing valuations based on geographical and structural metrics.",
    type: "regression",
    features: [
      { name: "Square Footage", type: "numeric", description: "Internal livable square footage", placeholder: "1850" },
      { name: "Bedroom Count", type: "numeric", description: "Number of full bedrooms", placeholder: "3" },
      { name: "School Score", type: "numeric", description: "Local public school district score (1-10)", placeholder: "8" },
      { name: "Distance Transit", type: "numeric", description: "Distance to nearest transit hub in miles", placeholder: "1.2" }
    ],
    parameters: [
      { name: "learningRate", label: "Learning Rate", min: 0.001, max: 0.5, defaultValue: 0.05, step: 0.005 },
      { name: "epochs", label: "Training Epochs", min: 5, max: 150, defaultValue: 80, step: 5 },
      { name: "regularization", label: "L2 Penalty (Ridge)", min: 0, max: 10, defaultValue: 1.5, step: 0.5 }
    ]
  }
];

// Initial default tabular test data for presets
const INITIAL_TEST_DATA: Record<string, Record<string, any>[]> = {
  "spam-filter": [
    { "Subject Urgently": "Yes", "Link Count": 7, "Grammar Errors": 4, "Domain Authenticated": "No" },
    { "Subject Urgently": "No", "Link Count": 1, "Grammar Errors": 0, "Domain Authenticated": "Yes" },
    { "Subject Urgently": "Yes", "Link Count": 0, "Grammar Errors": 1, "Domain Authenticated": "Yes" }
  ],
  "real-estate": [
    { "Square Footage": 2200, "Bedroom Count": 4, "School Score": 9, "Distance Transit": 0.4 },
    { "Square Footage": 1200, "Bedroom Count": 2, "School Score": 5, "Distance Transit": 2.5 },
    { "Square Footage": 3100, "Bedroom Count": 5, "School Score": 8, "Distance Transit": 1.1 }
  ]
};

export default function MLPlaygroundPanel() {
  const [activeWorkspace, setActiveWorkspace] = useState<"ai-simulate" | "js-regression">("ai-simulate");

  // AI SIMULATOR STATE
  const [selectedModel, setSelectedModel] = useState<MLModelDefinition>(ML_PRESETS[0]);
  const [params, setParams] = useState<Record<string, number>>({});
  const [testInputs, setTestInputs] = useState<Record<string, any>[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<MLSimulateResponse | null>(null);
  const [selectedPredictionIdx, setSelectedPredictionIdx] = useState<number | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // JS REGRESSION STATE
  const [points, setPoints] = useState<DataPoint[]>([
    { x: 0.15, y: 0.25, id: "p1" },
    { x: 0.35, y: 0.42, id: "p2" },
    { x: 0.55, y: 0.52, id: "p3" },
    { x: 0.75, y: 0.78, id: "p4" },
    { x: 0.90, y: 0.85, id: "p5" }
  ]);
  const [polyDegree, setPolyDegree] = useState<number>(1); // 1 = linear, 2 = quadratic, 3 = cubic
  const [lr, setLr] = useState<number>(0.1);
  const [maxEpochs, setMaxEpochs] = useState<number>(200);
  const [isJSTraining, setIsJSTraining] = useState(false);
  // Regression weights (w0 = intercept, w1 = x, w2 = x^2, w3 = x^3)
  const [weights, setWeights] = useState<number[]>([0.2, 0.5, 0.0, 0.0]);
  const [currentLoss, setCurrentLoss] = useState<number>(0);
  const [predictX, setPredictX] = useState<string>("0.5");
  const [predictedY, setPredictedY] = useState<number | null>(null);
  const [clickRipples, setClickRipples] = useState<{ id: string; x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize parameters when model selection changes
  useEffect(() => {
    const initialParams: Record<string, number> = {};
    selectedModel.parameters.forEach((p) => {
      initialParams[p.name] = p.defaultValue;
    });
    setParams(initialParams);
    setTestInputs(INITIAL_TEST_DATA[selectedModel.id] || []);
    setSimulationResult(null);
    setSelectedPredictionIdx(null);
    setSimulationError(null);
  }, [selectedModel]);

  // Handle slider changes
  const handleParamChange = (name: string, value: number) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new row to test inputs
  const handleAddTestInput = () => {
    const newRow: Record<string, any> = {};
    selectedModel.features.forEach((f) => {
      newRow[f.name] = f.type === "numeric" ? parseFloat(f.placeholder) || 0 : f.placeholder;
    });
    setTestInputs((prev) => [...prev, newRow]);
  };

  // Delete a row from test inputs
  const handleDeleteTestInput = (idx: number) => {
    setTestInputs((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update a specific cell in test input
  const handleCellChange = (idx: number, featureName: string, value: string) => {
    setTestInputs((prev) => {
      const updated = [...prev];
      const isNumeric = selectedModel.features.find((f) => f.name === featureName)?.type === "numeric";
      updated[idx] = {
        ...updated[idx],
        [featureName]: isNumeric ? parseFloat(value) || 0 : value
      };
      return updated;
    });
  };

  // Run AI Simulation
  const handleRunSimulation = async () => {
    if (testInputs.length === 0) {
      setSimulationError("Please add at least one test case row to evaluate.");
      return;
    }

    setIsSimulating(true);
    setSimulationError(null);
    setSimulationResult(null);
    setSelectedPredictionIdx(null);

    try {
      const response = await fetch("/api/simulate-ml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel.id,
          modelName: selectedModel.name,
          modelDescription: selectedModel.description,
          parameters: params,
          testInputs: testInputs
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Simulation engine failed.");
      }

      const data = await response.json();
      setSimulationResult(data);
      // Select the first result by default
      if (data.predictions && data.predictions.length > 0) {
        setSelectedPredictionIdx(0);
      }
    } catch (err: any) {
      console.error(err);
      setSimulationError(err.message || "Failed to establish a pipeline to the AI training simulator.");
    } finally {
      setIsSimulating(false);
    }
  };

  // JS REGRESSION GRADIENT DESCENT IMPLEMENTATION
  // Computes polynomial prediction: f(x) = w0 + w1*x + w2*x^2 + w3*x^3
  const predictJS = (x: number, w: number[]) => {
    return w[0] + w[1] * x + w[2] * Math.pow(x, 2) + w[3] * Math.pow(x, 3);
  };

  // Compute Mean Squared Error (MSE)
  const computeMSE = (w: number[]) => {
    if (points.length === 0) return 0;
    let sumErr = 0;
    points.forEach((p) => {
      const diff = predictJS(p.x, w) - p.y;
      sumErr += diff * diff;
    });
    return sumErr / points.length;
  };

  // Fit weights on render or point changes to show current loss
  useEffect(() => {
    setCurrentLoss(computeMSE(weights));
  }, [points, weights]);

  // Train the local regression algorithm
  const handleTrainJSRegression = () => {
    if (points.length === 0) return;
    setIsJSTraining(true);

    // Reset weights randomly to show a clean start
    let w = [0.1 + Math.random() * 0.2, -0.2 + Math.random() * 0.4, 0.0, 0.0];
    setWeights(w);

    let epoch = 0;

    const runStep = () => {
      if (epoch >= maxEpochs || !isJSTraining) {
        setIsJSTraining(false);
        return;
      }

      const N = points.length;
      const grad = [0, 0, 0, 0]; // Gradients for w0, w1, w2, w3

      // Compute gradients
      points.forEach((p) => {
        const diff = predictJS(p.x, w) - p.y;
        grad[0] += diff; // w0
        grad[1] += diff * p.x; // w1
        if (polyDegree >= 2) grad[2] += diff * Math.pow(p.x, 2); // w2
        if (polyDegree >= 3) grad[3] += diff * Math.pow(p.x, 3); // w3
      });

      // Update weights with gradient step
      w[0] -= lr * (grad[0] / N);
      w[1] -= lr * (grad[1] / N);
      if (polyDegree >= 2) {
        w[2] -= lr * (grad[2] / N);
      } else {
        w[2] = 0; // lock to 0
      }
      if (polyDegree >= 3) {
        w[3] -= lr * (grad[3] / N);
      } else {
        w[3] = 0; // lock to 0
      }

      setWeights([...w]);
      epoch += 1;

      // Animate frame-by-frame
      requestAnimationFrame(runStep);
    };

    // Trigger loop
    requestAnimationFrame(runStep);
  };

  // Add coordinate data point on clicking scatter plot area
  const handlePlotClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isJSTraining || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Create a visual click ripple
    const newRipple = {
      id: "rp-" + Date.now() + Math.random(),
      x: clickX,
      y: clickY
    };
    setClickRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setClickRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    // Map pixel coordinates to [0, 1] interval
    // X maps from left to right [0, 1]
    // Y maps from bottom to top [0, 1] (flip vertical coordinate!)
    const pX = Math.max(0, Math.min(1, clickX / rect.width));
    const pY = Math.max(0, Math.min(1, 1 - clickY / rect.height));

    const newPoint: DataPoint = {
      x: parseFloat(pX.toFixed(3)),
      y: parseFloat(pY.toFixed(3)),
      id: "pt-" + Date.now()
    };

    setPoints((prev) => [...prev, newPoint]);
  };

  // Predict coordinate output
  const handleJSPredict = () => {
    const xVal = parseFloat(predictX);
    if (isNaN(xVal) || xVal < 0 || xVal > 1) return;
    const res = predictJS(xVal, weights);
    setPredictedY(parseFloat(res.toFixed(3)));
  };

  // Reset SVG coordinate sandbox
  const handleResetSandbox = () => {
    setPoints([]);
    setWeights([0.3, 0.1, 0, 0]);
    setPredictedY(null);
    setIsJSTraining(false);
  };

  // Render fitted SVG curve lines
  const generateCurvePath = () => {
    let path = "";
    const resolution = 100;
    for (let i = 0; i <= resolution; i++) {
      const xNorm = i / resolution;
      const yNorm = predictJS(xNorm, weights);

      // Map back to canvas pixel dimensions (e.g. 500x350)
      const xPixel = xNorm * 500;
      const yPixel = (1 - yNorm) * 350; // flip Y coordinate

      if (i === 0) {
        path += `M ${xPixel} ${yPixel}`;
      } else {
        path += ` L ${xPixel} ${yPixel}`;
      }
    }
    return path;
  };

  return (
    <div className="space-y-8">
      {/* Visual Navigation Sub-Control inside panel */}
      <div className="flex border-b border-slate-200 gap-4 shrink-0">
        <button
          onClick={() => setActiveWorkspace("ai-simulate")}
          className={`pb-3 font-sans font-bold text-sm border-b-2 transition ${
            activeWorkspace === "ai-simulate"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-900"
          }`}
        >
          1. AI Model Simulator & Tuner
        </button>
        <button
          onClick={() => setActiveWorkspace("js-regression")}
          className={`pb-3 font-sans font-bold text-sm border-b-2 transition ${
            activeWorkspace === "js-regression"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-400 hover:text-slate-900"
          }`}
        >
          2. Visual Mathematics Sandbox
        </button>
      </div>

      {/* WORKSPACE 1: AI MODEL SIMULATOR & TUNER */}
      {activeWorkspace === "ai-simulate" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Panel (Left side) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-sans font-bold text-slate-900 text-sm">Hyper-Parameter Config</h3>
            </div>

            {/* Model Type Preset Picker */}
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                ML Model Template
              </label>
              <div className="space-y-2">
                {ML_PRESETS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`w-full text-left p-3.5 rounded-lg border transition ${
                      selectedModel.id === m.id
                        ? "border-indigo-500 bg-indigo-50/10 ring-1 ring-indigo-500/50 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-sans font-semibold text-slate-900 text-sm">{m.name}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">{m.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Hyperparameters Sliders */}
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Tuner Sliders
              </span>

              {selectedModel.parameters.map((param) => (
                <div key={param.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-sans font-medium text-slate-700">{param.label}</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {params[param.name] ?? param.defaultValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={params[param.name] ?? param.defaultValue}
                    onChange={(e) => handleParamChange(param.name, parseFloat(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Min: {param.min}</span>
                    <span>Max: {param.max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Run Button */}
            <button
              id="btn-run-sim"
              disabled={isSimulating}
              onClick={handleRunSimulation}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide shadow-xs transition disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Training Simulated Model...
                </>
              ) : (
                <>
                  <Brain className="w-3.5 h-3.5" />
                  Train & Evaluate Model
                </>
              )}
            </button>
          </div>

          {/* Test Inputs & Outputs Dashboard (Right side) */}
          <div className="lg:col-span-8 space-y-6">
            {simulationError && (
              <div className="bg-rose-50 border border-slate-200 text-rose-700 p-4 rounded-xl text-sm">
                {simulationError}
              </div>
            )}

            {/* Table of Test Inputs */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-sans font-bold text-slate-900 text-sm">Evaluation Dataset</h3>
                </div>
                <button
                  id="btn-add-row"
                  onClick={handleAddTestInput}
                  className="flex items-center gap-1 bg-indigo-50 border border-indigo-200/50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>

              {/* Editable Grid Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {selectedModel.features.map((f) => (
                        <th key={f.name} className="p-3 font-mono font-bold text-slate-500">
                          {f.name}
                          <span className="text-[9px] text-slate-400 block font-normal">{f.type === "numeric" ? "Numeric" : "Categorical"}</span>
                        </th>
                      ))}
                      <th className="p-3 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {testInputs.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/50">
                        {selectedModel.features.map((f) => (
                          <td key={f.name} className="p-3">
                            <input
                              type={f.type === "numeric" ? "number" : "text"}
                              value={row[f.name] ?? ""}
                              onChange={(e) => handleCellChange(rowIdx, f.name, e.target.value)}
                              placeholder={f.placeholder}
                              className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 font-mono text-xs focus:border-indigo-500 focus:outline-none shadow-xs"
                            />
                          </td>
                        ))}
                        <td className="p-3 text-right">
                          <button
                            id={`delete-row-${rowIdx}`}
                            onClick={() => handleDeleteTestInput(rowIdx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {testInputs.length === 0 && (
                      <tr>
                        <td colSpan={selectedModel.features.length + 1} className="p-6 text-center text-slate-400">
                          No test data. Click "Add Row" to populate features.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIMULATION VISUALIZATIONS */}
            <AnimatePresence mode="wait">
              {isSimulating && (
                <motion.div
                  key="simulating-spinner"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center shadow-xs"
                >
                  <Brain className="w-10 h-10 text-indigo-600 animate-bounce mb-3" />
                  <h4 className="font-sans font-bold text-slate-900 text-sm">Training simulated network...</h4>
                  <p className="text-slate-500 text-xs mt-1">Initializing validation weights and establishing neural feedback loop with Manohar.</p>
                </motion.div>
              )}

              {simulationResult && !isSimulating && (
                <motion.div
                  key="simulation-results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Visual training charts Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Training history plot */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                      <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Training History Curve (Loss)
                      </h4>
                      <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={simulationResult.trainingHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="epoch" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Line type="monotone" dataKey="loss" stroke="#6366f1" name="Train Loss" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="valLoss" stroke="#f43f5e" name="Val Loss" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Summary / Explanation card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                          Model Evaluation Summary
                        </h4>
                        <div className="flex gap-4 mb-4">
                          {selectedModel.type === "classification" ? (
                            <>
                              <div className="bg-emerald-50/50 border border-slate-200 px-4 py-2 rounded-lg text-center shadow-xs">
                                <span className="text-[9px] text-slate-400 block font-mono font-bold">ACCURACY</span>
                                <span className="font-bold font-sans text-emerald-700 text-lg">
                                  {simulationResult.modelSummary.accuracy ? `${(simulationResult.modelSummary.accuracy * 100).toFixed(1)}%` : "94.2%"}
                                </span>
                              </div>
                              <div className="bg-indigo-50/50 border border-slate-200 px-4 py-2 rounded-lg text-center shadow-xs">
                                <span className="text-[9px] text-slate-400 block font-mono font-bold">F1-SCORE</span>
                                <span className="font-bold font-sans text-indigo-700 text-lg">
                                  {simulationResult.modelSummary.f1Score ? (simulationResult.modelSummary.f1Score).toFixed(3) : "0.935"}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className="bg-emerald-50/50 border border-slate-200 px-4 py-2 rounded-lg text-center shadow-xs">
                              <span className="text-[9px] text-slate-400 block font-mono font-bold">R² COEFFICIENT</span>
                              <span className="font-bold font-sans text-emerald-700 text-lg">
                                {simulationResult.modelSummary.r2Score ? (simulationResult.modelSummary.r2Score).toFixed(3) : "0.892"}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">
                          {simulationResult.modelSummary.parametersExplanation}
                        </p>
                      </div>
                      <div className="text-[9px] text-slate-400 font-mono mt-4 pt-3 border-t border-slate-200">
                        * Simulated mathematically in a single turn using the parameter weights of the tuning vectors.
                      </div>
                    </div>
                  </div>

                  {/* Tabular Predictions list and selected row explainer */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Predictions lists (Left) */}
                    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                      <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                        <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                          Evaluation Results ({simulationResult.predictions.length})
                        </h4>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                        {simulationResult.predictions.map((p, idx) => {
                          const isSelected = selectedPredictionIdx === idx;
                          const isSpamClass = p.prediction.toLowerCase() === "spam";

                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedPredictionIdx(idx)}
                              className={`w-full text-left p-4 flex items-center justify-between transition cursor-pointer ${
                                isSelected ? "bg-indigo-50/30 font-semibold text-indigo-900" : "hover:bg-slate-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono font-bold text-slate-400"># {idx + 1}</span>
                                <div>
                                  <span className="text-xs text-slate-800 font-sans block">
                                    Prediction: <strong className={isSpamClass ? "text-rose-600" : "text-emerald-700"}>{p.prediction}</strong>
                                  </span>
                                  {p.confidence && (
                                    <span className="text-[9px] font-mono text-slate-400">
                                      Confidence: {p.confidence.toFixed(1)}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 opacity-80" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Feature importance and Decision Explainers (Right) */}
                    <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
                      {selectedPredictionIdx !== null && simulationResult.predictions[selectedPredictionIdx] ? (
                        <>
                          <div>
                            <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-widest block">
                              Decision Attributions
                            </span>
                            <h4 className="font-sans font-bold text-slate-900 text-sm mt-1">
                              Local Feature Importances (Attributions)
                            </h4>
                          </div>

                          {/* Attributions BarChart */}
                          <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                layout="vertical"
                                data={simulationResult.predictions[selectedPredictionIdx].featureImportances}
                                margin={{ left: 20, right: 20 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="feature" type="category" tick={{ fontSize: 9 }} width={100} />
                                <Tooltip />
                                <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                                  {simulationResult.predictions[selectedPredictionIdx].featureImportances.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#6366f1" : "#818cf8"} />
                                  ))}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Text explanation */}
                          <div className="bg-indigo-50/20 border border-slate-200 p-4 rounded-xl">
                            <h5 className="text-[10px] font-mono text-indigo-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5" /> AI Prediction Reasoning
                            </h5>
                            <p className="text-xs text-slate-700 leading-relaxed font-sans">
                              {simulationResult.predictions[selectedPredictionIdx].explanation}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
                          Select a test record on the left to inspect feature weights and AI reasoning.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* WORKSPACE 2: VISUAL MATHEMATICS SANDBOX */}
      {activeWorkspace === "js-regression" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Menu (Left side) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h3 className="font-sans font-bold text-slate-900 text-sm">Tuning Hyperparameters</h3>
            </div>

            {/* Regression Degree */}
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Fitting Model Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => {
                      setPolyDegree(deg);
                      setPredictedY(null);
                    }}
                    className={`p-2 rounded-lg text-center border text-[10px] uppercase font-bold transition ${
                      polyDegree === deg
                        ? "border-indigo-500 bg-indigo-50 text-indigo-600 font-bold ring-1 ring-indigo-500 shadow-xs"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    {deg === 1 && "Linear"}
                    {deg === 2 && "Quadratic"}
                    {deg === 3 && "Cubic"}
                  </button>
                ))}
              </div>
            </div>

            {/* Training Config (lr, epochs) */}
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-sans text-slate-600">Learning Rate (Alpha)</span>
                  <span className="font-mono font-bold text-indigo-600">{lr}</span>
                </div>
                <input
                  type="range"
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  value={lr}
                  onChange={(e) => setLr(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-sans text-slate-600">Training Iterations</span>
                  <span className="font-mono font-bold text-indigo-600">{maxEpochs}</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={maxEpochs}
                  onChange={(e) => setMaxEpochs(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Run Actions */}
            <div className="space-y-2 border-t border-slate-200 pt-4">
              <button
                id="btn-train-js"
                disabled={isJSTraining || points.length === 0}
                onClick={handleTrainJSRegression}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs uppercase tracking-wide shadow-xs transition disabled:opacity-40"
              >
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                Train Regression Line
              </button>
              <button
                id="btn-clear-js"
                onClick={handleResetSandbox}
                className="w-full flex items-center justify-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-lg text-xs transition shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Points & Weights
              </button>
            </div>

            {/* Predict Segment */}
            <div className="border-t border-slate-200 pt-4 space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Linear Prediction Solver
              </span>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={predictX}
                  onChange={(e) => setPredictX(e.target.value)}
                  placeholder="Enter X (0 to 1)"
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:border-indigo-500 focus:outline-none shadow-xs"
                />
                <button
                  id="btn-js-predict"
                  onClick={handleJSPredict}
                  className="bg-indigo-50 border border-slate-200 text-indigo-600 hover:bg-indigo-100 px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
                >
                  Predict Y
                </button>
              </div>

              {predictedY !== null && (
                <div className="bg-emerald-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-sans">Predicted Y:</span>
                  <span className="font-mono font-bold text-emerald-700 text-sm">
                    {predictedY}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Canvas Scatter plot & details (Right side) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans font-bold text-slate-900 text-sm">
                    Regression Plot Gutter
                  </h3>
                  <span className="text-xs text-slate-400 block font-sans">
                    Click anywhere inside the dark plot grid to place a coordinate.
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Dataset: {points.length} points
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    MSE Loss: {currentLoss.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* Coordinate Plot SVG */}
              <div
                ref={canvasRef}
                onClick={handlePlotClick}
                className="relative bg-slate-950 rounded-xl w-full h-[350px] border border-slate-800 shadow-inner overflow-hidden cursor-crosshair select-none"
              >
                {/* SVG drawings */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Grid Layout Guidelines */}
                  <line x1="0" y1="175" x2="500" y2="175" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />
                  <line x1="250" y1="0" x2="250" y2="350" stroke="#1e293b" strokeWidth="1" strokeDasharray="5,5" />

                  {/* Draw Regression Line fitted curve */}
                  {points.length > 0 && (
                    <path
                      d={generateCurvePath()}
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Click ripples */}
                  {clickRipples.map((r) => (
                    <motion.circle
                      key={r.id}
                      cx={r.x}
                      cy={r.y}
                      initial={{ r: 0, opacity: 0.8 }}
                      animate={{ r: 40, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      fill="none"
                      stroke="#ec4899"
                      strokeWidth="2"
                    />
                  ))}

                  {/* Draw points */}
                  {points.map((p) => {
                    const cx = p.x * 500;
                    const cy = (1 - p.y) * 350; // flip Y coordinate
                    return (
                      <motion.circle
                        key={p.id}
                        cx={cx}
                        cy={cy}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        r="6.5"
                        className="fill-rose-500 stroke-white cursor-pointer transition hover:scale-125"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </svg>

                {/* Vertical labels (Y-axis 1 to 0) */}
                <div className="absolute left-3 top-3 text-[10px] text-slate-500 font-mono">Y=1.0</div>
                <div className="absolute left-3 bottom-3 text-[10px] text-slate-500 font-mono">Y=0.0</div>

                {/* Horizontal labels (X-axis 0 to 1) */}
                <div className="absolute right-3 bottom-3 text-[10px] text-slate-500 font-mono">X=1.0</div>
                <div className="absolute left-12 bottom-3 text-[10px] text-slate-500 font-mono">X=0.0</div>

                {/* Animate floating text if training is active */}
                {isJSTraining && (
                  <div className="absolute top-4 right-4 bg-indigo-600/80 text-white font-mono text-[10px] py-1 px-2.5 rounded-md animate-pulse">
                    TRAINING VIA GRADIENT DESCENT
                  </div>
                )}
              </div>

              {/* Equations visualizer */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center text-xs font-mono">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px] font-bold">Trained Model Equation</span>
                  <span className="text-slate-800 font-bold text-sm">
                    y = {weights[0].toFixed(3)} 
                    {weights[1] >= 0 ? ` + ${weights[1].toFixed(3)}x` : ` - ${Math.abs(weights[1]).toFixed(3)}x`}
                    {polyDegree >= 2 && (weights[2] >= 0 ? ` + ${weights[2].toFixed(3)}x²` : ` - ${Math.abs(weights[2]).toFixed(3)}x²`)}
                    {polyDegree >= 3 && (weights[3] >= 0 ? ` + ${weights[3].toFixed(3)}x³` : ` - ${Math.abs(weights[3]).toFixed(3)}x³`)}
                  </span>
                </div>
                <div className="text-right text-[11px] text-slate-500 max-w-sm font-sans mt-2 md:mt-0 leading-normal">
                  Our custom engine calculates the MSE derivative dynamically, applying vector weight step updates to minimize loss during fitting.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
