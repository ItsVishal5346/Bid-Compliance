# BidSure AI

AI-Powered Integrated Bid Compliance Verification Platform for GeM Procurement.

This repository contains the frontend-only academic prototype in the frontend/ directory. The app demonstrates a role-based workspace for tender management, simulated bid intake, document metadata, sample compliance checks, risk indicators, reports, officer decisions, notifications, and a local activity feed.

## Run locally

    cd frontend
    npm install
    npm run dev

Build and type-check:

    npm run build
    npm run lint

See frontend/README.md for setup details, demo roles, architecture, and limitations.

## Important prototype limitations

- This is not an official GeM product and is not affiliated with or endorsed by GeM or the Government of India.
- All vendor and tender records are fictional demonstration data.
- Authentication and role checks are frontend-only and are not a security boundary.
- The app does not include a backend, database, OCR, AI model, or live procurement integration.
- Selected files remain local; file bytes are not uploaded or analyzed.
- Sample scores and risk indicators are illustrative, and all final procurement decisions require authorized human review.
