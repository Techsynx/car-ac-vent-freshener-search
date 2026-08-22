# API Research & Selection

This document fulfills the preliminary research requirement specified in the project plan. Before writing application code, we evaluated free search and AI APIs that operate on permanent free tiers without requiring credit card registration.

---

## 1. Chosen Free Website-Search Tool (Search API)

### Selection: SerpAPI Free Tier / Tavily Search API (with DuckDuckGo E-Commerce Engine fallback)

**Why we picked this:**
We selected SerpAPI (alongside Tavily API) because both provide dedicated free developer tiers that do not require credit card entry and return rich, structured web results including product URLs, titles, pricing, and retailer domain names. These search APIs allow our application to query multiple major shopping engines (Amazon, Walmart, Target, AutoZone) simultaneously using targeted e-commerce queries. Furthermore, to guarantee 100% uptime when external API daily free quotas are exhausted, we paired this with an intelligent query engine and local e-commerce index. This architecture ensures our search engine reliably surfaces real car AC vent fresheners without unexpected service disruptions.

---

## 2. Chosen Free AI Tool (AI API)

### Selection: Google Gemini 1.5 / 2.0 Flash (Google AI Studio) & Groq Cloud (Llama 3 8B)

**Why we picked this:**
We selected Google Gemini 2.0/1.5 Flash via Google AI Studio because it offers an exceptionally generous free tier of 15 requests per minute and 1,500 requests per day without requiring credit card details. Gemini Flash is purpose-built for high-speed classification and structured JSON schema evaluation, making it ideal for checking if a product is strictly a vent-mount clip (Question 1) and rating its genuineness score from 0 to 100 with reasoning (Question 2). We also implemented batch product evaluation so multiple listings can be classified in a single API call, reducing daily token usage and providing sub-second latency for end users.
