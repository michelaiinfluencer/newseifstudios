# Design brief — Seif Studios (seifstudios.com)

## Design read
For brand and marketing decision-makers evaluating a creative AI studio: the site
must feel like sitting in a dark screening room while expensive work is projected,
awe with total control, zero template smell.

## Concept spine
**The studio as a projection room.** The page is a dark theatre: the hero is a film
the visitor's scroll projects, work planes ignite like screens as you approach,
and one red signal light (the "record" lamp) threads every section. Red is never
decoration; it always means "live".

## Delivery tier
**spectacle** (user-mandated: lusion.co register). Lenis + GSAP ScrollTrigger
bridge, Tier-1 scroll-scrubbed hero, WebGL second beat, custom cursor, intro
loader. Everything reduced-motion-gated, SSR-safe.

## Locked palette (user's explicit brand, overrides default bans)
- `#000000` background (brand-locked pure black; the projection room)
- `#ffffff` primary text
- `#ff0000` single accent (record light) / `#dc0000` hover
- Grays: `#a1a1a6` muted, `#6e6e73` captions, `#1d1d1f` surfaces/hairlines
Defense: monochrome void lets the AI-generated work carry all color; one
saturated red is the entire identity. No second accent anywhere.

## Locked type (user's explicit brand)
- Display + body: **Inter** (user-locked; tight tracking -2 to -4px on display,
  fluid `clamp(2.5rem, 7vw, 5.5rem)`)
- Labels / pills / marquee / numerals: system mono stack (`ui-monospace, SF Mono,
  Menlo, Monaco`), uppercase only on the two budgeted eyebrows

## Tier-1 technique
**A1 — single-shot hero scrub** ("Liquid Light Ribbon"): a ~5s generated film of
a red liquid-light ribbon unfurling in black void, ffmpeg'd to ~100 frames,
canvas-scrubbed by the pinned hero's scroll progress. Defense: it IS the spine,
the visitor's scroll is the projector; the studio's medium (AI film) is the
first thing they operate, not watch.
**Second beat (different family): C1 — displacement/liquid hover** on the Work
galleries: images/videos on WebGL planes that ripple under the cursor.
**Custom cursor** (spectacle contract): small dot + trailing ring, magnetic on
nav links and CTAs, grows to "view" over work planes. Touch: disabled.
Anti-convergence: first build in this chat; all six axes derived from the
brand's material world (projector light, black glass, signal lamps).

## Section plan (single page; 6 sections, 5 distinct families, ≤2 eyebrows)
1. **Hero** — image-as-canvas full-bleed scrub film, text bottom-left over it
   (eyebrow #1: positioning line with blinking red dot). Bottom mono marquee.
   Family: cinematic full-bleed.
2. **Work** — 7 category chapters, staggered masonry of WebGL media planes,
   thin captions + mono format tags (eyebrow #2: "Our Work"). Closing band
   "Creative Without Limits". Family: gallery-led masonry.
3. **Services** — numbered full-width index rows (01–07), hairline dividers,
   hover reveals floating media + red title. Family: index/list rows.
4. **Process** — vertical timeline with thin red progress rail; 4 steps, then
   AI-stack strip on `#1d1d1f` surfaces, then Day 1→7 rail. Family: vertical
   rhythm timeline.
5. **Contact** — giant typographic statement "Let's Create" with oversized red
   period (the second-read moment), huge mono mailto link. Family: centered
   statement (used once).
6. **Footer** — minimal hairline bar. (No board needed.)
Composition anchors: bottom-left over image / top-left lead / stacked rows /
off-grid rail / centered statement. Hero is NOT left-text-right-image.

## Second-read moment
One oversized red period on "Let's Create." in Contact, structural scale.

## Asset plan
- User assets WIN (never regenerate): full work library (Image/, Video/) and
  logos (Logo/) copied from the user's local library into `public/assets/`,
  extensions normalized lowercase; head kit derived from `LogoSmallS.png`.
- Generate: hero still Candidate A (Liquid Light Ribbon, 2 takes, pick 1),
  seedance image-to-video scrub film from the chosen still (~5s, no cuts),
  OG card 1200×630 in brand language, 1 section transition texture plate
  (red-on-black light streaks) for the Work↔Services beat.
- Frames: `fps=20, scale=1280` → `public/frames/hero/*.webp`; frame 1 paints
  immediately (screenshot-safe); reduced-motion shows the final sharp frame.

## CTA inventory (one label per intent; bespoke garment per placement)
- **"Contact Us"** (single contact-intent label page-wide):
  - Hero: red pill, magnetic, `scale(0.98)` press
  - Work closing: oversized headline with small arrow-link garment
  - Process band: framed block button (hairline frame fills red on hover)
  - Nav: plain link with red underline sweep
- **"Inspire Me"** (scroll-to-work intent, hero only): underlined inline link
  with arrow, underline sweeps red
- **mailto** (Contact): giant mono underlined link, its own garment
Mobile degradation: shorter hero pin, C1 hover becomes scroll parallax, cursor
off on touch, masonry collapses to swipeable single column.

## Copy
Voice from the user's content bible (BUILD-BRIEF.md), confident and specific.
Zero em/en-dashes anywhere visible (bible lines are rewritten with commas,
colons, periods at build time). Headlines ≤8 words. Real service/tool names.
