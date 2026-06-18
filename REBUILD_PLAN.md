# Excel Solutions V Blog — Audit & Phased Rebuild Plan

> **Audited:** 2026-07-02, live server inspection of `/var/www/blogExcelSolutionsV` (repo: `svei00/blogExcelSolutionsV`)
> **Workflow rule for every phase:** edit locally → test locally → commit → push → deploy from `main`. Never edit files on the server.
> **How to use this doc:** work one phase per branch. Each phase lists *What / Why / Tools / Done-when*. Implementation hints only — write the actual code with your AI assistant, one task at a time.

---

## Part 0 — Architecture snapshot (what exists today)

```
Browser
  │
  ├─ nginx (excelsolutionsv.com, HTTPS via Let's Encrypt)
  │    ├─ /            → static files from /var/www/excelsolutionsv.com  ← a COPY of client/dist
  │    ├─ /ads.txt     → served from /var/www/blogExcelSolutionsV/ads.txt
  │    └─ /api/        → proxy to Express on 127.0.0.1:3000 (pm2 "mern-blog")
  │
  ├─ Express API (api/index.js) → MongoDB (posts, users, comments)
  └─ Firebase Storage → post/cover images (uploaded client-side from the editor)
```

- **Frontend:** Vite + React 18 + Tailwind + Flowbite-React. SPA — all HTML is rendered in the browser.
- **Content storage:** posts live in **MongoDB** as raw **HTML strings** produced by React-Quill (`api/models/post.model.js` → `content: String`).
- **"Excel post upload"** is *authoring*, not an end-user upload feature: only admin-gated `/create-post` exists, and the only file uploads are images sent client-side to Firebase Storage. There is **no server-side file upload endpoint** — good, one less attack surface.
- **Deploy:** GitHub Action (`.github/workflows/deploy.yml`) SSHes to the VPS, `git pull`, builds `client/dist`, restarts pm2. **It never copies the build to the nginx web root** — that step is manual and undocumented (see finding C4).

---

## Part 1 — Audit findings (prioritized by impact)

### 🔴 Critical

| # | Finding | Where | Impact |
|---|---------|-------|--------|
| C1 | ~~ads.txt authorizes the WRONG AdSense account~~ **CORRECTED 2026-07-08:** the opposite is true. `ads.txt` (`pub-5050087617356218`) is correct — it's the **script tag in `client/index.html:9`** that loads the wrong account (`ca-pub-7909802717375323`), confirmed by svei pulling AdSense's own ownership-verification snippet (uses `5050087617356218`). Google likely serves ads under the wrong/unverified account → revenue impact, possibly worse than a plain ads.txt mismatch since the script tag drives actual ad rendering. | `client/index.html:9` | Direct revenue |
| C2 | **AdSense meta tag duplicated** (not wrong, per the 2026-07-08 correction above). `google-adsense-account` meta with the **correct** ID (`ca-pub-5050087617356218`) is injected in `App.jsx:27-30` (every page) and again in `PostPage.jsx:93-96` (post pages get two). The script itself is *not* loaded twice — the duplication is at the meta level, and until 1.1 lands the meta ID and script ID mismatch each other. | `App.jsx`, `PostPage.jsx` | Ads verification confusion |
| C3 | **Stored XSS surface: post HTML rendered unsanitized.** `dangerouslySetInnerHTML={{ __html: post.content }}` with no DOMPurify. Today only admins author posts, which limits exposure — but `npm audit` flags Quill 1.x (inside react-quill 2.0) with a **known XSS CVE**, and any future author/account compromise becomes site-wide script injection. | `PostPage.jsx:122-125` | Security |
| C4 | **Deploy drift / undocumented manual step.** The Action builds `client/dist`, but nginx serves `/var/www/excelsolutionsv.com` — and right now the two contain **different builds** (bundle hashes differ). Someone must remember to copy files by hand; forget it and you deploy an API change with a stale frontend. | `deploy.yml`, nginx conf | Deploy integrity |
| C5 | **JWTs never expire + weak cookie flags.** Tokens are signed with no `expiresIn`; the cookie sets only `httpOnly` (no `secure`, no `sameSite`). A leaked token is valid forever; cookie can ride cross-site requests (CSRF) and, in misconfig, plain HTTP. | `auth.controller.js:58-68` (and the two `google` branches) | Auth security |
| C6 | **Vulnerable dependencies:** server 9 (1 critical), client 33 (1 critical). No Dependabot, no audit in CI. | `package-lock.json` ×2 | Security |

### 🟠 High

| # | Finding | Where | Impact |
|---|---------|-------|--------|
| H1 | **Social crawlers never see your meta/OG tags.** All SEO tags are injected client-side (react-helmet-async). Facebook/WhatsApp/LinkedIn don't execute JS → shared posts show no title/image. Google can render JS but it's slower and less reliable than server-delivered tags. | `PostPage.jsx` Helmet block | SEO / sharing |
| H2 | **No sitemap.xml, no robots.txt.** Nothing tells Google what to crawl. Foundational gap for a blog-as-lead-funnel. | (missing) | SEO |
| H3 | **og:url points to the wrong domain** — `blog.excel-solutionsv.com` (stale) instead of `excelsolutionsv.com`. No canonical tag anywhere. | `PostPage.jsx:81-84` | SEO |
| H4 | **Latent crash: `errorHandler` used but never imported** in the comment controller → an ordinary authz failure throws `ReferenceError` and returns 500. | `comment.controller.js:8` | Correctness |
| H5 | **Signup missing `return` on validation failure** → execution continues, `bcryptjs.hashSync(undefined)` throws **outside** the try/catch → unhandled 500 on any empty-field signup. | `auth.controller.js:11-22` | Correctness |
| H6 | **No rate limiting anywhere.** `/api/auth/signin` is brute-forceable; comments can be spammed; no comment length cap server-side. | `api/index.js`, comment routes | Abuse |
| H7 | **ReDoS / regex injection in search:** `searchTerm` goes into a Mongo `$regex` unescaped. A crafted query can pin the DB CPU. | `post.controller.js:40-46` | Availability |
| H8 | **No nginx security headers:** no CSP, HSTS, X-Frame-Options, X-Content-Type-Options. HTTPS redirect exists (good), headers don't. | nginx conf | Security |
| H9 | **Editor fights you.** Quill stores presentation-heavy HTML (`ql-*` classes), mangles pasted Markdown, and your last three commits were CSS hacks fighting its dark-mode toolbar. The pain is structural: the storage format *is* the editor's internal format. | `CustomReactQuill.jsx`, `index.css` | Authoring |

### 🟡 Medium (code health, UX, a11y)

- **M1 — Duplicate `<h1>` on post pages:** post title is `h1`, then "Recent Articles" is *also* `h1` (`PostPage.jsx:132`). Confuses SEO heading hierarchy.
- **M2 — Theme colors are half-centralized.** `tailwind.config.js` defines `blueEx`/`greenEx` (good instinct — your CONTROL-sheet pattern half-exists), but: no semantic naming (primary/secondary/accent), no comments, and gradient combos like `from-greenEx to-blueEx` are copy-pasted across ~6 files. Rebranding = hunt-and-peck.
- **M3 — Contrast failures baked into the palette:** `greenEx #21B868` on white ≈ 2.5:1 and `blueEx #3182DF` ≈ 3.9:1 — both fail WCAG AA (4.5:1) for normal text, and both are used as link/text colors (`Home.jsx`, headers).
- **M4 — Root `package.json` is a grab-bag:** frontend libs (`react-helmet`, `normalize.css`, `redux-persist`) listed as *API server* deps; `nodemon` in prod deps; `esm` unused; client has *both* `react-helmet` (root) and `react-helmet-async` (client).
- **M5 — 240 KB `notes.md` committed to the repo** — personal notes shipped in every clone.
- **M6 — Files doing too much (AI-debuggability):** `CreatePost.jsx` and `UpdatePost.jsx` are ~80% duplicated (form + validation + upload + submit + SEO in one file each); `CustomReactQuill.jsx` mixes editor config + Firebase upload + DOM tooltip hacks; `DahsProfile.jsx` (331 lines, typo in name) mixes profile form + upload + delete + signout. A bug in "image upload" currently lives in **three** files.
- **M7 — Nav has no path to content or services.** Header links: Home / About / Projects. No Categories, no Services/Contact. The funnel's generic `CallToAction` links to an external portfolio and hotlinks a **Wikipedia image with `alt="Some Logo"`**.
- **M8 — `sort({ updatedAt })`** means editing an old post bumps it above new ones on Home — surprising editorial behavior.
- **M9 — Read-time estimate divides raw HTML length** by 1000 — counts markup as reading time.
- **M10 — Performance:** one monolithic JS bundle (no route code-splitting — dashboard code ships to every reader); full Firebase SDK in the public bundle; cover images uploaded at original size and rendered full-width; no gzip/cache config visible in nginx.
- **M11 — `<html lang="en">`** — if posts are Spanish (CFDI/SAT audience), this mislabels the page for search and screen readers. Decide the primary language and set it truthfully.
- **M12 — Prod artifacts of tutorial code:** `console.log`s, commented-out blocks, "Testing purposes" comments throughout.

---

## Part 2 — Phased rebuild plan

**Analytics goes in Phase 1 on purpose** — GA4 must be collecting before Phases 4–7 change navigation/UX, so decisions are measured, not guessed.

Every library named below is free for this use: MIT unless noted.

---

### Phase 0 — Audit & Baseline *(no code changes)*
**Branch:** none — this doc + external setup.

1. Commit this file as `docs/REBUILD_PLAN.md`.
2. **Verify the AdSense account** — ✅ **RESOLVED 2026-07-08.** svei pulled the site-ownership verification snippet directly from AdSense (`<script ... client=ca-pub-5050087617356218>`), confirming **`pub-5050087617356218` is the real, active account** — the opposite of the original audit assumption. Current file-by-file check: `ads.txt` → `pub-5050087617356218` ✅ already correct, no change needed. `App.jsx:29` / `PostPage.jsx:95` meta tags → `ca-pub-5050087617356218` ✅ already correct (just duplicated across two files — dedup still needed, see 1.2). `client/index.html:9` script tag → `ca-pub-7909802717375323` ❌ **wrong account** — this is the actual bug: AdSense's own ad-serving script has been requesting the wrong publisher ID, likely the real revenue leak (worse than an ads.txt mismatch, since the script tag drives what ads actually render). `pub-7909802717375323` should be treated as the stale/old ID everywhere it appears.
3. Create the **GA4 property** and a **Google Search Console** property for `excelsolutionsv.com` (verification will complete in Phase 1/5).
4. Baseline metrics to record in this doc: PageSpeed Insights scores (mobile + desktop) for Home and one post page; current AdSense earnings run-rate.
5. Baseline safety: run `mongodump` on the VPS and store the archive off-server; tag the repo `git tag pre-rebuild && git push --tags`.

**Done when:** doc committed, AdSense ID confirmed, GA4 + GSC created, DB dump stored, tag pushed.

---

### Phase 1 — Quick Fixes *(low-risk, high-impact, each its own commit)*
**Branch:** `phase-1-quick-fixes`

| Task | Hint |
|------|------|
| **1.1 Fix the AdSense script tag** ✅ **UNBLOCKED — corrected 2026-07-08** | `ads.txt` is already correct (`pub-5050087617356218`) — **no change needed there.** The real fix: `client/index.html:9`'s `<script>` tag loads `ca-pub-7909802717375323` (the wrong/stale account) — change it to `ca-pub-5050087617356218`. This is the actual revenue fix (reversed from the original audit finding). |
| **1.2 De-duplicate AdSense meta** | The `google-adsense-account` meta already has the *correct* ID (`ca-pub-5050087617356218`) in both `App.jsx:29` and `PostPage.jsx:95` — it's just duplicated. Delete it from **both**, then add it **once** directly in `client/index.html` next to the (now-fixed) script tag. Root cause to note in a comment: *static, site-wide tags belong in index.html; Helmet is only for per-page values.* ⚠️ **Heavy-comment zone** — future-you must understand why there is exactly one source of truth. |
| **1.3 Fix og:url domain** | `PostPage.jsx` → `https://excelsolutionsv.com/post/${post.slug}`. Better: define `SITE_URL` in a new `client/src/config/site.js` (see 1.8) and import it — first step away from hardcoding. |
| **1.4 Fix comment controller import** | Add `import { errorHandler } from "../utils/error.util.js";` to `comment.controller.js`. |
| **1.5 Fix signup early-return** | Add `return` before `next(errorHandler(400, …))` in `auth.controller.js` signup. |
| **1.6 JWT expiry + cookie flags** | Sign with `expiresIn: "7d"`; cookie gets `secure: true, sameSite: "strict"` (all three places in `auth.controller.js`). Note: users re-login weekly — acceptable for a blog. |
| **1.7 Repo hygiene** | `git rm --cached notes.md` + gitignore it. Remove from root `package.json`: `react-helmet`, `normalize.css`, `redux-persist`, `esm`; move `nodemon` to devDependencies. Remove `esm` from client too. Run `npm audit fix` (no `--force`) in both roots; record what remains for Phase 3. |
| **1.8 🎛️ CONTROL sheet: design tokens** | Create `client/src/config/theme.js` exporting a commented token object — primary, secondary, accent, plus neutrals — each with a comment: *what it is, where it's used, contrast notes*. Import it into `tailwind.config.js` so Tailwind classes (`bg-primary` etc.) are generated from it. Keep `blueEx`/`greenEx` as aliases of the new tokens during transition, migrate classes gradually, delete aliases in Phase 4. ⚠️ **Heavy-comment zone** — this file is the rebrand switchboard; every token documents itself. (Contrast-safe values chosen in Phase 7 — leave a `TODO(phase-7)` marker.) |
| **1.9 GA4** | Add the gtag snippet to `client/index.html` (measurement ID from Phase 0). For SPA route-change pageviews, send `page_view` on route change from one tiny component (`client/src/components/Analytics.jsx`) mounted in `App.jsx` — one file, one job. |
| **1.10 h1 → h2** | "Recent Articles" in `PostPage.jsx:132` becomes `h2`. |
| **1.11 robots.txt** | Static file in `client/public/`: allow all, disallow `/dashboard`, `/create-post`, `/update-post`, `/sign-in`, `/sign-up`; point to `Sitemap: https://excelsolutionsv.com/sitemap.xml` (route arrives in Phase 5). |
| **1.12 Fix deploy drift** | Choose one (a is simpler): **(a)** change nginx `root` to `/var/www/blogExcelSolutionsV/client/dist` — one source of truth, no copy step ever again; or **(b)** add an `rsync` step to `deploy.yml`. Either way, delete the stale `/var/www/excelsolutionsv.com` copy after verifying. ⚠️ Server-config change — do it deliberately, test with `nginx -t`, keep the old conf as `.bak`. |

**Done when:** ads.txt shows the right ID in AdSense dashboard (no "ads.txt issues" warning after re-crawl); GA4 shows real-time pageviews; signup with empty fields returns 400 not 500; one AdSense meta in page source; deploy produces identical bundle hash in the served directory.

---

### Phase 2 — Editor Migration: Quill → Toast UI Editor
**Branch:** `phase-2-editor`

**Feasibility: confirmed, with eyes open.** `@toast-ui/editor` + `@toast-ui/react-editor` are MIT, markdown-native (paste Markdown → it *stays* Markdown), dual WYSIWYG/markdown modes, dark theme included, Spanish i18n included. **One honest caveat:** the project is in low-activity maintenance mode (few commits since ~2023). It's stable and widely used, so it remains the right default for your paste-markdown-without-pain requirement. *Flagged alternative:* **Tiptap** (MIT core) — much more active, but markdown in/out requires extra extensions and wiring; more build effort for your use case. Only switch if Toast UI shows a real blocker in the spike (task 2.1).

**The strategic move — change the storage format, not just the editor:** store **Markdown** in MongoDB, render to HTML at display time. Markdown is portable; if any editor dies in 2028, your content doesn't care.

| Task | Hint |
|------|------|
| **2.1 Spike (½ day, throwaway branch)** | Minimal page with Toast UI React wrapper: paste a real Markdown draft, insert an image, toggle dark mode. Confirms no blocker before you commit to the path. |
| **2.2 Schema: add `contentFormat`** | `post.model.js` gains `contentFormat: { type: String, enum: ["html", "md"], default: "html" }`. Old posts stay `"html"` and keep rendering forever; new posts are `"md"`. **No risky bulk conversion required.** |
| **2.3 Render pipeline** | New file `client/src/lib/renderPostContent.js` — *single responsibility:* `(content, format) → sanitized HTML`. `md` → `marked` (MIT) → DOMPurify; `html` (legacy) → DOMPurify directly. `PostPage.jsx` imports it and stops knowing formats exist. ⚠️ **Heavy-comment zone** — document both branches and why sanitization is non-negotiable. |
| **2.4 Editor component** | `client/src/components/PostEditor.jsx` wraps Toast UI: props in (`value`, `onChange`), markdown out. Image upload moves to its own hook `client/src/hooks/useImageUpload.js` (Firebase logic extracted from `CustomReactQuill.jsx` + `CreatePost.jsx` — one copy instead of two). Toast UI's `addImageBlobHook` connects the two. |
| **2.5 Unify Create/Update** | Extract shared `client/src/components/PostForm.jsx`; `CreatePost.jsx` and `UpdatePost.jsx` shrink to thin pages (fetch/submit + render PostForm). Kills the 80% duplication (M6). |
| **2.6 Optional legacy conversion** | If you want old posts editable in the new editor: one-off **local** script with `turndown` (MIT, HTML→MD) run against a DB dump, review each post manually, update `contentFormat`. Do this per-post as needed, not as a big-bang batch. |
| **2.7 Remove Quill** | Uninstall `react-quill`, delete `CustomReactQuill.jsx`, and delete every `ql-*` / Quill dark-mode hack from `index.css` (this deletes your recent pain commits — satisfying). |

**Done when:** you paste a Markdown draft into a new post and publish with zero reformatting; old posts still render identically; `react-quill` is gone from `package.json`; the Quill XSS advisory disappears from `npm audit`.

---

### Phase 3 — Security Hardening
**Branch:** `phase-3-security`

| Task | Hint |
|------|------|
| **3.1 Sanitize on the way in AND out** | `isomorphic-dompurify` server-side in `post.controller.js` create/update (defense in depth), plus the client-side render sanitization from 2.3. Comments already render as escaped React text (verified safe) — add a server-side length cap (e.g. 500 chars) and strip HTML in `comment.controller.js`. |
| **3.2 helmet** | `helmet` (MIT) in `api/index.js`. Note CSP via nginx below, so disable helmet's CSP to avoid double headers. |
| **3.3 Rate limiting** | `express-rate-limit` (MIT): strict on `/api/auth/*` (e.g. 10/15min), moderate on comment creation (e.g. 5/min), light global. New file `api/middleware/rateLimits.js` — one file, all limits, commented. |
| **3.4 Input validation layer** | `zod` (MIT) schemas in `api/validators/` (one file per resource). Includes **escaping regex chars in `searchTerm`** before it reaches `$regex` (fixes H7) — tiny `escapeRegex` util with a comment explaining ReDoS, ⚠️ heavy-comment zone. |
| **3.5 Secrets** | `.env` is untracked (verified ✓) but **rotate `JWT_SECRET`** anyway (it predates this audit; rotation invalidates all sessions — fine). Add `.env.example` with placeholder keys so local setup is documented. Confirm the Firebase key is a `VITE_` var (it is; note in a comment that Firebase web keys are public-by-design identifiers — security comes from Firebase Storage *rules*, which you should verify allow writes only to authenticated admins, or at minimum restrict file size/type). |
| **3.6 nginx headers** | Add: HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, and a CSP. ⚠️ CSP with AdSense+GA4 is fiddly — allowlist `pagead2.googlesyndication.com`, `*.google.com`, `googleads.g.doubleclick.net`, `www.googletagmanager.com`, `firebasestorage.googleapis.com` (images), start in `Content-Security-Policy-Report-Only` mode for a week before enforcing. |
| **3.7 Dependency automation** | Enable **Dependabot** in the GitHub repo (free) for both package roots + GitHub Actions. Add a CI job that fails PRs on `npm audit --audit-level=high`. |
| **3.8 Safe deploy** | Extend `deploy.yml`: `mongodump` to a dated archive **before** pull; build; health-check (`curl -f https://excelsolutionsv.com/api/post/getposts?limit=1`) after restart; keep last 5 dumps. "Staging" for a solo dev = local `npm run dev` + `vite preview` against prod build — codify this as a checklist in `docs/DEPLOY.md`. |

**Done when:** securityheaders.com grade A-range; brute-forcing signin gets 429; `npm audit` clean at high+; deploy log shows dump + health check; JWT_SECRET rotated.

---

### Phase 4 — Responsive & Performance *(rendering speed ≠ navigation clarity — that's Phase 6)*
**Branch:** `phase-4-performance`

| Task | Hint |
|------|------|
| 4.1 Route code-splitting | `React.lazy` + `Suspense` for Dashboard, CreatePost, UpdatePost, SignIn/Up — readers stop downloading admin code. Biggest single bundle win. |
| 4.2 Bundle analysis | `rollup-plugin-visualizer` (MIT) — measure before/after; check what Firebase SDK costs (only `firebase/storage` + `firebase/app` should be imported — verify tree-shaking works; if the bundle still carries auth/firestore chunks, tighten imports). |
| 4.3 Image discipline | `browser-image-compression` (MIT) in `useImageUpload.js` — compress/resize to ~1600px max before Firebase upload. Add `loading="lazy"` to PostCard and in-content images; explicit `width`/`height` on cover images to kill layout shift (CLS). |
| 4.4 Self-host the CTA image | Replace the hotlinked Wikipedia PNG with a local asset (also fixes its alt text — see M7/Phase 7). |
| 4.5 nginx: gzip + cache | Enable gzip (or brotli if module available); `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` (hashed filenames make this safe); no-cache for `index.html`. |
| 4.6 Responsive pass | Audit at 360px / 768px / 1024px: post page typography (`max-w-2xl` prose is good, verify tables/code blocks from Markdown don't overflow — add `overflow-x-auto` wrappers in post-content CSS), header nav collapse, dashboard tables. |
| 4.7 Fix read-time | Compute from plain-text word count (`words / 200`), not HTML string length. |
| 4.8 Finish token migration | Migrate remaining hardcoded `blueEx/greenEx` gradient classes to semantic tokens; delete the transition aliases from 1.8. |

**Done when:** PageSpeed mobile ≥ 85 on a post page (record vs Phase 0 baseline); reader bundle measurably smaller (report numbers); no CLS from cover images.

---

### Phase 5 — SEO Fundamentals
**Branch:** `phase-5-seo`

| Task | Hint |
|------|------|
| **5.1 Server-side meta injection** (the chosen approach) | New `api/middleware/injectMeta.js`: for `GET /post/:slug` requests, fetch the post, and string-replace a `<!--META-->` placeholder in `dist/index.html` with title, description, OG tags, canonical, and Article JSON-LD before sending. All other routes get sensible defaults. ⚠️ **The single most heavily commented file in the project** — it's the one piece of "magic" in the stack; document the placeholder contract with `index.html` explicitly. Requires nginx change: route `/post/*` to Express instead of static (one `location` block). Keep Helmet tags too — they take over after hydration. |
| 5.2 Dynamic sitemap | Express route `GET /sitemap.xml` generating XML from the posts collection (slug + updatedAt) plus static pages. No library needed — a 40-line template. Proxy `/sitemap.xml` to Express in nginx. Submit in Search Console. |
| 5.3 Meta description field | Add optional `metaDescription` to the post model + PostForm (fallback: first 160 chars of *plain text* — current code strips HTML, keep that but note Markdown needs stripping too once Phase 2 lands). |
| 5.4 Canonical + lang | `<link rel="canonical">` in the injected meta; decide site language (M11) — if content is Spanish, `<html lang="es">`; if mixed, per-post `lang` field is Phase 8 territory, pick the dominant one now. |
| 5.5 Heading hierarchy policy | One `h1` per page (post title). In the editor, top-level section headings in content start at `##`/h2 — write this into an authoring note in `docs/AUTHORING.md`. |
| 5.6 Alt text | Add alt/caption support in the editor workflow (Markdown makes this natural: `![alt text](url)`), and an `imageAlt` field for the cover image. |
| 5.7 URL structure | `/post/:slug` is fine — **don't change it** (existing Google equity). Slug generator currently strips non-ASCII (`á`, `ñ` vanish) — improve to transliterate (`slugify`, MIT) for future posts; never touch old slugs without 301s. |
| 5.8 Search Console | Submit sitemap, request indexing of key posts, fix any coverage errors it reports. |

**Done when:** sharing a post URL into WhatsApp/LinkedIn shows correct title+image (test with metatags.io or the LinkedIn Post Inspector); sitemap accepted in GSC; every page has exactly one h1 and a canonical.

---

### Phase 6 — Reader UX & Navigation *(IA changes, measured with the GA4 data flowing since Phase 1)*
**Branch:** `phase-6-ux`

| Task | Hint |
|------|------|
| 6.1 Categories in the nav | Header gains a Categories dropdown (or bar) fed by the existing `/api/post/getCategories`. Readers currently have **no** browse path — nav is Home/About/Projects only. |
| 6.2 Related posts by category | PostPage "Recent Articles" → "Related articles": query `getposts?category=X&limit=3` excluding the current post. Recent ≠ related for an accountant looking for more CFDI content. |
| 6.3 Services-first funnel | Replace the generic `CallToAction` with a real services CTA: what you sell (Excel automation? CFDI tooling? consulting?), one clear action (contact / WhatsApp / service page). Place it **after** the post content (reader has received value) — and if AdSense Auto Ads are on, review placement settings so ads don't compete with your own CTA above the fold. **Services conversion > RPM** — configure Auto Ads conservatively (fewer formats, no anchor over the CTA). |
| 6.4 Breadcrumbs | `Home › Category › Post` on PostPage (with BreadcrumbList JSON-LD riding on 5.1's injection). Helps lost readers *and* SERP display. |
| 6.5 Search visibility + pagination | Search exists but is buried; add it to the header. Verify Search page paginates (`startIndex` exists in the API) with a visible "load more". |
| 6.6 Home page ordering | Change Home/getposts default sort to `createdAt` (fixes M8) — or add `?sort=` support and let Home ask for newest-created. |
| 6.7 Footer as a map | Footer gets: categories, services link, contact, About — the "lost reader's" fallback. |
| 6.8 Measure | Define success in GA4 before shipping: CTA click-through (event), pages/session, % of post-page sessions that visit a second page. Compare 4 weeks pre/post. |
| 6.9 Floating "pill" navbar (Upscayl-style, ref: upscayl.org/download) | At the top of the page the header stays the normal full-width bar; after scrolling ~40px it morphs into a centered floating pill: translucent bg (`bg-white/70 dark:bg-gray-900/70`), `backdrop-blur-md`, border + shadow, `max-w-5xl` centered with side margins, `rounded-full` on `md:`+ but **`rounded-2xl` on mobile** — the expanded hamburger menu turns a `rounded-full` bar into an ugly oval. Implementation: `scrolled` boolean state in `Header.jsx` from a **passive** window scroll listener (call the handler once on mount so a mid-page reload starts in the right state); swap conditional classes on the Flowbite `<Navbar>` with `transition-all duration-300`. Colors come from the Phase 1 `theme.js` tokens, not hardcoded. ⚠️ **Two traps found in the current code:** (a) `HeaderLayout.jsx`'s fixed wrapper paints its own solid `bg-white dark:bg-gray-900` — it must become background-free or the pill floats on top of a solid bar and the translucency is invisible; (b) once that wrapper is transparent, it still spans the full viewport width and swallows clicks on content visible beside/behind the pill — fix with `pointer-events-none` on the wrapper and `pointer-events-auto` on the `<Navbar>` element itself (NOT on a full-width inner div, which would re-block the clicks). Leave `HeaderLayout`'s height-measuring spacer logic alone — it measures once at mount (unscrolled), which is exactly right so content doesn't jump when the bar shrinks. |

**Done when:** a reader on any post can reach a category list, a related post, and your services page in one click each; GA4 events fire on CTA clicks; scrolling any page morphs the header into the translucent pill with no dead click-zones beside it and no content jump.

---

### Phase 7 — Accessibility Basics *(cheap now, expensive later; overlaps SEO)*
**Branch:** `phase-7-a11y`

| Task | Hint |
|------|------|
| 7.1 Fix token contrast | In `theme.js` (the control sheet — this is why it exists): darken text-role variants, e.g. green for text ≈ `#177D47`, blue for text ≈ `#1D6FD1`-or-darker, until ≥ 4.5:1 on white and on the dark-mode background. Keep the brighter originals as `*-vivid` tokens for large headings/buttons where 3:1 suffices. Document each ratio in the token comments. |
| 7.2 Semantic landmarks | One `<main>` per page, `<nav>` labeled, `<footer>`; PostCard titles become real headings (`h3`) inside `<article>`. |
| 7.3 Keyboard pass | Tab through header, comment form, editor page: visible focus rings (don't strip Tailwind's), skip-link to `#main-content`, dropdowns operable by keyboard (Flowbite is decent here — verify, don't assume). |
| 7.4 Forms & alts | Every input gets a label (not placeholder-as-label); kill `alt="Some Logo"`; decorative images get `alt=""`. |
| 7.5 Audit tooling | Lighthouse a11y + `axe DevTools` browser extension (free tier) on Home, a post, Search, and the comment flow. Fix everything "serious"+. |

**Done when:** Lighthouse a11y ≥ 95 on Home and post page; zero serious axe violations; all text tokens documented ≥ 4.5:1.

---

### Phase 8 — Optional / Future *(nothing here blocks anything above)*

- **SSR/SSG migration** (Astro or Next.js) for the public blog, keeping the Express API — the "right" long-term SEO architecture if the blog becomes the main lead channel. The Phase 5 middleware buys you years of runway; revisit if organic traffic plateaus.
- **Comment moderation queue** (approve-before-publish flag on the comment model) — worth it the day spam starts.
- **Newsletter**: Listmonk (AGPL, self-hostable on this VPS) or Buttondown (free tier) — accountants are an email-friendly audience.
- **i18n** (es/en post variants + hreflang) if you want cross-border reach.
- **Umami** (MIT, self-hosted) alongside GA4 for a privacy-friendly daily dashboard.
- **Image CDN / Cloudflare** in front of nginx: free tier gives caching + WAF + rate limiting at the edge.
- **Uptime monitoring**: Uptime Kuma (MIT, self-hosted) or UptimeRobot free tier.
- **Rename `DahsProfile.jsx` → `DashProfile.jsx`** and general dashboard refactor, if the admin area ever grows.

---

## Part 3 — Target file structure (the AI-debuggability contract)

The rule every phase follows: **one file = one job; a bug report should name one file.** Where cross-file dependencies are real, they're explicit imports at the top — an AI (or you, tired, at 11pm) reads file A alone and knows exactly which file B to ask for.

```
client/src/
  config/
    site.js          ← SITE_URL, site name, social handles (Phase 1)
    theme.js         ← 🎛️ THE CONTROL SHEET: commented color tokens (Phase 1)
  lib/
    renderPostContent.js  ← (format, content) → safe HTML. The ONLY sanitization point client-side (Phase 2)
  hooks/
    useImageUpload.js     ← the ONLY Firebase upload code (Phase 2)
  components/
    PostEditor.jsx        ← Toast UI wrapper, markdown in/out, nothing else (Phase 2)
    PostForm.jsx          ← shared by Create/Update pages (Phase 2)
    Analytics.jsx         ← GA4 route-change pageviews, nothing else (Phase 1)
  pages/                  ← thin: fetch + compose components

api/
  middleware/
    rateLimits.js    ← all limits, one file (Phase 3)
    injectMeta.js    ← SEO injection; most-commented file in the repo (Phase 5)
  validators/        ← zod schemas, one file per resource (Phase 3)
  controllers/       ← thinner after validators absorb input checks
```

Current worst offenders this dissolves: `CreatePost`/`UpdatePost` duplication, `CustomReactQuill`'s three jobs, upload logic in three places, SEO knowledge scattered across App/PostPage/index.html.

---

## Part 4 — Git workflow

- **One branch per phase**: `phase-1-quick-fixes`, `phase-2-editor`, … Inside a phase, **one commit per task** (`fix: correct AdSense publisher ID in ads.txt`) — reviewable, individually revertable.
- **Test locally before merging**: API (`npm run dev`) + client (`npm run dev`), plus `npm run build && vite preview` to catch prod-only issues. Merge to `main` only when the phase's "Done when" checks pass.
- **Deploy only from `main`**, only via the GitHub Action (which, after Phase 3, backs up the DB and health-checks itself). Never edit on the server; the two server-config touchpoints (nginx in 1.12 and 3.6) are deliberate exceptions — change, `nginx -t`, reload, and keep dated `.bak` copies.
- **Tag after each phase** (`phase-1-done`, …). Rollback = `git revert` the offending commit (preferred) or redeploy the previous tag.
- Phases 1→3 are sequential by design (fix revenue, then editor, then hardening). Phases 4–7 can reorder if life happens; Phase 5.1 depends on nothing from 4.

---

## Appendix — Library license confirmation

| Library | License | Used in |
|---|---|---|
| @toast-ui/editor, @toast-ui/react-editor | MIT | Phase 2 |
| marked | MIT | Phase 2 |
| turndown (optional, local script only) | MIT | Phase 2 |
| DOMPurify / isomorphic-dompurify | Apache-2.0 OR MPL-2.0 | Phases 2–3 |
| helmet, express-rate-limit, zod, slugify | MIT | Phases 3, 5 |
| browser-image-compression, rollup-plugin-visualizer | MIT | Phase 4 |
| GA4 / Search Console / Dependabot | Free (hosted) | Phases 1, 3, 5 |
| Listmonk (AGPL-3.0), Umami (MIT), Uptime Kuma (MIT) | as noted | Phase 8 |
