# Route Migration Matrix

Every current route in `src/App.tsx` (367 entries) gets exactly one action.

**Legend:** `KEEP` · `MERGE` (fold into a parent) · `REDIRECT` (301 to new) · `SECTION` (becomes an anchor section) · `DYNAMIC` (row in DB not a route) · `DASHBOARD` (authenticated, not in the 38) · `ARCHIVE` (kept read-only, not linked) · `REMOVE` (delete route, add redirect).

## Home / Programs
| Old | Action | New |
|---|---|---|
| `/` | KEEP | `/` |
| `/programs` | REDIRECT | `/impact` |
| `/programs/nesa-africa` | REDIRECT | `/` |
| `/upcoming-events` | REDIRECT | `/media#upcoming-events` |
| `/movement` | REDIRECT | `/about` |
| `/ecosystem` | REDIRECT | `/about#ecosystem` |
| `/install` | KEEP (PWA util) | `/install` |

## About / Governance / Policies
| Old | Action | New |
|---|---|---|
| `/about` | KEEP | `/about` |
| `/about/scef` | SECTION | `/about#scef` |
| `/about/social-impact` | SECTION | `/about#social-impact` |
| `/about/awards-recognition` | REDIRECT | `/recognition` |
| `/about/governance` | REDIRECT | `/governance` |
| `/about/timeline` | REDIRECT | `/timeline` |
| `/about/vision-2035` | SECTION | `/about#vision-2035` |
| `/governance` | KEEP | `/governance` |
| `/policies` + `/policies/*` | MERGE | `/governance#policies` |
| `/guidelines/*` | MERGE | `/governance#guidelines` |
| `/faq`, `/help`, `/help-center` | MERGE | `/support#help` |
| `/contact` | REDIRECT | `/support#contact` |

## Recognition / Awards / Categories
| Old | Action | New |
|---|---|---|
| `/awards`, `/award`, `/award-categories`, `/awards/categories`, `/categories`, `/category`, `/pathways`, `/pathways-to-recognition`, `/awards/recognition-architecture`, `/awards/18-categories`, `/awards/pillars`, `/awards/explore`, `/awards/regions`, `/awards/timeline`, `/awards/winners` | REDIRECT | `/recognition` |
| `/awards/18-categories/:categorySlug` | REDIRECT | `/recognition/:tier/:category` (mapped) |
| `/awards/gold`, `/awards/gold-blue-garnet`, `/awards/blue-garnet`, `/awards/blue-garnet-categories`, `/awards/gold-blue-garnet/categories`, `/awards/gold-special-recognition`, `/awards/gold-special-recognition-legacy` | REDIRECT | `/recognition/gold-blue-garnet` |
| `/awards/platinum`, `/awards/platinum-recognition`, `/awards/platinum-certificate-categories` | REDIRECT | `/recognition/platinum` |
| `/awards/platinum/diaspora`, `/awards/platinum-recognition/diaspora` | REDIRECT | `/recognition/platinum/diaspora-educational-impact` |
| `/awards/icon`, `/awards/africa-education-icon` | REDIRECT | `/recognition/africa-education-icon` |
| `/awards/africa-education-icon/nominees` | REDIRECT | `/directory?tier=africa-education-icon` |
| `/awards/influencer`, `/awards/influencer-education`, `/awards/influencer-education-impact`, `/awards/influencers-education-impact`, `/awards/influencers-education-impact-2026-recognition` | REDIRECT | `/recognition/influencer-education-impact` |
| `/awards/influencer-education-impact/nominees` | REDIRECT | `/directory?tier=influencer-education-impact` |
| `/awards/csr-education`, `/awards/csr-for-education` | REDIRECT | `/recognition/gold-blue-garnet/best-csr-education-africa` |
| `/awards/digital-voices` | REDIRECT | `/recognition/influencer-education-impact` |
| `/awards/global-partnerships`, `/awards/grants-global-support` | REDIRECT | `/recognition/platinum/international-partnership-education` |
| `/categories/:slug`, `/category/:slug`, `/awards/category/:slug`, `/categories/christian-education-impact-africa`, `/categories/islamic-education-impact-africa`, `/categories/diaspora-education-impact`, `/categories/international-bilateral-education`, and every `/category/*` legacy slug | REDIRECT | mapped to `/recognition/{tier}/{category}` via slug map (see below) |
| `/awards/pillars/:slug` | REDIRECT | `/recognition` |
| `/awards/explore/:pathwaySlug[/*]` | REDIRECT | `/recognition/{tier}` (pathway→tier map) |
| `/awards/gold-blue-garnet/vote`, `/awards/gold-blue-garnet/vote-now`, `/vote`, `/vote/gold`, `/vote/blue-garnet`, `/vote-with-agc`, `/voting-portal`, `/voting-timeline`, `/how-voting-works`, `/claim-voting-credits`, `/earn-voting-coins`, `/earn-voting-credits` | REMOVE (voting sunset) | REDIRECT to `/governance#2026-recognition-method` |
| `/trending`, `/results` | REDIRECT | `/directory?status=recognised` |

## Nominees / Directory
| Old | Action | New |
|---|---|---|
| `/nominees`, `/nominee`, `/nominee-directory`, `/nominees-directory` | REDIRECT | `/directory` |
| `/nominees/:slug`, `/nominees/profile/:slug`, `/profile/:slug`, `nominee/:slug` | REDIRECT | `/nominee/:slug` (KEEP profile route) |
| `/nominees/category/:categorySlug[/:subSlug]` | REDIRECT | `/directory?category=…&subcategory=…` |
| `/nominees/region/:slug` | REDIRECT | `/directory?region=…` |
| `/nominees/africa-education-icon-award[/:sub][/:cls]` | REDIRECT | `/directory?tier=africa-education-icon&…` |
| `/nominees/best-ngo-contribution-to-education[/…]` | REDIRECT | `/directory?category=best-ngo-education-africa` |
| `/nominees/gold-special-recognition[/…]` | REDIRECT | `/directory?tier=gold-blue-garnet` |
| `/nominee/:slug` | KEEP | `/nominee/:slug` |
| `/directory`, `/directory/:slug` | KEEP | `/directory[/:slug]` |
| `/contributors[/:id]` | REDIRECT | `/directory?type=contributor` |

## Regions
| Old | Action | New |
|---|---|---|
| `/regions`, `/regions/:slug`, `/regions/nigeria` | KEEP | `/regions[/:slug]` |
| `/region`, `/region/:slug`, `/region/nigeria` | REDIRECT | `/regions[/:slug]` |
| `/awards/regions[/:slug]` | REDIRECT | `/regions[/:slug]` |

## Nomination
| Old | Action | New |
|---|---|---|
| `/nominate` | KEEP (rebuild as gateway) | `/nominate` |
| `/nominate/advanced`, `/nominate/icon`, `/nominate/ngo`, `/nominate/official`, `/nominate/official/:family`, `/nominate/official/:family/:category` | MERGE into `AwardNominationForm` | `/nominate?tier=…&category=…&subcategory=…` |
| `/prenominate` | REDIRECT | `/nominate` |
| `/endorse`, `/endorse-nesa`, `/get-involved/endorse-nesa-africa` | REDIRECT | `/support#endorse` |

## Impact / EduAid
| Old | Action | New |
|---|---|---|
| `/impact` | KEEP | `/impact` |
| `/impact/nominate-school`, `/impact/regional-school-intervention` | SECTION | `/special-needs` |
| `/impact/rebuild-my-school-africa`, `/rebuild`, `/eduaid-africa/rebuild-my-school[/:regionSlug]` | REDIRECT | `/rebuild-my-school` |
| `/eduaid`, `/eduaid-africa` | KEEP | `/eduaid-africa` |
| `/afri-edutourism` | KEEP | `/afri-edutourism` |

## Media
| Old | Action | New |
|---|---|---|
| `/media` | KEEP (rebuild as hub) | `/media` |
| `/media/tv`, `/media/nesa-tv` | SECTION | `/media#tv` |
| `/media/webinars` | SECTION | `/media#webinars` |
| `/media/gala`, `/media/photos`, `/media/gallery`, `/media/highlights`, `/media/events`, `/media/shows`, `/media/behind-the-scenes` | SECTION | `/media#…` |
| `/gallery`, `/gallery/:slug`, `/videos`, `/music`, `/press` | REDIRECT | `/media#…` |

## Gala / Tickets / Commerce
| Old | Action | New |
|---|---|---|
| `/gala/tickets`, `/gala/attendance`, `/tickets`, `/buy-your-ticket` | REDIRECT | `/gala#tickets` |
| `/gala` (new) | KEEP | `/gala` |
| `/merch`, `/merchandise`, `/store`, `/shop`, `/shop-now`, `/buy-merchandise`, `/bulk-orders`, `/shop/bulk-orders` | REDIRECT | `/support#merchandise` |
| `/shop/:slug`, `/shop/cart`, `/cart`, `/shop/checkout`, `/checkout`, `/shop/orders/:id`, `/orders/:id` | DASHBOARD (retain checkout flow) | `/cart`, `/checkout`, `/orders/:id` |

## Support / Community
| Old | Action | New |
|---|---|---|
| `/support` (new) | KEEP | `/support` |
| `/sponsor`, `/sponsors`, `/sponsors/:slug`, `/sponsor/:slug`, `/sponsor/packages`, `/sponsorship`, `/sponsorship-packages`, `/our-sponsors`, `/our-partners`, `/partner`, `/partners`, `/partnerships`, `/partners/prospects/:slug`, `/become-a-sponsor`, `/become-sponsor` | REDIRECT | `/support#sponsors` |
| `/donate`, `/getfinance` | REDIRECT | `/support#donate` |
| `/volunteer`, `/volunteers`, `/volunteers/:slug`, `/volunteer-*`, `/get-involved`, `/membership` | REDIRECT | `/support#volunteers` |
| `/ambassadors` | REDIRECT | `/support#ambassadors` |
| `/chapters`, `/join-local-chapter` | REDIRECT | `/support#chapters` |

## Wallet / AGC (retain non-award)
| Old | Action | New |
|---|---|---|
| `/wallet`, `/dashboard/wallet` | DASHBOARD | `/wallet` |
| `/earn-agc`, `/agc-rewards`, `/earn-credits`, `/about-agc` | KEEP | `/earn-agc`, `/about-agc` |
| `/gfawzip*`, `/payments/gfawzip`, `/links`, `/wallet/gfawzip` | DASHBOARD | retained |

## Judges (Icon-only scope)
| Old | Action | New |
|---|---|---|
| `/judges`, `/judges/directory`, `/judges/:slug`, `/judges-arena` | KEEP (public directory) | `/judges[/:slug]` |
| `/judge/*`, `/judge-*`, `/judgeapply`, `/judges/apply`, `/jury` | DASHBOARD (Icon-scoped) | `/judge/*` |

## NRC / OLC / Admin
| Old | Action | New |
|---|---|---|
| `/nrc/*` | DASHBOARD | unchanged |
| `/olc/*` | DASHBOARD | unchanged |
| `/admin/*` | DASHBOARD | unchanged |
| `/admin/pathways` | RENAME | `/admin/subcategories` (+ redirect) |

## Auth / Account
| Old | Action | New |
|---|---|---|
| `/login`, `/register`, `/forgot-password`, `/reset-password`, `/otp`, `/account/login`, `/account/otp`, `/auth/*`, `/signin`, `/signup` | DASHBOARD | keep + existing redirects |
| `/dashboard`, `/dashboard/*` | DASHBOARD | unchanged |
| `/my-certificates[/*]`, `/certificates/verify[/:hash]`, `/certificates/guide`, `/verify`, `/verify/:hash` | DASHBOARD | unchanged |
| `/nominee/accept/:token`, `/nominee/decline/:token`, `/nominee/dashboard/:token` | DASHBOARD | unchanged |

## Timeline
| Old | Action | New |
|---|---|---|
| `/timeline` | KEEP (rebuild DB-driven) | `/timeline` |
| `/about/timeline`, `/awards/timeline`, `/voting-timeline` | REDIRECT | `/timeline` |

## Misc
| Old | Action | New |
|---|---|---|
| `/edx`, `/edx-matrix` | REDIRECT | `/governance#edi` |
| `/unauthorized`, `*` (404) | KEEP | error routes |
| `discussion`, `nominees` (relative — bugs) | REMOVE | fix in `App.tsx` |

## Legacy category slug → new tier/category map

Used by the redirect layer built in Stage 4.

| Old slug (`/category/...` or `/categories/...`) | New path |
|---|---|
| `africa-education-icon` | `/recognition/africa-education-icon/africa-education-icon-award` |
| `christian-education-africa`, `christian-education-impact-africa` | `/recognition/platinum/christian-education-impact` |
| `islamic-education-africa`, `islamic-education-impact-africa` | `/recognition/platinum/islamic-education-impact` |
| `creative-arts-nigeria` | `/recognition/gold-blue-garnet/best-creative-arts-education-nigeria` |
| `csr-education-africa` | `/recognition/gold-blue-garnet/best-csr-education-africa` |
| `csr-education-nigeria` | `/recognition/gold-blue-garnet/best-csr-education-nigeria` |
| `diaspora-education`, `diaspora-education-impact` | `/recognition/platinum/diaspora-educational-impact` |
| `education-friendly-state-nigeria` | `/recognition/gold-blue-garnet/best-education-policy-state-nigeria` |
| `edutech-africa` | `/recognition/gold-blue-garnet/best-edtech-innovation-africa` |
| `international-education`, `international-bilateral-education` | `/recognition/platinum/international-partnership-education` |
| `library-nigeria` | `/recognition/platinum/best-tertiary-institution-library` |
| `media-advocacy-nigeria` | `/recognition/gold-blue-garnet/best-media-education-advocacy-nigeria` |
| `ngo-education-africa` | `/recognition/gold-blue-garnet/best-ngo-education-africa` |
| `ngo-education-nigeria` | `/recognition/gold-blue-garnet/best-ngo-education-nigeria` |
| `political-leaders-nigeria` | `/recognition/platinum/political-leadership-education` |
| `research-development-nigeria` | `/recognition/platinum/research-development-education` |
| `stem-education-africa` | `/recognition/gold-blue-garnet/best-stem-education-programme-africa` |

## Counts

- Legacy routes inventoried: **367**
- KEEP as-is: ~40 (dashboards, auth, checkout, wallet, error, timeline, media, gala, support, directory, nominee profile, judges directory, regions, install)
- REDIRECT (301): ~180 (most award/nominate/vote/shop/sponsor aliases)
- MERGE / SECTION: ~50 (policies, guidelines, media sub-pages, gallery, help)
- DYNAMIC: ~30 (per-category, per-region, per-nominee params)
- DASHBOARD (unchanged, not in 38): ~60 (`/dashboard/*`, `/nrc/*`, `/admin/*`, `/olc/*`, `/judge/*`, `/volunteer/*`)
- REMOVE (voting sunset routes → redirect to governance): ~10
- ARCHIVE (legacy layouts read-only): 2 (`/awards/gold-special-recognition-legacy`, `/awards/pillars/:slug`)
- BUG fixes: 3 (`discussion`, `nominees`, `nominee/:slug` missing leading slash in `App.tsx`)
