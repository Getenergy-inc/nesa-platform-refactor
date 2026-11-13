# Refactor navigation bars 1 and 2

## Scope
Apply the supplied navigation brief under the owner's navigation-only Phase 0 exemption. Keep the original logo, charcoal/gold colours, fonts, bar heights and existing menu styling. No publishing, page-content changes, database changes, new routes or changes to permissions.

## Navigation changes
- Main bar: About · Recognition · Impact · Media · Get Involved · Contact, with Sign In and Submit a Nomination as the only primary actions.
- Keep the existing upper bar, but remove its eleven standalone operational links. Its utility links become Sign In and Submit a Nomination, as supplied.
- Populate the five existing dropdown groups with the supplied links. Move Nominee Directory under Recognition on desktop; retain Nominees at the mobile first level as explicitly specified in the brief.
- Group school-support links under Impact; webinars, podcast, TV, documentaries/interviews, E-Journal and press under Media; volunteer, chapters, team, sponsor, partner, donate and contact under Get Involved.
- Sign In menu: Select Your Workspace, with Nominee Portal, NRRC Portal, Judges Arena, Volunteer Workspace, Chapter Workspace and Administrator Sign-In. Use existing destinations and preserve every sign-in and access check. Display the full approved Nominee Research and Review Corps name, without changing stored roles or /nrc routes.
- Keep the existing authorised workspace controls for signed-in users; remove public wallet/AGC links from the header menus without deleting any records.
- Keep accessible expandable mobile menus and prominent Sign In/Submit a Nomination actions. Preserve all 12 languages and the authorised nomination form link.

## Technical details
- Update the live shared header and its canonical menu configuration, not the unused legacy navigation.
- Reuse existing navigation, dropdown, accordion and button components; share workspace link definitions across desktop and mobile.
- Match every supplied destination to existing pages or established redirects. Use an existing relevant page for content without a dedicated destination; flag any unavailable destination rather than inventing a route.
- Record the navigation exemption and shared-menu architecture, without marking Phase 0 cleared.

## Verification
Check desktop, the current 915px-wide view and 390px mobile: menu opening/closing, keyboard focus, labels, nomination destination and workspace sign-in links. Run relevant existing tests and check preview errors. Protected workspaces remain permission-gated; no roles are granted by selecting a menu link.

## Review
Stop after these two bars for owner review. Report changed files, any unavailable destinations and any checks blocked by the wider security hold. Nothing will be published.