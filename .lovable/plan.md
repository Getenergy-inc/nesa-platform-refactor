# Restore Buy Merchandise enquiry links

- Add **Buy Merchandise** after **Donate**, before **Contact Us**, in the shared Get Involved menu; add the same link after Donate in the footer.
- Both links point to `/contact?subject=merchandise`. Prefill the existing Contact subject with **Merchandise**, without adding a payment or enquiry-saving workflow.
- Preserve the merchandise independence notice; no shop, cart, checkout, payment, redirect, branding or access changes. Do not publish.
- Update navigation checks to reflect the existing desktop/mobile menus, and verify the expanded menu fits on desktop and at 360px.

## Files
- `src/config/siteNavigation.ts`
- `src/components/nesa/NESAFooter.tsx`
- `src/pages/Contact.tsx`
- `src/config/__tests__/siteNavigation.test.ts`
- `tests/e2e/navbar-overlap.spec.ts` (currently tests retired voting menus; update the affected menu expectations)
- `roadmap.md` (task status)

## Outside these surfaces
No changes to shop redirects, auth, data, payments or shared styling. The Contact form currently has no working submission destination; this task only sets its existing subject field.