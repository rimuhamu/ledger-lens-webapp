/**
 * Groundedness Scoring Utilities
 * 
 * This module implements gap analysis to detect potential AI hallucinations
 * by comparing retrieval confidence (what we know from documents) with
 * generation confidence (how certain the AI is in its response).
 * 
 * Formula:
 * - R (Retrieval Average) = Average of retrieval_scores
 * - G (Generation Confidence) = exp(Average of generation_logprobs)
 * - Gap = max(0, G - R) → "Is the AI more confident than the facts allow?"
 * - Hallucination Risk when Gap > 0.15
 */

export interface GroundednessResult {
  R: number;              // Retrieval average (0-1)
  G: number;              // Generation confidence (0-1)
  gap: number;            // G - R (can be negative)
  isHallucinationRisk: boolean;
  status: 'PASS' | 'WARNING' | 'INCOMPLETE';
  statusReason: string;
}

const HALLUCINATION_GAP_THRESHOLD = 0.15;
const HIGH_CONFIDENCE_THRESHOLD = 0.7;
const LOW_RETRIEVAL_THRESHOLD = 0.6;
const HIGH_GENERATION_THRESHOLD = 0.8;

/**
 * Calculate the average of an array of numbers
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Convert log probabilities to a confidence score (0-1)
 * Uses exponential of the average log probability
 */
function logprobsToConfidence(logprobs: number[]): number {
  if (logprobs.length === 0) return 0;
  const avgLogprob = average(logprobs);
  return Math.exp(avgLogprob);
}

/**
 * Determine the groundedness status based on R and G values
 */
function determineStatus(R: number, G: number, gap: number): {
  status: 'PASS' | 'WARNING' | 'INCOMPLETE';
  statusReason: string;
} {
  // WARNING: High hallucination risk (AI is very confident but retrieval is weak)
  if (R < LOW_RETRIEVAL_THRESHOLD && G > HIGH_GENERATION_THRESHOLD) {
    return {
      status: 'WARNING',
      statusReason: `High hallucination risk detected. AI confidence (${(G * 100).toFixed(0)}%) significantly exceeds document evidence (${(R * 100).toFixed(0)}%).`
    };
  }

  // INCOMPLETE: Both R and G are low (not enough data or low confidence overall)
  if (R < LOW_RETRIEVAL_THRESHOLD && G < LOW_RETRIEVAL_THRESHOLD) {
    return {
      status: 'INCOMPLETE',
      statusReason: `Insufficient data. Both retrieval quality (${(R * 100).toFixed(0)}%) and AI confidence (${(G * 100).toFixed(0)}%) are low.`
    };
  }

  // PASS: Good retrieval and good generation confidence
  if (R > HIGH_CONFIDENCE_THRESHOLD && G > HIGH_CONFIDENCE_THRESHOLD) {
    return {
      status: 'PASS',
      statusReason: `Well-grounded response. High retrieval quality (${(R * 100).toFixed(0)}%) matches strong AI confidence (${(G * 100).toFixed(0)}%).`
    };
  }

  // PASS with caution: Decent scores but check the gap
  if (gap > HALLUCINATION_GAP_THRESHOLD) {
    return {
      status: 'WARNING',
      statusReason: `Confidence gap detected. AI confidence (${(G * 100).toFixed(0)}%) may exceed available evidence (${(R * 100).toFixed(0)}%).`
    };
  }

  return {
    status: 'PASS',
    statusReason: `Acceptable groundedness. Retrieval quality: ${(R * 100).toFixed(0)}%, AI confidence: ${(G * 100).toFixed(0)}%.`
  };
}

/**
 * Calculate groundedness metrics from retrieval scores and generation log probabilities
 * 
 * @param retrievalScores - Array of similarity scores (0-1) for each retrieved chunk
 * @param logprobs - Array of log probabilities for generated tokens
 * @returns GroundednessResult with metrics and status
 */
export function calculateGroundedness(
  retrievalScores: number[],
  logprobs: number[]
): GroundednessResult {
  // Calculate R: Average retrieval score
  const R = average(retrievalScores);

  // Calculate G: Generation confidence from log probabilities
  const G = logprobsToConfidence(logprobs);

  // Calculate the gap (how much AI confidence exceeds retrieval quality)
  const gap = G - R;

  // Determine if there's a hallucination risk
  const isHallucinationRisk = gap > HALLUCINATION_GAP_THRESHOLD;

  // Determine overall status
  const { status, statusReason } = determineStatus(R, G, gap);

  return {
    R,
    G,
    gap,
    isHallucinationRisk,
    status,
    statusReason
  };
}

/**
 * Check if retrieval is consensus-based (multiple good sources) or single-source reliant
 * 
 * @param retrievalScores - Array of similarity scores
 * @returns Object indicating consensus type
 */
export function analyzeRetrievalConsensus(retrievalScores: number[]): {
  type: 'consensus' | 'single-source' | 'weak';
  description: string;
  topScoresCount: number;
} {
  if (retrievalScores.length === 0) {
    return {
      type: 'weak',
      description: 'No retrieval data available',
      topScoresCount: 0
    };
  }

  // Count how many scores are "high quality" (> 0.7)
  const highQualityCount = retrievalScores.filter(score => score > 0.7).length;

  if (highQualityCount >= 4) {
    return {
      type: 'consensus',
      description: `Strong consensus across ${highQualityCount} sources`,
      topScoresCount: highQualityCount
    };
  } else if (highQualityCount >= 1 && highQualityCount <= 2) {
    return {
      type: 'single-source',
      description: `Relying on ${highQualityCount} primary source(s)`,
      topScoresCount: highQualityCount
    };
  } else {
    return {
      type: 'weak',
      description: 'Weak retrieval quality across all sources',
      topScoresCount: 0
    };
  }
}
