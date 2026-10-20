# Repository architecture

This document describes the result of the `refactor/portfolio-architecture`
branch: a pure structural reorganization of a static, no-build HTML/CSS/JS
site. **No visual design, typography, spacing, colors, or page behavior was
changed.** Every change here is either a file move, a duplicate-code
extraction, or a path update made necessary by a move.

## Why this shape

- The site is hosted on GitHub Pages directly from `main`, root path (`"source":
  {"branch":"main","path":"/"}`, `build_type: legacy`). There is no build
  step and no routing layer — whatever is committed is served byte-for-byte.
  That means `index.html` **must** stay at the repo root, and every other
  path just needs its relative links to resolve correctly on disk.
- The repo has no templating system (plain HTML, no React/Next.js, no
  include mechanism), so "shared" only ever means "the same bytes copied
  into multiple files." The refactor's job was to find genuinely duplicated
  bytes and give them one home, and to leave genuinely page-specific
  content where it was.

## Final structure

```
/
├── index.html                  (stays at root — GitHub Pages entry point)
├── README.md
├── assets/                     (unchanged — images, svgs, tools/, cv/)
├── pages/
│   ├── cv.html
│   ├── experience.html
│   └── projects.html
├── case-studies/
│   ├── farmart-os.html
│   ├── farmart-pro.html
│   └── farmart-app.html
├── css/
│   ├── home.css                 (index.html's own system — not shared)
│   ├── cv.css                   (cv.html's own system — not shared)
│   ├── base.css                 (shared base system, see below)
│   ├── mockups.css               (shared diagram/mockup components)
│   ├── hero-mockup.css           (shared hero mockup-stage components)
│   ├── artwork-placeholders.css  (shared, used by the 3 FarMart case studies)
│   ├── platform-wireframes.css   (shared, used by the 3 FarMart case studies)
│   └── responsive-fixes.css      (shared late-audit responsive patch)
├── js/
│   ├── home.js            (index.html's nav scroll-spy + reveal/count-up)
│   ├── cv-download.js     (shared CV-download logic — index.html + pages/experience.html)
│   ├── cv-page.js         (cv.html's own bespoke download script)
│   └── projects-filter.js (pages/projects.html's filter buttons)
└── docs/
    ├── architecture.md    (this file)
    └── design-system.md
```

No `/components` directory was created. See "Deliberately not done" below.

## Files moved (`git mv`, history preserved)

| From | To |
|---|---|
| `cv.html` | `pages/cv.html` |
| `experience.html` | `pages/experience.html` |
| `projects.html` | `pages/projects.html` |
| `farmart-os.html` | `case-studies/farmart-os.html` |
| `farmart-pro.html` | `case-studies/farmart-pro.html` |
| `farmart-app.html` | `case-studies/farmart-app.html` |

`index.html` and `assets/` did not move.

## CSS extraction — what was verified identical before touching it

Before extracting anything, every candidate block was diffed byte-for-byte
across the files that appeared to share it. Only confirmed-identical blocks
were pulled into `/css`:

| Shared file | Lines | Used by |
|---|---|---|
| `base.css` | 400 | experience, projects, farmart-os, farmart-pro, farmart-app |
| `mockups.css` | 96 | same 5 pages |
| `hero-mockup.css` | 54 | same 5 pages (see override note below) |
| `artwork-placeholders.css` | 6 | farmart-os, farmart-pro, farmart-app |
| `platform-wireframes.css` | 89 | farmart-os, farmart-pro, farmart-app |
| `responsive-fixes.css` | 9 | farmart-app, farmart-os, farmart-pro (core); experience and projects link the same file and keep 2 extra `.xs-grid` lines inline, exactly where they were |

That is roughly **654 lines**, previously duplicated 3–5× each (over 2,800
duplicated lines total), now living in one place per block.

**One real per-page override was found and preserved**, not erased:
`farmart-os.html`'s hero-mockup block sized its own phone mockup slightly
differently (`.hs-os .ph { width: 17% → 16%; right: 4% → 2%; bottom: -14% →
-20% }`). The shared file keeps the common value; `farmart-os.html` links it
and then has a 3-line inline `<style>` immediately after that re-declares
just that one selector. Cascade order guarantees this renders identically
to the original.

**Everything else was left inline, deliberately.** Each page still carries
its own genuinely unique `<style>` blocks (e.g. the FarMartOS lifecycle
diagram styles, the Experience-page timeline, the Projects-page filter
grid) in exactly their original document position. This was a conscious
choice: moving unique, single-use CSS into its own file doesn't reduce any
duplication, and every extra file is one more place a cascade-order mistake
could change the rendered page. The payoff of full extraction wasn't worth
that risk for a "look exactly the same" project.

### `index.html` and `pages/cv.html`

These two were never duplicated anywhere else (confirmed — their `:root`
variable names don't even overlap with the shared system: `--white` /
`--hero-1` / `--ghost` vs. `--bg` / `--paper` / `--band`). Their CSS was
still externalized, to `css/home.css` and `css/cv.css` respectively, purely
for consistency with the rest of the site — every page now loads its styles
via `<link>` instead of mixing inline and external.

## JavaScript extraction

- `index.html` and `pages/experience.html` shared a byte-identical
  CV-download script. It's now `js/cv-download.js`. Because the two pages
  live at different depths (root vs. one level down), a shared script can't
  hardcode the PDF's relative path — and GitHub Pages serves this repo from
  a sub-path (`/JS-Portfolio/`), so an absolute `/assets/...` path would
  silently break in production while still working in local testing. Each
  page instead sets `window.CV_PDF_PATH` to its own correct relative path
  in one inline line, immediately before loading the shared script:
  ```html
  <script>window.CV_PDF_PATH = 'assets/cv/Jai_Singh_CV.pdf';</script>   <!-- index.html -->
  <script>window.CV_PDF_PATH = '../assets/cv/Jai_Singh_CV.pdf';</script> <!-- pages/experience.html -->
  <script src="../js/cv-download.js"></script>
  ```
- `pages/cv.html` has its own bespoke, single-button download script
  (different element IDs, not byte-identical to the shared one). It was
  moved as-is to `js/cv-page.js`, with only its one hardcoded PDF path
  corrected for its new depth. It was **not** merged into the shared
  script — see "Deliberately not done."
- `index.html`'s nav scroll-spy + scroll-reveal/count-up code (unique,
  never duplicated) moved to `js/home.js`.
- `pages/projects.html`'s filter-button code (unique) moved to
  `js/projects-filter.js`.

All script tags stay in their original document position (end of `<body>`),
so execution order is unchanged.

## Link and asset path updates

Every `href`/`src` referencing another page or an asset was updated for the
file's new depth. The full link graph was mapped before any edits were
made (no case-study page ever links to `experience.html`, `cv.html`, or
`projects.html` directly, which simplified this). After the moves:

- `index.html` (root): asset paths unchanged; links to moved pages gained
  `pages/` or `case-studies/` prefixes.
- `pages/*.html` and `case-studies/*.html` (one level deep): asset paths
  gained a `../` prefix; links to pages in the *other* new folder gained
  `../case-studies/` or `../pages/`; links to pages in the *same* folder
  are unchanged (still bare filenames); links to `index.html` gained `../`.

## Deliberately not done

- **No `/components` folder.** The brief asked for one, but this is a
  plain static site with no build step and no include/templating mechanism
  — there's nowhere to put a "component" that wouldn't just be documentation
  with no enforcement. Creating an empty folder would have violated the
  brief's own "no unnecessary folders" rule. The repeated HTML *patterns*
  (topbar markup, footer markup, card markup) are documented in
  `design-system.md` instead, as a reference for hand-copying consistently,
  with a note that a real component system would need a build step
  (outside this project's stated constraints).
- **`pages/cv.html`'s download script was not unified** with the shared
  `cv-download.js`, even though the two are behaviorally equivalent. Doing
  so would require changing `cv.html`'s button markup (from `id="dl-btn"`
  to the shared `data-cv-download` attribute contract) — a safe change in
  principle, but one more moving part than this zero-visual-change pass
  needed to touch. Flagged as a future, low-risk, opt-in cleanup.
- **Dead CSS was relocated, not deleted.** `pages/projects.html` carries
  roughly 190 lines of leftover "Experience page" / "Experience page v2"
  CSS (timeline, roles, stats-band styles) with zero matching markup on
  that page — confirmed by block-boundary inspection, not just suspicion.
  It was moved verbatim along with the rest of that page's unique styles.
  Removing unused CSS wasn't in scope for a reorganization that promises
  not to change rendered output, and verifying "truly 100% unused" with
  full confidence is its own separate task. Flagged here for whoever wants
  to do that cleanup next.
- **No merge of `home.css` and `base.css`.** index.html's design system and
  the case-study system are genuinely different designs (different color
  tokens, different component names under the same selectors in some
  cases, e.g. `.card`). Merging them would require renaming classes on one
  side or the other to avoid collisions — a real risk to "don't change the
  design," so it wasn't attempted.

## Validation performed

This environment has no browser or visual-regression tooling available, so
"compare screenshots before and after" (as literally requested) could not
be done. In its place:

1. **Tag-balance check** on every refactored file (open/close counts for
   `html`, `head`, `body`, `style`, `script`, and every structural tag used)
   — all balanced.
2. **Full link-graph audit**: every `href`/`src` in every one of the 7 pages
   was dumped and manually cross-checked against the new file locations.
3. **Automated HTTP resolution check**: a local server was started at the
   repo root and all 139 unique local `href`/`src` references across all 7
   pages were resolved per-page and requested — all returned HTTP 200.
4. **Line-by-line diff against pre-refactor backups** for the most heavily
   edited files, filtered to just the `href=`/`src=` lines, to confirm every
   changed line was an intended path update and nothing else was touched.

What this does **not** catch: actual visual rendering, cascade-order bugs
that don't show up as a broken link (none were found in this analysis, but
a human/browser check is still the real confirmation), JS runtime behavior
beyond "the file loads." **Please open the local preview
(`python3 -m http.server 8000`) and click through all 7 pages, the CV
download button on 3 pages, and the projects-page filters, before merging.**

## Remaining issues / open items

- ~190 lines of dead CSS in `pages/projects.html` (see above) — candidate
  for a future, separate cleanup PR.
- `pages/cv.html`'s download script could be unified with the shared one
  (see above) — future, separate, low-risk change.
- `/components` was intentionally skipped — see above for the reasoning and
  the documented alternative.
- No visual/screenshot regression test was possible in this environment —
  a human pass over the local preview is the recommended final check before
  merging.

## Git

- Branch: `refactor/portfolio-architecture`
- `main` was not touched, no force-push was used, and nothing was pushed or
  deployed as part of this work — per the brief's rules 9 and 10.
