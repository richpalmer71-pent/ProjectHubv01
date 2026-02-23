# Pentland C&C Project Hub v3.0

Multi-module project management tool for campaign briefing and delivery.

## Setup
```bash
npm install
npm start
```

## Deploy to Vercel
```bash
vercel --prod
```

## Structure
- `src/App.js` — Main app with sidebar navigation, all module routing and state
- `src/components/shared.jsx` — Shared UI components (Field, Input, EmailSelect, etc.)
- `src/components/Playground.jsx` — Project Playground module
- `src/components/ResourceManagement.jsx` — Resource Management module
- `src/components/AssetDelivery.jsx` — Asset Delivery module
- `src/components/FeedbackCentre.jsx` — Feedback Centre module

## Modules
1. Project Playground — Creative workspace (links, images, notes)
2. Campaign Overview — Project admin (job number, brand, dates)
3. Resource Management — Team allocation with role assignments
4. Campaign Toolkit — Shared resources and links
5. Project Brief — Multi-channel briefing (web, email, paid)
6. Approval Centre — Brief & project sign-off workflow
7. Asset Delivery — Figma links, uploads, download directory
8. Feedback Centre — Post-project ratings and review

## Features
- Sidebar navigation across all modules
- Auto-translation for DE/FR locale duplication (via Claude API)
- Email user management with add new user
- File upload and download directory
- Save/Edit state management per module
