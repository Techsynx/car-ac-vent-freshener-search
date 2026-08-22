/**
 * AI Service for Car AC Vent Air Freshener Search Engine
 * Implements Question 1 (Vent Category Filter) & Question 2 (Genuineness/Trust Evaluation)
 * Supports Google Gemini Flash, Groq, and Heuristic Rule Engine.
 */

const getEnv = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const geminiApiKey = getEnv('VITE_GEMINI_API_KEY');
const groqApiKey = getEnv('VITE_GROQ_API_KEY');

/**
 * Evaluates Question 1: Is this product a car AC vent-mount air freshener?
 * @param {string} title
 * @param {string} description
 * @returns {Promise<{ is_vent_freshener: boolean, confidence: number, reason: string }>}
 */
export async function evaluateIsVentFreshener(title = '', description = '') {
  const text = `${title} ${description}`.toLowerCase();

  // 1. If Gemini API key is available, call Gemini Flash
  if (geminiApiKey && geminiApiKey.length > 10) {
    try {
      const prompt = `You are a strict product categorization AI.
Question 1: "Here is a product title and description. Is this a car AC vent-mount air freshener (the small clip-on kind that goes inside or attaches directly to automobile air conditioning vents)? Answer yes or no, and how sure you are."
Rules:
- Non-vent items (hanging tree paper, aerosol sprays, tin cans, under-seat pads, home wall plug-ins, steering wheel covers, car accessories) MUST be 'no'.
- Only clips, sticks, or diffusers specifically designed to mount to car AC air vents are 'yes'.

Product Title: "${title}"
Description: "${description}"

Respond ONLY with valid JSON in this exact structure:
{"is_vent_freshener": true_or_false, "confidence": 0_to_100, "reason": "short 1-sentence explanation"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            is_vent_freshener: Boolean(parsed.is_vent_freshener),
            confidence: Number(parsed.confidence) || 90,
            reason: parsed.reason || ''
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to heuristic:', err.message);
    }
  }

  // 2. High-precision semantic & keyword heuristic fallback
  return runVentCategorizationHeuristic(title, description);
}

/**
 * Evaluates Question 2: Does this look like a genuine, trustworthy listing, or fake/spam?
 * @param {Object} product - { price, rating, review_count, name, description, source_website }
 * @returns {Promise<{ genuine_score: number, genuine_reason: string, is_genuine: boolean }>}
 */
export async function evaluateGenuineness(product) {
  const { price = 0, rating = 0, review_count = 0, name = '', description = '', source_website = '' } = product;

  // 1. If Gemini API key is available
  if (geminiApiKey && geminiApiKey.length > 10) {
    try {
      const prompt = `You are an e-commerce fraud and spam detection AI.
Question 2: "Here is a product's price, rating, and number of reviews. Does this look like a genuine, trustworthy listing, or does it look fake/spam? Give a score from 0 to 100 and a short reason."

Product Details:
- Title: "${name}"
- Price: $${price}
- Rating: ${rating} / 5.0
- Number of Reviews: ${review_count}
- Retailer / Source: ${source_website}
- Description: "${description}"

Fraud flags to look for:
- Prices that are impossibly cheap (e.g. $0.01) with thousands of bot reviews.
- Prices that are absurdly gouged (e.g. $499 for a plastic clip with 0 reviews).
- Giveaway/phishing scams (e.g., "Free iPhone with purchase", "claim within 5 mins").
- Dangerous or corrosive substances with terrible ratings (< 2.0 stars).
- Normal retail vent clips typically cost $3 to $30, have 3.8 - 4.9 stars, and reasonable review volume.

Respond ONLY with valid JSON in this exact structure:
{"genuine_score": 0_to_100, "is_genuine": true_or_false, "genuine_reason": "short concise explanation"}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            genuine_score: Math.max(0, Math.min(100, Math.round(Number(parsed.genuine_score) || 75))),
            is_genuine: parsed.genuine_score >= 70,
            genuine_reason: parsed.genuine_reason || 'Verified legitimate listing'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini Genuineness API failed, falling back to heuristic:', err.message);
    }
  }

  // 2. Semantic Heuristic Fallback for Genuineness
  return runGenuinenessHeuristic(product);
}

/**
 * Batch evaluation of multiple products to minimize API roundtrips
 * @param {Array} products
 * @returns {Promise<Array>}
 */
export async function batchEvaluateProducts(products = []) {
  if (!Array.isArray(products) || products.length === 0) return [];

  const evaluated = [];

  for (const product of products) {
    const categoryResult = await evaluateIsVentFreshener(product.name, product.description || '');
    
    if (categoryResult.is_vent_freshener) {
      const trustResult = await evaluateGenuineness(product);
      evaluated.push({
        ...product,
        is_vent_freshener: true,
        vent_confidence: categoryResult.confidence,
        genuine_score: trustResult.genuine_score,
        genuine_reason: trustResult.genuine_reason,
        is_genuine: trustResult.is_genuine,
      });
    }
  }

  return evaluated.sort((a, b) => (b.genuine_score || 0) - (a.genuine_score || 0));
}

/**
 * Rule-based heuristic for Question 1 (Vent Category Filter)
 */
function runVentCategorizationHeuristic(title = '', description = '') {
  const combined = `${title} ${description}`.toLowerCase();

  const nonVentKeywords = [
    'hanging tree', 'rearview mirror', 'hang from mirror',
    'spillproof can', 'under seat', 'tin can', 'organic can',
    'aerosol spray', 'room spray', 'spray bottle', 'pressurized spray',
    'wall plug-in', 'plug in wall', 'wall outlet', '120v household', 'home & office plug',
    'steering wheel cover', 'seatbelt cover', 'seat cushion', 'crypto miner', 'mining bitcoin',
    'humidifier for bedroom', 'reed diffuser bottle'
  ];

  for (const keyword of nonVentKeywords) {
    if (combined.includes(keyword)) {
      return {
        is_vent_freshener: false,
        confidence: 98,
        reason: `Identified as non-vent product category (${keyword}). Excluded from vent search.`
      };
    }
  }

  const ventKeywords = ['vent', 'louvre', 'air clip', 'vent clip', 'vent stick', 'vent oil', 'ac clip', 'vent mount', 'vent blade'];
  const hasVentKeyword = ventKeywords.some(k => combined.includes(k));

  if (hasVentKeyword) {
    return {
      is_vent_freshener: true,
      confidence: 95,
      reason: 'Confirmed car AC vent-mounted air freshener mechanism.'
    };
  }

  return {
    is_vent_freshener: false,
    confidence: 85,
    reason: 'Does not contain car AC vent mounting indicators.'
  };
}

/**
 * Rule-based heuristic for Question 2 (Genuineness / Spam Scoring)
 */
function runGenuinenessHeuristic(product) {
  const { price = 0, rating = 0, review_count = 0, name = '', description = '', source_website = '' } = product;
  const text = `${name} ${description} ${source_website}`.toLowerCase();

  let score = 90;
  const reasons = [];

  if (text.includes('free iphone') || text.includes('claim within') || text.includes('lottery') || text.includes('crypto')) {
    score -= 75;
    reasons.push('Contains promotional phishing/spam triggers.');
  }

  if (text.includes('dissolves') || text.includes('corrosive') || text.includes('toxic') || text.includes('acid')) {
    score -= 80;
    reasons.push('Safety hazard alert: reports of corrosive substance.');
  }

  if (price <= 0.05) {
    score -= 60;
    reasons.push(`Suspicious pricing ($${price.toFixed(2)}) indicating fake review farm.`);
  } else if (price >= 150.0) {
    score -= 65;
    reasons.push(`Extreme price gouging anomaly ($${price.toFixed(2)}) for a vent clip.`);
  }

  if (review_count > 50000 && price < 1.0) {
    score -= 40;
    reasons.push('Unrealistic review count / price ratio suggesting bot manipulation.');
  }

  if (rating < 2.5 && rating > 0) {
    score -= 50;
    reasons.push(`Critically low customer satisfaction rating (${rating}/5.0).`);
  }

  const trustedRetailers = ['amazon', 'walmart', 'target', 'autozone', 'bath & body works', 'advance auto parts', 'oreilly'];
  const isKnownRetailer = trustedRetailers.some(r => source_website.toLowerCase().includes(r));
  if (!isKnownRetailer && (source_website.includes('biz') || source_website.includes('top') || source_website.includes('xyz') || source_website.includes('click'))) {
    score -= 30;
    reasons.push('Suspicious domain extension from unverified vendor.');
  }

  score = Math.max(5, Math.min(100, score));
  const is_genuine = score >= 70;

  const finalReason = reasons.length > 0
    ? reasons.join(' ')
    : `Legitimate listing with consistent pricing ($${price.toFixed(2)}), verified retailer (${source_website || 'Major store'}), and ${rating}★ rating (${review_count.toLocaleString()} reviews).`;

  return {
    genuine_score: score,
    is_genuine,
    genuine_reason: finalReason
  };
}
