# Approved content changes

Status: **Approved by the user.** The user explicitly approved keeping Work
navigation pointed at All Projects and keeping the Visual Design galleries
removed, and authorized finalizing the validated refactor and remediation.
The filename is retained so existing documentation links continue to resolve.

Commit: `51cff667275a73dcc66b47c49933b99756e7a576`.

The commit message says these edits were carried over from pending working-tree
changes made before the refactor branch was created. That records deliberate
inclusion. The subsequent explicit user approval confirms that the changes
below are retained in this branch.

| Change from original main | Current location | Consequence |
|---|---|---|
| Homepage Work link changes from `#work` to the All Projects page | `index.html` | Clicking Work leaves the homepage. Its existing scroll-spy still marks Work when the homepage work section is reached. |
| Removes the lede's reference to earlier visual design work | `pages/projects.html` | Changes portfolio positioning and copy. |
| Removes the `2 visual galleries` summary count | `pages/projects.html` | Summary now lists case studies and projects in development only. |
| Changes All filter count from 8 to 6 | `pages/projects.html` | Matches the six remaining cards. |
| Removes the Visual Design filter button | `pages/projects.html` | That category can no longer be selected. |
| Removes the Visual Design section, including Behance and Dribbble gallery cards | `pages/projects.html` | Those two gallery entrypoints disappear from this page; other existing social links are unaffected. |
| Moves the hidden empty-state paragraph out of the deleted section and adds `wrap` | `pages/projects.html` | Preserves the filter's empty-state target after section removal. |

No other content edits appear in this commit. File relocation and path updates
happened in later commits and are separate from the changes above.

The scope decision is resolved: retain these content/navigation changes and their
associated copy, counts, filter, and empty-state updates. They remain intentional
differences from main, so the branch does not claim whole-branch visual or
behavioral equivalence.
