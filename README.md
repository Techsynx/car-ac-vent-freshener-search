# 🚗 Car AC Vent Air Freshener Search Tool

> An AI-powered search tool that discovers real car AC vent-mounted air fresheners, filters out irrelevant categories (gel, sprays, hanging trees), evaluates listing trustworthiness, and offers offline caching with Supabase.

---

## 🌟 Key Features

1. **Live Multi-Store Search**: Finds real car vent fresheners across shopping platforms (Amazon, Walmart, Target, AutoZone).
2. **AI Category Verification**: Automatically asks AI: *"Is this really a car AC vent-mount air freshener?"* and drops non-vent items.
3. **AI Genuineness & Trust Scoring**: Evaluates rating, review volume, and price to score listings 0–100 with clear reasoning tags.
4. **Offline & Cached Fallback (Supabase)**: Saves recent searches (<24h). If live search quota expires or the network is offline, the app seamlessly serves cached products with a `'Saved'` badge.
5. **Trust-First Sorting**: Organizes results by genuine trust score first to protect buyers from fake/spam listings.
6. **Force Fresh Search**: Allows users to bypass the 24-hour cache and query live internet results on demand.
7. **10+10 Ground Truth Benchmark**: Includes an automated verification test suite evaluating AI classification against 10 genuine and 10 fake/wrong-category products.
8. **Modern Responsive UI**: Built with React, Vite, and Tailwind CSS with interactive badges, search presets, and mobile support.

---

## 🔬 API Research & Justification

- **Search API**: **SerpAPI / Tavily API Free Tier** + direct e-commerce query engine. Selected for structured product result extraction (price, ratings, store domain) with zero credit card requirements.
- **AI API**: **Google Gemini 2.0 / 1.5 Flash (Google AI Studio)** + Groq fallback. Selected for rapid structured JSON classification (15 RPM / 1,500 RPD free tier) to filter categories and evaluate listing genuineness in batches.

*See [`docs/api_research.md`](docs/api_research.md) for full 3-4 sentence justifications.*

---

## 🗄️ Database Architecture (Supabase / Postgres)

- `products`: Stores product name, link, source website, price, rating, review count, image, category verification status, genuine score, and timestamp.
- `search_cache`: Stores search term query, matched product IDs, last run date, and status (`live` vs `saved`).

*See [`supabase/schema.sql`](supabase/schema.sql) for table definitions and indexes.*

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
# AI & Search API Keys (Optional - built-in resilient fallbacks included)
VITE_GEMINI_API_KEY=
VITE_GROQ_API_KEY=
VITE_SERPAPI_KEY=
VITE_TAVILY_API_KEY=

# Supabase Database (Optional - in-memory storage fallback included)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Benchmark Test Suite (10+10 Dataset)
```bash
node scripts/eval_dataset.js
```

---

## 📦 Deployment (Vercel & Supabase)
1. Push code to GitHub repository (`Techsynx/car-ac-vent-freshener-search`).
2. Import repo into Vercel.
3. Configure environment variables in Vercel project settings.
4. Deploy with one click.
