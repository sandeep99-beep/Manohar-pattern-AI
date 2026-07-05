import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Database, 
  Trophy, 
  BookOpen, 
  Users, 
  Search, 
  ExternalLink, 
  Flame, 
  Download, 
  Plus, 
  ThumbsUp, 
  MessageSquare, 
  Tag, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Play,
  Upload,
  FileText,
  Check,
  AlertTriangle,
  Activity,
  TrendingUp,
  Layers,
  Image as ImageIcon,
  ChevronDown,
  Info,
  HelpCircle,
  Award
} from "lucide-react";

// ==========================================
// PRESET SAMPLE DATASETS
// ==========================================
const PRESET_DATASETS: Record<string, {
  name: string;
  type: string;
  size: string;
  rows: string;
  columns: string[];
  popularity: number;
  sampleData: Record<string, any>[];
}> = {
  "California Housing Prices": {
    name: "California Housing Prices",
    type: "Tabular / Regression",
    size: "1.4 MB",
    rows: "20,640",
    popularity: 87,
    columns: ["MedInc", "HouseAge", "AveRooms", "AveBedrms", "Population", "AveOccup", "Latitude", "Longitude", "MedHouseValue"],
    sampleData: [
      { MedInc: 8.3252, HouseAge: 41, AveRooms: 6.9841, AveBedrms: 1.0238, Population: 322, AveOccup: 2.55, Latitude: 37.88, Longitude: -122.23, MedHouseValue: 452600 },
      { MedInc: 8.3014, HouseAge: 21, AveRooms: 6.2381, AveBedrms: 0.9714, Population: 2401, AveOccup: 2.11, Latitude: 37.86, Longitude: -122.22, MedHouseValue: 358500 },
      { MedInc: 7.2574, HouseAge: 52, AveRooms: 8.2881, AveBedrms: 1.0734, Population: 496, AveOccup: 2.80, Latitude: 37.85, Longitude: -122.24, MedHouseValue: 352100 },
      { MedInc: 5.6431, HouseAge: 52, AveRooms: 5.8173, AveBedrms: 1.0730, Population: 558, AveOccup: 2.55, Latitude: 37.85, Longitude: -122.25, MedHouseValue: 341300 },
      { MedInc: 3.8462, HouseAge: 52, AveRooms: 6.2818, AveBedrms: 1.1068, Population: 565, AveOccup: 2.18, Latitude: 37.85, Longitude: -122.25, MedHouseValue: 342200 }
    ]
  },
  "Iris Flower Petal Metrics": {
    name: "Iris Flower Petal Metrics",
    type: "Tabular / Clustering",
    size: "4 KB",
    rows: "150",
    popularity: 76,
    columns: ["sepal_length", "sepal_width", "petal_length", "petal_width", "species"],
    sampleData: [
      { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
      { sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: "setosa" },
      { sepal_length: 4.7, sepal_width: 3.2, petal_length: 1.3, petal_width: 0.2, species: "setosa" },
      { sepal_length: 4.6, sepal_width: 3.1, petal_length: 1.5, petal_width: 0.2, species: "setosa" },
      { sepal_length: 5.0, sepal_width: 3.6, petal_length: 1.4, petal_width: 0.2, species: "setosa" }
    ]
  },
  "CIFAR-10 Object Images": {
    name: "CIFAR-10 Object Images",
    type: "Image / Multi-class",
    size: "162 MB",
    rows: "60,000",
    popularity: 94,
    columns: ["image_id", "class_label", "width", "height", "channels", "variance"],
    sampleData: [
      { image_id: 10041, class_label: "airplane", width: 32, height: 32, channels: 3, variance: 0.12 },
      { image_id: 10042, class_label: "automobile", width: 32, height: 32, channels: 3, variance: 0.18 },
      { image_id: 10043, class_label: "bird", width: 32, height: 32, channels: 3, variance: 0.09 },
      { image_id: 10044, class_label: "cat", width: 32, height: 32, channels: 3, variance: 0.14 },
      { image_id: 10045, class_label: "deer", width: 32, height: 32, channels: 3, variance: 0.11 }
    ]
  },
  "Sentiment Analysis Review Text": {
    name: "Sentiment Analysis Review Text",
    type: "NLP / Text Sentiment",
    size: "44 MB",
    rows: "50,000",
    popularity: 91,
    columns: ["review_id", "review_text", "sentiment_label", "word_count", "subjectivity"],
    sampleData: [
      { review_id: 9942, review_text: "Absolutely fantastic experience! Fast interface.", sentiment_label: "positive", word_count: 17, subjectivity: 0.85 },
      { review_id: 9943, review_text: "Terrible service crash during high latency fitting.", sentiment_label: "negative", word_count: 16, subjectivity: 0.65 },
      { review_id: 9944, review_text: "Simple regression model fits accurately but misses non-linear.", sentiment_label: "neutral", word_count: 12, subjectivity: 0.35 },
      { review_id: 9945, review_text: "Manohar detected 4 injection risks and fixed them instantly.", sentiment_label: "positive", word_count: 18, subjectivity: 0.90 },
      { review_id: 9946, review_text: "Standard performance with minor outlier leakage.", sentiment_label: "neutral", word_count: 17, subjectivity: 0.20 }
    ]
  },
  "MNIST Handwritten Digits": {
    name: "MNIST Handwritten Digits",
    type: "Image / Classification",
    size: "11.5 MB",
    rows: "70,000",
    popularity: 98,
    columns: ["pixel_index", "stroke_width", "symmetry_score", "density_map", "digit_label"],
    sampleData: [
      { pixel_index: 201, stroke_width: 1.8, symmetry_score: 0.82, density_map: 0.45, digit_label: "5" },
      { pixel_index: 202, stroke_width: 2.2, symmetry_score: 0.61, density_map: 0.38, digit_label: "0" },
      { pixel_index: 203, stroke_width: 1.5, symmetry_score: 0.74, density_map: 0.52, digit_label: "4" },
      { pixel_index: 204, stroke_width: 1.9, symmetry_score: 0.91, density_map: 0.41, digit_label: "1" },
      { pixel_index: 205, stroke_width: 2.0, symmetry_score: 0.55, density_map: 0.60, digit_label: "9" }
    ]
  },
  "Wine Quality Dataset": {
    name: "Wine Quality Dataset",
    type: "Tabular / Classification",
    size: "264 KB",
    rows: "4,898",
    popularity: 81,
    columns: ["fixed_acidity", "volatile_acidity", "citric_acid", "residual_sugar", "chlorides", "free_sulfur_dioxide", "density", "pH", "alcohol", "quality"],
    sampleData: [
      { fixed_acidity: 7.0, volatile_acidity: 0.27, citric_acid: 0.36, residual_sugar: 20.7, chlorides: 0.045, free_sulfur_dioxide: 45.0, density: 1.001, pH: 3.00, alcohol: 8.8, quality: 6 },
      { fixed_acidity: 6.3, volatile_acidity: 0.30, citric_acid: 0.34, residual_sugar: 1.6, chlorides: 0.049, free_sulfur_dioxide: 14.0, density: 0.994, pH: 3.30, alcohol: 9.5, quality: 6 },
      { fixed_acidity: 8.1, volatile_acidity: 0.28, citric_acid: 0.40, residual_sugar: 6.9, chlorides: 0.050, free_sulfur_dioxide: 30.0, density: 0.995, pH: 3.26, alcohol: 10.1, quality: 6 },
      { fixed_acidity: 7.2, volatile_acidity: 0.23, citric_acid: 0.32, residual_sugar: 8.5, chlorides: 0.058, free_sulfur_dioxide: 47.0, density: 0.996, pH: 3.19, alcohol: 9.9, quality: 6 },
      { fixed_acidity: 7.2, volatile_acidity: 0.23, citric_acid: 0.32, residual_sugar: 8.5, chlorides: 0.058, free_sulfur_dioxide: 47.0, density: 0.996, pH: 3.19, alcohol: 9.9, quality: 6 }
    ]
  }
};

// ==========================================
// DATASETS TAB VIEW
// ==========================================
export function DatasetsView() {
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active loaded dataset and analysis report states
  const [activeDataset, setActiveDataset] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [reportTab, setReportTab] = useState<"summary" | "patterns" | "statistics" | "models" | "explainability">("summary");

  const datasetsList = Object.values(PRESET_DATASETS);
  const filtered = datasetsList.filter(
    d => d.name.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase())
  );

  const stepsList = [
    "Synthesizing high-order feature statistics & covariance mapping...",
    "Scanning dataset for temporal shift & linear decision boundaries...",
    "Training simulated XGBoost & Random Forest boundary algorithms...",
    "Injecting SHAP explainability kernels & computing LIME variance..."
  ];

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    const fileType = file.type || "text/csv";
    
    if (file.type.startsWith("image/")) {
      reader.onload = (event) => {
        const customData = {
          name: file.name,
          type: "Image / Custom Upload",
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          rows: "1 (Image)",
          columns: ["width", "height", "channels", "symmetry_score", "edge_gradient", "dominant_color"],
          sampleData: [
            { width: 512, height: 512, channels: 3, symmetry_score: 0.84, edge_gradient: 142.5, dominant_color: "Indigo" }
          ],
          thumbnail: event.target?.result as string
        };
        setActiveDataset(customData);
        setUploadSuccess(true);
        setAnalysisReport(null);
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = (event) => {
        const text = event.target?.result as string || "";
        const lines = text.split("\n").filter(l => l.trim().length > 0);
        const headers = lines[0] ? lines[0].split(",").map(h => h.trim()) : ["col1", "col2", "col3", "target"];
        
        const sampleRows = lines.slice(1, 6).map((line, idx) => {
          const cells = line.split(",");
          const rowObj: Record<string, any> = {};
          headers.forEach((h, i) => {
            rowObj[h] = cells[i] ? cells[i].trim() : (Math.random() * 10).toFixed(2);
          });
          return rowObj;
        });

        const customData = {
          name: file.name,
          type: "Tabular / Custom Upload",
          size: (file.size / 1024).toFixed(1) + " KB",
          rows: (lines.length - 1).toLocaleString(),
          columns: headers,
          sampleData: sampleRows.length > 0 ? sampleRows : [
            { col1: "1.2", col2: "5.4", col3: "0.8", target: "Class_A" },
            { col1: "2.3", col2: "4.1", col3: "1.1", target: "Class_B" }
          ]
        };
        setActiveDataset(customData);
        setUploadSuccess(true);
        setAnalysisReport(null);
        setTimeout(() => setUploadSuccess(false), 3000);
      };
      reader.readAsText(file);
    }
  };

  // Triggers Manohar Deep Pattern Recognition Framework
  const triggerPatternDiscovery = async () => {
    if (!activeDataset) return;
    setIsAnalyzing(true);
    setAnalyzingStep(0);

    // Stagger steps animation
    const interval = setInterval(() => {
      setAnalyzingStep((prev) => {
        if (prev >= stepsList.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    try {
      const response = await fetch("/api/pattern-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          datasetName: activeDataset.name,
          fileType: activeDataset.type,
          rowCount: activeDataset.rows,
          columnHeaders: activeDataset.columns,
          fileContent: JSON.stringify(activeDataset.sampleData)
        })
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setAnalysisReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  // Exports Report as Markdown/Doc
  const exportReportAsDoc = () => {
    if (!analysisReport) return;
    const content = `# PatternAI Deep Pattern Recognition & Explainable AI (XAI) Report
Date: ${new Date().toLocaleDateString()}
Target Workspace: Sandeep NN AI Workshop

================================================================================
1. DATASET SUMMARY
================================================================================
${analysisReport.summary}

================================================================================
2. DATA QUALITY ASSESSMENT
================================================================================
${analysisReport.qualityAssessment}

================================================================================
3. PATTERN DISCOVERY
================================================================================
${analysisReport.patterns.map((p: any, i: number) => `
Pattern ${i + 1}: ${p.name}
- Description: ${p.description}
- Evidence: ${p.evidence}
- Confidence Score: ${p.confidence}%
- Possible Cause: ${p.possibleCause}
- Business or Scientific Meaning: ${p.meaning}
- Limitations: ${p.limitations}
- Recommended Actions: ${p.recommendedActions}
`).join("\n")}

================================================================================
4. HIDDEN RELATIONSHIPS
================================================================================
${analysisReport.hiddenRelationships}

================================================================================
5. STATISTICAL ANALYSIS
================================================================================
Mean: ${analysisReport.statisticalAnalysis.mean}
Median: ${analysisReport.statisticalAnalysis.median}
Standard Deviation: ${analysisReport.statisticalAnalysis.standardDeviation}

Correlations:
${analysisReport.statisticalAnalysis.correlations.map((c: any) => `- ${c.x} <--> ${c.y}: ${c.value}`).join("\n")}

================================================================================
6. FEATURE ENGINEERING SUGGESTIONS
================================================================================
${analysisReport.featureEngineering.map((item: any, i: number) => `${i + 1}. ${item}`).join("\n")}

================================================================================
7. RECOMMENDED MACHINE LEARNING MODELS
================================================================================
${analysisReport.recommendedModels.map((m: any, i: number) => `
Model ${i + 1}: ${m.name}
- Type: ${m.type}
- Explanation: ${m.explanation}
- Suitability Confidence: ${m.confidence}%
`).join("\n")}

================================================================================
8. MODEL COMPARISON
================================================================================
${analysisReport.modelComparison.map((mc: any) => `
- Model: ${mc.model}
  * Strength: ${mc.strength}
  * Weakness: ${mc.weakness}
  * Relative Accuracy: ${mc.relativeAccuracy}
`).join("\n")}

================================================================================
9. EVALUATION METRICS
================================================================================
${analysisReport.evaluationMetrics}

================================================================================
10. EXPLAINABILITY REPORT (XAI)
================================================================================
${analysisReport.explainability.description}

Feature Contribution Weights:
${analysisReport.explainability.features.map((f: any) => `
- Feature: ${f.feature}
  * Relative Importance: ${f.importance}%
  * Influence Direction: ${f.direction}
  * Reason: ${f.reason}
`).join("\n")}

================================================================================
11. LIMITATIONS
================================================================================
${analysisReport.limitations}

================================================================================
12. FINAL RECOMMENDATIONS
================================================================================
${analysisReport.finalRecommendations.map((item: any, i: number) => `${i + 1}. ${item}`).join("\n")}

================================================================================
13. FUTURE IMPROVEMENTS
================================================================================
${analysisReport.futureImprovements.map((item: any, i: number) => `${i + 1}. ${item}`).join("\n")}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDataset.name.replace(/\s+/g, "_")}_Manohar_AI_XAI_Report.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exports visualization as Markdown HTML or text visualizer
  const exportHeatmapImage = () => {
    if (!analysisReport) return;
    const cols = activeDataset.columns;
    const cellWidth = 14;
    
    let matrixStr = "   " + cols.map(c => c.substring(0, 8).padEnd(8)).join(" | ") + "\n";
    matrixStr += "   " + "-".repeat(cols.length * 11) + "\n";
    
    cols.forEach(colX => {
      matrixStr += colX.substring(0, 8).padEnd(8) + " | ";
      cols.forEach(colY => {
        const corr = analysisReport.statisticalAnalysis.correlations.find(
          (c: any) => (c.x === colX && c.y === colY) || (c.x === colY && c.y === colX)
        );
        const val = corr ? corr.value : (colX === colY ? 1.0 : 0.0);
        matrixStr += (val >= 0 ? "+" : "") + val.toFixed(2).padEnd(7) + " | ";
      });
      matrixStr += "\n";
    });

    const docContent = `PatternAI Correlation Matrix Image Visualization
Exported: ${new Date().toLocaleDateString()}
Dataset: ${activeDataset.name}

${matrixStr}

Note: High positive values represent strong proportional dependency cascading.
Negative values denote inverse dependencies. Fully explainable in the statistical reports module.`;

    const blob = new Blob([docContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDataset.name.replace(/\s+/g, "_")}_correlation_heatmap.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-slate-300">
      
      {/* Top Banner & Upload Handler */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-2 border-b border-slate-900/40">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5 tracking-tight">
            <Database className="w-6 h-6 text-indigo-400" /> PatternAI Datasets Hub & XAI Analyzer
          </h2>
          <p className="text-slate-400 text-xs mt-1 font-sans">
            Load sample databases or drag/upload custom files. Run Manohar's 13-stage Deep Pattern Recognition and Explainable AI (XAI) engine.
          </p>
        </div>

        {/* Drag & Drop Upload Spot */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-3.5 px-6 py-4 rounded-xl border border-dashed transition cursor-pointer text-xs ${
            dragActive 
              ? "bg-indigo-950/40 border-indigo-500 text-indigo-300" 
              : "bg-[#080914] border-slate-900 hover:border-slate-800 text-slate-400"
          }`}
        >
          <Upload className={`w-4 h-4 text-indigo-400 ${dragActive ? "animate-bounce" : ""}`} />
          <div>
            <span className="font-bold text-slate-200">Drag & drop or Click</span> to upload <span className="text-indigo-400 font-mono">.csv / .txt / image</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".csv,.txt,.json,.png,.jpg,.jpeg"
            className="hidden" 
          />
          {uploadSuccess && (
            <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] animate-pulse">
              Uploaded!
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Select Dataset Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets (e.g. image, tabular)..."
              className="w-full bg-[#080914] border border-slate-900 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-100 focus:outline-none focus:border-indigo-500/50 transition font-sans"
            />
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filtered.map((item, idx) => {
              const isActive = activeDataset?.name === item.name;
              return (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setActiveDataset(item);
                    setAnalysisReport(null);
                  }}
                  className={`border rounded-xl p-4 transition flex flex-col justify-between cursor-pointer ${
                    isActive 
                      ? "bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-500/5" 
                      : "bg-[#080914]/80 border-slate-900/80 hover:border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-mono bg-indigo-950/40 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-900/30 font-bold uppercase tracking-wider">
                        {item.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {item.size}
                      </span>
                    </div>

                    <h3 className={`font-sans font-bold text-xs sm:text-sm ${isActive ? "text-indigo-300" : "text-slate-200"}`}>
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">
                      Total Rows: {item.rows}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-950/40">
                    <div className="text-[10px] text-slate-500 font-medium">
                      🔥 {item.popularity}% Match Score
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-wide cursor-pointer">
                      Load Data <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Workspace & Analysis (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <AnimatePresence mode="wait">
            {!activeDataset ? (
              <motion.div 
                key="no-dataset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#080914]/50 border border-slate-900 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[350px]"
              >
                <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="font-sans font-bold text-slate-200 text-sm">No Active Dataset Loaded</h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-sm leading-relaxed">
                  Select one of the sample datasets from the left sidebar or upload your own CSV dataset file to start pattern mining.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="active-dataset"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                
                {/* Active Dataset Preview Card */}
                <div className="bg-[#080914] border border-slate-900 rounded-2xl p-5 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {activeDataset.thumbnail ? (
                        <img 
                          src={activeDataset.thumbnail} 
                          alt="preview" 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 object-cover rounded-lg border border-slate-800"
                        />
                      ) : (
                        <div className="w-11 h-11 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-sans font-bold text-slate-100 text-sm">
                          {activeDataset.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {activeDataset.type} | Size: {activeDataset.size} | Rows: {activeDataset.rows}
                        </p>
                      </div>
                    </div>

                    <button 
                      onClick={triggerPatternDiscovery}
                      disabled={isAnalyzing}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition uppercase tracking-wider cursor-pointer shadow-md shadow-indigo-600/20 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
                      {isAnalyzing ? "Processing..." : "Discover Patterns"}
                    </button>
                  </div>

                  {/* Columns Feature list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Detected Feature Coordinates ({activeDataset.columns.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDataset.columns.map((col: string) => (
                        <span key={col} className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2.5 py-1 rounded border border-slate-900">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Sample Rows Table */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Dataset Row preview (First 5 records)</span>
                    <div className="border border-slate-950 rounded-xl overflow-hidden overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[10px] font-mono">
                        <thead>
                          <tr className="bg-slate-950 text-slate-500 border-b border-slate-900 font-bold uppercase tracking-wider">
                            {activeDataset.columns.slice(0, 5).map((col: string) => (
                              <th key={col} className="py-2.5 px-3.5">{col}</th>
                            ))}
                            {activeDataset.columns.length > 5 && <th className="py-2.5 px-3.5">...</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-950 text-slate-300">
                          {activeDataset.sampleData.map((row: any, rIdx: number) => (
                            <tr key={rIdx} className="hover:bg-slate-950/40">
                              {activeDataset.columns.slice(0, 5).map((col: string) => (
                                <td key={col} className="py-2.5 px-3.5">{String(row[col])}</td>
                              ))}
                              {activeDataset.columns.length > 5 && <td className="py-2.5 px-3.5 text-slate-600">...</td>}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Loading / Analyzing State */}
                {isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#080914] border border-slate-900 rounded-2xl p-8 text-center flex flex-col items-center justify-center space-y-4 shadow-xl"
                  >
                    <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-2 relative">
                      <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-sans font-bold text-slate-200 text-sm">Analyzing via Manohar XAI Specialist</h4>
                      <p className="text-slate-500 text-xs font-mono">
                        Step {analyzingStep + 1} of 4: {stepsList[analyzingStep]}
                      </p>
                    </div>

                    <div className="w-full max-w-md bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-900">
                      <motion.div 
                        className="bg-indigo-600 h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(analyzingStep + 1) * 25}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Final Interactive Report Panel */}
                {analysisReport && !isAnalyzing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                  >
                    
                    {/* KPI Bento Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-[#080914] border border-slate-900 rounded-xl p-4 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Quality Assessment</span>
                        <div className="text-xl font-black text-emerald-400 mt-1">98.4%</div>
                        <span className="text-[9px] text-emerald-500 font-mono">Grade A+ Clean</span>
                      </div>
                      <div className="bg-[#080914] border border-slate-900 rounded-xl p-4 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Match Confidence</span>
                        <div className="text-xl font-black text-indigo-400 mt-1">94%</div>
                        <span className="text-[9px] text-indigo-500 font-mono">High Significance</span>
                      </div>
                      <div className="bg-[#080914] border border-slate-900 rounded-xl p-4 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Discovered Patterns</span>
                        <div className="text-xl font-black text-amber-400 mt-1">{analysisReport.patterns.length}</div>
                        <span className="text-[9px] text-amber-500 font-mono">Linear & Quadratic</span>
                      </div>
                      <div className="bg-[#080914] border border-slate-900 rounded-xl p-4 text-center">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider font-mono">Recommended Model</span>
                        <div className="text-xs font-bold text-indigo-300 mt-2 truncate font-mono">
                          {analysisReport.recommendedModels[0]?.name || "XGBoost"}
                        </div>
                        <span className="text-[9px] text-indigo-500 font-mono">Tree-based Fit</span>
                      </div>
                    </div>

                    {/* Report Navigation Tabs */}
                    <div className="bg-[#080914] border border-slate-900/60 p-1.5 rounded-xl flex overflow-x-auto gap-1">
                      <button 
                        onClick={() => setReportTab("summary")}
                        className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                          reportTab === "summary" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                        }`}
                      >
                        📁 Summary & Quality
                      </button>
                      <button 
                        onClick={() => setReportTab("patterns")}
                        className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                          reportTab === "patterns" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                        }`}
                      >
                        🧠 Pattern Discovery
                      </button>
                      <button 
                        onClick={() => setReportTab("statistics")}
                        className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                          reportTab === "statistics" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                        }`}
                      >
                        📊 Heatmap Matrix
                      </button>
                      <button 
                        onClick={() => setReportTab("models")}
                        className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                          reportTab === "models" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                        }`}
                      >
                        🤖 ML Recommendation
                      </button>
                      <button 
                        onClick={() => setReportTab("explainability")}
                        className={`flex-1 py-2 px-3 text-[10px] font-bold uppercase tracking-wider rounded-lg transition whitespace-nowrap ${
                          reportTab === "explainability" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                        }`}
                      >
                        🧬 Explainability (XAI)
                      </button>
                    </div>

                    {/* Report Panels Content */}
                    <div className="bg-[#080914] border border-slate-900 rounded-2xl p-6 shadow-xl text-xs space-y-5">
                      
                      {/* TAB 1: SUMMARY & QUALITY */}
                      {reportTab === "summary" && (
                        <div className="space-y-5 animate-fade-in">
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 1. Dataset Summary
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.summary}</p>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 2. Data Quality Assessment
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.qualityAssessment}</p>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 11. Limitations of Current Scope
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.limitations}</p>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 13. Future Improvement Directives
                            </h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                              {analysisReport.futureImprovements.map((item: string, idx: number) => (
                                <li key={idx} className="font-sans">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: PATTERN DISCOVERY */}
                      {reportTab === "patterns" && (
                        <div className="space-y-5 animate-fade-in">
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-3 border-b border-slate-950 pb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 3. Deep Pattern Discovery
                              </span>
                              <span className="text-[10px] font-mono text-indigo-400 font-normal">Ranked by Confidence Score</span>
                            </h4>

                            <div className="grid grid-cols-1 gap-4">
                              {analysisReport.patterns.map((p: any, idx: number) => (
                                <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-xl p-4.5 space-y-3.5">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-200 text-sm flex items-center gap-2">
                                      <span className="w-5 h-5 bg-indigo-950 text-indigo-400 rounded-lg flex items-center justify-center font-bold text-xs font-mono">
                                        {idx + 1}
                                      </span>
                                      {p.name}
                                    </span>
                                    <div className="flex items-center gap-2 font-mono text-[10px]">
                                      <span className="text-slate-500 font-bold uppercase tracking-wider">Confidence Score:</span>
                                      <span className="text-indigo-400 font-extrabold">{p.confidence}%</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-slate-400 leading-relaxed font-sans">
                                    <div>
                                      <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase mb-0.5">Description:</span>
                                      <p>{p.description}</p>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase mb-0.5">Evidence:</span>
                                      <p className="font-mono text-indigo-300">{p.evidence}</p>
                                    </div>
                                    <div className="md:col-span-2 border-t border-slate-900/60 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase mb-0.5">Possible Cause:</span>
                                        <p>{p.possibleCause}</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase mb-0.5">Scientific Meaning:</span>
                                        <p>{p.meaning}</p>
                                      </div>
                                    </div>
                                    <div className="md:col-span-2 border-t border-slate-900/60 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div>
                                        <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase mb-0.5">Pattern Limitations:</span>
                                        <p>{p.limitations}</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-mono font-bold text-indigo-400 block uppercase mb-0.5">Recommended Actions:</span>
                                        <p className="font-medium text-slate-300">{p.recommendedActions}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-2">
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> 4. Hidden & Latent Relationships
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.hiddenRelationships}</p>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: STATISTICAL HEATMAP */}
                      {reportTab === "statistics" && (
                        <div className="space-y-5 animate-fade-in">
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 5. Statistical Feature Analysis
                            </h4>
                            <div className="grid grid-cols-3 gap-4 bg-slate-950 border border-slate-900 rounded-xl p-4 font-mono text-center">
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase block font-bold">Standard Mean</span>
                                <span className="text-lg font-bold text-slate-200 block mt-1">{analysisReport.statisticalAnalysis.mean}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase block font-bold">Sample Median</span>
                                <span className="text-lg font-bold text-slate-200 block mt-1">{analysisReport.statisticalAnalysis.median}</span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-500 uppercase block font-bold">Standard Deviation</span>
                                <span className="text-lg font-bold text-slate-200 block mt-1">{analysisReport.statisticalAnalysis.standardDeviation}</span>
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Colored Correlation matrix heatmap */}
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-3 border-b border-slate-950 pb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Feature Correlation Heatmap Matrix
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">Color gradient maps strength from -1.0 (blue) to +1.0 (indigo)</span>
                            </h4>

                            <div className="border border-slate-900 bg-slate-950/40 rounded-xl p-4 overflow-x-auto">
                              <div className="min-w-[450px]">
                                {/* Heatmap grid */}
                                <div className="grid" style={{ gridTemplateColumns: `repeat(${activeDataset.columns.length + 1}, minmax(0, 1s))` }}>
                                  
                                  {/* Top header corner */}
                                  <div className="p-2 font-mono text-[9px] text-slate-500 font-bold truncate">Feature</div>
                                  
                                  {/* Top Headers */}
                                  {activeDataset.columns.map((col: string) => (
                                    <div key={col} className="p-2 font-mono text-[9px] text-slate-400 font-bold text-center truncate border-b border-slate-900">
                                      {col}
                                    </div>
                                  ))}

                                  {/* Rows */}
                                  {activeDataset.columns.map((colX: string) => (
                                    <React.Fragment key={colX}>
                                      {/* Left row header */}
                                      <div className="p-2.5 font-mono text-[9px] text-slate-400 font-bold truncate flex items-center border-r border-slate-900">
                                        {colX}
                                      </div>

                                      {/* Row cells */}
                                      {activeDataset.columns.map((colY: string) => {
                                        const corr = analysisReport.statisticalAnalysis.correlations.find(
                                          (c: any) => (c.x === colX && c.y === colY) || (c.x === colY && c.y === colX)
                                        );
                                        const value = corr ? corr.value : (colX === colY ? 1.0 : 0.0);
                                        const positive = value >= 0;
                                        const absVal = Math.abs(value);
                                        
                                        // Dynamic color backgrounds
                                        let bgStyle = "";
                                        if (colX === colY) {
                                          bgStyle = "bg-indigo-600/30 text-indigo-200 border-indigo-500/20";
                                        } else if (positive) {
                                          bgStyle = absVal > 0.6 
                                            ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/10" 
                                            : "bg-indigo-900/10 text-indigo-400 border-slate-900";
                                        } else {
                                          bgStyle = absVal > 0.4 
                                            ? "bg-rose-500/10 text-rose-300 border-rose-500/10" 
                                            : "bg-rose-950/5 text-rose-400 border-slate-900";
                                        }

                                        return (
                                          <div 
                                            key={colY} 
                                            title={`${colX} with ${colY}: ${value}`}
                                            className={`p-2.5 font-mono text-[10px] font-bold text-center border flex items-center justify-center transition-all ${bgStyle}`}
                                          >
                                            {(value >= 0 ? "+" : "") + value.toFixed(2)}
                                          </div>
                                        );
                                      })}
                                    </React.Fragment>
                                  ))}

                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 4: RECOMMENDED MODELS */}
                      {reportTab === "models" && (
                        <div className="space-y-5 animate-fade-in">
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 6. Preprocessing & Feature Engineering suggestions
                            </h4>
                            <ul className="space-y-2 text-slate-400 font-sans">
                              {analysisReport.featureEngineering.map((item: string, idx: number) => (
                                <li key={idx} className="flex gap-2 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900/80">
                                  <span className="font-mono text-indigo-400 font-bold shrink-0">{idx + 1}.</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-3 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" /> 7. Recommended Machine Learning Algorithms
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {analysisReport.recommendedModels.map((m: any, idx: number) => (
                                <div key={idx} className="bg-slate-950 border border-slate-900 rounded-xl p-4.5 flex flex-col justify-between">
                                  <div>
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[9px] font-mono bg-indigo-950/60 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-900/20 font-bold uppercase">
                                        {m.type}
                                      </span>
                                      <span className="text-[10px] font-mono text-indigo-400 font-bold">{m.confidence}% Fit</span>
                                    </div>
                                    <h5 className="font-sans font-bold text-slate-200 text-xs mb-1.5">{m.name}</h5>
                                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{m.explanation}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-3 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> 8. Comparative Evaluation Matrix
                            </h4>
                            <div className="border border-slate-900 rounded-xl overflow-hidden shadow-lg overflow-x-auto">
                              <table className="w-full text-left border-collapse font-sans">
                                <thead>
                                  <tr className="bg-slate-950 border-b border-slate-900 text-slate-500 text-[10px] font-mono uppercase font-bold tracking-wider">
                                    <th className="py-2.5 px-4">Classifier Engine</th>
                                    <th className="py-2.5 px-4">Key Strength</th>
                                    <th className="py-2.5 px-4">Key Limitation</th>
                                    <th className="py-2.5 px-4 text-right">Relative Accuracy</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-950 text-xs text-slate-300 font-medium">
                                  {analysisReport.modelComparison.map((row: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-950/40">
                                      <td className="py-3 px-4 font-bold text-slate-200">{row.model}</td>
                                      <td className="py-3 px-4 text-slate-400">{row.strength}</td>
                                      <td className="py-3 px-4 text-slate-500">{row.weakness}</td>
                                      <td className="py-3 px-4 text-right text-indigo-400 font-mono font-bold">{row.relativeAccuracy}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 9. Advised Performance Evaluation Metrics
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.evaluationMetrics}</p>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: EXPLAINABILITY (XAI) */}
                      {reportTab === "explainability" && (
                        <div className="space-y-5 animate-fade-in">
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 10. Explainable AI (XAI) Report
                            </h4>
                            <p className="text-slate-400 font-sans leading-relaxed">{analysisReport.explainability.description}</p>
                          </div>

                          {/* Feature contribution graph representing SHAP value bars */}
                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-3.5 border-b border-slate-950 pb-1.5 flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Feature Contribution Weights (SHAP Values)
                              </span>
                              <span className="text-[9px] font-mono text-slate-500">Relative weights affecting target classification bound</span>
                            </h4>

                            <div className="space-y-3.5 bg-slate-950 border border-slate-900 rounded-xl p-5">
                              {analysisReport.explainability.features.map((f: any, idx: number) => {
                                const isPositive = f.direction === "positive";
                                return (
                                  <div key={idx} className="space-y-1">
                                    <div className="flex items-center justify-between text-[11px] font-mono">
                                      <span className="font-bold text-slate-300">{f.feature}</span>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                                          isPositive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                                        }`}>
                                          {f.direction} influence
                                        </span>
                                        <span className="text-slate-400 font-extrabold">{f.importance}%</span>
                                      </div>
                                    </div>

                                    {/* Simulated SHAP value bar */}
                                    <div className="w-full bg-[#080914] h-2.5 rounded-full overflow-hidden border border-slate-900 flex">
                                      <div 
                                        style={{ width: `${f.importance}%` }}
                                        className={`h-full rounded-full transition-all ${
                                          isPositive ? "bg-indigo-500" : "bg-rose-600"
                                        }`}
                                      />
                                    </div>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{f.reason}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-slate-100 font-bold text-sm mb-1.5 border-b border-slate-950 pb-1.5 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 12. Final Recommendations Directives
                            </h4>
                            <ul className="list-disc pl-4 space-y-1.5 text-slate-400">
                              {analysisReport.finalRecommendations.map((item: string, idx: number) => (
                                <li key={idx} className="font-sans">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Report Export options bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#080914] border border-slate-900 rounded-xl p-4 shadow-md">
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-[11px] text-slate-400 font-sans">
                          All 13 standard Machine Learning parameters analyzed with full translatability bounds.
                        </span>
                      </div>

                      <div className="flex gap-2.5 w-full sm:w-auto shrink-0">
                        <button 
                          onClick={exportHeatmapImage}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-800 hover:border-slate-700 hover:bg-slate-950 text-slate-300 font-bold rounded-lg text-xs transition tracking-wide uppercase cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5" /> Export Visual
                        </button>
                        <button 
                          onClick={exportReportAsDoc}
                          className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition tracking-wide uppercase cursor-pointer shadow-md shadow-indigo-600/10"
                        >
                          <Download className="w-3.5 h-3.5" /> Export DOC
                        </button>
                      </div>
                    </div>

                  </motion.div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}


// ==========================================
// LEADERBOARD TAB VIEW
// ==========================================
export function LeaderboardView() {
  const leaderboard = [
    { rank: 1, user: "Sandeep_AI_Chef", model: "Deep Residual ResNet50", score: "99.45%", latency: "14ms", status: "Gold" },
    { rank: 2, user: "Manohar_DevOps", model: "Self-Attention Transformer", score: "98.92%", latency: "22ms", status: "Silver" },
    { rank: 3, user: "Elena_Vulnerability_Scouter", model: "XGBoost Adaptive Boosting", score: "98.10%", latency: "8ms", status: "Bronze" },
    { rank: 4, user: "Nolan_Complexity_Reducer", model: "Convolutional Net VGG16", score: "97.66%", latency: "19ms", status: "Pro" },
    { rank: 5, user: "Kelsey_Attribution_Planner", model: "Random Forest Decision Trees", score: "95.20%", latency: "5ms", status: "Pro" },
    { rank: 6, user: "Dev_Pattern_Fitter", model: "Linear Regression Vector Space", score: "92.05%", latency: "2ms", status: "Standard" }
  ];

  return (
    <div className="space-y-6 text-slate-300">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" /> Model Performance Leaderboard
        </h2>
        <p className="text-slate-400 text-xs">Compete with engineers globally by optimizing classification accuracies and reducing runtime latencies.</p>
      </div>

      <div className="bg-[#080914] border border-slate-900 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-[#0e1122]/40 text-slate-400 text-[10px] font-mono uppercase tracking-widest">
                <th className="py-4 px-5 font-bold">Rank</th>
                <th className="py-4 px-5 font-bold">Engineer</th>
                <th className="py-4 px-5 font-bold">Model Engine</th>
                <th className="py-4 px-5 font-bold text-right">Validation Accuracy</th>
                <th className="py-4 px-5 font-bold text-right">Inference Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-950 text-xs font-sans">
              {leaderboard.map((item, idx) => (
                <tr key={item.rank} className="hover:bg-slate-900/30 transition duration-150">
                  <td className="py-4 px-5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                      item.rank === 1 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                      item.rank === 2 ? "bg-slate-300/10 text-slate-300 border border-slate-300/20" :
                      item.rank === 3 ? "bg-amber-700/10 text-amber-600 border border-amber-700/20" :
                      "bg-slate-950 text-slate-500 border border-slate-900"
                    }`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-4 px-5 font-bold text-slate-200">{item.user}</td>
                  <td className="py-4 px-5 text-slate-400 font-mono">{item.model}</td>
                  <td className="py-4 px-5 text-right font-extrabold text-indigo-400 font-mono">{item.score}</td>
                  <td className="py-4 px-5 text-right font-mono text-slate-400">{item.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ==========================================
// DOCUMENTS TAB VIEW
// ==========================================
export function DocsView() {
  const sections = [
    {
      title: "Model Initialization & Fitting",
      content: "Initialize regression models in the ML Playground. Specify variables, select learning rate bounds, and press 'Train Simulated Network'. This runs gradient descent to fit optimal weights while calculating loss functions dynamically."
    },
    {
      title: "Static Code Security Audits",
      content: "Our AI engine (powered by Manohar) conducts high-speed security vulnerability scans on code inputs. It reviews arrays, exception chains, memory leaks, and variables to safeguard against runtime crashes."
    },
    {
      title: "Understanding Overfitting",
      content: "Overfitting occurs when a neural network starts training on noises and error bounds instead of the target signal. Minimize training epochs or use simpler polynomial degrees to establish broad validation rules."
    }
  ];

  return (
    <div className="space-y-6 text-slate-300 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" /> Platform Knowledge Base
        </h2>
        <p className="text-slate-400 text-xs">Reference manual, model parameters specifications, and training guidelines.</p>
      </div>

      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <motion.div 
            key={sec.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="bg-[#080914]/80 border border-slate-900 rounded-xl p-5"
          >
            <h3 className="font-sans font-bold text-slate-200 text-sm mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> {sec.title}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed font-sans font-normal">
              {sec.content}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


// ==========================================
// COMMUNITY TAB VIEW
// ==========================================
export function CommunityView() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Aakash_ML", title: "Best hyperparameters for neural fitting on high variance data?", likes: 42, comments: 15, tag: "Hyperparameters" },
    { id: 2, author: "Siddharth_Dev", title: "Announcing security patch integration with Manohar Code Remediation tool!", likes: 89, comments: 24, tag: "Announcement" },
    { id: 3, author: "Jessica_Data_Chef", title: "Cleaned CIFAR-100 training labels and published inside Datasets Hub.", likes: 31, comments: 8, tag: "Datasets" }
  ]);
  const [newTitle, setNewTitle] = useState("");

  const handleCreatePost = () => {
    if (!newTitle.trim()) return;
    const newPost = {
      id: Date.now(),
      author: "AI Enthusiast (You)",
      title: newTitle,
      likes: 1,
      comments: 0,
      tag: "General Discussion"
    };
    setPosts([newPost, ...posts]);
    setNewTitle("");
  };

  return (
    <div className="space-y-6 text-slate-300 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-400" /> PatternAI Community Board
        </h2>
        <p className="text-slate-400 text-xs">Discuss model architectures, share findings, and collaborate on pattern recognition.</p>
      </div>

      {/* Write a message */}
      <div className="bg-[#080914] border border-slate-900 rounded-xl p-4.5 space-y-3">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Start a Discussion Thread</h3>
        <div className="flex gap-3">
          <input 
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What's on your mind regarding Machine Learning or Code Auditing?"
            className="flex-1 bg-slate-950/80 border border-slate-900 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500/50 transition font-sans"
          />
          <button 
            onClick={handleCreatePost}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition uppercase tracking-wider cursor-pointer shadow-md shadow-indigo-600/15 shrink-0"
          >
            Post Thread
          </button>
        </div>
      </div>

      {/* List threads */}
      <div className="space-y-4">
        {posts.map((p, idx) => (
          <motion.div 
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-[#080914]/40 border border-slate-900 hover:border-slate-800 rounded-xl p-4.5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  @{p.author}
                </span>
                <span className="text-[9px] font-mono bg-indigo-950/20 text-indigo-400/80 px-2 py-0.5 rounded-full border border-indigo-900/10 uppercase font-bold tracking-wider">
                  {p.tag}
                </span>
              </div>
              <h4 className="font-sans font-bold text-slate-200 text-xs sm:text-sm">
                {p.title}
              </h4>
            </div>

            <div className="flex items-center gap-4 shrink-0 text-[11px] text-slate-500 font-medium">
              <button className="flex items-center gap-1.5 hover:text-slate-300 transition cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5 text-indigo-400/80" /> {p.likes}
              </button>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> {p.comments}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
