# Harmony - AI Family Communication Coach

## Overview

Harmony is an AI-powered family communication coach that helps resolve conflicts (especially couples/in-law relationships) through a structured 4-phase flow. It uses the Iceberg Model to extract hidden emotional needs, translates blame into I-statements, and provides AI role-play rehearsal.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **UI**: Tailwind CSS 4 + shadcn/ui (New York style) + Framer Motion
- **AI**: Vercel AI SDK (`ai`) + Google Gemini 2.5 Pro (`@ai-sdk/google`)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **Icons**: Lucide React

## Commands

```bash
npm run dev      # Dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npm test         # Vitest (npm run test = vitest run)
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Onboarding (safety guarantees)
│   ├── setup/page.tsx                # Conflict category + context
│   ├── input/[roomId]/page.tsx       # Phase 1: Vent raw emotions → AI validation
│   ├── reveal/[roomId]/page.tsx      # Phase 2: Iceberg Model (hidden needs)
│   ├── rehearsal/[roomId]/page.tsx   # Phase 3: AI role-play chat (streaming)
│   ├── review/[roomId]/page.tsx      # Phase 4: Summary + micro-actions
│   └── api/
│       ├── validate/route.ts         # generateText() → empathetic validation
│       ├── reveal/route.ts           # generateObject() + Zod → structured needs
│       └── chat/route.ts             # streamText() → role-play streaming
├── components/ui/                    # shadcn/ui primitives (Button, Card, Dialog, etc.)
└── lib/utils.ts                      # cn() helper (clsx + tailwind-merge)
```

## App Flow

`/ → /setup → /input/[roomId] → /reveal/[roomId] → /rehearsal/[roomId] → /review/[roomId]`

Data passes between pages via `sessionStorage` with keys: `harmony-input-{roomId}`, `harmony-topic-{roomId}`, `harmony-desc-{roomId}`, `harmony-reveal-{roomId}`.

## API Endpoints

| Endpoint | SDK Method | Purpose |
|----------|-----------|---------|
| `POST /api/validate` | `generateText()` | Empathetic validation of user's vent (no advice) |
| `POST /api/reveal` | `generateObject()` | Extract Iceberg Model (surface + hidden needs, I-statement translation) |
| `POST /api/chat` | `streamText()` | Role-play as family member; adapts tone based on user's communication style |

All endpoints use `google("models/gemini-2.5-pro")` and have mock fallbacks for missing API key or quota exhaustion.

## Environment

Required in `.env.local`:
```
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```

## Conventions

- **Styling**: Tailwind utilities + `cn()` for class merging. Colors: zinc (base), blue (user), emerald (partner), amber/rose (accents).
- **Components**: shadcn/ui in `components/ui/`. Add new ones via `npx shadcn add <component>`.
- **Path alias**: `@/` maps to `src/`.
- **State**: `useState` for local state, `sessionStorage` for cross-page data (MVP, no database yet).
- **AI responses**: All API routes wrap AI calls in try-catch with graceful fallback to mock responses.
- **Structured AI output**: Use `generateObject()` with Zod schemas for typed responses.
- **Streaming**: Use `useChat()` hook from `ai/react` for real-time chat UI.

## Current Limitations (MVP)

- No database — all data in sessionStorage
- Single-player simulation (dual-blind not truly implemented)
- No authentication
- Room ID is mocked (`demo-room-123`)
- Share/export not implemented
- No safety guardrails or risk detection yet
