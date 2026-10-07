# ✨ InstaQuote AI — Aesthetic Instagram Post Generator

A full-stack, responsive web application that automatically transforms user-entered quotes into aesthetic, high-engagement Instagram posts (1:1, 4:5, 9:16) with automated AI sentiment analysis, theme matching, dynamic typography pairing, and zero-key generative AI backgrounds—operating **100% on $0 free-tier tools**.

---

## 🚀 Key Features

- **5 Distinct Aesthetic Themes**:
  - 💥 **Bold & Motivational**: Heavy impact sans-serif (`Montserrat`, `Oswald`), dark high-contrast gradient, gold/amber accents, framing brackets.
  - 🏛️ **Philosophical & Timeless**: Editorial serif (`Playfair Display`, `Cinzel`, `EB Garamond`), classical architecture/statue imagery, Roman gold accents, refined hairline borders.
  - 🌿 **Calm & Minimalist**: Serene airiness (`Plus Jakarta Sans`, `Inter`), pastel and beige undertones, clean line accents, mindfulness badge.
  - ⚡ **Cyber / Modern Tech**: Monospace terminal code aesthetics (`Space Mono`, `JetBrains Mono`), neon cyan/purple accents, terminal crosshairs and code headers.
  - 📜 **Retro / Vintage Poetry**: Warm sepia 35mm film grain, muted analog tones, romantic italic typography (`Libre Baskerville`, `Caveat`).

- **Aspect Ratio Switcher**:
  - **1:1** Square Feed (`1080 × 1080 px`)
  - **4:5** Portrait Feed (`1080 × 1350 px`)
  - **9:16** Story / Reel Cover (`1080 × 1920 px`)

- **Dual AI Analysis Engine ($0 Free Tier)**:
  - **Google Gemini 3.8 Flash**: Direct multimodal AI analysis via `@google/genai` when an API key is provided.
  - **Intelligent Heuristic Fallback Engine**: Instant, zero-friction local classification for 100% keyless operation right out of the box.

- **Background Image Pipeline**:
  - **Pollinations.ai**: Zero-key generative AI background synthesis with custom prompt engineering.
  - **Curated Stock Collections**: Fast-loading, high-resolution photography curated by aesthetic theme.
  - **Custom Image Upload**: Drag & drop or upload personal photos directly.
  - **Re-roll / Shuffle**: 1-click photo swaps within the detected theme.

- **HTML5 Canvas 2D Engine**:
  - Safe-zone padding & adaptive multi-line word-wrapping.
  - Dynamic Google Fonts loader with `document.fonts.load()` verification.
  - Dual readability overlay (gradient + vignette + optional 35mm film grain).
  - Customizable watermark / Instagram handle (`@yourbrand`).
  - 1-Click Client-Side Export: Instant PNG download + clipboard copy with celebratory confetti.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI / Styling**: React 19, Tailwind CSS, Lucide React, Canvas Confetti
- **AI SDK**: `@google/genai` (Google Gemini 3.8 Flash)
- **Generative AI Imagery**: Pollinations.ai (Flux engine, zero-key)
- **Typography**: Google Fonts API
- **Rendering**: Native HTML5 Canvas 2D Context

---

## 📦 Getting Started

### 1. Installation
```bash
cd instaquote-ai
npm install
```

### 2. (Optional) Configure Gemini API Key
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you skip this, InstaQuote AI automatically uses its built-in sentiment analyzer and Pollinations.ai free generative backgrounds).*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 📄 License
MIT License
