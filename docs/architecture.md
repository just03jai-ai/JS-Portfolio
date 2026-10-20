# Repository architecture

This document describes the structural reorganization of a static, no-build
HTML/CSS/JS site and its targeted QA remediation. The structural work aims to
preserve the existing design; the branch as a whole is **not behavior-identical
to `main`**. Commit `51cff66` changes the homepage Work destination and removes
the Visual Design galleries. The user explicitly approved retaining those changes;
see [content-changes-pending-confirmation.md](content-changes-pending-confirmation.md).

The first QA review found omitted hero rules, missing legacy URL entrypoints,
and a responsive cascade discrepancy. The remediation restores the original
hero declarations, adds small redirect documents, and preserves the original
FarMartOS breakpoint behavior. Validation evidence and limitations are recorded
in [qa-remediation.md](qa-remediation.md); source extraction alone is not proof
of visual equivalence.

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
├── .gitignore                  (ignores .DS_Store; existing files are preserved)
├── cv.html, experience.html, projects.html       (legacy redirect documents)
├── farmart-os.html, farmart-pro.html, farmart-app.html (legacy redirect documents)
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
│   ├── projects-filter.js (pages/projects.html's filter buttons)
│   └── legacy-redirect.js (query/fragment-preserving legacy entrypoints)
└── docs/
    ├── architecture.md    (this file)
    ├── design-system.md
    ├── content-changes-pending-confirmation.md
    └── qa-remediation.md
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

## CSS extraction and remediation

The extraction commit records duplicate-block checks for the following files.
The later QA review nevertheless found missing rules and a cascade discrepancy;
the original extraction checks did not establish rendered equivalence:

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

**FarMartOS has a page-specific override.** Its original desktop values are
`.hs-os .ph { position: absolute; width: 16%; right: 2%; bottom: -20%; }`,
with `width: 24%` at `max-width: 860px`. The page-level override loads after
`hero-mockup.css`, so it repeats that original responsive width after its desktop
rule to preserve the cascade. The selector currently has no matching markup;
this repairs latent behavior rather than a visible phone component.

**Hero artwork remains page-local.** All three case studies restore the exact
`.hero-art` and `.hero-art img` declarations from `main` before loading
`hero-mockup.css`. These two rules were accidentally omitted during extraction.
They preserve the original radius, aspect ratio, maximum width, overflow clipping,
image dimensions, and `object-fit: cover`. No new visual treatment was added.

**Page-specific styles remain inline.** Each page still carries
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
for consistency with the rest of the site — every full portfolio page now loads
its main styles via `<link>`, while page-specific rules and the original small HTML wrapper
styles can remain inline.

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

## Legacy URL compatibility

The six original root-level filenames are small redirect documents, not copies
of the page implementations. Each declares a relative `rel="canonical"` pointing
to its corresponding new page, a visible fallback link, and a deferred shared
`js/legacy-redirect.js` script. Relative targets resolve to the correct canonical
page under either root hosting or a project prefix; they do not assume a domain.

The script resolves the destination against the legacy document URL, preserves
`location.search` and `location.hash`, and uses `location.replace` so Back does
not return to a redirect entrypoint. Destinations are full pages and never redirect
back. With JavaScript disabled, the visible link still reaches the full page;
query/fragment preservation is provided by JavaScript and is not claimed for the
no-JavaScript fallback. Static hosting serves these documents as HTTP 200, not
server-side 301 redirects. No duplicate full-page implementations were introduced.

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

The initial extraction relied on static inspection and local HTTP checks. Its
claim that browser tooling was unavailable is superseded by the completed QA
review and remediation validation using installed headless Chrome through Python
Playwright. Tests use original `main`, the pre-remediation branch HEAD, and the
remediated working tree. They cover all seven full pages at widths 1440, 768,
and 390px, plus legacy redirects and functional interactions.

The current results, browser settings, meaningful differences, and untested
surfaces are recorded in [qa-remediation.md](qa-remediation.md). Do not infer
visual equivalence from valid resource paths or balanced HTML tags.

## Remaining issues / open items

- ~190 lines of dead CSS in `pages/projects.html` (see above) — candidate
  for a future, separate cleanup PR.
- `pages/cv.html`'s download script could be unified with the shared one
  (see above) — future, separate, low-risk change.
- `/components` was intentionally skipped — see above for the reasoning and
  the documented alternative.
- The content/navigation changes in `51cff66` are approved intentional differences
  from main; see the separate approval record.
- Cross-browser, physical-device, and viewer-specific save-to-disk checks are
  outside the recorded Chromium validation; see the QA report for limitations.

## Git

- Branch: `refactor/portfolio-architecture`
- `main` was not touched, no force-push was used, and nothing was pushed or
  deployed as part of this work — per the brief's rules 9 and 10.
