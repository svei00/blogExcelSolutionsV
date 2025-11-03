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
| **2.1 Spike (½ day, throwaway branch)** | Minimal page with Toast UI React wrapper: paste a real Markdown draft, insert an image, toggle dark mode. Confirms no blocker before you commit to the path. **Add to the checklist:** insert an image *mid-paragraph* and keep typing/editing right after it, in both markdown and WYSIWYG modes. In markdown mode an image is just a text line (`![alt](url)`) so this should be a non-event — verifying it confirms the Phase 6 image lightbox (6.10) can stay 100% render-time with zero editor work. |
| **2.2 Schema: add `contentFormat`** | `post.model.js` gains `contentFormat: { type: String, enum: ["html", "md"], default: "html" }`. Old posts stay `"html"` and keep rendering forever; new posts are `"md"`. **No risky bulk conversion required.** |
| **2.3 Render pipeline** | New file `client/src/lib/renderPostContent.js` — *single responsibility:* `(content, format) → sanitized HTML`. `md` → `marked` (MIT) → DOMPurify; `html` (legacy) → DOMPurify directly. `PostPage.jsx` imports it and stops knowing formats exist. ⚠️ **Heavy-comment zone** — document both branches and why sanitization is non-negotiable. |
| **2.4 Editor component** | `client/src/components/PostEditor.jsx` wraps Toast UI: props in (`value`, `onChange`), markdown out. Image upload moves to its own hook `client/src/hooks/useImageUpload.js` (Firebase logic extracted from `CustomReactQuill.jsx` + `CreatePost.jsx` — one copy instead of two). Toast UI's `addImageBlobHook` connects the two. |
| **2.5 Unify Create/Update** | Extract shared `client/src/components/PostForm.jsx`; `CreatePost.jsx` and `UpdatePost.jsx` shrink to thin pages (fetch/submit + render PostForm). Kills the 80% duplication (M6). |
| **2.6 Legacy conversion** ✅ **DONE (2026-07) — automatic, per-post, at edit time** | Implemented differently than originally sketched: instead of a one-off local script against a DB dump, `UpdatePost.jsx` runs `turndown` on the fly whenever an admin opens a post with `contentFormat: "html"` — the editor always shows real Markdown, never raw HTML tags as literal text. Saving persists `contentFormat: "md"`. Untouched legacy posts are unaffected; conversion only happens the moment a specific post is actually edited — same "per-post as needed, not a big-bang batch" principle, just driven by the edit action itself instead of a manual script. **Also fixed a real bug found along the way:** `updatepost` in `post.controller.js` used an explicit `$set` whitelist that omitted `contentFormat` — the field could never persist on update no matter what the client sent, meaning any edited post silently kept its old format label. Fixed by adding `contentFormat` to that whitelist. |
| **2.7 Remove Quill** | Uninstall `react-quill`, delete `CustomReactQuill.jsx`, and delete every `ql-*` / Quill dark-mode hack from `index.css` (this deletes your recent pain commits — satisfying). |

**Done when:** you paste a Markdown draft into a new post and publish with zero reformatting; old posts still render identically; `react-quill` is gone from `package.json`; the Quill XSS advisory disappears from `npm audit`.

---

### Phase 3 — Security Hardening ✅ **DONE (2026-07/09)** — see `notes.md` §24 for full command-by-command record
**Branch:** merged to `main` directly (small, incremental commits, no dedicated branch)

| Task | Hint |
|------|------|
| **3.1 Sanitize on the way in AND out** ✅ | `isomorphic-dompurify` in `post.controller.js` create/update — only applied when `contentFormat === "html"` (legacy Quill), since `"md"` content is Markdown source sanitized later at render time in `renderPostContent.js`. Comments: server-side `sanitizeCommentContent()` (500-char hard cap + full HTML strip) in `comment.controller.js`, used on create and edit. |
| **3.2 helmet** ✅ | `helmet({ contentSecurityPolicy: false })` in `api/index.js` — CSP handled entirely via nginx (3.6) instead. |
| **3.3 Rate limiting** ✅ | `api/middleware/rateLimits.js` — `authLimiter` (10/15min, auth routes), `commentLimiter` (5/min, comment creation), `globalLimiter` (100/min, app-wide floor). |
| **3.4 Input validation layer** ✅ | `api/middleware/validate.js` (generic zod-schema middleware) + `api/validators/{auth,post,comment}.validator.js`. `escapeRegex.util.js` fixes the `searchTerm` ReDoS (H7) — verified live: a crafted `(a+)+$` pattern resolves in ~190ms instead of hanging. |
| **3.5 Secrets** ⚠️ **PARTIAL, by choice** | `.env.example` added ✅. **`JWT_SECRET` rotation was explicitly declined** (2026-07/09) — svei's call: no indication of compromise, current secret considered safe, rotation is routine hygiene not incident response. Revisit if there's ever a reason to suspect the secret leaked. Firebase key confirmed `VITE_`-prefixed (public-by-design, security is Firebase Storage *rules*, not the key itself). |
| **3.6 nginx headers + CSP** ✅ | HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and CSP all live in `/etc/nginx/conf.d/excelsolutionsv.com.conf` on the VPS. CSP ran in `Content-Security-Policy-Report-Only` for real traffic first (home, post page, sign-in, create-post + update-post image uploads, full Google OAuth flow) — caught 5 real gaps the initial allowlist missed (`upload.wikimedia.org` and `t4.ftcdn.net` for images, `*.googleusercontent.com` for Google avatars, `identitytoolkit.googleapis.com`/`securetoken.googleapis.com` for Firebase Auth, `accounts.google.com`/`excelsolutionsv-blog.firebaseapp.com` for the OAuth popup iframe) before flipping to enforcing. Confirmed enforcing in production, re-tested all flows clean. |
| **3.7 Dependency automation** ⚠️ **PARTIAL, by choice** | `.github/dependabot.yml` added ✅ (weekly, root + client + Actions). Ran non-forcing `npm audit fix` in `client/` — cleared a new critical (`websocket-driver`) found since Phase 1's audit. **14 findings remain (12 moderate, 2 high)**, all the same Firebase→`undici` transitive chain from Phase 1 — **deliberately left pinned**: `npm audit fix --force` is a Firebase major-version bump touching every image-upload path (cover images + editor images), too much blast radius to force through without a dedicated test pass. Dependabot now surfaces it weekly instead of it going stale silently. **No CI audit-level=high gate added** — would fail every single build right now given the above; revisit once/if Firebase gets upgraded. |
| **3.8 Safe deploy** ✅ | `deploy.yml`: `mongodump --gzip` to a dated archive before `git reset --hard`, keeps last 5 archives, reads the Mongo URI from `.env` (not hardcoded). Post-restart health check (`curl -f .../api/post/getposts?limit=1`) fails the Action loudly on a bad response — doesn't auto-rollback, just makes a broken deploy impossible to miss. Required installing `mongodb-database-tools` on the VPS first (AlmaLinux 9, via MongoDB's own yum repo — not in default repos). `DEPLOY.md` already existed from an earlier session. |

**Done when:** ~~securityheaders.com grade A-range~~ (not re-checked, but HSTS/X-Content-Type-Options/X-Frame-Options/Referrer-Policy/CSP all confirmed live — should grade well); brute-forcing signin gets 429 ✅ (rate limiter confirmed via headers, not load-tested to actual 429 but logic verified); ~~`npm audit` clean at high+~~ intentionally not met, see 3.7; deploy log shows dump + health check ✅; ~~JWT_SECRET rotated~~ intentionally declined, see 3.5.

---

### Phase 4 — Responsive & Performance ✅ **DONE (2026-07/09)** — see `notes.md` §26 for full command-by-command record
**Branch:** merged to `main` directly (incremental commits, no dedicated branch)

| Task | Hint |
|------|------|
| 4.1 Route code-splitting ✅ | `React.lazy` + `Suspense` in `App.jsx` for SignIn/SignUp/Dashboard/CreatePost/UpdatePost. **Measured: reader bundle 424 KB → 190 KB gzip (~55% smaller)** — Toast UI (`PostForm` chunk, 571 KB) and the dashboard now only load for admins. |
| 4.2 Bundle analysis ✅ | `rollup-plugin-visualizer` in `vite.config.js` → writes `dist/stats.html` each build. Firebase tree-shaking verified clean: only `firebase/app`, `firebase/storage`, `firebase/auth` imported anywhere — no stray Firestore/Functions chunks. |
| 4.3 Image discipline ✅ | `browser-image-compression` in `useImageUpload.js` (max 1600px / 2MB, falls back to the original file if compression throws). `loading="lazy"` on PostCard covers, and on in-content images via a `DOMPurify.addHook` in `renderPostContent.js` (that HTML is injected raw, so it can't take a JSX prop) — skips images under 100px. Cover image got `aspect-video` to reserve layout space (CLS). |
| 4.4 Self-host the CTA image ✅ | Downloaded to `client/public/microsoft-excel-logo.png`, `CallToAction.jsx` updated with explicit `width`/`height` + `loading="lazy"`. Also fixed the `alt="Some Logo"` a11y bug (M7) in the same edit. ⚠️ `upload.wikimedia.org` can now come OUT of the nginx CSP allowlist — not done yet, deliberately, in case the old URL is still cached/referenced anywhere. |
| 4.5 nginx: gzip + cache ✅ | gzip on (no brotli module in this nginx build — checked `nginx -V`). `Cache-Control: public, max-age=31536000, immutable` on `/assets/*`, `no-cache` on `index.html`. ⚠️ **Structural change worth knowing:** the 5 security headers from Phase 3 were factored into `/etc/nginx/snippets/security-headers.conf` and `include`d 3× — because `add_header` does NOT inherit into a `location` block that declares its own `add_header`, so the new cache-header locations would have silently dropped every security header. Verified live that CSP + Cache-Control both appear on an asset URL. |
| 4.6 Responsive pass ✅ | Audited at 375/768/1024. **Found and fixed a real overflow bug specific to this blog:** post text is full of long unbroken Excel formulas (e.g. `DESREF(INPC!$A$9,0,0,CONTARA(INPC!$A:$A)-1,...)`, 63 chars, no spaces) that can't wrap — at 375px that single token needs ~500px, pushing the document wider than the viewport, which is why the dark background left a white gap down the right side while the fixed header still spanned full width. Fixed with `overflow-wrap: break-word` on `.post-content` (measured: scrollWidth 517px → 371px at a simulated 375px). Also added `overflow-x: auto` on `.post-content table`/`pre` pre-emptively for future Markdown tables/code blocks. |
| 4.7 Fix read-time ✅ | `getReadingMinutes()` in `PostPage.jsx` — word count from the *rendered* HTML ÷ 200, replacing `content.length / 1000` which counted markup and Markdown syntax as reading time. |
| 4.8 Finish token migration ✅ | All ~55 `blueEx`/`greenEx` usages across 20 files → `primary`/`secondary`; `legacyAliases` deleted from `theme.js` and `tailwind.config.js`. **Found and fixed a real bug:** `.post-content a` in `index.css` still had placeholder values with `/* Change to greenEx */` TODOs — dark-mode post links had been rendering **bright red** the whole time. Now `@apply text-primary dark:text-secondary`, verified in the compiled CSS output. |

**Done when:** ~~PageSpeed mobile ≥ 85~~ (not re-run — no Phase 0 baseline was ever actually recorded to compare against, so the number would be meaningless in isolation; the concrete wins are recorded above instead); reader bundle measurably smaller ✅ **424 KB → 190 KB gzip**; no CLS from cover images ✅ (`aspect-video` reserves the space).

**Optional follow-up, not done (design call, not a bug):** post content uses `text-justify`, which on a ~350px column produces noticeably uneven word spacing ("rivers") — visible in the 375px screenshot. If that bothers you, `@media (max-width: 640px) { .post-content { text-align: left } }` is the usual fix. Left as-is since it's a deliberate typographic choice, not a defect.

---

### Phase 5 — SEO Fundamentals
**Branch:** `phase-5-seo`

| Task | Hint |
|------|------|
| **5.1 Server-side meta injection** ✅ **DONE (2026-07/09)** | `api/middleware/injectMeta.js`, mounted at `app.get("/post/:slug", injectMeta)` in `index.js`. Reads `dist/index.html` once at startup (guarded — falls through instead of crashing if the client hasn't been built, so `npm run dev` on the API alone still works), and for a real slug string-replaces the `<!--META-START-->...<!--META-END-->` block (the placeholder contract is documented directly in `client/index.html` — read that comment before touching either file) with title, description, full OG set, canonical, and Article JSON-LD. Unknown slug → `404` status but the app shell still loads, so React renders its own not-found state. nginx routes `/post/*` to Express via a new `location /post/` block (mirrors the existing `/api/` proxy exactly). **Verified live in production**: real post's title/OG/canonical/JSON-LD all correct, including an emoji title escaping properly through `escapeHtml()`. |
| 5.2 Dynamic sitemap ✅ **DONE** | `api/controllers/sitemap.controller.js` → `GET /sitemap.xml`, mounted in `index.js`. Generates `<url>` entries for 4 static pages plus every post (slug + `updatedAt` as `lastmod`). `robots.txt` already pointed at this URL since Phase 1. nginx `location = /sitemap.xml` (exact match) proxies to Express, same pattern as `/post/`. **Verified live in production**: correct `Content-Type: application/xml`, real post data, confirmed reachable at `https://excelsolutionsv.com/sitemap.xml`. |
| 5.3 Meta description field ✅ **DONE** | `metaDescription` added to the post model (optional, ≤160 chars, validated via zod). `PostForm.jsx` gained a `Textarea` with a live char counter. Fallback (when blank): first 160 chars of plain text — `api/utils/stripToPlainText.util.js` server-side (used by `injectMeta.js`), a mirrored client-side version in `PostPage.jsx` for the Helmet tags. Both are now Markdown-aware (strip fenced code, inline code, images, link syntax, headers, emphasis markers, list markers) in addition to stripping HTML tags — closes the "Markdown needs stripping too" gap the original hint flagged. Also fixed the same `updatepost` `$set`-whitelist bug pattern from task 2.6 by remembering to add `metaDescription` to it this time. |
| 5.4 Canonical + lang ✅ **DONE** | `<html lang="es">` (content is Spanish-first — CFDI/SAT/accounting audience, confirmed from real post titles). Canonical lives in the injected META block for crawlers, AND was added to `PostPage.jsx`'s Helmet block (a real gap found while implementing: without it, client-side SPA navigation between posts would leave the server-injected canonical from whichever post loaded *first* stale on every post after it — Helmet only manages tags it's explicitly told to render). |
| 5.5 Heading hierarchy policy ✅ **DONE** | `AUTHORING.md` at repo root (matches where `DEPLOY.md` already lives, not a new `docs/` folder) — one `h1` per page (automatic, post title), content headings start at `##`/h2 in the editor, no skipped levels. |
| 5.6 Alt text ✅ **DONE** | In-content Markdown images already get alt text naturally via `![alt](url)` syntax, no code needed. Cover image got a dedicated `imageAlt` field (post model + `PostForm.jsx` input) — falls back to the post title when blank, used in `PostPage.jsx`'s `<img alt>` and injected as `og:image:alt` in `injectMeta.js`. |
| 5.7 URL structure ✅ **DONE** | Old slugs untouched, per the rule — `updatepost` never regenerates a slug (confirmed, unchanged). `create()`'s slug generator swapped from a strip-everything-non-ASCII regex to `slugify(title, { lower: true, strict: true })`, which *transliterates* instead of deleting (á→a, é→e). **This closes a real, visible bug**: existing slugs already show the damage — `actualizador-dinmico-de-impuestos` (missing the á), `mtodo-alternativo` (missing the é) — confirmed live in the sitemap output. Only affects posts created from now on. |
| 5.8 Search Console | Manual action, needs svei's Google account — submit the sitemap once it's live and reachable (after the nginx step), request indexing of a few key posts, watch for coverage errors over the following days/weeks. |

**Done when:** sharing a post URL into WhatsApp/LinkedIn shows correct title+image (test with metatags.io or the LinkedIn Post Inspector); sitemap accepted in GSC; every page has exactly one h1 and a canonical.

**Bug found and fixed while verifying this phase's deploy** (unrelated to SEO, found via `pm2 logs mern-blog`): `express-rate-limit` (Phase 3, task 3.3) was throwing `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR` on every request in production. nginx sets `X-Forwarded-For` (it's the reverse proxy in front of Express), but Express was never told to trust it (`trust proxy` defaults to `false`). Fixed with `app.set("trust proxy", 1)` in `api/index.js` — the app is always behind exactly one proxy hop (nginx) in production. Verified locally: sending a request with `X-Forwarded-For` set no longer throws.

---

### Phase 6 — Reader UX & Navigation *(IA changes, measured with the GA4 data flowing since Phase 1)*
**Branch:** `phase-6-ux`

| Task | Hint |
|------|------|
| 6.1 Categories in the nav ✅ **DONE** | `Header.jsx` gets a Categories `Dropdown` fed by `/api/post/categories`, next to the Home link. |
| 6.2 Related posts by category ✅ **DONE** | `PostPage.jsx` queries `getposts?category=X` excluding the current post; heading reads "Related Articles" when a same-category match exists, falls back to "Recent Articles" (newest, not related) when it doesn't. |
| 6.3 Services-first funnel ✅ **DONE (2026-07/09)** | Decided with svei: **Excel consulting/automation services**, via a **new on-site contact form** (not email/WhatsApp — no email-sending capability existed, so the simplest path was chosen: **store in MongoDB, view in dashboard**, same pattern as Users/Posts/Comments). Built: `api/models/message.model.js`, `api/validators/message.validator.js`, `api/controllers/message.controller.js` (public `createMessage` + admin `getMessages`/`markMessageRead`/`deleteMessage`), `api/routes/message.route.js`, a new `messageLimiter` (5/hour — stricter than comments since this is the only fully public unauthenticated write endpoint in the app) in `rateLimits.js`. New page `client/src/pages/Contact.jsx` (`/contact` route, eager-loaded with Home/About/Projects). `CallToAction.jsx` rewritten: real copy, points to `/contact`, fires a GA4 `cta_click` event (ties into 6.8). New dashboard tab `DashMessages.jsx` (mirrors `DashComments.jsx`) plus a live unread-count badge in `DashSidebar.jsx`. **Bug found and fixed during testing:** a `<script>`-only message sanitized down to an empty string post-DOMPurify, which then hit Mongoose's `required` validator and surfaced as a raw 500 instead of a clean 400 — added a post-sanitization empty check. **Bug found and fixed:** the sidebar's unread badge only refreshed on tab navigation, not when marking read from within the Messages tab itself — fixed with a `messages-updated` window event (`DashSidebar` and `DashMessages` are siblings, not parent/child). **Verified fully end-to-end**: real form submission through the actual dev-server UI (not just curl), real admin dashboard view (using a locally-minted JWT, same signing as `auth.controller.js`), live mark-read/delete tested both via UI and direct API calls, rate limiting confirmed (5/hour triggers 429), XSS/sanitization confirmed (tags stripped, text kept). All test data cleaned from the production DB afterward. |
| 6.4 Breadcrumbs ✅ **DONE** | `Home › Category › Post` `<nav aria-label="Breadcrumb">` on `PostPage.jsx`, category crumb skipped for `"uncategorized"` posts. Server-side `BreadcrumbList` JSON-LD counterpart lives in `injectMeta.js`, kept in sync with the same skip rule. |
| 6.5 Search visibility + pagination ✅ **DONE** | `NavLinkEx to="/search"` in `Header.jsx`. `Search.jsx`'s `handleShowMore` pages via `startIndex`, visible "Show More" button. |
| 6.6 Home page ordering ✅ **DONE** | `getposts` sorts by `createdAt` (`post.controller.js:79`, commented as the M8/6.6 fix), not `updatedAt`. |
| 6.7 Footer as a map ✅ **DONE** | `Footer.jsx`: Categories (fetched live), Contact link, About — the lost reader's fallback. |
| 6.8 Measure ⚠️ **PARTIAL** | CTA click-through instrumentation ✅ done — `cta_click` GA4 event fires from `CallToAction.jsx`, tagged with `cta_location` (the page path) so placement effectiveness is comparable. The actual 4-week pre/post comparison is inherently a wait-and-measure task, not something to "finish" in a coding session — revisit in GA4 once enough post-6.3 data has accumulated. |
| 6.9 Floating "pill" navbar (Upscayl-style, ref: upscayl.org/download) ✅ **DONE** | At the top of the page the header stays the normal full-width bar; after scrolling ~40px it morphs into a centered floating pill: translucent bg (`bg-white/70 dark:bg-gray-900/70`), `backdrop-blur-md`, border + shadow, `max-w-5xl` centered with side margins, `rounded-full` on `md:`+ but **`rounded-2xl` on mobile** — the expanded hamburger menu turns a `rounded-full` bar into an ugly oval. Implementation: `scrolled` boolean state in `Header.jsx` from a **passive** window scroll listener (call the handler once on mount so a mid-page reload starts in the right state); swap conditional classes on the Flowbite `<Navbar>` with `transition-all duration-300`. Colors come from the Phase 1 `theme.js` tokens, not hardcoded. ⚠️ **Two traps found in the current code:** (a) `HeaderLayout.jsx`'s fixed wrapper paints its own solid `bg-white dark:bg-gray-900` — it must become background-free or the pill floats on top of a solid bar and the translucency is invisible; (b) once that wrapper is transparent, it still spans the full viewport width and swallows clicks on content visible beside/behind the pill — fix with `pointer-events-none` on the wrapper and `pointer-events-auto` on the `<Navbar>` element itself (NOT on a full-width inner div, which would re-block the clicks). Leave `HeaderLayout`'s height-measuring spacer logic alone — it measures once at mount (unscrolled), which is exactly right so content doesn't jump when the bar shrinks. |
| **6.10 Image lightbox for post content (howtogeek-style: expand + prev/next)** ✅ **DONE** | **What:** clicking any image inside a post opens a full-screen viewer with zoom, plus left/right arrows that step through the *other* images in the same post without closing — critical for step-by-step tutorials where readers flip between "step 3" and "step 4" screenshots and need to read small cell references. **Hint — this is a RENDER-time feature, deliberately NOT an editor feature:** it operates on the sanitized HTML that `renderPostContent.js` (2.3) already produces, so it works identically for legacy `"html"` posts and new `"md"` posts, and the editor/Markdown round-trip never knows it exists. New component `client/src/components/PostImageLightbox.jsx` (one file, one job): `PostPage.jsx` renders post HTML into a ref'd container; a `useEffect` scans `container.querySelectorAll('img')`, builds a `slides` array (`{src, alt}`), attaches click handlers + a corner expand-icon affordance (wrapper `<span>` with an absolutely-positioned icon; `cursor: zoom-in`), and drives a controlled **`yet-another-react-lightbox`** (MIT, actively maintained — v3.21.x releases through 2025/26, built for React 18, works with Vite, core ≈11 kB min+gzip) with its bundled **Zoom** plugin (arrows, Esc, swipe, and keyboard nav come free). Skip images narrower than ~100px (badges/icons shouldn't enter the gallery). Re-run the scan when the post slug changes. ⚠️ Depends on 2.3's rendered container existing — but Phase 6 already follows Phase 2, so no reordering needed. |
| **6.11 "Floating" image treatment via design tokens** ✅ **DONE** | **What:** post-content images get an elevated look (rounded corners + drop shadow + subtle border) so screenshots read as objects above the page, not flush scans. **Hint:** add an **`elevation` scale to `theme.js`** (1.8's control sheet — e.g. `elevation.sm/md/lg`, each commented with *what it is, where it's used*), wired into `tailwind.config.js` `boxShadow` so classes like `shadow-elevation-md` are generated from tokens — never one-off inline CSS. ⚠️ Shadows are nearly invisible on dark backgrounds: pair each elevation token with a dark-mode companion (subtle `ring`/border token, e.g. `dark:ring-1 dark:ring-white/10`) and document that in the token comment. **Apply in ONE place:** a `.post-content img` rule in the post-content CSS layer (using `@apply` or Tailwind `theme()`), because Markdown-generated `<img>` tags can't carry classes. Keep styling here in CSS and behavior in 6.10's component — don't let the lightbox scanner become the styling point. |

**Done when:** a reader on any post can reach a category list, a related post, and your services page in one click each; GA4 events fire on CTA clicks; scrolling any page morphs the header into the translucent pill with no dead click-zones beside it and no content jump; on a multi-image post (legacy HTML *and* new Markdown), clicking any content image opens the viewer at that image, arrows/swipe step through the post's other images without closing, zoom makes small cell references legible, and Esc returns to the reading position; post images show the elevated treatment consistently in light and dark mode, and changing one `elevation` token in `theme.js` restyles every post image at once.

---

### Phase 6b — Post index redesign *(deliberate detour after Phase 6 closed; same Reader-UX theme)*
**Branch:** `phase-6b-post-index`

**Why this exists:** the post grid was still the card design from the source YouTube tutorial (image shrinks on hover, "Read Article" slides up from `bottom-[-200px]`). Beyond looking like a template, it is functionally broken on touch — no hover means the button stays clipped off-card forever, and the title is a `<p>`, not a link, so the cover image is the only reliable tap target on the whole card. Decided with svei: **two layouts, reader picks.** Default **row** (index-style list — his readers are accountants hunting a specific tutorial, and a row list scans faster and reads the same at 10 posts or 100); **grid** available as the alternative. Both drop card chrome entirely — no per-card border, no shadow, no rounded corners — and get their structure from hairline rules, like a worksheet. Hover tints the surface and adds an inset accent edge (the way a selected cell behaves in Excel) instead of resizing anything. Design rule that falls out and should hold going forward: **chrome stays flat, content floats** — 6.11's `shadow-elevation-md` stays scoped to post-content images.

| Task | Hint |
|------|------|
| 6b.1 API: derived card fields + conditional `content` projection | **Do this first — it's independently revertable and 6b.3 depends on it.** `getposts` currently returns full `content` on every post (real posts run 20–47 kB each), so Home downloads ~270 kB of HTML it never renders — a Phase 4 performance miss. Checked every call site: only `PostPage.jsx:28` (`?slug=`) and `UpdatePost.jsx:24` (`?postId=`) need `content`; Home, Search, related-posts, `DashPosts`, `DashboardComp` all discard it. So: **`excerpt` and `readingMinutes` are returned ALWAYS (both branches); only `content` is conditional** on `slug \|\| postId`. Returning the derived fields unconditionally is what lets `PostPage` consume `post.readingMinutes` and **delete its own inline `getReadingMinutes` (PostPage.jsx:124)** — otherwise the server and client compute reading time separately and will disagree. `excerpt`: reuse `getMetaDescription(post)` from `stripToPlainText.util.js` as-is (it already prefers an author-set `metaDescription` and falls back to stripped plain text, matching `injectMeta.js`). `readingMinutes`: `stripToPlainText()` → word count → ÷200 wpm → round, minimum 1. ⚠️ Mongoose `.select()` can't compute derived fields, so fetch with `content`, compute, then map to plain objects without it — the payload we're fixing is the network one. At 10 posts the extra DB read is irrelevant; if the post count ever gets large, revisit by precomputing both fields at write time (needs a backfill migration, not worth it now). |
| 6b.2 `reviewedAt` (honest freshness, not a published date) | **Decided with svei**, and it follows from his content philosophy: he writes for things that age slowly, so a *published* date measures exactly the thing he made irrelevant — and every post is currently from 2024, so showing `createdAt` would stamp "Nov 2024" across the whole index and read as abandoned. `updatedAt` can't carry it either: 6.6 already established that a typo fix bumps a 2024 post above everything newer. So add `reviewedAt: { type: Date, default: null }` to `post.model.js`, a date input in `PostForm.jsx`, and show it on cards **only when set — never fall back to `createdAt`**, so a card can't claim freshness it hasn't earned. Also fixes a real dishonesty in `injectMeta.js:77`, which currently emits `dateModified: post.updatedAt` (a typo fix tells Google the article was revised) → `reviewedAt \|\| createdAt`. ⚠️ **Add `reviewedAt` to `updatepost`'s `$set` whitelist (post.controller.js:134) in the SAME commit.** This is the FOURTH field added to that whitelist (contentFormat 2.6, metaDescription 5.3, imageAlt 5.6) and forgetting it is a documented recurring bug pattern in this project — see notes.md 27.4. |
| 6b.3 `PostCard` rewrite with a `variant` prop | **One component, two layout branches — NOT two files.** The semantics are identical in both variants (same `<article>`, same heading level, same single wrapping link, same alt handling, same category label), and duplicating them means every Phase 7 fix gets made twice and drifts within a month. `variant: "row" \| "grid"`, default `"row"`. Fixes three real bugs while in there: (a) `alt="Post Cover"` is hardcoded on every card and ignores the `imageAlt` field added in 5.6 — `PostPage` uses it, `PostCard` doesn't, so screen-reader users hear "Post Cover" N times → `alt={post.imageAlt \|\| post.title}` (this is Phase 7.4, satisfied early); (b) the card renders the raw slug (`contable`) while the hero chip directly above renders `categoryLabel()` (`Excel para Contadores`) — same page, two names → use `categoryLabel()`; (c) the whole card becomes ONE `<Link>` wrapping an `<article>`, killing both the mobile dead-zone and the two-tab-stops-per-card problem. Title becomes a real `<h3>` (Phase 7.2, also satisfied early). **No excerpt on the card** — decided with svei: his titles are already descriptive ("Actualizador Dinámico de Impuestos. Parte 2: Método Alternativo para Recargos en Excel"), so a two-line excerpt under a two-line title is redundancy, not information. Card shows: category (mono, uppercase), title, reading time, and `reviewedAt` when set. Drop the fixed `h-[400px]` (long ES titles were being truncated mid-word by `line-clamp-2`) and let height follow content. Hover = surface tint + inset accent edge; **never animate `height`** (forces reflow every frame — the current `h-[260px]`→`h-[200px]` transition is the worst offender). ⚠️ Keep the metaphor restrained: monospace category labels and hairline rules is as far as it goes. Column letters, an `fx` bar, or green tint everywhere is costume and ages badly. |
| 6b.4 View toggle + persisted preference ✅ **DONE** | `client/src/hooks/useViewPreference.js` (localStorage, read in the `useState` initializer — no flash — writes wrapped in try/catch) + `client/src/components/PostViewToggle.jsx` (real `<button>`s, `aria-pressed`, `aria-label`, `react-icons/hi` `HiOutlineViewList`/`HiOutlineViewGrid`). Wired into both `Home.jsx` (next to the "Recent Posts" heading) and `Search.jsx` (next to "Posts Results"); `PostCard`'s existing `variant` prop drives the render. |
| 6b.5 Grid container ✅ **DONE** | Home and Search's post list now branch on `view`: row keeps the `divide-y` hairline list, grid renders `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` with `divide-x divide-y` hairlines (no `flex flex-wrap justify-center`, so no ragged last row). Folded into the 6b.4 commit rather than a separate one — the toggle and the container it switches are one change. |

**Done when:** the post index renders in both variants in light and dark mode; row is the default and the choice survives a reload with no flash of the other layout; on a touch device the entire card is tappable and no CTA is hidden off-card; keyboard users get exactly one tab stop per card with a visible focus ring; `getposts` no longer ships `content` to Home/Search (verify the payload drop on the network tab, not just by reading the code) while `PostPage` still receives it; `PostPage` uses the server's `readingMinutes` and its local copy of that function is gone; a post with no `reviewedAt` shows no date at all, and one with it shows the reviewed date; category names on cards match the ones in the hero chips and footer.

---

### Phase 7 — Accessibility Basics *(cheap now, expensive later; overlaps SEO)*
**Branch:** `phase-7-a11y`

| Task | Hint |
|------|------|
| 7.1 Fix token contrast ⚠️ **CODE DONE, NOT BROWSER-VERIFIED** | No single hex clears 4.5:1 on both a white AND a near-black background (checked with the WCAG relative-luminance formula: `primary` #3182DF is 3.90:1 on white / 4.55:1 on dark; `secondary` #21B868 is 2.59:1 on white / 6.86:1 on dark — so the plan's original phrasing of one darkened value satisfying both was wrong). Added `primaryText` (`#1D6FD1`, 4.95:1 on white) and `secondaryText` (`#177D47`, 5.17:1 on white) to `theme.js`, documented with ratios in the token comments. `primary`/`secondary` are unchanged (kept for large text/buttons/backgrounds, and because they already pass AA on dark backgrounds). Applied as `text-{x}Text dark:text-{x}` across ~25 usages site-wide (Header, Footer, NavLinkEx, PostCard, Home, Search, PostPage breadcrumbs, About, CommentSection, Comment, SignIn/SignUp, `.post-content a`, and the Dash* admin pages). Icon-only glyphs (social icons, the view-toggle icon, admin edit/delete icons) were left on the vivid tokens — WCAG's 3:1 non-text threshold, not 4.5:1, applies there. **Not verified**: no Lighthouse/axe run this session (browser tooling was unavailable — see 7.5). `npm run build` and `npm run lint` both pass with the new code, but the actual on-screen contrast has not been visually checked. |
| 7.2 Semantic landmarks ⚠️ **PARTIAL** | `HeaderLayout.jsx`'s content wrapper is now a `<main id="main-content">` (one per page, matches the Route-rendered content). `Header.jsx`'s `<Navbar>` already renders a `<nav>`; `Footer.jsx` already renders Flowbite's `<Footer>` (a `<footer>` element). **Not done**: PostCard titles as real `<h3>` was already satisfied by 6b.3, so that half is fine — but no audit yet of every page for exactly-one-`<h1>`/heading-order beyond what 5.5 covers, and dropdown/landmark labeling wasn't re-checked beyond what already existed. |
| 7.3 Keyboard pass ⚠️ **PARTIAL** | Skip-link to `#main-content` added in `App.jsx` (`sr-only focus:not-sr-only`, first focusable element in the DOM, before the header). **Not done**: no actual Tab-through pass of header/comment form/editor page this session (needs a live browser, which was unavailable — see 7.5); focus-ring and dropdown-keyboard-operability behavior is UNVERIFIED, not fixed. |
| 7.4 Forms & alts | Not started this session. |
| 7.5 Audit tooling ✅ **DONE (2026-08-10) — audited, fixed, re-verified, including the post page** | No Lighthouse (no Chrome binary for headless launch in this environment), so verified with **axe-core 4.10.2 injected live** into the dev server (Home, Search, About, Contact, Sign In) via the Browser pane, plus manual keyboard/focus checks and hand-computed WCAG contrast on anything axe flagged `incomplete` (gradient backgrounds axe can't auto-resolve). Local dev's Mongo connection stayed down all session — root cause found: **Node's DNS resolver on this machine is pinned to `127.0.0.1`** (`dns.getServers()`), which refuses `SRV` queries needed for the `mongodb+srv://` connection string, while the OS's own resolver (the router) answers the same SRV query fine — some local DNS-redirecting service (VPN/ad-blocker/security software) is the suspect, not Mongo Atlas or the app. That's a machine-level fix for svei, not something to patch in code. **Worked around it by auditing the live production post page directly instead** (read-only GET requests, no writes) once a from a fixed prod deploy came back up. Production's CSP correctly blocked loading axe-core from a CDN (`script-src` doesn't allowlist cdnjs) — confirms the Phase 3 CSP hardening is working — so the post-page audit used the same manual DOM/computed-contrast technique already proven on the gradient buttons, not axe itself. |

**Bugs found and fixed this session (all hand-verified before AND after, not just axe's raw output):**
- **[Serious, sitewide, fixed]** `Header.jsx`'s nav `<ul>` had `<a>` children directly instead of wrapping each in `<li>` (axe `list` violation on every page). Wrapped `NavLinkEx`/the Categories `Dropdown` in `<li>`.
- **[Critical, fixed]** `Search.jsx`'s `searchTerm`/`sort`/`category` `<label>`s had no `htmlFor` — no accessible name (axe `select-name`, critical). Added `htmlFor` to all three, matching each field's `id`.
- **[Serious, fixed]** White text on `bg-gradient-to-r from-secondary to-primary` failed AA 4.5:1 across the **entire** gradient (hand-computed: 2.59:1–3.90:1) on every **solid** (non-`outline`) gradient button/element carrying white text — `Buttons.jsx`/`ButtonEx`, `PostForm.jsx`'s submit, `DahsProfile.jsx`'s "Create a Post" (its `outline` prop was commented out), `SignIn.jsx`/`SignUp.jsx`/`Contact.jsx` submit buttons, `Footer.jsx`'s credit link, `About.jsx`'s avatar circle. Fixed by swapping the gradient stops to `primaryText`/`secondaryText` (already-AA-safe tokens from 7.1) — hand-verified these clear 4.5:1 at both endpoints AND the gradient midpoint. Flowbite `outline` buttons (`OAuth.jsx`, `PostForm.jsx`'s upload button, `Header.jsx`'s Sign In, `DahsProfile.jsx`'s Update) were **not** touched — their gradient only renders as a thin border around a solid dark fill, so the text was never actually on the gradient. Documented the distinction and the reasoning in `theme.js`'s token comment.
- **[Serious, fixed]** `text-gray-500` (no `dark:` override) failed contrast outright in dark mode against the page's actual background (`ThemeProvider.jsx`'s `rgb(16,23,42)`, hand-computed at 3.69:1, not the 4.83:1 it gets on white) — `Search.jsx`'s "No posts found."/"Loading..." and `Contact.jsx`'s subtitle. Fixed by adding `dark:text-gray-400` (hand-verified ~7:1 against the dark page bg).
- **[Serious, fixed]** Dark-mode `dark:text-primary` and the (backwards) `text-gray-400 dark:text-gray-500` failed 4.5:1 on `About.jsx`'s profile card, which uses `dark:bg-gray-800` — a lighter surface than the page background 7.1 was verified against (hand-computed: `dark:text-primary` on `gray-800` = 3.77:1, not the 4.55:1 that holds on near-black). Fixed by changing the card to `dark:bg-gray-900` (matches 7.1's tested assumption, still visually distinct from the page's custom navy) and swapping the `(Svei)` span to the correct `text-gray-500 dark:text-gray-400` direction (was inverted — failed in *both* modes at 2.54:1/3.04:1).
- **[Fixed]** The 7.3 skip link scrolled but never moved keyboard focus — `<main id="main-content">` had no `tabIndex={-1}`, so `document.activeElement` fell back to `<body>` after activation and a keyboard user's next Tab restarted from the top of the document. Added `tabIndex={-1}` + `focus:outline-none` (the skip link itself is already the visible focus affordance) in `HeaderLayout.jsx`.

**Real Lighthouse run (2026-08-10, second half of session):** local dev's Mongo/DNS problem never cleared, but svei pointed out he has Brave installed — Brave is Chromium, so `CHROME_PATH` pointed `npx lighthouse` at `brave.exe` instead of downloading anything, run against the **live production site** (read-only). Lighthouse's own temp-dir cleanup throws a harmless Windows `EPERM` on exit (file lock, unrelated to the audit) — the JSON report is written successfully before that, so the score is real. Results:
- **Home: 100.** Zero failed accessibility audits.
- **Post page (`/post/xlookup-vs-indexmatch...`): 91**, short of the ≥95 target. Two failed audits, both already known: `image-alt` (the same 12-images-missing-`alt` gap below) and a **new, serious contrast bug** (see next).

**More bugs found on the live post page, two fixed, one flagged:**
- **[Serious, fixed]** `PostPage.jsx` wrapped its content in its own `<main>`, nested inside `HeaderLayout.jsx`'s `<main id="main-content">` — invalid HTML (two `<main>` landmarks on one page), confirmed live (`document.querySelectorAll('main').length === 2`). Only `PostPage.jsx` has this; every other page was already a single `<main>`. Fixed by changing it to a plain `<div>` — the landmark role is already provided by `HeaderLayout`.
- **[Serious, fixed — Lighthouse `color-contrast`, 16 instances]** Legacy Quill-editor content bakes literal `style="color: black"` into the stored post HTML. An inline style always beats the theme's `dark:text-gray-200` class, so in dark mode this rendered as **black text on the near-black page background (`#111827`) at a measured 1.18:1 contrast** — effectively invisible for any dark-mode reader. This is a rendering-pipeline bug, not a per-post content problem (every legacy HTML post likely has it), so fixed once at the source: `renderPostContent.js`'s DOMPurify `afterSanitizeAttributes` hook now strips `color`/`background-color`/`background` from every sanitized node's inline `style`, so post text color always comes from the theme, never from stored content. Verified for real — not just reasoned about — by dynamically importing the live module in the running dev server and confirming `style="color: black;"` sanitizes down to `style=""`.
- **[Flagged, not fixed — needs a decision, not just a patch]** 12 of 16 images on this post have **no `alt` attribute at all** (not even empty) — confirmed via `img.hasAttribute('alt')` on the live DOM and by Lighthouse's `image-alt` audit. This is a legacy-HTML-post content gap (predates the Phase 2 Markdown migration), not a code bug: the raw stored HTML never had alt text written for these images, so there's nothing in the render pipeline to fix the way the color bug was. Two real options, both requiring svei's call: (a) content fix — go back into these older posts and add real per-image alt text (best for screen readers and image SEO, but manual, and likely repeats across the other legacy-HTML posts, not just this one); (b) code fallback — have `renderPostContent.js` inject the post title as `alt` for any in-content `<img>` missing one (automatic, but every untitled image on a post gets the same generic label, so it's a floor, not a real fix). Not touched this session pending that decision. **This is now the only known blocker to the post page clearing Lighthouse's ≥95 accessibility bar** — the contrast bug above was the other failing audit and is fixed.

**Local dev nav `<li>` fix note:** the live production page's nav `<ul>` already had correct `<li>` children (not the bug), which looked contradictory at first — resolved by finding the commented-out `Navbar.Link`-based markup still sitting in `Header.jsx` (Flowbite's own `Navbar.Link` adds `<li>` automatically). Production is still running the pre-`NavLinkEx`-refactor build, which is why it doesn't show the bug; the bug is real in the current, undeployed source, and the 7.1-era switch to the custom `NavLinkEx` component (which does *not* add `<li>`) is what introduced it. Confirms the fix is still needed for whenever this deploys.

**Re-verified after fixes:** axe-core reports **zero violations** on Home, About, Contact, Sign In, and Search (loading state) — confirmed live in the Browser pane, not just read from source. The post page was checked manually (axe-core itself couldn't load there — blocked by production's own CSP, see below) and is down to the one flagged, undecided alt-text item. `npm run build` and `npm run lint` pass with no new errors introduced (checked file-by-file against pre-existing lint debt). Remaining axe `incomplete` (gradient/undetermined) items were hand-computed and confirmed passing.

**Verified working (no change needed):** Home's landmarks are clean (exactly one `<main>`/`<nav>`/`<footer>`, single `<h1>`, no skipped heading levels) — 7.2 holds there. Production's CSP (Phase 3) correctly blocks loading an external script like axe-core from a CDN — a good sign the security hardening is doing its job, not something to relax for testing convenience.

**Still open before Phase 7 can close:** the alt-text decision above — the only thing standing between the post page and a ≥95 Lighthouse score.

**Done when:** Lighthouse a11y ≥ 95 on Home and post page; zero serious axe violations; all text tokens documented ≥ 4.5:1. **Home: 100 (real Lighthouse score, verified 2026-08-10). Post page: 91, one fix away from passing** — everything but the alt-text decision is done.

---

### Phase 9 — Excel function glossary *(new content type; committed work, unlike Phase 8's idea list — numbered 9 only to avoid renumbering existing references)*
**Branch:** `phase-9-glossary`

**What svei asked for:** a function reference like `exceljet.net/functions` (431 functions, 13 categories, each showing name / Excel version introduced / a short purpose line / argument names), where **tagging a post with a function automatically updates the glossary** — the function's page starts listing that post and the counts go up, with no manual step and no hardcoded "431".

⚠️ **Do NOT scrape or paraphrase Exceljet.** Function names and Microsoft's syntax signatures are facts and are fine to use; Exceljet's purpose statements and examples are their own writing. Source the list from Microsoft's official Excel functions documentation and write original one-liners. This is also the SEO-correct path — 431 pages of reworded third-party text is exactly what Google classifies as thin duplicate content, and it would be spent against the domain authority built in Phase 5.

**The differentiator, and the reason this is worth building at all: Spanish function names.** Excel localizes them (XLOOKUP→BUSCARX, VLOOKUP→BUSCARV, SUMIF→SUMAR.SI). Mexican accountants running Spanish Excel hit this constantly, Exceljet does not cover it, and it ties directly into the existing CFDI/SAT content. A bilingual EN↔ES function reference is a thing that does not currently exist; a monolingual one is a worse copy of a site that already ranks. Treat the ES mapping as the spine of the feature, not a later enhancement.

| Task | Hint |
|------|------|
| 9.1 Catalog data + read API | `api/data/excelFunctions.json`, **server-owned, exactly one copy.** The `api/config/site.js` ↔ `client/src/config/site.js` duplication precedent (notes.md 27.1) applies to *two constants*, not 431 records — the server needs this data anyway for the sitemap and meta injection in 9.5, so the server owns it and the client fetches it. Per entry: `name`, `category` (Microsoft's own 13), `syntax`, `args[]`, `summary` (**original, one line**), `since` (Excel version — Exceljet shows this and it matters more for svei's audience than theirs, since accountants on 2016/2019 need to know a function exists for them *before* reading a tutorial about it), and `es` (Spanish name). Endpoints: `GET /api/function` (list, optional `?category=` / `?search=`, returns `totalFunctions` derived from the array length) and `GET /api/function/:name`. **The count is never stored or hardcoded — it is `length`.** That is the "auto conti": add an entry to the JSON, every count on the site is already correct. Seed incrementally — a correct 60-function catalog beats a padded 431 with empty summaries, and 9.4's guard means unfinished entries simply don't get pages yet. |
| 9.2 Post ↔ function tagging | `functions: [String]` on `post.model.js` (canonical uppercase names). `PostForm.jsx` gets a tag input **validated against the catalog** — free-text tags create orphans that silently never appear in the glossary, which is the failure mode that makes features like this rot. Add `?function=NAME` filtering to `getposts` (same `...(req.query.x && {...})` pattern already used for `category`/`userId`/`slug`). ⚠️ **Add `functions` to `updatepost`'s `$set` whitelist (post.controller.js:134) in the same commit** — this is now the FIFTH field to need it (contentFormat 2.6, metaDescription 5.3, imageAlt 5.6, reviewedAt 6b.2) and forgetting it is this project's most-repeated bug (notes.md 27.4). |
| 9.3 `/functions` index page | Grouped by the 13 categories with jump links, plus client-side search. **EN/ES toggle is the headline feature** — searching "BUSCARX" must find XLOOKUP and vice versa. Show per-function: name, `since` badge, one-line summary, and a count of svei's posts covering it. Counts come from a single aggregate (`$unwind` + `$sortByCount` on `functions`) fetched once for the whole page — **not one request per function.** Reuse 6b.3's `PostCard`/hairline visual language rather than inventing a third card style. |
| 9.4 `/functions/:name` detail page | Function metadata + its Spanish name + the list of svei's posts tagged with it (reusing `PostCard` in row variant). ⚠️ **Thin-content guard, non-negotiable:** only functions that have *either* an original summary *or* at least one tagged post get a crawlable page; everything else appears in the 9.3 index only, with no detail URL and no sitemap entry. Without this, launch day ships ~400 near-empty pages and Google reads the whole section as doorway content. Recommended: `noindex` for any page that slips through the guard. |
| 9.5 SEO + nginx wiring | Add qualifying function pages to `sitemap.controller.js` (5.2). Extend `injectMeta.js` (5.1) to handle `/functions/:name` — it currently only knows `/post/:slug`, and these pages are crawler-facing, so they need the same server-rendered title/description/canonical treatment or they are invisible to Google in a client-rendered SPA. New nginx `location /functions/` block mirroring the existing `/api/` and `/post/` proxy blocks. ⚠️ **DEPLOY ORDER TRAP, already learned the hard way in notes.md 27.1:** the Express routes must be deployed and *confirmed live via direct curl* BEFORE reloading nginx with the new proxy rule. Reloading nginx first sends every `/functions/*` URL to a route the running process does not have yet → instant 502s across the whole new section. |

**Done when:** `/functions` lists the catalog grouped by category with working EN↔ES search; a function's page shows its Spanish name, its `since` version, and every post tagged with it; tagging a post with `XLOOKUP` in the editor makes it appear on that function's page and increments its count with no other action; every count on the site derives from data (adding a catalog entry or tagging a post updates them by itself); functions with neither a summary nor a tagged post have no crawlable URL; `curl`ing a function URL directly returns server-injected meta tags, not the bare SPA shell.

---

### Phase 10 — Video library *(new content type; pairs with Phase 9 — build after it, shares the tag vocabulary)*
**Branch:** `phase-10-videos`

**What svei asked for:** a video section like `exceljet.net/videos`, fed from his social channels. Confirmed from `Footer.jsx`: YouTube (`youtube.com/svei00`), TikTok (`@excel.solutionsv`), Instagram (`@excelsolutionsv`), Facebook, X.

⚠️ **Only YouTube can realistically be automated.** YouTube publishes a public per-channel RSS feed needing no key, no quota and no OAuth. TikTok and Instagram require business accounts, app review, and tokens that expire on a schedule — building auto-sync against them is a maintenance liability that breaks silently and is not worth it at this scale. **Plan: YouTube syncs automatically; every other platform is a manual add via pasted URL.** Do not promise auto-sync for platforms whose APIs will fight back.

**The real payoff is not a video page — it's the cross-link.** Videos share the `functions[]` tag vocabulary introduced in 9.2, so a function page can list posts *and* videos, a post can surface its companion video, and one tagging action feeds all three surfaces. That is why this comes after Phase 9 rather than standing alone; built in isolation it is just another silo to maintain.

| Task | Hint |
|------|------|
| 10.1 `Video` model + admin CRUD | Mongo collection, not live API calls at request time — the site must not depend on YouTube being reachable to render a page, the SEO work in 10.5 needs the data server-side, and svei needs enrichment fields YouTube does not have. Fields: `platform` (`youtube`/`tiktok`/`instagram`/`facebook`/`x`), `externalId`, `url`, `title`, `thumbnail`, `publishedAt`, `durationSeconds`, `slug` — plus locally-owned `functions[]`, `category`, `description`, `relatedPostId`, `featured`. Dashboard tab mirroring `DashPosts.jsx`. Manual add works for every platform including YouTube, so the section is usable before 10.2 exists. |
| 10.2 YouTube sync | Source: `https://www.youtube.com/feeds/videos.xml?channel_id=UC...` — free, no API key, no quota, gives title/link/thumbnail/publishedAt. ⚠️ Returns only the **most recent 15** videos, which is fine for "new uploads appear by themselves" but cannot backfill an old catalogue; if the full back catalogue is needed, that specific job wants YouTube Data API v3 (`playlistItems.list`, 1 quota unit against a 10,000/day free allowance) with a key in `.env` — do not reach for the API just to get the recent-uploads behaviour the free feed already provides. ⚠️ `youtube.com/svei00` is a handle, **not** a channel ID; the `UC...` ID has to be resolved once and stored in `.env`. ⚠️ **THE bug to avoid: re-sync must upsert only YouTube-owned fields** (`title`, `thumbnail`, `publishedAt`, `durationSeconds`) and never overwrite `functions[]`, `category`, `description`, `relatedPostId` or `featured` — otherwise every sync silently wipes the manual tagging that gives this feature its value. Trigger: a dashboard "Sync now" button first (zero infra, zero risk, proves the upsert logic); only add a schedule once that is proven correct. |
| 10.3 `/videos` index | ⚠️ **Never render N YouTube iframes on one page** — each embed pulls well over a megabyte of player JS, so a 20-video index would be several times heavier than the entire rest of the site. Use a facade: static thumbnail plus a play affordance, swapping in the real iframe only on click. Embed via `youtube-nocookie.com`. Filterable by platform, category, and function tag. Reuse 6b.3's `PostCard` visual language and row/grid variants rather than inventing a third card style — a video card is a post card with a duration badge and a play affordance. |
| 10.4 Cross-linking | Function pages (9.4) gain a videos section alongside posts, driven by the same `functions[]` tags. `PostPage` surfaces `relatedPostId`'s companion video when one exists. Extend the 9.3 aggregate rather than adding a second one — one query should return post *and* video counts per function. |
| 10.5 SEO + CSP + nginx | `VideoObject` JSON-LD through `injectMeta.js` (5.1) on `/videos/:slug` — video rich results are one of the few remaining SERP features that are cheap to earn. Add qualifying videos to `sitemap.controller.js`. New nginx `location /videos/` block. ⚠️ Embeds interact with the Phase 3.6 CSP work: `frame-src` must allow `www.youtube-nocookie.com` and `img-src` must allow `i.ytimg.com`, so land this while CSP is still in report-only mode rather than after enforcement. ⚠️ **Same deploy-order trap as 9.5 and notes.md 27.1:** Express routes deployed and curl-confirmed live BEFORE the nginx reload, or every `/videos/*` URL 502s at once. |

**Done when:** `/videos` lists videos from every platform with no more than one player iframe loaded at a time; publishing a new YouTube video makes it appear without anyone editing the site; re-running the sync never erases manual tags or descriptions (verify by tagging a video, syncing, and confirming the tag survived); a function page shows both posts and videos for that function; `curl`ing a video URL returns server-injected `VideoObject` markup rather than the bare SPA shell.

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
    PostImageLightbox.jsx ← scans rendered post HTML for imgs, drives the lightbox; behavior only, styling lives in CSS/tokens (Phase 6)
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
| turndown | MIT | Phase 2 |
| DOMPurify / isomorphic-dompurify | Apache-2.0 OR MPL-2.0 | Phases 2–3 |
| helmet, express-rate-limit, zod, slugify | MIT | Phases 3, 5 |
| browser-image-compression, rollup-plugin-visualizer | MIT | Phase 4 |
| yet-another-react-lightbox (+ bundled Zoom plugin) | MIT | Phase 6 |
| GA4 / Search Console / Dependabot | Free (hosted) | Phases 1, 3, 5 |
| Listmonk (AGPL-3.0), Umami (MIT), Uptime Kuma (MIT) | as noted | Phase 8 |
