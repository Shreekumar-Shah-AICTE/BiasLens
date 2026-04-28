import { GoogleGenAI } from '@google/genai';
import type { BiasAnalysis } from '../types';

const SYSTEM_PROMPT = `You are BiasLens, an advanced AI fairness auditor. You analyze datasets and automated decision systems for hidden bias and discrimination.

When given a scenario describing an AI decision system, you MUST respond with ONLY valid JSON (no markdown, no code blocks, no explanation outside the JSON) in this exact schema:

{
  "overallFairnessScore": <number 0-100, where 100 is perfectly fair>,
  "severityLevel": "<CRITICAL|HIGH|MODERATE|LOW>",
  "summary": "<2-3 sentence executive summary of findings>",
  "biasesDetected": [
    {
      "type": "<Gender|Racial|Age|Socioeconomic|Geographic|Disability>",
      "severity": "<CRITICAL|HIGH|MODERATE|LOW>",
      "metric": "<specific statistical finding>",
      "affectedGroup": "<the disadvantaged group>",
      "confidence": <number 0-100>
    }
  ],
  "hiddenProxies": [
    {
      "variable": "<the seemingly neutral variable>",
      "correlatesWith": "<the protected attribute it masks>",
      "correlationStrength": <number 0-100>,
      "explanation": "<plain language explanation of why this is dangerous>"
    }
  ],
  "demographicImpact": [
    {
      "group": "<demographic group name>",
      "approvalRate": <number 0-100>,
      "comparedToAverage": "<+X% or -X%>"
    }
  ],
  "recommendations": [
    {
      "priority": <1-5, 1 being most urgent>,
      "action": "<specific actionable fix>",
      "impact": "<expected improvement>",
      "effort": "<LOW|MEDIUM|HIGH>"
    }
  ],
  "fairnessMetrics": {
    "statisticalParity": <number 0-100>,
    "equalOpportunity": <number 0-100>,
    "predictiveParity": <number 0-100>,
    "individualFairness": <number 0-100>
  }
}

Generate realistic, detailed, and technically sound bias analysis. Include at least 3 biases detected, 3 hidden proxies, 5 demographic groups, and 4 recommendations. Make the hidden proxies particularly insightful — find non-obvious correlations that would surprise a data scientist. Be very specific with numbers and percentages. Return ONLY the JSON object, nothing else.`;

export async function analyzeBias(apiKey: string, scenarioPrompt: string): Promise<BiasAnalysis> {
  console.log('[BiasLens] Starting analysis with model: gemini-2.5-flash');
  
  try {
    const client = new GoogleGenAI({ apiKey });

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: scenarioPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
        topP: 0.9,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text ?? '';
    console.log('[BiasLens] Raw response length:', responseText.length);
    console.log('[BiasLens] Raw response preview:', responseText.substring(0, 200));

    // Clean potential markdown wrapping
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    }
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const analysis: BiasAnalysis = JSON.parse(cleaned);
    console.log('[BiasLens] Analysis parsed successfully. Fairness score:', analysis.overallFairnessScore);
    return analysis;
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[BiasLens] FULL ERROR:', error);
    console.error('[BiasLens] Error message:', error.message);
    console.error('[BiasLens] Error name:', error.name);
    if ('status' in error) {
      console.error('[BiasLens] HTTP status:', (error as any).status);
    }
    if ('errorDetails' in error) {
      console.error('[BiasLens] Error details:', (error as any).errorDetails);
    }
    throw error;
  }
}
