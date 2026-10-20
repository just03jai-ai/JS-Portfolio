# Jai Singh — Product Designer

Portfolio website: enterprise UX, information architecture and design systems.

- **Home:** `index.html`
- **Experience:** `pages/experience.html`
- **All projects:** `pages/projects.html`
- **CV:** `pages/cv.html` (PDF in `assets/cv/`)
- **Case studies:** `case-studies/farmart-os.html`, `case-studies/farmart-pro.html`, `case-studies/farmart-app.html`
- **Shared CSS:** `css/` · **Shared JS:** `js/`

Static HTML and CSS, no build step. Hosted with GitHub Pages from `main`,
served from the repo root — `index.html` must stay at the top level.

See `docs/architecture.md` for the full repository layout and
`docs/design-system.md` for the CSS design tokens and component patterns.

Pull requests run the required `HTML Validation  Link Check  Build Check` job.
It checks the HTML document contract and legacy route declarations, local links,
JavaScript syntax, and a temporary static-site copy served under `/JS-Portfolio/`.
Run the Python checks locally with `python3 scripts/check_portfolio.py html`,
`python3 scripts/check_portfolio.py links`, and
`python3 scripts/check_portfolio.py build`; also run `node --check` on `js/*.js`.
These checks use no project dependencies and do not replace browser visual QA
or full HTML conformance validation. The workflow does not deploy the site.

Connect: [LinkedIn](https://www.linkedin.com/in/jai-singh-639511173/) · [Behance](https://www.behance.net/just03jaif1e6) · [Dribbble](https://dribbble.com/Jai03)

© 2026 Jai Singh. All rights reserved. Case study diagrams are conceptual and contain no FarMart screens, data or internal business rules.
