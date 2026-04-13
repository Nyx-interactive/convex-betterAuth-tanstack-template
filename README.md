# Collectr

Collectr is a TanStack Start + Convex + Better Auth scaffold for a tweet-link organizer with nested folders and installed-PWA share target support.

## Current Scaffold Status

- Better Auth is wired to Convex for email/password sign-in and sign-up.
- A PWA manifest and service worker registration foundation are in place.
- `/share-target` is scaffolded as the landing route for incoming share intents.
- The detailed implementation plan lives in `docs/implementation-plan.md`.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start or connect a Convex deployment:

```bash
npx convex dev
```

3. Copy `.env-example` to `.env.local` and fill in the required values.

4. Start the app:

```bash
npm run dev
```

## Useful Commands

```bash
npm run dev
npm run build
npm run test
```

## Notes

- Installed PWA share target support is primarily Chromium-based.
- The actual tweet ingest, folder CRUD, and embed rendering are planned next.
- The cloned template still contains demo routes that can be deleted during product implementation.
