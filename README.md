<div align="center">

# 🌿 Carbon Trace

### AI-Powered Personal Carbon Footprint Tracker

**PromptWars Virtual Hackathon — Climate Tech Vertical**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google)](https://cloud.google.com/vertex-ai)
[![Cloud Run](https://img.shields.io/badge/Google_Cloud-Cloud_Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

</div>

---

## 🎯 Chosen Vertical

**Climate Tech — Carbon Footprint Awareness Platform**

Carbon Trace addresses the growing need for individuals to understand, quantify, and act on their personal contribution to greenhouse gas emissions. While national and corporate sustainability data is widely reported, personal carbon literacy remains low — most people have no intuitive sense of how their daily choices (diet, transport, energy) translate into kg of CO₂e per year.

Carbon Trace bridges that gap with a guided calculator, live visual analytics, and Gemini-powered recommendations that are specific to *the user's actual data* — not generic climate advice.

---

## 💡 Approach and Logic

### Context-Injection AI Pattern

Rather than sending a generic prompt like *"give me carbon reduction tips"*, Carbon Trace injects the user's exact numerical footprint breakdown into every Gemini inference call. The model receives:

```
Transport:    842 kg CO₂e
Home Energy:  310 kg CO₂e
Food & Diet:  620 kg CO₂e
Shopping:     195 kg CO₂e
Waste:         43 kg CO₂e
Total:      2,010 kg CO₂e  (vs. India avg 1,900 kg | Paris target 2,000 kg)
```

This ensures every recommendation is **calibrated to the individual's highest-impact categories** — a user with high transport emissions gets EV/public-transit advice, while a user with high food emissions gets dietary shift recommendations with estimated savings.

### Emission Factor Methodology

All calculation factors are sourced from peer-reviewed and government publications:

| Category | Emission Factor | Source |
|---|---|---|
| Car (petrol) | 0.171 kg CO₂e / km | IPCC AR6 |
| Car (diesel) | 0.159 kg CO₂e / km | IPCC AR6 |
| Motorbike | 0.114 kg CO₂e / km | IPCC AR6 |
| Bus / Public transit | 0.089 kg CO₂e / km | IPCC AR6 |
| Short-haul flight | 0.255 kg CO₂e / km | IPCC AR6 + RF multiplier |
| Electricity (India grid) | 0.716 kg CO₂e / kWh | CEA 2023 |
| LPG cooking gas | 2.983 kg CO₂e / kg | IPCC AR6 |
| Beef | 27.0 kg CO₂e / kg | FAO |
| Chicken | 6.9 kg CO₂e / kg | FAO |
| Clothing | 14.5 kg CO₂e / item | Industry estimate |
| Electronics | 65.0 kg CO₂e / item | Industry estimate |

### AI Model

**Gemini 2.5 Flash** via Google Cloud Vertex AI (service account authentication). Configured with:
- `temperature: 0.2` — deterministic, factual output
- `responseMimeType: application/json` — enforces structured schema matching
- In-memory rate limiting: 10 requests / IP / minute

### Security Architecture

- All Gemini/Vertex AI calls are **server-side only** (`/api/insights` route handler)
- No API keys or credentials exposed to the browser
- Service account uses Workload Identity on Cloud Run (no JSON key files)
- All user input validated with **Zod schemas** before reaching the AI
- Rate limiting prevents abuse without requiring authentication

---

## ⚙️ How the Solution Works

```
User Journey
──────────────────────────────────────────────────────────────

  Step 1 — Calculate
  ┌─────────────────────────────────────────────────────┐
  │  5-step guided calculator:                          │
  │  Transport → Energy → Food → Shopping → Waste       │
  │                                                     │
  │  Each step computes kg CO₂e live using              │
  │  research-backed emission factors                   │
  └────────────────────────┬────────────────────────────┘
                           │ React Context (FootprintContext)
                           ▼

  Step 2 — Visualise
  ┌─────────────────────────────────────────────────────┐
  │  Dashboard:                                         │
  │  • Donut chart — category breakdown                 │
  │  • Bar chart — vs India avg & global avg            │
  │  • Carbon Score card — vs Paris Agreement 2,000 kg  │
  │  • Committed savings tracker (localStorage)         │
  └────────────────────────┬────────────────────────────┘
                           │ POST /api/insights
                           ▼

  Step 3 — Act
  ┌─────────────────────────────────────────────────────┐
  │  AI Insights (Gemini 2.5 Flash):                    │
  │  • 5 ranked, specific recommendations               │
  │  • Estimated kg CO₂e saved / year                   │
  │  • Difficulty label: Easy / Medium / Hard           │
  │  • "Commit to action" → persists in localStorage    │
  │    and updates projected savings total              │
  └─────────────────────────────────────────────────────┘
```

**Data flow:**
1. User fills calculator → data stored in React Context
2. Dashboard reads context → renders charts with `recharts` (dynamically loaded via `next/dynamic`)
3. "Get AI Insights" → POST to `/api/insights` with full footprint payload
4. Route validates with Zod → computes totals → injects into Gemini prompt
5. Gemini 2.5 Flash returns structured JSON → displayed as action cards
6. User commits to actions → saved in `localStorage` → shown as running CO₂ reduction total

---

## 📐 Assumptions Made

| Assumption | Detail |
|---|---|
| Emission factors are averages | Individual vehicle efficiency, regional grid mix, and agricultural practices may vary |
| Flight RF multiplier applied | Per IPCC AR6 methodology, short-haul factor includes 2× radiative forcing uplift |
| Food = production stage only | Consumer-side transport emissions for groceries not included |
| Shopping factors are conservative | Clothing: 14.5 kg/item; Electronics: 65 kg/item — based on lifecycle assessments |
| Waste recycling ceiling | 100% recycling rate reduces waste emissions by 40% (not 100%) |
| No PII stored | All user data lives in browser `localStorage` only; nothing is persisted server-side |
| Benchmarks | India avg: 1,900 kg/yr · Global avg: 4,800 kg/yr · Paris target: 2,000 kg/yr |
| Single-occupant car assumed | Transport calculations do not account for carpooling |

---

## 🚀 Deployment — Google Cloud Run

This app is containerised with a production-optimised multi-stage Dockerfile and deployed on **Google Cloud Run** (`us-central1` — lowest cost, highest availability).

### Live URL
> Deployed at: `https://carbontrace-app-<hash>-uc.a.run.app`
> *(auto-assigned after first deploy)*

### Deploy from source (one-time setup)

```bash
# 1. Set your project
gcloud config set project carbontrace-app

# 2. Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  aiplatform.googleapis.com

# 3. Create Artifact Registry repository
gcloud artifacts repositories create carbontrace \
  --repository-format=docker \
  --location=us-central1

# 4. Create service account for Cloud Run
gcloud iam service-accounts create carbontrace-sa \
  --display-name="CarbonTrace Cloud Run SA"

# 5. Grant Vertex AI access to the service account
gcloud projects add-iam-policy-binding carbontrace-app \
  --member="serviceAccount:carbontrace-sa@carbontrace-app.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"

# 6. Build & deploy (Cloud Build handles everything)
gcloud builds submit --config cloudbuild.yaml \
  --substitutions=COMMIT_SHA=$(git rev-parse --short HEAD)
```

### Or deploy directly with a single command

```bash
gcloud run deploy carbontrace-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --service-account carbontrace-sa@carbontrace-app.iam.gserviceaccount.com \
  --set-env-vars GCP_PROJECT_ID=carbontrace-app,GCP_LOCATION=us-central1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 10
```

> **Cost note:** `--min-instances=0` means the service scales to zero when idle — you only pay for actual request processing. Ideal for hackathon demos.

### Local Development

```bash
git clone https://github.com/YOUR_USERNAME/carbontrace-app
cd carbontrace-app
cp .env.example .env.local
# Edit .env.local with your GCP_PROJECT_ID and GCP_LOCATION

npm install
npm run dev
# → http://localhost:3000
```

### Docker (local)

```bash
docker build -t carbontrace-app .
docker run -p 3000:8080 \
  -e GCP_PROJECT_ID=carbontrace-app \
  -e GCP_LOCATION=us-central1 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/secrets/sa.json \
  -v /path/to/sa.json:/secrets/sa.json \
  carbontrace-app
```

---

## 🧪 Testing

```bash
npm test          # Run Jest unit tests
npm run lint      # ESLint
npm run build     # TypeScript compile + Next.js production build
```

**Test coverage:**
- Carbon calculation logic (8 unit tests)
- Zero inputs, category breakdowns, India grid factor, beef factor, recycling ceiling, typical household range

---

## 🛠 Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js App Router | 14.2 | Full-stack framework + API routes |
| TypeScript | 5 (strict) | Type safety across entire codebase |
| Tailwind CSS | 3.4 | Utility-first styling |
| Recharts | 3.8 | Donut + bar chart visualizations (dynamic loaded) |
| Gemini 2.5 Flash | via Vertex AI | Context-injection AI recommendations |
| `@google/genai` SDK | 2.9 | Google Gen AI client (Vertex AI backend) |
| Zod | 4.4 | Runtime input validation + TypeScript inference |
| Jest + ts-jest | 30 / 29 | Unit testing for calculation logic |
| React Context | — | Global footprint state |
| `localStorage` | — | Client-side action commitment persistence |

---

## 📁 Project Structure

```
carbontrace-app/
├── Dockerfile               # Multi-stage production image (Alpine, port 8080)
├── cloudbuild.yaml          # Cloud Build pipeline → Artifact Registry → Cloud Run
├── next.config.mjs          # standalone output for Docker
├── src/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── calculator/      # 5-step guided footprint calculator
│   │   ├── dashboard/       # Visual analytics dashboard
│   │   ├── actions/         # Committed actions tracker
│   │   └── api/insights/    # POST route → Gemini 2.5 Flash inference
│   ├── components/
│   │   ├── calculator/      # Step components (Transport, Energy, Food, Shopping, Waste)
│   │   └── dashboard/       # Chart components (DonutChart, ComparisonBar, ScoreCard)
│   ├── context/
│   │   └── FootprintContext.tsx   # Global state: footprint data + committed actions
│   ├── lib/
│   │   ├── carbon-calculator.ts   # Pure calculation functions (emission factor math)
│   │   └── constants.ts           # Emission factors, benchmarks, rate-limit config
│   ├── validators/
│   │   └── footprint.schema.ts    # Zod schema for /api/insights payload
│   └── __tests__/
│       └── carbon-calculator.test.ts   # 8 unit tests
```

---

## 📄 License

MIT © 2025 — Built for PromptWars Virtual Hackathon