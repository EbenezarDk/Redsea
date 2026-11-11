# Red Sea International — website prototype

Cinematic prototype of the RSI site. Two routes only: the homepage and Our Businesses.

Copy follows `RSI reference documents/RSI_Cursor_Master_Prompt.md`. The three source files named in that prompt (website content document, corporate presentation, IFM presentation) were not in this workspace, so no additional facts were taken from them.

## Run

```bash
npm install
npm run dev
```

Production check:

```bash
npm run lint
npm run build
npm start
```

## Routes

- `/` — Hero, About, Capabilities, Businesses, Project Proof, Sectors, Contact, Footer
- `/businesses` — Intro, five vertical businesses, services, integrated delivery, contact, the same footer

Anchors on `/businesses`: `#housing`, `#facilities`, `#first-fix`, `#real-estate`, `#investment`, plus `#service-modular`, `#service-facilities`, `#service-mep`, `#service-real-estate`, `#service-investment`.

## Contact

`Contact RSI` and `Contact Our Team` open the verified official page [https://redseaintl.com/contact-us](https://redseaintl.com/contact-us). There is no lead form. `Discuss Your Project` returns to the homepage contact handoff.

## Assets to replace

Photography and video were not supplied. Sections use original modular studies (vector drawings), not photographs of RSI projects. Each study is mapped in `src/data/assets.ts` with `APPROVAL_REQUIRED` and an `intendedSrc` under `/public/images/rsi/`. Set `src` on a record to that approved file and the frame will use `next/image`.

Do not drop unrelated stock into those paths and describe it as an RSI project. The working red `#D71932` is the palette from the master prompt; confirm it against official artwork before treating it as a brand lockup. The header mark is a typographic placeholder, not the official logo — replace `src/components/ui/Logo.tsx` when the logo file is approved.

## Intentionally omitted

No extra routes were created. Social profiles, postal addresses, phone numbers, careers, investor relations, sustainability, and legal pages are not linked because they were not part of the approved page copy. Division pages are not built; “Explore This Business” moves to the matching services block on this page.

## Motion and performance

GSAP ScrollTrigger drives the hero transition, about-image parallax, capabilities story, business gallery, project wipes, and the lifecycle line. Lenis smooths wheel scrolling only for fine pointers at 1024px and up, and only when the user has not requested reduced motion or data saver. Touch scrolling stays native.

`prefers-reduced-motion` removes pinning, scrubbing, and parallax. Those stories fall back to a stacked reading layout. Pinned scenes are also skipped for coarse pointers so a trackpad or mouse desktop gets the cinematic sequence and touch screens keep the stack.

Animate transforms and opacity. The business-card expand is the exception: it transitions `flex-grow` so one panel can widen while the others stay labelled.
