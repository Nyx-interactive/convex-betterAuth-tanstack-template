# Collectr Implementation Plan

## Goal

Build a TanStack Start + Convex app where a signed-in user can paste or share tweet links into the app, view the embedded tweet content, and organize saved tweets into folders and nested folders.

## Starting Point

The repo is scaffolded from `Nyx-interactive/convex-betterAuth-tanstack-template` and already includes:

- TanStack Start file-based routing
- Convex client wiring and generated API types
- Better Auth integrated with Convex
- shadcn/ui primitives and Tailwind CSS
- A PWA manifest + service worker registration foundation
- A scaffolded `/share-target` route for installed-PWA handoff

## Product Decisions

### Auth

- Use Better Auth with email/password as the default auth method.
- Keep Google auth optional and only enable it when env vars are configured.
- Treat all user data as private and scope every Convex query/mutation/action to the authenticated user.

### Tweet Rendering

- Use official embedded tweets rather than custom tweet rendering.
- Store the original URL and extracted `tweetId`.
- Render tweets client-side via the official widget script.
- Fall back to a plain link card when an embed fails or the tweet is unavailable.

### Share Into App

- Use installed-PWA Web Share Target support.
- Register `share_target` in `public/manifest.webmanifest`.
- Route shared content into `/share-target` using `GET` params: `title`, `text`, `url`.
- Parse tweet URLs from both `url` and `text` because Android share sheets do not always populate `url`.
- For MVP, open a prefilled intake screen and require explicit save rather than auto-saving on arrival.

### Folder Model

- Use adjacency-list nesting with `parentId`.
- Support root folders and nested folders.
- Start with create, rename, browse, move tweet, and delete-empty-folder flows.
- Avoid destructive cascade delete behavior in MVP.

## Convex Data Model

### `folders`

- `userId: Id<"users"> | string` depending on Better Auth identity mapping
- `name: string`
- `parentId: Id<"folders"> | null`
- `createdAt: number`

Indexes:

- `by_user`
- `by_user_parent`

### `tweets`

- `userId`
- `tweetId: string`
- `url: string`
- `folderId: Id<"folders"> | null`
- `createdAt: number`
- `embedStatus: "pending" | "ok" | "unavailable" | "failed"`

Indexes:

- `by_user_folder`
- `by_user_tweetId`

## Convex API Plan

### Auth Helpers

- `auth.getCurrentUser`
- shared helper to require an authenticated user id inside protected functions

### Folder Functions

- `folders.listTree`
- `folders.create`
- `folders.rename`
- `folders.deleteIfEmpty`

### Tweet Functions

- `tweets.listInbox`
- `tweets.listByFolder`
- `tweets.addFromUrl`
- `tweets.move`
- `tweets.remove`

## Route Plan

### `/`

- Show inbox view for uncategorized tweets
- Show sidebar or top-level folder navigation
- Show paste input for manual import

### `/folders/$folderId`

- Show selected folder details
- Show child folders
- Show tweets saved in that folder

### `/share-target`

- Parse incoming shared payload
- Detect tweet URL
- If signed out, redirect to `/login` and preserve the pending share payload
- If signed in, show a save screen with folder destination selection

### `/login`

- Simple email/password sign in and sign up

## Frontend Component Plan

- `FolderTree`
- `FolderListItem`
- `AddTweetForm`
- `ShareIntakeCard`
- `TweetEmbed`
- `TweetFallbackCard`
- `FolderPicker`

## Tweet Embed Plan

- Create a dedicated `TweetEmbed` component.
- Load `https://platform.twitter.com/widgets.js` only on the client.
- Create embeds by tweet id or canonical URL.
- Avoid SSR dependence for final tweet rendering.
- Show a loading skeleton first, then embed or fallback.

## Share Target Flow

1. User installs the PWA.
2. User shares a tweet link from the browser or another app.
3. OS launches `Collectr` via `/share-target`.
4. The route extracts the tweet URL from the payload.
5. If unauthenticated, the app preserves the payload and routes to login.
6. If authenticated, the app shows the detected tweet URL and folder destination.
7. User confirms save.
8. App stores the tweet in Convex and routes to inbox or the selected folder.

## Verification Checklist

- `npm install` succeeds
- `npx convex dev` connects and generates types
- email/password sign-up works
- email/password sign-in works
- PWA installs locally in Chromium
- app appears in Chromium share sheet after install
- shared tweet opens `/share-target`
- tweet URL detection works from both `url` and `text`
- tweet save works for authenticated users
- tweets can be moved into folders
- embedded tweets render in the app
- `npm run build` passes

## Known Risks

- Web Share Target is not fully cross-browser; Chromium is the main supported path.
- Official X embed behavior can change independently of the app.
- Better Auth user identity shape should be confirmed before finalizing the schema types for `userId`.

## Suggested Next Implementation Order

1. Replace the scaffold home page with the real inbox layout.
2. Add Convex schema and protected folder/tweet functions.
3. Implement manual paste-to-save flow.
4. Implement `/share-target` save flow with auth preservation.
5. Implement official tweet embed rendering.
6. Add folder navigation and nested folder UI.
7. Run build/test pass and clean out leftover demo files.
