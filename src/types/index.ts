export interface BiasDetected {
  type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  metric: string;
  affectedGroup: string;
  confidence: number;
}

export interface HiddenProxy {
  variable: string;
  correlatesWith: string;
  correlationStrength: number;
  explanation: string;
}

export interface DemographicImpact {
  group: string;
  approvalRate: number;
  comparedToAverage: string;
}

export interface Recommendation {
  priority: number;
  action: string;
  impact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface FairnessMetrics {
  statisticalParity: number;
  equalOpportunity: number;
  predictiveParity: number;
  individualFairness: number;
}

export interface BiasAnalysis {
  overallFairnessScore: number;
  severityLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  summary: string;
  biasesDetected: BiasDetected[];
  hiddenProxies: HiddenProxy[];
  demographicImpact: DemographicImpact[];
  recommendations: Recommendation[];
  fairnessMetrics: FairnessMetrics;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  domain: string;
  description: string;
  datasetInfo: string;
  prompt: string;
}
