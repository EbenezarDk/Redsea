# RSI Website Revamp — Cursor Master Implementation Prompt

## Your role and outcome
Act as an award-level creative director, UX designer, and senior frontend engineer. Build an original, production-quality, interactive corporate website prototype for **Red Sea International (RSI)**, website: https://redseaintl.com/.

**IMPLEMENT EXACTLY TWO ROUTES:** `/` (Homepage) and `/businesses` (Our Businesses). Do not implement an IFM landing page, individual division pages, project-detail pages, a blog, investor-relations pages, or careers pages. The client has supplied three reference documents: `RSI - Website Content - BD Input .docx`, `RSI-Corporate-Presentation 2026 (2).pdf`, and `RSI-INTEGRATED-FACILITIES-MANAGEMENT (2).pdf`. Inspect these if available in the workspace. The master website content document is the copy authority for the two target pages; the presentations are visual and factual supporting references.

**Creative thesis:** “Built for Progress. Designed for People.” Develop a striking original experience that expresses modular construction and a connected multi-business enterprise. The site must feel cinematic, architectural, assured, high-end, and human — not a standard construction template and not a clone of an existing awards site.

## Inspiration (conceptual, do not copy layouts/code/branding)
- https://www.awwwards.com/ — editorial hierarchy, immersive storytelling, premium motion.
- https://www.cssdesignawards.com/sites/insulae/49196/ — GSAP scroll reveal, parallax and typographic restraint in architecture.
- https://www.cssdesignawards.com/sites/interite/45972/ — unique but purposeful GSAP scrolling interactions.
- https://www.cssdesignawards.com/sites/aramco-the-birth-of-oil/47120/ — chapter-based cinematic scroll storytelling.
- https://www.cssawards.org/ — overall creativity, content, accessibility and execution benchmarks.

Do not include awards logos or claim RSI has won web awards. The visual direction is award-inspired, not derivative.

## Technology and implementation rules
1. Next.js (App Router), React, TypeScript, Tailwind CSS. Use the latest mutually compatible stable versions available in the environment.
2. GSAP + ScrollTrigger for primary scroll-linked movement. Optionally use Lenis for smooth scrolling on devices that benefit, integrated cleanly with ScrollTrigger. Do not combine competing scroll systems or hijack touch scrolling. Avoid excessive dependencies.
3. Implement real GSAP animations, not inert CSS classes or pseudo-code. Register plugins once; use `gsap.context()` / robust cleanup in React, respect hydration and resize; scope selectors with component refs.
4. Use `next/image` for optimized approved imagery, sensible `sizes`, responsive image crops, lazy load below the fold, priority for LCP image. Use locally stored assets in `/public/images/rsi/` and `/public/video/` when approved; create gracefully styled visual placeholders only when assets are unavailable. Never substitute unrelated third-party images as actual RSI projects.
5. Use exact official RSI logo assets when available, extract colors from brand assets rather than treating proposed hex codes as official. Working visual palette: RSI red approximately #D71932 (verify against artwork), charcoal #161616, graphite #2A2A2A, white #FFFFFF, warm off-white #F6F4F1, neutral gray #777777. Elegant condensed display type and legible body font; only use properly licensed fonts.
6. Mobile-first responsive design. Breakpoints for 375, 768, 1024, 1440, and 1920 px. No horizontal overflow. Avoid text clipping and layout shifts.
7. Honor `prefers-reduced-motion`: disable scrub/pin/parallax and show readable, immediately available content. Disable heavy interactions on low-power mobile; provide static visuals as fallback. All interactive cards must support keyboard and touch.
8. Semantic HTML, one H1 per page, logical H2/H3 hierarchy, visible focus indicators, skip link, minimum adequate contrast, accessible hover alternatives, descriptive image alt text, focus management in menu, WCAG-conscious design.
9. Performance first: animate transforms/opacity, not layout properties; cap image and video sizes, minimize ScrollTrigger pinning, clean up animations, avoid accidental stacked pin offsets and excessive scroll lengths. Avoid unnecessary WebGL. Target smooth animation on mid-range laptops and practical Lighthouse performance/accessibility results.
10. SEO: proper metadata, Open Graph placeholders (do not invent approved media), descriptive titles, canonical plan, responsive images, organization structured data ONLY with verified factual fields.
11. Make the contact CTA work without inventing an API or mailbox: use a verified existing official contact URL if established, otherwise link to a plainly labeled on-page contact handoff section with approved contact details pending. Do not create a fake submitted/successful lead form.
12. Do not fabricate client contracts, certifications, workforce counts, financial metrics, project outcomes, active status, or copyrighted image usage permissions.

## Shared design system
- 12-column desktop grid, maximum container width around 1440px, generous horizontal margins.
- Headlines should be bold, editorial and architectural: 80–110px desktop hero where viewport allows, fluid typography with `clamp`, body 16–19px.
- Borders should feel precise, like construction drawings: 1px hairlines, thin geometric strokes, minimal corner rounding. Do not make generic glassmorphic or neon gradient UI.
- Motion rhythm: immediate hero, measured reveal in About, story-driven pinned Capabilities, cinematic business/proof chapters, calm final CTA. Reuse a restrained vocabulary (mask reveal, stagger, scale/parallax, line drawing, controlled image wipes).
- Navigation: approved logo, About RSI (home `/#about`), Our Businesses (`/businesses`), Projects (`/#projects`), Contact (`/#contact`). The longer proposed navigation in the master mentions Sustainability/QHSE, Investor Relations and Careers. These are separate future workstreams: display only if pointing to independently verified existing official destinations; never create dummy routes or fictitious data. Sticky transparent-on-hero navbar changes to solid on scroll. Add accessible mobile menu.
- Shared footer on both pages: RSI logo, approved brand statement, working internal routes/anchors and verified existing official legal/contact links only; a large ghost wordmark and subtle animation. Copyright year may use actual current year dynamically. Do not fabricate social URLs or postal addresses.

# PAGE ONE — Homepage `/`

Build exactly seven primary content sections followed by the shared footer: Hero, About, Capabilities, Businesses, Project Proof, Sectors, CTA, Footer. Treat source copy below as the authoritative starting point. Proposed display micro-headings may be inserted without altering factual content.

## 1. Hero (`#top`)
Eyebrow: `RED SEA INTERNATIONAL`
H1: `Built for Progress. Designed for People.`
Body: `From modular buildings and workforce accommodation to integrated facilities management, catering and infrastructure services, Red Sea International brings together complementary capabilities to deliver and operate the places where people live and work.`
CTAs: `Explore Our Businesses` -> `/businesses`; `View Our Experience` -> `/#projects`.
Visual: immersive, real RSI camp/factory/facility wide photo or approved drone footage from the corporate presentation; dark gradient for legibility.
Animation: a 100vh cinematic opening, masked two-line text reveal, ambient image drift; scrub a 2–3 viewport transition from full-bleed project image to a geometric modular frame. One discreet scroll indicator; do NOT force a heavy 3D scene, auto-play sound or obstruct the CTA.

## 2. About (`#about`)
H2: `One Group. Integrated Capabilities.`
Body: `Established in 1967 and listed on the Saudi Exchange since 2006, Red Sea International (RSI) is a Saudi company delivering modular building solutions, workforce accommodation, integrated facility management and associated services. The Group supports clients across energy, mining, infrastructure, construction and other demanding environments, bringing together manufacturing, project delivery and ongoing operations.`
Support: `Our experience extends across more than 65 countries, with a track record in temporary and permanent facilities for diverse industries.`
CTA: `Discover RSI` -> relevant local section or verified official existing page; not a fake route.
Approved factual stat labels: `1967 — Established`; `2006 — Listed on Saudi Exchange`; `65+ — Countries of experience`.
Layout: asymmetric editorial copy left, two vertically staggered images right, stats on architectural baseline. Scroll parallax images 10–15% offset, copy mask reveals and staggered stats; no count animation that misleadingly implies real-time data.

## 3. Capabilities (`#capabilities`)
Proposed display heading: `Connected Capabilities. One Delivery Vision.`
Four pillars with EXACT copy:
- `Design & Manufacture` — `Factory-produced modular solutions for accommodation, offices, hospitality and other facilities.`
- `Build & Deliver` — `Integrated planning, installation and project delivery for temporary and permanent infrastructure.`
- `Operate & Maintain` — `Hard and soft FM, accommodation operations, catering, hospitality and life-support services.`
- `Partner & Invest` — `Collaboration and investment opportunities that support long-term client and market needs.`
Motion: a scroll-pinned story panel (desktop only) with 4 active states, each title retains clear readability and shows a relevant approved image. Use ScrollTrigger scrub with progress mapping, progress markers, and an accessible click-to-select equivalent. Use a simple stacked layout on mobile and reduced motion.

## 4. Our Businesses Preview (`#businesses`)
Proposed heading: `Five Businesses. One Connected Group.`
Intro: `Five specialist business areas work together to respond to diverse project requirements.`
Cards with exact source descriptions:
1. `Red Sea Housing Services` — `Modular construction, temporary facilities and permanent building solutions.`
2. `RSI Facilities Management` — `Hard and soft FM, catering, hospitality and camp operations.`
3. `First Fix | MEP Contracting` — `Mechanical, electrical, plumbing and infrastructure delivery.`
4. `Real Estate Development` — `Hospitality, residential and commercial development opportunities.`
5. `Specialized Investment` — `Strategic investments, acquisitions and partnerships.`
All five cards navigate to `/businesses#housing`, `/businesses#facilities`, `/businesses#first-fix`, `/businesses#real-estate`, `/businesses#investment` (anchors, not unimplemented pages).
Motion: bold horizontal gallery that translates with a scrubbed scroll on desktop while preserving usable native scroll; cards reveal images, title and number. Avoid an awkward or inaccessible forced horizontal-only scroll.

## 5. Project Proof (`#projects`)
H2: `Experience Where It Matters`
Body: `Our teams support major clients in oil and gas, mining, construction, infrastructure, government and remote-site operations. We combine facilities, services and operational knowledge to help clients mobilize efficiently and maintain dependable site performance.`
Exactly four featured references:
- `Webuild — Trojena` — workforce accommodation and support services; approved imagery candidate: RSI IFM PDF pages 11–12.
- `Ma’aden — Turaif` — camp operations; candidate: RSI IFM PDF page 13.
- `Baker Hughes — Rig Camps` — rig camp supply and operations; candidate: RSI IFM PDF page 14.
- `Red Sea Global — Construction Village` — integrated accommodation and operations; candidate: RSI IFM PDF page 15.
Motion: immersive pinned project viewer on desktop, project title and short description on one side and masked full-bleed photographic scene on the other. Scroll-scrub through 4 projects, with active index 01/04 ... 04/04. Provide click controls and basic stacked cards on mobile. DO NOT display invented outcome numbers, current contract status or permission-dependent client logos without approval.

## 6. Sectors (`#sectors`)
Proposed heading: `Built for Demanding Environments.`
Sectors derived from the homepage source: `Oil & Gas`, `Mining`, `Construction`, `Infrastructure`, `Government`, `Remote-Site Operations`.
Motion: responsive 3x2 tile grid, restrained image zoom or image reveal on hover/focus, precise red marker lines. If suitable approved imagery is unavailable, use editorial type-only tiles rather than misleading photos.

## 7. CTA (`#contact`)
H2: `Let’s Build the Right Solution`
CTA label: `Contact RSI`
Optional supporting line clearly identified as editorial proposal: `Connect with Red Sea International to discuss your project requirements.`
Visual: dark full-width panel with RSI red architectural geometry; subtle shape expansion and accessible contact action. Reuse the same contact resolution approach on Businesses page.

# PAGE TWO — Our Businesses `/businesses`

Build five primary sections followed by the SAME shared footer: Intro, Five Vertical Cards, Services Overview, Integrated Delivery, CTA, Footer.

## 1. Intro
Eyebrow: `OUR BUSINESSES`
H1: `Five Businesses. One Integrated Approach.`
Body: `Red Sea International combines specialized businesses across modular construction, facilities management, MEP contracting, real estate and investment. Our integrated model enables clients to access complementary solutions throughout the facility lifecycle—from early planning and manufacturing to operation, maintenance and long-term development.`
Visual: dark editorial hero with a thin red animated architectural line connecting into the five vertical cards.

## 2. Five Vertical Business Cards — SIGNATURE SECTION
At 1440px desktop, present FIVE tall adjacent vertical photographic panels across almost the full content width. Each has number, division name, image and an explicit expand control. Default state shows all five titles (vertical/rotated where necessary). Active state expands one panel to approx 36–44% of available width and compresses others while keeping all panel titles discoverable. Smooth `flex-basis`/CSS grid interpolation is optional, but ensure animation remains performant. Provide click, hover, keyboard focus and touch input. Do not hide important information behind hover only. Card active state shows EXACT body and tags as follows:

Card 01 (`#housing`)
Title: `Red Sea Housing Services`
Body: `We design and manufacture modular building systems for workforce accommodation, offices, hospitality and a range of temporary and permanent uses.`
Tags: `Modular construction`, `Workforce accommodation`, `Temporary facilities`, `Permanent buildings`.

Card 02 (`#facilities`)
Title: `RSI Facilities Management`
Body: `We support daily facility performance and occupant wellbeing through technical maintenance, soft services, catering, hospitality and integrated camp management.`
Tags: `Hard FM`, `Soft FM`, `Catering`, `Camp management`, `Life support`.

Card 03 (`#first-fix`)
Title: `First Fix | MEP Contracting`
Body: `Our MEP and infrastructure capabilities support complex building systems and integrated project delivery.`
Tags: `Mechanical works`, `Electrical works`, `Plumbing`, `Infrastructure`, `Turnkey projects`.

Card 04 (`#real-estate`)
Title: `Real Estate Development`
Body: `Our development activities focus on opportunities in hospitality, residential and commercial facilities.`
Tags: `Hospitality`, `Residential`, `Commercial`.

Card 05 (`#investment`)
Title: `Specialized Investment`
Body: `We evaluate investment and partnership opportunities aligned with the Group’s capabilities and long-term direction.`
Tags: `Investments`, `M&A`, `Strategic partnerships`.

Each card's source CTA label is `Explore This Business`. Since only two pages are approved, DO NOT navigate to a fake division page; the button may scroll to the related services detail in Section 3 or be marked 'Business page to follow' in an obviously non-actionable prototype state. For better usability, prefer working in-page services anchors and the existing content. On mobile use a vertical stack of five clickable full-width expandable photo cards, no forced horizontal navigation.

## 3. Services Overview
This is a NEW VISUAL ORGANIZATION of already supplied division tags, not a new factual claims section.
Proposed H2: `Specialist Services. Connected Expertise.`
Five selectable categories with only established labels:
- `Modular & Building Solutions`: Modular construction, workforce accommodation, temporary facilities, permanent buildings.
- `Facilities & Operations`: Hard FM, Soft FM, catering, camp management, life support.
- `MEP & Infrastructure`: Mechanical works, electrical works, plumbing, infrastructure, turnkey projects.
- `Real Estate Development`: Hospitality, residential, commercial.
- `Investment & Partnerships`: Investments, M&A, strategic partnerships.
Design as a spacious services selector and large associated image panel. Use scroll-linked active state on desktop plus explicit tablist keyboard operation; simple accessible accordion/tabs on mobile. No unsupported new service claims.

## 4. Integrated Delivery
H2: `Connected Expertise Across the Facility Lifecycle`
Body: `From modular manufacturing and project construction to catering, maintenance and site operations, RSI’s business areas can collaborate to address requirements that span multiple disciplines. Engagement models are tailored to each client, location and scope.`
Motion: scroll-scrubbed architectural lifecycle with `Design -> Build -> Operate -> Maintain` phases; this is a visual metaphor only, not a promise that RSI supplies all phases on every contract. Use an SVG/vector line drawing or layered photo/illustration; show working fallback for reduced motion. Highlight collaboration across divisions; no unsupported metrics.

## 5. CTA
CTA labels: `Discuss Your Project` and `Contact Our Team`.
Use the exact shared CTA and footer system. Route to verified official contact destination or the existing `/#contact` handoff anchor. Do not add invented contact details or a nonfunctional form.

# Image and asset plan
- Hero: approved RSI project aerial / modular camp / factory imagery; corporate presentation may contain factory images.
- About: RSI factory or workers-site photography from corporate presentation.
- Capabilities: real modular production, delivery, technical operations and approved investment-appropriate imagery; if none, abstract modular patterns are acceptable.
- Five cards: authentic corresponding division images, not irrelevant stock imagery attributed to RSI.
- Proof: IFM PDF pages 11–12 (Webuild/Trojena), 13 (Ma'aden/Turaif), 14 (rig camps), 15 (Red Sea Global Construction Village).
- Keep asset mapping in `/src/data/assets.ts` with comments `APPROVAL_REQUIRED` until permissions verified. Use `/public/images/rsi/placeholder-*` aesthetic gradient/color panels with informative alt text only if no permissioned photograph exists.
- Do not embed source PDFs as page content. Do not treat third-party illustrative imagery as RSI-owned media.

# Recommended frontend component plan
`src/app/layout.tsx`
`src/app/page.tsx`
`src/app/businesses/page.tsx`
`src/app/globals.css`
`src/components/layout/Header.tsx`
`src/components/layout/Footer.tsx`
`src/components/layout/PageTransition.tsx` (only if performant)
`src/components/sections/Hero.tsx`
`src/components/sections/About.tsx`
`src/components/sections/Capabilities.tsx`
`src/components/sections/BusinessPreview.tsx`
`src/components/sections/ProjectProof.tsx`
`src/components/sections/Sectors.tsx`
`src/components/sections/CTA.tsx`
`src/components/businesses/BusinessesHero.tsx`
`src/components/businesses/VerticalBusinessCards.tsx`
`src/components/businesses/ServicesOverview.tsx`
`src/components/businesses/IntegratedDelivery.tsx`
`src/components/motion/ScrollScene.tsx`
`src/components/motion/RevealText.tsx`
`src/components/ui/Button.tsx`
`src/data/site-content.ts`
`src/data/assets.ts`
`src/lib/motion.ts`
`src/hooks/useReducedMotion.ts`

Prefer data-driven service and business components, with all approved copy in one typed object rather than scattered strings. Keep markup minimal and manage animation cleanup correctly.

# Motion choreography (specific acceptance requirements)
A. Hero: 100vh, image zoom 1.0 -> 1.12, text reveal, subtle image/copy separation. No flash/flicker on hydration.
B. About: left sticky editorial headline, right offset image parallax and stat fade.
C. Capabilities: four clear active phases with scroll progress and click fallback; no overlapping unreadable text.
D. Home Businesses: sequential image/card storytelling as scroll moves; each card links to the corresponding `/businesses#...` anchor.
E. Project Proof: four scrubbed image-mask changes with project title transitions and progress UI.
F. Sectors: calm hover/focus interactions with no heavy pinning.
G. Business vertical cards: smooth hover/focus/click expand, accessible touch behavior, scroll-based active selection optional, never fighting user input.
H. Services: selection controls and synchronized visual panel.
I. Integrated Delivery: a coherent scroll-scrubbed lifecycle illustration with legible step labels.
J. Footer: only subtle reveal motion.

Ensure each pinned story has adequate scroll length but avoid stacking huge blank scroll spacers. On reduced motion use instant transitions or none. Avoid videos unless approved assets exist; use poster fallback and don't force autoplay with sound.

# SEO copy (provided in master)
Homepage title: `Red Sea International | Modular Buildings & Integrated Services`
Homepage description: `Explore Red Sea International’s modular construction, workforce accommodation, facilities management and integrated service capabilities.`
Businesses title: `Our Businesses | Red Sea International`
Businesses description: `Discover RSI’s business divisions across modular housing, facilities management, MEP, real estate development and specialized investment.`

# Implementation workflow
1. Inspect existing repository. If it's empty, scaffold the project. Inspect package versions and configure fonts, Tailwind, routes, and a development script.
2. Build responsive static wireframes for both routes with the correct text and authentic media placeholders. Implement navigation, anchors, hero and footer first.
3. Implement the data-driven five businesses and four project references, ensuring all copy matches this prompt. Build the service selector and integrated lifecycle.
4. Add GSAP/ScrollTrigger choreography in discrete, cleanly unmounted components; prevent hydration issues and horizontal overflow.
5. Add reduced-motion/touch/mobile/keyboard fallbacks. Test both pages at 375, 768, 1024, 1440px.
6. Run lint/typecheck/build; fix errors. Verify internal routes and anchors. Check for hydration errors, broken links, no images (when placeholders intentionally used), ScrollTrigger pin jumps and layout shift.
7. Polish transitions, spacing, responsive typography and performance. Ensure no content disappears when JavaScript animations fail.
8. Finish with a concise README: install/run commands, route list, assets required, permissions to verify, any nonfunctional external destinations intentionally withheld, performance notes and places to replace content.

# Critical acceptance checklist
- Exactly two implemented routes: `/` and `/businesses`.
- Homepage order: Hero > About > Capabilities > Businesses > Project Proof > Sectors > CTA > Footer.
- Businesses order: Intro > 5 Vertical Cards > Services > Integrated Delivery > CTA > identical Footer.
- Real scroll-scrubbed and parallax effects, not mock interactions; transitions retain readability.
- Five correct RSI divisions, four correct featured projects, four correct capability pillars.
- Original editable UI design; no copied site templates, generic stock credited to RSI, or misleading project facts.
- Both pages usable at all standard screen sizes and with reduced motion.
- No broken CTAs, fake routes, placeholder employment/regulatory data or unverified accreditation badges.
- Source website copy preserved; newly added headlines/microcopy clearly editorial.

Start implementing in the current Cursor workspace rather than replying with only an outline. Show real working code and all files. If important source assets are missing, build clean placeholders, record exact required assets, and continue implementing the site without blocking.
