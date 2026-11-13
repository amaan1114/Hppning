---
version: 1
name: happning
description: "Grey-white ground, deep green accent, Instrument Sans. Tonal surfaces mixed from the accent, hairline rings, no drop shadows."
colors:
  background: "#F8F8F8"
  surface: "#FFFFFF"
  surface-container-low: "#E8EAE9"
  surface-container: "#E0E5E1"
  surface-container-high: "#CDD9D1"
  on-surface: "#2A2A2A"
  on-surface-strong: "#0A0A0A"
  on-surface-variant: "#6A6A6A"
  outline: "#D1D1D1"
  outline-variant: "#A7A7A7"
  primary: "#1F6B3A"
  on-primary: "#FFFFFF"
  secondary: "#18532D"
  tertiary: "#0A2213"
  overlay: "#00000033"
  danger: "#B3261E"
typography:
  headline-display:
    fontFamily: Instrument Sans
    fontSize: 34px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.036em
  headline-lg:
    fontFamily: Instrument Sans
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: -0.028em
  body-lg:
    fontFamily: Instrument Sans
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.4
  body-md:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 400
  label-md:
    fontFamily: Instrument Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
  label-sm:
    fontFamily: Instrument Sans
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.3
  headline-display-mobile:
    fontFamily: Instrument Sans
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.2
  headline-lg-mobile:
    fontFamily: Instrument Sans
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.4
rounded:
  xs: 12px
  sm: 16px
  md: 24px
  lg: 42px
  xl: 100px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 20px
  xl: 34px
  2xl: 48px
  3xl: 68px
  container: 1280px
  container-wide: 1600px
---

# happning Design System

## Overview

A campus event platform. The interface is light, on a grey-white ground
(**#F8F8F8**) with near-black text (**#0A0A0A**) and a **deep green (#1F6B3A)**
accent. Type is **Instrument Sans** throughout.

The palette is taste-skill's `mint-pink-accounts`, dealt for a software product.
Its ground, surface, ink, muted and accent are as dealt; the three tonal steps,
the two outlines, the hover green and the deep green-black are mixed from the
accent so every surface sits in the same hue family.

Depth comes from tonal steps and hairline rings, never drop shadows.

## Colours

- **#F8F8F8** — the page ground. Token `background`.
- **#FFFFFF** — cards and sheets, which lift above the ground. Token `surface`.
- **#E8EAE9 → #E0E5E1 → #CDD9D1** — tonal steps for panels, fills and pressed
  states. Tokens `surface-container-low`, `surface-container`,
  `surface-container-high`. Each is the dealt surface with 3%, 7% and 16% of the
  accent mixed in.
- **#0A0A0A / #2A2A2A / #6A6A6A** — three text levels: headings, body, muted.
  Tokens `on-surface-strong`, `on-surface`, `on-surface-variant`.
- **#D1D1D1 / #A7A7A7** — borders and dividers. Tokens `outline`, `outline-variant`.
- **#1F6B3A** — primary actions and key highlights. Token `primary`.
- **#18532D** — the hover and pressed state of a primary action. Token `secondary`.
- **#0A2213** — the deep closing band, the wordmark and the darkest tile.
  Token `tertiary`.
- **#B3261E** — error messages only. Token `danger`.

Every pairing the app uses clears WCAG AA:

| pairing | ratio |
| --- | --- |
| heading on ground | 18.64 |
| body on ground | 13.52 |
| muted on ground | 5.09 |
| accent on ground | 6.14 |
| accent on container-low | 5.39 |
| white on accent | 6.52 |
| white on secondary | 9.08 |
| white on tertiary | 16.78 |
| danger on ground | 6.15 |

## Typography

**Instrument Sans** carries the whole interface, loaded through `next/font/google`
and exposed as `--font-instrument`. Fallback: `system-ui, sans-serif`.

Display weight is 500, not 600, with negative tracking: -0.036em at display size
and -0.028em on section headings. Body text is 400, labels and buttons 500.

- **headline-display:** 34px / 500 / 1.2, tracking -0.036em (20px on mobile).
- **headline-lg:** 20px / 500 / 1.4, tracking -0.028em (16px on mobile).
- **body-lg:** 18px / 400 / 1.4. Lead paragraphs.
- **body-md:** 14px / 400. Body text.
- **label-md:** 14px / 500 / 1.3. Buttons and nav.
- **label-sm:** 12px / 400 / 1.3. Small labels and metadata. This is the floor
  for anything a reader reads; 10px is for badges only.

## Layout

- **Scale:** xs 4, sm 8, md 16, lg 20, xl 34, 2xl 48, 3xl 68. All on the 4px grid.
- **Container:** content caps at 1280px. 1600px is for the nav bar only.
- **Widths:** 1440, 1024, 768, 390.
- Grids that hold cards reflow with `repeat(auto-fill, minmax(280px, 1fr))` so a
  fourth card joins the row instead of stranding.
- Every grid track is `minmax(0, …)`; display heads carry `overflow-wrap:
  break-word` and `min-width: 0`.

## Elevation & Depth

No drop shadows. Layers separate by tonal step
(#FFFFFF → #E8EAE9 → #E0E5E1 → #CDD9D1) and by hairline ring:

- `box-shadow: inset 0 0 0 1px #D1D1D1`

## Shapes

16px is the default corner. 12px on small controls, 24px on cards, 42px on large
sheets and tiles, 100px on pills and buttons.

## Motion

0.2s and 0.3s, `ease` and `ease-in-out`. Never `transition: all`; never animate
`width`, `height`, `top` or `left`. Every animation has a
`prefers-reduced-motion: reduce` fallback.

## Do's and Don'ts

- Do keep the ground #F8F8F8 and lift cards to #FFFFFF; step down to the tonal
  greens for panels and fills.
- Do keep text in three levels: #0A0A0A, #2A2A2A, #6A6A6A.
- Do reserve #1F6B3A for primary actions, titles and key highlights.
- Don't use #1F6B3A for body text or for a large background; the deep #0A2213 is
  the colour for a full-bleed dark band.
- Don't add drop shadows; use hairline rings and tonal surfaces.
- Don't introduce a font beyond Instrument Sans.
- Don't set an eyebrow above a heading, or a label in tracked capitals.
- Don't let a transition run longer than 0.3s.
