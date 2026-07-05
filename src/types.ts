/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AuditIssue {
  severity: "critical" | "high" | "medium" | "low" | "positive";
  category: "security" | "performance" | "quality" | "architecture" | "best-practice" | "testing" | "positive";
  title: string;
  description: string;
  suggestion: string;
  example?: string;
  priority: number; // 1-10
  location?: string; // line number or function name
  currentComplexity?: string;
  optimizedComplexity?: string;
  improvement?: string;
}

export interface AuditResult {
  issues: AuditIssue[];
  summary: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    positiveCount: number;
    overallScore: number; // 0 - 100
  };
}

export interface BugFixResponse {
  fixedCode: string;
  explanation: string;
}

// ML Model Simulation types
export interface MLModelDefinition {
  id: string;
  name: string;
  description: string;
  type: "classification" | "regression";
  features: { name: string; type: "numeric" | "categorical"; description: string; placeholder: string }[];
  classes?: string[]; // For classification
  parameters: { name: string; label: string; min: number; max: number; defaultValue: number; step: number }[];
}

export interface MLSimulateRequest {
  modelId: string;
  modelName: string;
  modelDescription: string;
  parameters: Record<string, number>;
  testInputs: Record<string, string | number>[];
}

export interface TrainingEpoch {
  epoch: number;
  loss: number;
  accuracy?: number; // for classification
  valLoss: number;
  valAccuracy?: number;
}

export interface PredictionResult {
  inputIndex: number;
  prediction: string | number;
  confidence?: number; // percentage
  explanation: string;
  featureImportances: { feature: string; importance: number }[]; // weights
}

export interface MLSimulateResponse {
  trainingHistory: TrainingEpoch[];
  predictions: PredictionResult[];
  modelSummary: {
    r2Score?: number;
    accuracy?: number;
    f1Score?: number;
    parametersExplanation: string;
  };
}

// Interactive JS Regression Playground Types
export interface DataPoint {
  x: number;
  y: number;
  id: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

