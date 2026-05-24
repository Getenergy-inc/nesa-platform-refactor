
# Volunteer Ecosystem Platform — Implementation Plan

This is a large, multi-phase build. I'll deliver it in **3 phases** so each phase ships working value and can be reviewed before the next.

---

## Phase 1 — Data layer + Public discovery (ship first)

**Database (new tables, all RLS-protected):**
- `volunteers` — slug, full_name, photo_url, country, region, chapter_id, role, team, bio, badges[], verification_status, contribution_score, social_links (jsonb), referral_code, referral_count, visibility_status, joined_at, user_id
- `volunteer_tasks` — title, description, status, proof_url, assigned_to, approved_by
- `volunteer_referrals` — volunteer_id, referred_email, status, converted_at
- `volunteer_badges` — code, label, icon, tier
- `volunteer_teams` — name, slug, description, lead_user_id
- `volunteer_activity_logs` — volunteer_id, action, metadata, created_at
- Trigger: auto-generate slug + unique referral code on insert
- Trigger: increment `contribution_score` on task approval / referral conversion
- View: `volunteer_leaderboard` (top by contribution_score, by referrals, by team)

**Public pages:**
- `/volunteers` — redesigned hero, animated impact stats (counters from DB aggregates), searchable/filterable grid (country, chapter, team, role, active/alumni), featured contributors strip, "Why We Volunteer" stories
- `/volunteers/:slug` — profile hero, contribution summary, social links, referral block (unique link + QR + share buttons WhatsApp/X/FB/LinkedIn/copy), badges, activity feed
- `/volunteer-stories` — story cards
- `/volunteer-teams` — team grid with member counts
- `/volunteer-leaderboard` — top contributors / referrers

**Nav (Engage dropdown):** Become a Volunteer · Meet Our Volunteers · Volunteer Leaderboard · Join a Local Chapter · How to Join a Local Chapter

---

## Phase 2 — Private Volunteer Dashboard

Routes (auth-gated, `volunteer` role auto-granted on first dashboard visit if profile exists):
- `/volunteer/dashboard` — overview cards (referrals, tasks, score, badges)
- `/volunteer/profile` — edit bio, photo, country, social links, visibility toggle
- `/volunteer/referrals` — invite link, QR, share assets, conversion table
- `/volunteer/tasks` — assigned tasks, submit proof, status
- `/volunteer/analytics` — profile views, referral clicks, share counts (charts via recharts)
- `/volunteer/settings` — notification + privacy controls

Gamification: Bronze/Silver/Gold/Continental tiers computed from `contribution_score` thresholds, badge auto-award trigger.

---

## Phase 3 — Admin CMS + Analytics

- `/admin/volunteers` — approve, verify, hide/show, assign badges, assign chapter/team, feature contributor
- `/admin/volunteers/teams` — CRUD teams
- `/admin/volunteers/tasks` — create + assign tasks
- GA4 events: `volunteer_profile_view`, `volunteer_referral_click`, `volunteer_share`, `volunteer_signup`
- Aggregated analytics dashboard for admins

---

## Technical notes

- All visuals reuse existing Charcoal/Gold tokens, Playfair Display headers, `framer-motion` for counters/transitions
- Mobile-first: sticky share bar on profile, bottom-sheet filters, swipe-friendly cards, `pb-20` for bottom nav
- Reuse existing `CONTRIBUTORS` seed data: migration backfills the new `volunteers` table from `src/data/contributors.ts` so the directory is populated on day one
- QR codes via `qrcode.react` (already in deps if not — small add)
- Referral links: `nesa.africa/join?v={slug}` resolved by existing referral attribution hook
- Strict RLS: public reads only when `visibility_status='public'` AND `verification_status='approved'`; volunteers edit only own row; admins full access via `has_role(auth.uid(),'admin')`

---

## Scope confirmation

**Phase 1 is large on its own** (~6 new tables + migrations + 5 public routes + nav update + redesigned `/volunteers`). I'll start there after you approve.

**Please confirm:**
1. Proceed with all 3 phases (I'll ship Phase 1 first, then continue)?
2. OK to seed `volunteers` table from existing `CONTRIBUTORS` data?
3. Any team/badge taxonomy you want locked in now, or use the defaults (Tech, Data, Media, Design, Content, Gala, Ambassador, Chapter Coordinator, Volunteer Lead, Verified)?
