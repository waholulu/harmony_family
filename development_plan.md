# Harmony (Communication Coach) - Development Plan

This document outlines the current state of the MVP and the future development roadmap required to bring the product to a fully functional, production-ready state.

## 1. Current State (MVP Phase 1 - Local Prototype)

We have successfully built the core AI interaction flow as a front-end prototype.

### Completed Features:
*   **Next.js & Tailwind CSS Framework:** Modern, responsive foundation.
*   **Onboarding & Guarantees UI:** Sets the safe psychological environment for users.
*   **Venting / Input Phase:** Allows users to input raw emotional text.
*   **AI Emotional Validation:** Uses `gemini-3.1-pro-preview` to provide immediate, non-judgmental empathy.
*   **Constructive Reveal (Iceberg Model):** Uses AI to extract the surface complaints and hidden needs, translating the raw text into a constructive "I-statement".
*   **Rehearsal Room (Role-play):** A live AI chat environment where users practice their communication strategies against an AI simulating their partner's defensive state.
*   **Review/Summary Card:** A shareable summary of the agreed-upon micro-actions and core needs.

### Technical Limitations of Current MVP:
*   **No Database:** All data is currently passed using the browser's temporary local `sessionStorage`. 
*   **Single-Player Mode:** The "Dual-blind" feature (where two separate users enter a room and input data independently before revealing) is currently simulated in a single browser flow.
*   **No Authentication:** Users cannot create accounts or save past conflicts.
*   **Local Hosting Only:** The app is only running on `localhost`.

---

## 2. Future Development Roadmap

To move from the current MVP prototype to a full product, we need to implement the following phases.

### Phase 2: Backend & Multiplayer Foundation (Supabase Integration)
*Goal: Enable the true "Dual-Blind Setup" where two users can interact in the same room from different devices.*

*   **[ ] Supabase Setup:** Initialize a Supabase project (PostgreSQL).
*   **[ ] Database Schema:** Create tables for `Users`, `Rooms` (the conflict sessions), and `Messages`.
*   **[ ] Authentication:** Implement simple login (e.g., Magic Link or Google OAuth) so users can invite their partners securely.
*   **[ ] Room Logic (Real-time):** Update the UI so that when User A creates a conflict room, they get an invite link to send to User B. The app must block progression to the "Reveal" phase until *both* users have submitted their raw inputs.
*   **[ ] Replace SessionStorage:** Migrate all data fetching and saving from local storage to the Supabase database.

### Phase 3: Advanced AI Features & Safety Guardrails
*Goal: Implement the critical safety features outlined in the original plan to prevent abuse.*

*   **[ ] Risk Assessment Engine:** Before passing input to the Validation/Reveal stages, run a separate fast AI check to classify the input as Low, Medium, or High Risk (Domestic Violence / Mental Control).
*   **[ ] Hard Stop Safety UI:** If High Risk is detected, immediately show the emergency resources UI and disable the rehearsal room.
*   **[ ] AI Persona Tuning:** Add UI controls in the Rehearsal Room allowing the user to adjust the AI's "Reaction Style" (e.g., more defensive, more willing to compromise) to better match their real-life partner.

### Phase 4: Retention & "Emotional Bank Account"
*Goal: Bring users back to the app when they are NOT fighting.*

*   **[ ] Daily Question Feature:** Implement the "War-time hoarding" feature: a daily lightweight, positive prompt (e.g., "What's a small thing your partner did this week that you appreciated?").
*   **[ ] Profile Dashboard:** Create a dashboard showing a history of resolved conflicts and accumulated relationship insights.
*   **[ ] Automated Follow-ups:** Implement the system to email or push notify users 24 hours after a Rehearsal to check if the real-world conversation happened and how it went.

### Phase 5: Production Deployment & Go-To-Market
*Goal: Launch the app to the public.*

*   **[ ] Vercel Deployment:** Deploy the Next.js app to Vercel for fast, global hosting.
*   **[ ] Environment Variables:** Securely configure production API keys for Supabase and Google AI in the Vercel dashboard.
*   **[ ] Shareable Cards Generation:** Polish the "Review Card" UI to allow users to generate an image or PDF of their conflict resolution to share anonymously on social media for marketing.
*   **[ ] Analytics:** Integrate basic analytics (e.g., PostHog or Vercel Analytics) to track drop-off rates in the onboarding flow.
