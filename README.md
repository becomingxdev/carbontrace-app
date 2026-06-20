# Carbon Trace

A Carbon Footprint Awareness Platform built for PromptWars Virtual Hackathon.

Carbon Trace helps individuals understand, track, and reduce their personal carbon footprint through a guided 5-step calculator, visual analytics dashboard, and AI-powered personalized recommendations.

---

## Chosen Vertical
Carbon Footprint Awareness Platform

---

## How It Works

1. **Understand** — The user completes a 5-step calculator covering Transport, Home Energy, Food and Diet, Shopping, and Waste. Each step uses research-backed emission factors (IPCC AR6, CEA 2023, FAO) to compute a category-level CO2e estimate in real time.

2. **Track** — The Dashboard visualizes the total footprint as a donut chart broken down by category, and a comparison bar chart against the India average (1,900 kg/year) and global average (4,800 kg/year). A Carbon Score card contextualizes the result against the Paris Agreement target of 2,000 kg/year.

3. **Reduce** — The AI Insights page sends the user's complete footprint profile to Gemini 1.5 Flash (via Google Cloud Vertex AI) using a context-injection pattern. The model returns 5 specific, ranked recommendations targeting the user's highest-impact categories, each with an estimated kg CO2e saved per year and a difficulty label (Easy, Medium, or Hard). Users can commit to actions, which persist in localStorage and display as a running projected reduction total.

---

## Approach and Logic

### Context-Injection AI Pattern
Rather than asking the AI a generic question, Carbon Trace injects the user's exact numerical footprint breakdown into the system prompt before each inference call. This ensures every recommendation is specific to the user's actual behaviour, not boilerplate advice.

### Emission Factor Methodology
All calculation factors are sourced from peer-reviewed and government publications:

| Category     | Source                                              |
|--------------|-----------------------------------------------------|
| Transport    | IPCC Sixth Assessment Report (AR6)                  |
| Electricity  | Central Electricity Authority, India (CEA 2023)     |
| Food         | Food and Agriculture Organization (FAO)             |
| LPG and Gas  | IPCC AR6                                            |

### AI Model
Gemini 1.5 Flash via Google Cloud Vertex AI. Temperature is set to 0.2 for consistent and factual output. responseMimeType is set to application/json to enforce structured output matching the required schema.

---

## Assumptions Made

- Emission factors represent average conditions; individual vehicle efficiency or regional grid mix may vary.
- Flight emissions include a radiative forcing multiplier per IPCC AR6 methodology.
- Food emissions represent production-stage CO2e only (consumer transport not included).
- Shopping factors use conservative industry estimates: clothing at 14.5 kg CO2e per item and electronics at 65 kg CO2e per item.
- Waste recycling is assumed to mitigate up to 40% of disposal emissions at a 100% recycling rate.
- All user data is stored in browser localStorage only. No personal data is stored on any server beyond the duration of the AI inference call.
- Benchmarks used: India average 1,900 kg per year, Global average 4,800 kg per year, Paris Agreement target 2,000 kg per year.

---

## Setup

git clone https://github.com/YOUR_USERNAME/carbontrace-app
cd carbontrace-app
cp .env.example .env.local

Add your Google Cloud credentials to .env.local:
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json

npm install
npm run dev

Open http://localhost:3000

---

## Tech Stack

| Technology                        | Role                          |
|-----------------------------------|-------------------------------|
| Next.js 14 App Router             | Full-stack framework          |
| TypeScript (strict mode)          | Type safety                   |
| Tailwind CSS                      | Styling                       |
| Recharts                          | Data visualization            |
| Google Cloud Vertex AI            | Gemini 1.5 Flash AI inference |
| Zod                               | Input validation              |
| Jest + ts-jest                    | Unit testing                  |
| localStorage                      | Client-side persistence       |

---

## Project Structure

src/
├── app/              Next.js App Router pages and API route handler
├── components/       UI components organized by feature area
├── context/          Global footprint state via React Context
├── lib/              Pure carbon calculation functions and emission constants
├── validators/       Zod input schemas
└── __tests__/        Jest unit tests for calculation logic