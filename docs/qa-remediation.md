# QA remediation report

## Decision

**READY WITH WARNINGS.** The user explicitly approved the Work navigation and
Visual Design gallery changes in `51cff66` and authorized committing the validated
remediation, pushing only the refactor branch, and creating a PR targeting main.
The content-scope decision gate is resolved. Testing limitations remain below.
Merging and deployment are not authorized.

This report records the validation snapshot before the finalization commit.
Final commit and PR details are recorded in Git history and the pull request;
the validation evidence is unchanged by these approval-documentation updates.

## Baseline and Git safety at validation time

- Branch: `refactor/portfolio-architecture`; unchanged HEAD `1e3471e32b3e33ce7c191c9d41fa4de95790fbac`.
- Unchanged local main: `be7493e41f85396ade997e3af0e523c56ac2efb1`.
- `origin/main` remains at the same cached SHA; no live remote refresh was attempted.
- Working tree intentionally contains the uncommitted remediation; staging remains empty.
- `.DS_Store` is ignored and its existing file was preserved.
- `git diff --check` and syntax checks for all five JavaScript files pass.

## Findings by severity

| Severity | Root cause | Remediation / status |
|---|---|---|
| CRITICAL | No critical findings established | None open. |
| HIGH | `cd455cf` omitted `.hero-art` and `.hero-art img` while extracting the block into `css/hero-mockup.css` | Fixed in all three case studies using byte-identical declarations from main, in their original cascade position before the shared hero styles. |
| HIGH | `67bc3c0` moved six public pages without preserving old entrypoints | Fixed with six small redirect documents and one shared script. No full-page copies. |
| HIGH | `51cff66` contains content/navigation changes outside a structural refactor | Approved by the user; retained as intentional differences from main. See the separate approval record. |
| MEDIUM | Architecture documentation described the whole branch as behavior-preserving and said browser validation was unavailable | Corrected to distinguish structural work, content changes, remediation, current browser evidence, and limitations. |
| LOW | FarMartOS's page-specific override loaded after the shared 860px media rule, changing an unused selector's responsive width | Fixed by restoring the original 24% responsive width after the page's 16% desktop override. No matching component currently exists. |
| LOW | No `.gitignore` rule for the pre-existing `.DS_Store` | Added `.DS_Store` rule. No user files deleted. |

## Files changed

Modified:

- `case-studies/farmart-app.html`
- `case-studies/farmart-pro.html`
- `case-studies/farmart-os.html`
- `docs/architecture.md`

Added:

- `.gitignore`
- `cv.html`, `experience.html`, `projects.html`
- `farmart-app.html`, `farmart-pro.html`, `farmart-os.html`
- `js/legacy-redirect.js`
- `docs/content-changes-pending-confirmation.md`
- `docs/qa-remediation.md`

`index.html`, full pages under `pages/`, existing shared CSS/JS, and assets were
not modified. Existing navigation/content changes were not reverted.

## Hero restoration

All three pages restore these exact original main declarations:

```css
.hero-art { border-radius: 20px; overflow: hidden; background: #f4f4f5; aspect-ratio: 1191 / 669; max-width: 100%; }
.hero-art img { width: 100%; height: 100%; object-fit: cover; display: block; }
```

Computed hero container and image rectangles, radius, overflow, aspect ratio,
maximum width, object-fit, and object-position match main at all three widths.
The current image width/height attributes remain unchanged. The FarMartOS latent
cascade repair retains `width: 24%` through 860px; its other original override
values are preserved.

## Screenshot validation

Used installed Google Chrome 155 through Python Playwright, headless, device
scale factor 1, light color scheme, en-US locale, widths 1440/768/390 and height
900 CSS pixels. Main was exported with `git archive main`; after was served from
the working tree. Both use matching-depth local URL prefixes. No source files
were changed to accommodate the screenshots.

Font responses are cached and replayed byte-for-byte between compared pages.
Tests await fonts after scrolling, explicitly load fonts for page text, decode
all images, disable animations/transitions equally, return to scroll position
zero, warm the full-page raster, and then capture. Saved geometry also records
font, typography, color, spacing, radius, image, and layout properties.

The authoritative matrix contains **42 screenshots / 21 matched pairs**:

| Page | 1440px | 768px | 390px |
|---|---|---|---|
| index.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |
| pages/experience.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |
| pages/projects.html | Content differs (51cff66) | Content differs (51cff66) | Content differs (51cff66) |
| pages/cv.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |
| case-studies/farmart-os.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |
| case-studies/farmart-pro.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |
| case-studies/farmart-app.html | Exact screenshot match | Exact screenshot match | Exact screenshot match |

The Projects differences are retained changes from `51cff66`: removed gallery
cards, filter, summary count and lede wording, plus relocated empty state. The
homepage Work destination also differs functionally even when its screenshots
match. This report does not claim whole-branch visual or behavioral equivalence.

Earlier diagnostic captures included local-server connection resets (some CSS
or images did not load); they are not accepted as regression evidence. The
accepted run increases the local server connection queue and rejects any capture
with an HTTP failure, failed request, console error, exception, or broken image.
The original broad before/main/after capture is retained for diagnostics only.

## Functional validation

- 184 local HTML references/fragments checked across the seven full pages and six compatibility documents: no missing paths or fragment IDs.
- 45 unique local HTTP resources (including CSS, JS, images, legacy documents, and PDF) return 200.
- All six redirects verified with plain URLs and with query strings/fragments at both the origin root and a project prefix: 24 passing browser assertions.
- All six fallback links and canonical destinations verified with JavaScript disabled in both hosting modes: 12 passing assertions.
- Encoded query values, repeated query parameters, and fragments survive JavaScript redirects. `location.replace` avoids a redirect entry in Back history. Targets are full pages rather than redirect documents, avoiding loops.
- Relative canonical links resolve to the corresponding new page and deliberately omit campaign queries/fragments. No deployment domain is guessed.
- Project filters pass at all three widths: All=6, Enterprise=1, Mobile=2, In development=3; exactly one pressed button; no false empty state.
- Mobile back navigation works on all seven pages; homepage Work reaches `pages/projects.html`.
- All four CV controls open the correct PDF and receive HTTP 200 in the mobile browser check.
- Accepted screenshot matrix: no console errors, page exceptions, failed resources, broken images, or horizontal document overflow.
- All five JavaScript files pass `node --check`.

## Remaining differences and limitations

- **Resolved scope finding:** the user approved retaining `51cff66`. Details are in [content-changes-pending-confirmation.md](content-changes-pending-confirmation.md).
- **LOW / hosting limitation:** compatibility files return HTTP 200 and use client-side redirects; they are not server-side 301 responses. With JavaScript disabled, fallback links navigate correctly but do not carry the query/fragment automatically.
- **LOW / untested surfaces:** Safari, Firefox, real devices, print rendering, optional viewer-specific native save-to-disk, and exhaustive animation timing are outside this Chromium matrix. Ordinary browser PDF opening was verified.
- Full-page equality is assessed under controlled animation states. It does not certify every hover, scroll, or animation frame.

## Evidence and reproduction

Artifacts are local to this review environment:

- Authoritative screenshots and comparison summary: `/private/tmp/js-portfolio-remediation/validated/`
- Browser resource/geometry evidence: `validated/results.json`
- Font-response checksums: `validated/font-cache.json`
- Redirect/filter/PDF evidence: `/private/tmp/js-portfolio-remediation/functional.json` and the initial `results.json` (filter and navigation records only; failed-resource captures excluded).
- Screenshot runner: `/private/tmp/js-portfolio-remediation/validated-capture.py`
- Functional runner: `/private/tmp/js-portfolio-remediation/validate.py`
- Original QA report retained unchanged at `/private/tmp/js-portfolio-qa/REVIEW.md`.

The functional runner's screenshot phase predates the connection-queue correction;
use the authoritative screenshot runner for visual reproduction. Browser runs
require installed Python Playwright and Chrome and permission to start an isolated
browser/local server. No project dependency or framework was added.

The user authorized the finalization commit, a push of only
`refactor/portfolio-architecture`, and a PR targeting main. Stop after PR creation;
merging requires further explicit approval and deployment remains unauthorized.
