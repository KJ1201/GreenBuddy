# ReLoop Anti - MVP Scope & Implementation Plan

Based on `PRD.md`, `design_doc.json`, and `Tech Stack.md`.

## MVP Scope (Hackathon Demo)

**Goal**: A web-based platform to guide students through E-waste teardowns, verifying components with AI, and routing them to reuse/recycle channels.

### Core Features
1.  **Authentication**: Simple Email/Password login (Supabase Auth).
2.  **Device Catalog**:
    *   Search/Filter by difficulty.
    *   Support for 4 MVP Devices: HP DeskJet 2700, Linksys WRT54G, Xbox 360, Dell Inspiron.
3.  **Pre-Dismantle Preview ("Component Map")**:
    *   Visual map of valuable parts inside selected device.
    *   Estimated total value and learning outcomes.
4.  **Guided Teardown Runner**:
    *   Step-by-step instructions.
    *   **Safety Gates**: Mandatory PPE/Power-off acknowledgments for risky steps.
    *   **Educational Context**: "What/Why/Where/How" cards for components.
5.  **AI Verification (Gemini 2.0 Flash)**:
    *   Image upload for harvested components.
    *   Real-time identification and condition grading.
    *   Confidence score (>=75% auto-verify).
6.  **Post-Dismantle Actions**:
    *   **Donate**: School locator (mock), Tax receipt preview.
    *   **Sell**: Marketplace listing with AI-suggested pricing (no actual payments).
    *   **Recycle**: Facility locator for waste parts.
7.  **Gamification**:
    *   XP system and Leaderboard.
    *   Badges for verified components.

### Tech Stack
*   **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion (animations), Lucide React (icons).
*   **State/Data**: Zustand, React Query.
*   **Backend**: Supabase (Auth, Postgres DB, Edge Functions, Storage).
*   **AI**: Google Gemini 2.0 Flash Vision (via Supabase Edge Functions).
*   **Hosting**: Vercel.

---

## Step-by-Step Implementation Plan

### Phase 1: Foundation & Design System
- [x] **1.1. Project Initialization**
    - Initialize Vite + React + TypeScript application.
    - Install dependencies: `backend-client` (supabase-js), `react-router-dom`, `tanstack/react-query`, `zustand`, `clsx`, `tailwind-merge`, `lucide-react`, `framer-motion`.
- [x] **1.2. Tailwind & Design System Config**
    - Configure `tailwind.config.js` with "Modern Wellness" palette (Pastels: `#D4E8E8`, `#F4BDB0`, `#F9F1A5`, `#F5D5D5`) and typography.
    - Set up base CSS for organic shapes and rounded corners.
- [x] **1.3. UI Component Library**
    - Build core atomic components:
        - `Button` (Primary/Secondary/Icon).
        - `Card/Container` (Organic rounded).
        - `Badge/Pill` (Pastel backgrounds).
        - `Input/Form` elements.

### Phase 2: Backend & Data
- [x] **2.1. Supabase Setup**
    - Create Supabase project (if not exists, else mock/local).
    - Design Database Schema (`devices`, `components`, `teardown_steps`, `user_progress`, `marketplace_listings`).
- [x] **2.2. Seed Data**
    - Populate database with the 4 MVP devices, their components, and detailed teardown steps with educational content.

### Phase 3: Core User Flow - Pre-Dismantle
- [x] **3.1. Landing Page**
    - Hero section with value prop.
    - "Start Teardown" CTA.
- [x] **3.2. Device Catalog Page**
    - Grid of available devices with HVI scores and difficulty ratings.
    - Filter logic.
- [x] **3.3. Device Detail & Component Map**
    - Device overview.
    - Interactive "Component Map" visualization (list/grid of parts to expect).

### Phase 4: Core User Flow - Teardown & Verification
- [x] **4.1. Teardown Runner UI**
    - Step navigation (Next/Prev).
    - Image display for instructions.
    - **Safety Gate Component**: Modal/Blocker for hazardous steps.
    - **Educational Card**: "What/Why/Where/How" drawer/popup.
- [x] **4.2. Image Upload Component**
    - Drag & drop or camera capture area.
- [x] **4.3. AI Integration (Gemini)**
    - Create Supabase Edge Function `verify-component`.
    - Integrate Google Gemini 2.0 Flash Vision API.
    - Implement prompt engineering for component ID and grading.
    - Frontend integration to display AI results (Type, Condition, Confidence).

### Phase 5: Post-Dismantle & Marketplace
- [x] **5.1. Action Hub**
    - "Teardown Complete" summary screen.
    - Choices: Donate, Sell, Recycle.
- [x] **5.2. Marketplace & Donate Views**
    - **Sell**: Marketplace listings and "Register Part" modal.
    - **Donate**: Verified list of STEM labs and charity focus.
    - **Recycle**: Nearest certified e-waste facilities list.

### Phase 6: Gamification & Polish
- [x] **6.1. XP & Leaderboard**
    - Logic to award XP on verification.
    - Leaderboard page (Global/School rankings).
- [x] **6.2. Animations & UX Polish**
    - Modern wellness aesthetic with Framer Motion transitions and micro-interactions.

### Phase 7: Deployment & QA
- [x] **7.1. Deployment**
    - Deploy to Vercel/Netlify.
- [x] **7.2. Smoke Testing**
    - Verify full flow: Landing -> Device -> Teardown -> AI Verify -> Listing.

### Phase 8: Post-MVP Improvements & Quality Assurance
- [x] **8.1. Critical Bug Fix**
    - Fixed marketplace "Register Part" modal sizing issue.
    - Modal now fits properly without requiring browser zoom.
- [x] **8.2. Performance Optimization**
    - Added lazy loading with OptimizedImage component.
    - Implemented GPU acceleration utilities.
    - Added loading skeleton animations.
    - Enhanced CSS with smooth scrolling and reduced motion support.
- [x] **8.3. SEO Enhancement**
    - Added comprehensive meta tags for search engines.
    - Implemented Open Graph tags for social sharing.
    - Added Twitter Card metadata.
- [x] **8.4. Accessibility Improvements**
    - Added focus indicators for keyboard navigation.
    - Implemented reduced motion preferences.
    - Enhanced color contrast and semantic HTML.
- [x] **8.5. Testing Infrastructure**
    - Created comprehensive TESTING.md checklist (300+ test items).
    - Covers functional, cross-browser, accessibility, and performance testing.
- [x] **8.6. TypeScript & Build Fixes**
    - Created vite-env.d.ts for proper type definitions.
    - Fixed all TypeScript compilation errors.
    - Successful production build achieved.
- [x] **8.7. Documentation**
### Phase 9: Authentication System (Critical Missing Feature)
- [ ] **9.1. Auth Pages**
    - Create `LoginPage.tsx` with email/password form.
    - Create `SignUpPage.tsx` with name/school registration.
    - Create `AuthLayout.tsx` for consistent styling.
- [ ] **9.2. Protected Routes**
    - Implement `ProtectedRoute.tsx` wrapper.
    - Update `App.tsx` to secure `/profile`, `/teardown`, `/marketplace`.
- [ ] **9.3. Auth State**
    - Implement `auth.store.ts` (Zustand) for session management.
    - Integrate Supabase Auth listener.
