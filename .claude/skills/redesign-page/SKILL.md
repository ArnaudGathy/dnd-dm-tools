---
name: redesign-page
description: Overhaul the UI of an existing page or view, code-first (no Figma). Reads & screenshots the current page, proposes design directions, then implements the chosen one with a render-verify loop. Use when the user wants to redesign, overhaul, restyle, or modernize the look of an existing page/component.
argument-hint: "<page route or file path, e.g. /spells or src/app/(with-nav)/spells/page.tsx>"
---

# Redesign an existing page (code-first)

Overhaul the **presentation** of an existing page while keeping its data, routing, and
server/client boundaries intact. The redesign is implementable, not a fantasy mockup,
because it's grounded in the page that already exists.

This is a **stack:** Next.js 15 (App Router) + React + Tailwind + shadcn-style components.
Reuse the existing data layer (`src/lib/api/*` reads, `src/lib/actions/*` mutations) — a
redesign **never** rewrites how data is fetched or mutated, only how it's rendered.

Input: a page route (`/spells`, `/encounters`) or a file path. If none given, ask which
page first.

## Guardrails (read before starting)

- **Presentation only.** Do not change query/mutation signatures, Prisma calls, auth
  guards (`restrictToAdmins()`), or `revalidatePath` paths. If a redesign seems to require
  a data-shape change, stop and confirm with the user first.
- **Reuse, don't reinvent.** Prefer the project's existing UI primitives
  (`src/components/ui/*`), Tailwind tokens, and utility classes over new bespoke CSS.
  Match the surrounding code's idiom.
- **Keep it French.** All user-facing copy stays in French, consistent with the rest of
  the app. Don't translate or "improve" copy unless asked.
- **Work in isolation.** Redesigns touch many lines — do it on a branch (see Step 3).

## Step 1 — Capture the current state

Before changing anything, understand what's there:

1. Resolve the route to its files. Read the `page.tsx`, its layout, and the components it
   renders. Note: which parts are Server vs Client Components, what data props flow in,
   and which `src/components/ui/*` primitives are already used.
2. Stand up the **screenshot harness** (see the section below) and capture the page as-is.
   Keep that screenshot — it's the baseline you'll critique against.
3. Summarize for the user, in 3–5 bullets: what the page does, its main sections, and the
   concrete UI problems worth fixing (cramped spacing, weak hierarchy, dated controls…).

## Screenshot harness (set up once, reuse all session)

The render-verify loop (Step 4) needs real screenshots of the running app. This project's
pages are **auth-gated** (`src/middleware.ts` redirects anything without a session to `/`),
and login is **Google OAuth — which refuses automated browsers** ("This browser or app may
not be secure"). So `/run` / `/verify` and a plain headless browser can't reach the page.
Don't fight Google's login; **reuse the session cookie from the user's normal browser**.

One-time setup (the dev server is usually already running on :3000 — check with
`lsof -i :3000 -sTCP:LISTEN`; if not, start `pnpm dev`):

1. **Install Playwright** (a dev dependency; confirm the `package.json` change is OK first):
   `pnpm add -D playwright && pnpm exec playwright install chromium`.
2. **Get the session cookie.** Ask the user to open the app in their normal (logged-in)
   browser → DevTools → Application → Cookies → `http://localhost:3000` → copy the value of
   **`authjs.session-token`** (NextAuth v5). If it's chunked (`…token.0`, `.1`), get each.
3. **Write `storageState.json`** in the scratchpad — a Playwright storage-state file with
   that cookie (`domain: "localhost"`, `path: "/"`, `httpOnly: true`, `secure: false`,
   `sameSite: "Lax"`, `expires: -1`).
4. **Write a `shot.mjs`** in the scratchpad that loads `storageState.json` and screenshots
   a route. Verify with one shot: a `status=200` (not a redirect to `/`) means the session
   works. Then `Read` the PNG to view it.

Gotchas learned the hard way:
- Scripts in the scratchpad live **outside** the repo, so Node's ESM resolver can't find
  `playwright`. Resolve it from the project instead:
  `const require = createRequire("<project-dir>/"); const { chromium } = require("playwright");`
- Use `deviceScaleFactor: 2` and `fullPage: true` for crisp, complete captures. Re-shoot at
  a mobile viewport (`width: 390`) for the responsive check.
- Pick a route with **real, rich data** for the baseline, and ask the user up front for a
  few records that exercise edge cases (long text, every conditional/highlight branch) —
  screenshot all of them, not just the happy path.
- The cookie is a live dev session: remind the user to log out afterward to rotate it.

`shot.mjs` (reuse verbatim; pass `<route> <out-name> [width]`):

```js
import { createRequire } from "module";
const require = createRequire("<ABSOLUTE_PROJECT_DIR>/");
const { chromium } = require("playwright");
const path = process.argv[2] ?? "/";
const out = process.argv[3] ?? "shot";
const width = Number(process.argv[4] ?? 1280);
const STATE = new URL("./storageState.json", import.meta.url).pathname;
const OUT = new URL(`./${out}.png`, import.meta.url).pathname;
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  storageState: STATE,
  viewport: { width, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();
const resp = await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
console.log(`status=${resp?.status()} url=${page.url()}`);
await page.waitForTimeout(500);
await page.screenshot({ path: OUT, fullPage: true });
console.log(`saved -> ${OUT}`);
await browser.close();
```

## Step 2 — Decide the design direction

Invoke the **`artifact-design`** skill — it is the design engine for this workflow. Follow
its deliberate process: brainstorm a design-token system (palette, type scale, spacing,
radii), critique it, and commit to one before building. This is what keeps the result from
reading like a generic template.

Then **present 2–3 distinct directions** to the user (e.g. "denser data-table feel",
"airy card-based layout", "compact dashboard"). Use `AskUserQuestion` with short
descriptions so the user picks one lane before you write component code. Respect any
existing app-wide design language (dark theme, accent colors) unless the user wants a
departure.

Do **not** skip straight to coding a single guess — picking the lane up front is cheaper
than rewriting.

## Step 3 — Build on a branch, in isolation

1. If on `master`, create a feature branch first: `git checkout -b redesign/<page-slug>`.
2. For a large, multi-component overhaul, consider a **git worktree** (`EnterWorktree`)
   so the working tree stays clean and the dev server keeps running on the original.
3. Implement the chosen direction, section by section:
   - Reuse `src/components/ui/*` primitives; extend them rather than forking when possible.
   - Apply the committed design tokens consistently (don't hardcode one-off colors).
   - Keep Server/Client boundaries exactly as they were — a presentational refactor must
     not turn a Server Component into a Client one just to add interactivity unless that
     interactivity genuinely needs it.

## Step 4 — Render-verify loop (the quality multiplier)

This is the step that separates "looks right in the diff" from "looks right in the
browser". For each meaningful change:

1. **Generate** the section.
2. **Render** it: with `pnpm dev` running, screenshot the route with `shot.mjs` from the
   harness above and `Read` the PNG. Re-shoot every edge-case record, not just one.
3. **Critique** the screenshot against the chosen direction and the original intent —
   spacing, alignment, hierarchy, responsive behavior (resize / check mobile width),
   empty/loading/error states, dark mode if applicable.
4. **Fix** what's off. Repeat until it matches the intent.

Verify the page with **real data** (the dev DB), not placeholder content — redesigns
often break on long lists, empty states, or overflowing text that a mockup never shows.

## Step 5 — Polish & hand off

1. Run `pnpm lint` (0 warnings allowed) and `pnpm typecheck`; fix everything.
2. Manually review the refactor for React issues (keys, effect deps, unnecessary client
   components, re-render traps) introduced by the change.
3. Show the user a **before/after** (the Step 1 baseline screenshot vs. the final one) and
   a short summary of what changed.
4. Do **not** commit unless the user asks — when they do, use the **`/commit`** skill. Let
   the user merge the branch themselves.

## Notes

- If the page pulls from external APIs (Notion, AideDD), don't trigger extra network
  fetches during the verify loop — rely on cached/dev data.
- If the redesign reveals a genuine data-layer limitation (a field you wish the query
  returned), surface it as a separate follow-up rather than silently widening the query.
