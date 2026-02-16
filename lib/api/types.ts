export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  created_at: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  user: UserResponse
}

// Document Types
export interface DocumentResponse {
  document_id: string
  ticker: string
  filename: string
  created_at: string
  s3_key?: string
}

export interface DocumentIngestResponse {
  document_id: string
  num_chunks: number
  num_pages: number
  s3_key: string
  status: string
}

// Analysis Types
export interface AnalysisRequest {
  query: string
}

export type RiskSeverity = 'LOW' | 'MED' | 'HIGH'
export type RiskLevel = 'Low' | 'Moderate' | 'High'

export interface KeyHighlight {
  icon: string
  text: string
  metric_value?: string
}

export interface RiskFactor {
  icon: string
  name: string
  severity: RiskSeverity
}

export interface SentimentData {
  score: number
  change?: string
  description: string
}

export interface RiskData {
  level: RiskLevel
  description: string
}

export interface AIIntelligenceHubData {
  key_highlights: KeyHighlight[]
  sentiment: SentimentData
  risk: RiskData
  risk_factors: RiskFactor[]
  suggested_questions: string[]
}

export interface ConfidenceMetric {
  label: string
  value: string
  ratio: number
}

export interface ConfidenceData {
  overall_level: "low" | "moderate" | "high"
  metrics: ConfidenceMetric[]
}

// Gap Analysis Types
export interface TokenConfidence {
  token: string
  logprob: number
  probability: number  // For heatmap visualization (0-1)
}

export interface GroundednessMetrics {
  retrieval_avg: number      // R: Average retrieval score (0-1)
  generation_avg: number     // G: Generation confidence (0-1)
  gap: number                // G - R
  status: 'PASS' | 'WARNING' | 'INCOMPLETE'
  status_reason: string
  hallucination_risk: boolean
}

export interface AnalysisResponse {
  answer: string
  verification_status: 'PASS' | 'FAIL'
  intelligence_hub: AIIntelligenceHubData
  confidence_metrics?: ConfidenceData
  retrieval_scores?: number[]
  retrieved_sources?: string[]
  generation_logprobs?: number[]
  token_confidences?: TokenConfidence[]  // Token-level data for heatmap
  groundedness?: GroundednessMetrics     // Calculated on frontend
  metadata: {
    document_id: string
  }
}

// Error Types
export interface APIError {
  detail: string
  status?: number
}

export interface DashboardStats {
  total_reports: number
  last_analysis: string | null
  ai_accuracy_score: number
  sentiment_distribution: Record<string, number>
}

// Analysis Progress Types
export type AnalysisStatusType = 'pending' | 'in_progress' | 'completed' | 'failed'
export type AnalysisStage = 'uploading' | 'research' | 'analysis' | 'validation' | 'intelligence' | 'complete'

export interface AnalysisStatus {
  status: AnalysisStatusType
  current_stage: AnalysisStage
  stage_index: number
  total_stages: number
  message: string
}

