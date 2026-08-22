/**
 * Vercel Serverless Function: /api/search
 * Handles live e-commerce search, AI categorization & trust evaluation, and Supabase caching.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { q = 'lavender vent air freshener', force = 'false' } = req.query;
  const isForceFresh = force === 'true';

  try {
    const { searchVentAirFresheners } = await import('../src/lib/searchService.js');
    const result = await searchVentAirFresheners(q, isForceFresh);

    return res.status(200).json({
      success: true,
      query: q,
      ...result,
    });
  } catch (error) {
    console.error('Serverless Search Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Search API Error',
    });
  }
}
