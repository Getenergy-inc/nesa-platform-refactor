# Keyboard navigation for both bars

Keep the current navigation labels, destinations, bar sizes, branding and visual design unchanged. Work remains within the navigation-only exemption; no publishing or access-rule changes.

## Findings from the Accessibility Review
- Critical: none found in the audited navigation controls.
- Warning: the main desktop menu moves past a closed group on Arrow Down instead of opening it. This makes expected keyboard entry inconsistent.
- Warning: upper-bar Sign In is a plain page link rather than the workspace selector available in the main bar.
- Warning: mobile Sign In opens an off-screen section without moving keyboard focus there; several drawer links lack an explicit focus indicator.

## Changes
- Use the existing accessible menubar primitive for desktop grouped navigation: Enter/Space/Arrow Down open; arrow keys move within and between groups; Home/End jump; Escape closes and returns focus. Keep ordinary Tab navigation and Contact as a normal link.
- Reuse the existing Sign In dropdown in the upper bar with its original compact appearance. Let its accessible primitive manage opening, arrow movement, typeahead and Escape/focus return.
- Add consistent gold keyboard-focus indicators to mobile links and accordion headings. When the prominent Sign In button opens its mobile group, focus that group's existing accordion heading.
- Keep the drawer's existing accessible focus trapping and Escape handling; do not hand-roll menu or modal focus management.

## Verification
Add focused keyboard regression checks next to existing navigation tests. Test both bars on the contact page with real keyboard input, including every desktop group, Sign In choices, Tab exit, Escape/focus return and 915px/390px mobile operation. Capture focused-menu evidence and check preview errors. Protected workspace contents are outside this task.