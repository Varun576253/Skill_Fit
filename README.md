# AI SkillFit

> **EDCS Hackathon — Theme 5 · Government of Karnataka**
>
> An AI-powered video interview and workforce fitment platform for Karnataka's blue-collar workers. Candidates register, answer 5 adaptive AI-generated questions by voice, and are automatically scored and classified — in under 5 minutes.

---

## What It Does

Karnataka has millions of skilled workers — welders, electricians, carpenters — but no scalable way to screen them. SkillFit replaces manual screening with an end-to-end AI pipeline:

1. **Candidate registers** — name, district, trade, preferred language
2. **AI interviews them** — Gemini generates trade-specific questions dynamically; each follow-up adapts based on the previous answer
3. **Groq Whisper transcribes** — speech-to-text with dialect tolerance for Kannada, Hindi, and English
4. **Gemini scores each answer** — Relevance, Clarity, and Confidence out of 10
5. **System classifies the candidate** — Job Ready / Requires Training / Manual Verification / Poor Quality / Suspected Fraud
6. **Government officer reviews** — admin dashboard with filters by district, trade, and classification

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CSS + Wouter |
| Backend | Node.js + Express + TypeScript |
| AI (Questions + Scoring) | Google Gemini 2.5 Flash Lite |
| Speech Transcription | Groq Whisper (Distil-Whisper) |
| Database | PostgreSQL via Drizzle ORM (Neon DB compatible) |
| Video Storage | Supabase Storage |
| Auth | Express sessions + bcrypt |
| API Validation | Zod + Orval (OpenAPI) |

---

## Features

- **Adaptive questioning** — Gemini reads each answer and tailors the next question. Not a fixed quiz.
- **Multi-language support** — Questions generated and read aloud in Kannada (ಕನ್ನಡ), Hindi, or English
- **Voice TTS** — Questions are spoken aloud using browser TTS (Android) with Google Cloud TTS fallback
- **Face presence check** — Skin-heuristic camera check flags candidates who leave the frame
- **Liveness detection** — Flags if candidate is absent for > 50% of the interview
- **Fraud / duplicate detection** — Duplicate signals are flagged and sent to a review queue
- **Admin dashboard** — Filter by district, trade, classification; view per-answer scores and AI feedback
- **Fully auditable** — Every score is AI-generated with written justification

---

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A PostgreSQL database (Neon free tier works perfectly)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com) (free)
- *(Optional)* Groq API key for better dialect transcription — [console.groq.com](https://console.groq.com)
- *(Optional)* Supabase project for video storage

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/skillfit.git
cd skillfit
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the required values:

```env
# Required
DATABASE_URL=postgresql://user:password@host:5432/database
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=any-random-string-at-least-32-chars

# Optional but recommended
GROQ_API_KEY=your_groq_api_key_here

# Optional — video storage
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up the database

```bash
pnpm db:push
```

### 4. Create admin user

```bash
pnpm --filter @workspace/api-server run seed:admin
```
If you get a message like this:
```bash
ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  @workspace/api-server@0.0.0 seed:admin: `tsx scripts/seed-admin.ts`
Exit status 1
```
Ignore it.

Default credentials: `admin` / `admin123` (change in production)

### 5. Run the app

Open two terminals:

```bash
# Terminal 1 — API server (port 3000)
pnpm dev:api

# Terminal 2 — Frontend (port 5173)
pnpm dev:web
```

Then open:
- **Candidate flow** → http://localhost:5173
- **Admin dashboard** → http://localhost:5173/admin

---

## Docker (Full Local Stack)

```bash
docker compose up -d     # starts Postgres + Redis
pnpm install
pnpm db:push
pnpm --filter @workspace/api-server run seed:admin
pnpm dev:api &
pnpm dev:web
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `SESSION_SECRET` | ✅ | Cookie signing secret (any random string) |
| `GROQ_API_KEY` | Recommended | Groq Whisper for better Kannada/Hindi transcription |
| `VITE_SUPABASE_URL` | Optional | Supabase project URL for video storage |
| `VITE_SUPABASE_ANON_KEY` | Optional | Supabase anon key |
| `GOOGLE_API_KEY` | Optional | Google Cloud TTS for Kannada voice fallback |
| `INTERVIEW_QUESTION_COUNT` | Optional | Number of questions per interview (default: 5, max: 12) |
| `GEMINI_TEXT_MODEL` | Optional | Override Gemini model (default: gemini-2.5-flash-lite) |
| `NODE_ENV` | Optional | Set to `production` for secure cookies |

---

## Project Structure

```
skillfit/
├── artifacts/
│   ├── api-server/          # Express backend
│   │   └── src/
│   │       ├── routes/      # interviews, candidates, admin, tts, transcribe
│   │       └── lib/         # gemini.ts, question-bank.ts, question-selection.ts
│   └── skillfit/            # React frontend
│       └── src/
│           └── pages/       # interview.tsx, results.tsx, admin/
├── lib/
│   ├── db/                  # Drizzle ORM schema + migrations
│   ├── api-spec/            # OpenAPI spec (orval-generated client)
│   └── api-client-react/    # React Query hooks
├── .env.example
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## How the AI Scoring Works

Each answer is sent to Gemini with the original question and trade context. Gemini returns:

| Dimension | What it measures |
|-----------|-----------------|
| **Relevance** | Does the answer actually address the question? |
| **Clarity** | Is the response clear and understandable? |
| **Confidence** | Does it demonstrate real practical knowledge? |

Scoring is prompt-guided to be lenient on informal speech, code-mixing (Kannada + English), and regional dialect. Every score includes a written feedback line.

### Classification Logic

| Condition | Classification |
|-----------|---------------|
| Avg score ≥ 7.0, no flags | **Job Ready** |
| Avg score 4.0 – 6.9, no flags | **Requires Training** |
| Avg score < 4.0 or flagged | **Manual Verification** |
| 50%+ very short answers | **Poor Quality** |
| Duplicate signal detected | **Suspected Duplicate / Fraud** |

---

## Language Support

| Language | Questions | Voice TTS | Speech Recognition |
|----------|-----------|-----------|-------------------|
| Kannada (ಕನ್ನಡ) | ✅ Kannada script | ✅ | ✅ Groq Whisper |
| Hindi (हिंदी) | ✅ Devanagari script | ✅ | ✅ Groq Whisper |
| English | ✅ | ✅ | ✅ |

---

## Security

- Session-based auth with bcrypt password hashing
- Express rate limiting on all API routes
- Parameterised queries via Drizzle ORM (no SQL injection)
- CORS restricted to configured origins in production
- Camera and microphone access only for the duration of the interview

---

## License

Built for the EDCS Hackathon — Government of Karnataka · Theme 5.
