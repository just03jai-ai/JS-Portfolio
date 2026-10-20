# Design system reference

This documents what already exists in the CSS — it does not introduce new
tokens or change any values. It's a map for anyone editing the site, and a
record of what the architecture refactor found and chose not to touch.

The site is really **three separate, hand-authored design systems** that
share a visual identity (same clay accent color, same font family choices)
but use different variable names and, in places, the same class name for
different things. They were kept separate during the refactor rather than
merged, specifically to avoid any risk of visual change — see
`architecture.md`.

## Shared visual identity (true across all three systems)

- **Accent color**: `#d49269` (a warm clay/terracotta), used as the
  decorative accent in both `home.css` and `base.css`. `cv.css` uses the
  darker, text-safe variant of the same hue, `#9a5a33`, as its primary
  accent (since the CV is a text-heavy, print-friendly page and the bright
  accent doesn't meet contrast requirements for body text).
- **Ink**: all three systems use `#111218` or very close to it
  (`cv.css` uses `#16171c`) as the primary near-black text/background color.
- **Type**: **Outfit** (UI text) + **Sora** (display/headings) are used
  across `home.css` and `base.css`. `base.css` additionally uses
  **Geist Mono** for labels and metadata. `cv.css` is deliberately
  different — it uses **Carlito/Calibri** (an ATS-resume-safe system font
  stack), since it's designed to also work as a printed/exported PDF.

## System 1 — `css/base.css` (the "case study" system)

Used by `pages/experience.html`, `pages/projects.html`,
`case-studies/farmart-os.html`, `case-studies/farmart-pro.html`,
`case-studies/farmart-app.html`.

### Tokens (from `:root`)

| Token | Value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--paper` | `#f7f5f3` | Warm neutral panel background |
| `--ink` | `#111218` | Primary text / headings |
| `--text` | `#4b4b55` | Body text |
| `--muted` | `#74747e` | Secondary/meta text |
| `--line` | `#e6e3e0` | Borders, rules |
| `--accent` | `#d49269` | Decorative clay accent |
| `--accent-ink` | `#9a5a33` | Text-safe accent (labels, links) |
| `--accent-tint` | `#fff6ef` | Accent-tinted background |
| `--ok` / `--ok-tint` | `#1f7a5c` / `#e7f4ee` | Success/positive state |
| `--warn` / `--warn-tint` | `#a15c12` / `#fdf1e2` | Warning state |
| `--bad` / `--bad-tint` | `#b3261e` / `#fbeaea` | Error/negative state |
| `--band` / `--band-text` / `--band-line` | `#111218` / `#c9cbd2` / `#2a2b31` | Dark "impact band" sections |
| `--f-ui` | Outfit | Body/UI font |
| `--f-display` | Sora | Headings |
| `--f-mono` | Geist Mono | Labels, metadata, code-like text |
| `--frame` | `1240px` | Max page width |
| `--measure` | `680px` | Reading-width column |

### Key reusable classes

- `.wrap` — centered max-width container (`--frame`)
- `.topbar` / `.back` / `.toc` / `.connect` — sticky header, back link, page nav, CTA pill
- `.hero`, `.facts`, `.hero-shot`, `.caption` — case-study hero pattern
- `.label` — uppercase mono eyebrow text
- `.sec-top`, `.body`, `.indent` — two-column section heading + content layout
- `.card`-style patterns are implemented per-section rather than one shared
  `.card` class here (e.g. `.eco article`, `.pgrid .pcard`, `.decisions li`)
  — these are page-specific component blocks layered on the shared tokens,
  not literally shared markup.
- `.band` — full-bleed dark section
- Status pill patterns: `.pl.g` / `.pl.w` / `.pl.r` / `.pl.a` (good/warn/bad/accent)

### Shared sub-systems (in `/css`, loaded by some or all of the 5 pages)

- `mockups.css` — the illustrative UI-mockup component kit (`.ui-desk`,
  `.ui-phone`, `.ui-card`, etc.) used to build generic "mock screen"
  illustrations without showing real product screens.
- `hero-mockup.css` — the hero "mockup stage" treatment (`.hs`, `.hs-os`,
  `.hs-pro`, `.hs-app`, `.anat`, `.snip`) for each case study's top banner.
- `artwork-placeholders.css` + `platform-wireframes.css` — used only by the
  three FarMart case studies, for the "screens coming soon" placeholder
  grids and the low-fi wireframe diagrams.
- `responsive-fixes.css` — a later audit pass's breakpoint patches, kept as
  its own file because it was added as a dated patch, not part of the
  original design.

## System 2 — `css/home.css` (the homepage)

Used only by `index.html`.

### Tokens (from `:root`)

| Token | Value | Use |
|---|---|---|
| `--white` | `#ffffff` | Page / card background |
| `--ink` | `#111218` | Primary text |
| `--ink-2` | `#111112` | Slightly different near-black (headings) |
| `--accent` | `#d49269` | Decorative clay accent (same hue as System 1) |
| `--accent-tint` / `--accent-line` | `#fff8f2` / `rgba(212,146,105,.11)` | Soft accent backgrounds |
| `--hero-1` / `--hero-2` | `#5a5a5a` / `#3e3e3e` | Hero gradient |
| `--hero-dim` / `--hero-sub` | `#333333` / `#d1d5db` | Hero text colors |
| `--ghost` / `--ghost-dark` | `#f5f5f5` / `#272829` | Section-heading "ghost word" + dark-band variant |
| `--text` / `--muted` / `--label` | `#52525b` / `#71717a` / `rgba(60,60,67,.6)` | Body text shades |
| `--line` | `#e4e4e7` | Borders |
| `--pill` | `#f4f4f5` | Tag/chip background |
| `--photo-bg` | `#f2ede9` | About-photo frame background |
| `--step-body` | `#606569` | "How I work" step body text |
| `--footer-bg` | `#f5f3f1` | Footer background |
| `--f-ui` / `--f-sora` / `--f-inst` / `--f-mono` | Outfit / Sora / Instrument Sans / Geist Mono | |
| `--content` | `1240px` | Max page width (same number as `--frame` in System 1, different name) |
| `--gap-section` | `120px` | Vertical rhythm between major sections |

### Key reusable classes

- `.wrap`, `.page`, `.stack-80` — layout primitives
- `.hero`, `.hero-bg`, `.hero-text`, `.ticker` — homepage hero + marquee
- `.sec-head` (`.ghost` + `.rule` + `.sub`) — the "ghost word" section heading
- `.card`, `.featured`, `.grid3` — project card grid **(note: `.card` here
  is a different component from anything in System 1 — same class name,
  different system, never loaded on the same page)**
- `.btn-soft` / `.btn-dark` — the two button styles (System 1 uses `.btn`
  with `.soft`/`.dark` modifiers and a separate `.connect` pill instead —
  same visual idea, different class names)
- `.quote`, `.about-card`, `.steps`/`.step`, `.tools`, `.footer`/`.cta` —
  one-off section components

## System 3 — `css/cv.css` (the CV / resume page)

Used only by `pages/cv.html`. Deliberately minimal and print-friendly
(`@page` and `@media print` rules included) — not meant to share anything
with the other two systems, since a resume has different constraints (ATS
parsing, printability) than the rest of the marketing site.

## Repeated HTML patterns (why there's no `/components` folder)

The brief asked for a `/components` directory. This site has no build
step and no include/templating mechanism (plain static HTML, intentionally
— no React/Next.js per the brief's own rules), so there is nowhere to put a
"component" that would actually be reused by reference rather than by
copy-paste. Creating an empty folder for this would have been a folder with
no function, which the brief's own Phase 2 instructions say not to do.

If a build step is ever introduced (even something lightweight like a
static-include preprocessor, not necessarily a JS framework), these are the
patterns worth turning into real, single-source components first — they're
the ones currently hand-duplicated with the most copies:

1. **Topbar / back-link nav** — appears, with minor variations, in
   `pages/cv.html`, `pages/experience.html`, `pages/projects.html`, and all
   three `case-studies/*.html` files (6 copies).
2. **Footer CTA + bottom bar** — appears in `pages/experience.html`,
   `pages/projects.html`, and all three case studies (5 copies).
3. **The "ecosystem" cross-links card** (FarMartOS / PRO / App
   cross-promotion) — appears in `pages/projects.html` and all three
   `case-studies/*.html` files (4 copies, each with the "you are here"
   article styled differently).
4. **The `data-cv-download` button + status line markup** — appears
   wherever a CV download button is offered (`index.html` ×2,
   `pages/experience.html` ×2).

Until there's a build step, the fix for drift in these patterns is manual
care when editing one copy — check the others. This document exists so
that check is easy to do.
