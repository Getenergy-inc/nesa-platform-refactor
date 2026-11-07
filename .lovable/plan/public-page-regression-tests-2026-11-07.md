# Public-page regression tests

Add automated checks for the completed public cleanup; leave the website’s design and content unchanged and do not publish.

## Coverage
- Public pages must not offer gala ticket purchases or link to ticket-sales addresses.
- The “Vote Before Gala” action must stay absent.
- Outdated overall category/subcategory totals must stay absent; retain the existing checks for 4 tiers, 22 categories and 90 subcategories.
- The “2026 Gala Highlights – Archive” item must stay absent.
- Former ticket addresses must redirect to the online gala information page.

## Technical details
Use the existing Playwright browser-test suite to check rendered public pages, shared navigation, and redirects on desktop and mobile. Include positive page-loaded assertions so blank or error pages cannot pass. Run against the existing local preview and run the focused award-total tests. No database changes or backup/export work from the attached migration brief are included in this test-only task.

## Verification
Run the new tests, verify that deliberately reintroducing each prohibited item causes its check to fail, and restore the clean state. Report any failing existing public page without changing unrelated content.