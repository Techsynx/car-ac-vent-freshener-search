/**
 * Vercel Serverless Function: /api/health
 * Health check and system capabilities endpoint
 */

export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    app: 'Car AC Vent Air Freshener Search Engine',
    version: '3.1.0',
    capabilities: [
      'multi_store_search',
      'ai_category_validation_q1',
      'ai_genuineness_scoring_q2',
      'supabase_cache_fallback',
      'ground_truth_benchmark_10_10',
    ],
    timestamp: new Date().toISOString(),
  });
}
