# Figma screen sync

Reference file: [My Portfolio Webpage](https://www.figma.com/design/teapCPPJVF6okkkP9mTbUO/My-Portfolio-Webpage).

| Screen | Figma frame | Local route |
| --- | --- | --- |
| Home | 2344:35 | `index.html` |
| All Projects | 2345:14 | `pages/projects.html` |
| Experience | 2351:14 | `pages/experience.html` |
| CV | 2358:14 | `pages/cv.html` |
| FarMartOS | 2360:14 | `case-studies/farmart-os.html` |
| FarMart PRO | 2370:14 | `case-studies/farmart-pro.html` |
| FarMart App | 2373:14 | `case-studies/farmart-app.html` |
| Interface DS | 2397:2 | `case-studies/interface-ds.html` |

Updated project spacing and About content on Home; artwork, headings, cards, counts, filters, and CTAs on All Projects; hero chips, portrait treatment, and role columns on Experience; screen typography and downloadable PDF on CV; heading styles and revised copy on the FarMart case studies. Case-study back links return to All Projects.

Interface DS includes native HTML examples for palettes, themes, sample controls, menu actions, the focus-time chart, and the date picker. Both Home's CTA and the All Projects card target the same case-study route. The page identifies the examples as interactive HTML, rather than claiming that the portfolio runs a separate React library.

## Intentional differences from Figma

- Kept existing illustrations and working conceptual diagrams where the older Figma frames contain empty placeholders. Kept the recognition band legible rather than reproducing its white-on-white export.
- Kept Home's DS-specific copy and artwork rather than its duplicated FarMart placeholder content in Figma.
- Used the consistent Interface DS name across the site and CV. All Projects has four case studies, two projects in development, and one Design System card; the Figma Design System filter's count of two does not match its cards.
- The library source button opens the supplied Figma file. The component-inventory button links to the on-page family inventory because no separate library URL was supplied.

## Verification

- All eight routes checked at 1440, 768, and 390 px: HTTP 200, no missing images, no horizontal page overflow, and no JavaScript errors.
- Clicked both Interface DS entry links and tested browser Back at desktop and mobile widths.
- Rebuilt project browsing around independent project-focus and case-study-availability controls. Checked all 18 combinations at desktop, tablet, and mobile widths, including contextual counts, empty states, and reset focus. Summary counts are derived from the six cards.
- Checked the palette, theme, button, chart, menu, calendar, keyboard date selection, and reminder interactions.
- Repository HTML, local-link, and static-build checks pass.
- Refreshed the two-page CV PDF, checked its extracted project name, and visually reviewed both pages.

Visual comparison used the Figma renders locally. Hosted 12ui comparison was rejected by automatic approval review because it could send local page and repository content to a third-party service; no hosted comparison result is claimed.
