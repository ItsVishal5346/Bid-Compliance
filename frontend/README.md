# BidSure AI — Frontend Prototype

**AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement**

BidSure AI is an academic frontend prototype that demonstrates how a procurement team might organize tender information, bid submissions, document metadata, sample compliance checks, review flags, reports, and officer decisions.

> **Prototype notice:** This is not an official GeM product and is not affiliated with or endorsed by the Government of India or GeM. All supplier/tender records are fictional. No backend, database, OCR engine, AI model, official procurement communication, or GeM integration is implemented.

## Features

- Demo login with Bidder/Vendor and Procurement Officer roles.
- Role-based frontend navigation and route guards.
- Dashboard KPI cards, sample compliance chart, and recent activity.
- Tender browsing, search, filtering, details, and validated tender creation.
- Multi-step simulated bid submission with local file selection and file type/size validation.
- Document metadata list and manual-review detail drawer.
- Criterion-wise compliance statuses: PASS, FAIL, PENDING REVIEW, NOT APPLICABLE.
- Transparent risk indicator dashboard.
- CSV report export and print-friendly report view.
- Officer review remarks and confirmation before updating the local decision state.
- Audit-log and notification dropdown.
- Responsive sidebar and mobile layout.

## Technology stack

- React 18, Vite 6, TypeScript
- React Router
- Tailwind CSS configuration (custom design tokens are implemented in src/index.css)
- Lucide React icons
- Recharts
- React Hook Form and Zod validation
- Browser File API

## Folder structure

    frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    └── src/
        ├── components/   # layout, page header, status badges, modal
        ├── context/      # local demo application state
        ├── data/         # fictional seeded records
        ├── pages/        # dashboard and main workflows
        ├── services/     # mock API adapter seam
        ├── types/        # TypeScript domain types
        ├── App.tsx
        ├── main.tsx
        └── index.css

## Installation and running

Requirements: Node.js 20 or later and npm.

From the repository root:

    cd frontend
    npm install
    npm run dev

Vite prints the local development URL, usually http://localhost:5173.

Production build:

    npm run build
    npm run preview

TypeScript check:

    npm run lint

## Demo login

Open the login page and choose either role button:

- **Continue as Bidder / Vendor** — browse tenders, submit a simulated bid, manage document metadata, and view reports.
- **Continue as Procurement Officer** — manage tenders, inspect bids, view sample compliance and risk indicators, record prototype decisions, and inspect the activity log.

Sign-in is only a role selector stored in browser session storage. Do not use actual account credentials.

## Mock data behavior

Seeded fictional data is defined in src/data/mockData.ts. Shared local state is managed in src/context/AppContext.tsx. src/services/mockApi.ts describes the service boundary that can later be replaced by HTTP requests. State-changing demo actions update the UI and prepend simple activity entries. Refreshing the app resets records to the seed data; no persistent database is used.

## Frontend-only limitations

- Browser route guards are a UX mechanism, not a security boundary.
- Tender creation and bid submission update local React state only.
- File selection checks extension and size. File contents are not uploaded to a server.
- Arbitrary uploaded files are not assigned invented OCR or AI classifications; they are marked for manual review.
- Seeded sample documents and compliance checks include fictional example outcomes.
- Scores and risk indicators are illustrative only. Pending checks do not pass, mandatory failures remain visible, and a procurement officer retains the final decision.
- CSV export is generated in the browser. Print view uses the browser print dialog.
- The audit log is a local demo feed, not an immutable or security-grade record.

## Connecting a future FastAPI backend

1. Implement backend authentication and server-enforced role-based authorization first. Do not rely on frontend route guards.
2. Create API endpoints for tenders, bids, documents, compliance assessments, reports, decisions, notifications, and audit events.
3. Replace functions in src/services/mockApi.ts with a typed API client using fetch or a suitable HTTP client.
4. Keep API base URLs in an environment variable such as VITE_API_BASE_URL; never put secrets or service credentials in frontend environment variables.
5. Send files only to an authenticated backend endpoint with appropriate size/type checks, malware scanning, retention policy, and access controls.
6. Treat AI/OCR outputs as reviewable suggestions. Store evidence references and model/rule versions server-side and preserve human decision authority.
7. Add tests, loading/error states, server-side validation, security review, accessibility checks, and CI before production use.

## Scripts

- npm run dev — start Vite development server.
- npm run build — TypeScript project build and Vite production build.
- npm run lint — TypeScript no-emit check.
- npm run preview — preview the built bundle locally.
