# RSI Pre-Launch QA Report

**Project:** Red Sea International (RSI) Corporate Website  
**Date:** 2026-11-12  
**Auditor role:** Senior Frontend / QA / Performance / A11y / Security / Release  
**Scope:** Production-readiness audit (no redesign)  
**Git action:** No push / no deploy performed (per instructions)

---

## 1. Project overview

Corporate marketing site for Red Sea International with a cinematic homepage and an Our Businesses deep-dive page. Interactions use Lenis + GSAP ScrollTrigger. Contact CTAs hand off to the official RSI contact page (`https://redseaintl.com/contact-us`).

## 2. Framework and dependency summary

| Item | Value |
| --- | --- |
| Framework | **Next.js 16.4.6** (App Router, Turbopack) |
| UI | React **19.3.0** |
| Language | TypeScript **5** (strict) |
| Styling | Tailwind CSS **4.3.3** (`@tailwindcss/turbopack`) |
| Motion | GSAP **3.15.1**, Lenis **1.3.27**, Motion **14.12.0** |
| Routes | `/`, `/businesses`, `/_not-found`, `/icon.svg`, `/sitemap.xml` |
| Scripts | `dev`, `build`, `start`, `lint`, `typecheck` *(typecheck added)* |

**Unused / removed during audit:** orphaned `BusinessesCTA` + parallax CTA helpers (no remaining imports after businesses page switched to shared `CTA`).

**Env:** No `.env` files present. No client secrets found in source.

## 3. Test commands executed

| Command | Result |
| --- | --- |
| `npm run lint` | **PASS** (after Header / ContactOverlay fixes) |
| `npm run typecheck` | **PASS** |
| `npm run build` | **PASS** |
| `npm audit --omit=dev` | **0 vulnerabilities** |
| `npm audit` (incl. dev) | Moderate findings in transitive `@typescript-eslint/*` via `eslint-config-next` — **not force-fixed** |

## 4. Pages and features tested (static / code-level)

### Home `/`
- Header / nav / contact overlay / footer — code paths reviewed
- Hero (scroll-scrub video) — implementation reviewed
- About, Capabilities (pinned), Businesses preview, Project Proof (pinned), Contact CTA, Footer
- **No “Sectors” section exists** in current codebase (N/A)

### Our Businesses `/businesses`
- Intro hero image banner
- Vertical business cards
- Services sticky tabs
- Integrated Delivery timeline
- Shared Contact CTA (`padTop`)
- Footer

### Not fully executed in a real browser by this audit
Mouse/trackpad/touch scroll, multi-device visual QA, Lighthouse field metrics, and production `next start` smoke in Chrome/Safari/Firefox remain **manual**.

## 5–6. Bugs discovered / fixed

### Fixed this audit

| ID | Severity | Description | Fix | Verification |
| --- | --- | --- | --- | --- |
| F1 | P1 | ESLint `react-hooks/set-state-in-effect` in `Header` (menu close + hash reset) | Render-time menu path sync; derive `activeHash` from pathname | `npm run lint` PASS |
| F2 | P1 | ESLint immutability errors mutating `registerClose` prop in `ContactOverlay` | Renamed to `registerCloseRef` | `npm run lint` PASS |
| F3 | P2 | Missing `robots.txt` / sitemap | Added `public/robots.txt` + `src/app/sitemap.ts` | Build lists `/sitemap.xml` |
| F4 | P2 | No `typecheck` script | Added `npm run typecheck` | Script PASS |
| F5 | P2 | Dead unused BusinessesCTA / parallax CTA modules | Removed confirmed-unused files | Build PASS |
| F6 | P2 | ScrollTrigger may go stale after client navigations | `SmoothScroll` refreshes ST on every pathname change | Build PASS |
| F7 | P2 | Contact section not in light header surface set (white CTA band) | Added `contact` to `LIGHT_SECTION_IDS` | Lint/build PASS |

### Open / flagged (not blindly rewritten)

| ID | Severity | Description | Notes |
| --- | --- | --- | --- |
| O1 | **P1** | Public CTA copy still says **“Editorial proposal”** and **“This prototype does not submit a form.”** (`site-content.ts` contact) | Flagged for **content approval** before launch. Not auto-rewritten (copy rule). |
| O2 | P2 | No Open Graph / Twitter share image configured | Add approved OG asset + metadata |
| O3 | P2 | Large media in repo (`public/videos/*`, capability PNGs, Assets duplicates) | Consider CDN / compression; GitHub push may be slow |
| O4 | P2 | `robots.txt` Sitemap host uses `redseaintl.com` | Confirm production hostname before go-live |
| O5 | P3 | Dev-only moderate `npm audit` findings under ESLint toolchain | Monitor; avoid `--force` |
| O6 | P3 | Manual responsive / a11y / Lighthouse / multi-browser QA incomplete | Required before claiming full readiness |

## 7. Files modified (this audit)

- `package.json` — added `typecheck`
- `src/components/layout/Header.tsx` — lint-safe state sync; contact light surface
- `src/components/navigation/ContactOverlay.tsx` — `registerCloseRef`
- `src/components/layout/SmoothScroll.tsx` — refresh ScrollTrigger on route change
- `public/robots.txt` — new
- `src/app/sitemap.ts` — new
- Deleted unused: `BusinessesCTA.tsx`, `cta/CTAContent.tsx`, `cta/Parallax*.tsx`
- `RSI_PRE_LAUNCH_QA_REPORT.md` — this report

## 8. Performance findings

- Production build compiles successfully with Cache Components + Partial Prefetching enabled.
- Hero + CTA videos are large; CTA uses `preload="auto"` (intentional for cinematic band). Below-fold Project Proof images use Next `Image` / AssetFrame.
- Capability/business PNGs in `public/images/rsi` are multi‑MB; recommend AVIF/WebP derivatives post-approval.
- **Lighthouse / CWV not measured in this session** — do not claim scores.

## 9. Accessibility findings

- Skip link present in `SiteShell`.
- Contact overlay has dialog semantics, Escape handling, focus restore (code review).
- Reduced-motion branches exist in Lenis, Project Proof, Capabilities, CTA, Delivery.
- **Needs manual verification:** focus order through header/mobile menu, contrast on video overlays, touch targets on vertical business cards.
- Project Proof / Capabilities storytelling remains scroll-dependent; reduced-motion fallbacks exist but should be smoke-tested on a real device.

## 10. Security findings

- No secrets in tracked source; `.env*` gitignored.
- External contact links use `rel="noopener noreferrer"`.
- Production dependency audit: **0** vulnerabilities.
- No user-generated form posts on-site (handoff to official site).

## 11. SEO findings

- Titles already match requested patterns:
  - Home: `Red Sea International | Modular Buildings & Integrated Services`
  - Businesses page title segment: `Our Businesses` → template → `Our Businesses | Red Sea International`
- Canonicals set on home + businesses.
- `robots: { index: true, follow: true }` in root layout.
- Sitemap + robots added.
- Missing OG image (O2).

## 12. Responsive results

Code uses shell gutters, `svh`, and desktop motion matchMedia gates (`DESKTOP_MOTION`).  
**Not visually verified** at 320–1920px in this session — classify as outstanding manual QA.

## 13. Animation verification (code-level)

- Single Lenis instance via `SmoothScroll` + `lenisRef`.
- GSAP contexts / `matchMedia` cleanup patterns used in Project Proof, Capabilities, CTA, Delivery.
- Route change now calls `ScrollTrigger.refresh()`.
- **Not re-validated** in browser for pin conflicts, reverse scrub, or stuck scroll after repeated `/` ↔ `/businesses` navigations.

## 14. Production build status

```
npm run lint       PASS
npm run typecheck  PASS
npm run build      PASS
```

Routes generated: `/`, `/businesses`, `/_not-found`, `/icon.svg`, `/sitemap.xml`.

## 15. Outstanding risks

1. Prototype CTA copy still user-visible (O1) — **content blocker for true production messaging**.
2. Incomplete real-browser / device matrix.
3. Heavy video/image payload for first-load markets.
4. Sitemap domain assumption vs actual deploy host.
5. Working tree has uncommitted audit fixes; branch was already **1 commit ahead** of `origin/main` (`Prepare RSI website for production launch`) before this audit’s local edits.

## 16. Recommended next actions

1. **Content:** Approve replacements for `contact.supportNote` / `contact.handoff` (remove “Editorial proposal” / “prototype”).
2. **Manual QA:** Home + Businesses on desktop + mobile; pin sections; contact overlay; external contact CTA.
3. **Media:** Add OG image; optionally compress videos / convert large PNGs.
4. **Confirm** production hostname in `robots.txt` / `metadataBase`.
5. Commit audit fixes when instructed; push only when approved.
6. Run `npm run start` and smoke the production server in a real browser.

---

## Release decision

### NOT READY FOR LAUNCH

**Reasons:**
- Public-facing prototype copy remains (P1 content approval item).
- Critical user journeys and cinematic scroll/video behavior were **not** fully verified in a real browser/device matrix during this audit.
- A successful production **build** alone is insufficient proof of launch readiness.

**Code health:** Lint, typecheck, and production build are green after audit fixes. No known P0 engineering build blockers remain in the static toolchain.
