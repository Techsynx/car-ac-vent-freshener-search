/**
 * Vercel Serverless Function: /api/evaluate
 * Evaluates the 10+10 ground truth dataset and returns precision, recall, and accuracy metrics.
 */

import { GROUND_TRUTH_DATASET } from '../src/lib/dataset.js';
import { evaluateIsVentFreshener, evaluateGenuineness } from '../src/lib/aiService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const evaluated = [];
    let catMatches = 0;
    let trustMatches = 0;

    for (const item of GROUND_TRUTH_DATASET) {
      const catRes = await evaluateIsVentFreshener(item.name, item.description);
      const trustRes = await evaluateGenuineness(item);

      const isCatMatch = catRes.is_vent_freshener === item.expected_is_vent;
      const isTrustMatch = trustRes.is_genuine === item.expected_genuine;

      if (isCatMatch) catMatches++;
      if (isTrustMatch) trustMatches++;

      evaluated.push({
        ...item,
        actual_is_vent: catRes.is_vent_freshener,
        actual_vent_conf: catRes.confidence,
        actual_genuine: trustRes.is_genuine,
        actual_genuine_score: trustRes.genuine_score,
        actual_reason: trustRes.genuine_reason,
        isCatMatch,
        isTrustMatch,
      });
    }

    const total = GROUND_TRUTH_DATASET.length;
    const catAccuracy = ((catMatches / total) * 100).toFixed(1);
    const trustAccuracy = ((trustMatches / total) * 100).toFixed(1);
    const overallAccuracy = (((catMatches + trustMatches) / (total * 2)) * 100).toFixed(1);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        catAccuracy: `${catAccuracy}%`,
        trustAccuracy: `${trustAccuracy}%`,
        overallAccuracy: `${overallAccuracy}%`,
        catMatches,
        trustMatches,
      },
      results: evaluated,
    });
  } catch (error) {
    console.error('Evaluation API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Benchmark Evaluation Failed',
    });
  }
}
