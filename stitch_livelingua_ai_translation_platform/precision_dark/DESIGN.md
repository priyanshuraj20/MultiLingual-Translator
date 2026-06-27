---
name: Precision Dark
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c5d8'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e90a1'
  outline-variant: '#444655'
  surface-tint: '#b9c3ff'
  primary: '#b9c3ff'
  on-primary: '#00228b'
  primary-container: '#2f54eb'
  on-primary-container: '#dee1ff'
  inverse-primary: '#254ce4'
  secondary: '#c6c6c7'
  on-secondary: '#2f3131'
  secondary-container: '#454747'
  on-secondary-container: '#b4b5b5'
  tertiary: '#ffb59a'
  on-tertiary: '#5b1b00'
  tertiary-container: '#b33d00'
  on-tertiary-container: '#ffdbcf'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001257'
  on-primary-fixed-variant: '#0033c2'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#454747'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802900'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system shifts from an atmospheric, "vibe-coded" aesthetic to a disciplined, technical, and high-contrast dark mode environment. The core personality is focused, efficient, and precise, targeting users who value clarity and performance over decorative flair.

The style is rooted in **Minimalism** with a **Functional/Technical** edge. It prioritizes information density and legibility through:
- **High-Contrast Surfaces:** Utilizing deep blacks and high-transparency grays to create a sense of infinite depth without the use of glows.
- **Micro-Precision:** Every element is aligned to a rigorous grid, using hairline borders and sharp edges to define space.
- **Functional Color:** Color is stripped of its decorative role and used exclusively to signal action, state changes, or status.

## Colors

The palette is strictly functional. The background is a pure black (#000000) to ensure maximum contrast and energy efficiency on OLED displays. 

- **Primary (#2f54eb):** Reserved strictly for active states, primary call-to-actions, and success indicators. It should never be used as a gradient or a glow.
- **Surface & Borders:** UI containers use a hairline border (#ffffff1a) rather than solid fills to maintain a lightweight feel. 
- **Typography:** Pure white (#ffffff) for primary content and a muted zinc (#a1a1aa) for secondary metadata to create a clear information hierarchy.

## Typography

This design system utilizes **Geist** exclusively to achieve a technical, developer-centric aesthetic. 

- **Tight Tracking:** Headlines use negative letter-spacing to create a "locked-in" visual density. 
- **Vertical Rhythm:** Line heights are strictly controlled to ensure blocks of text feel structured and intentional.
- **Labels:** Small labels and metadata are often set in uppercase with increased letter-spacing to provide a distinct contrast from body copy.

## Layout & Spacing

A rigorous **4px/8px grid system** governs all spatial relationships. Every padding, margin, and height value must be a multiple of 4.

- **Grid:** A 12-column fluid grid is used for desktop, collapsing to 4 columns for mobile. 
- **Containers:** Content is housed in "Cells" defined by 1px borders rather than expansive cards.
- **Density:** Spacing is kept tight to maximize information visibility, favoring smaller gaps (8px or 16px) over large, airy voids.

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Borders**, not shadows. 

- **Flat Philosophy:** Elements do not "float" with blurred shadows. Instead, elevated elements (like modals) use a slightly lighter fill (#0a0a0a) and a crisp white border at 15-20% opacity.
- **Hairline Outlines:** 1px borders define the perimeter of all interactive and structural elements. 
- **Zero Blur:** Avoid backdrop blurs or glassmorphism. Surfaces are opaque or use simple alpha-transparency without diffusion.

## Shapes

The shape language is conservative and structural. While the default is 8px (`rounded-md`), the visual intent is to appear "sharp-adjacent." 

- **Components:** Buttons and input fields use a consistent 8px radius.
- **Layout:** Structural containers or large sections may use 0px (sharp) corners to reinforce the grid-based, technical feel.

## Components

### Buttons
- **Primary:** Solid #2f54eb background with white text. No gradients. 8px corner radius.
- **Secondary:** Transparent background with a #ffffff1a border. Text is white.
- **States:** Hover states should involve a simple opacity shift or a slight brightness increase in the border color.

### Cards & Containers
- Replace traditional shadowed cards with "Cells."
- **Styling:** Transparent or #050505 background, 1px border (#ffffff1a). No external shadows.

### Input Fields
- Dark backgrounds (#0a0a0a), 1px border (#ffffff1a).
- Focus state: Border changes to #2f54eb. 
- Typography: 14px Geist for input text.

### Chips & Tags
- Small, rectangular with 4px radius. 
- Subtle fill (#ffffff0d) with uppercase 10px or 12px Geist labels.

### Lists
- Separated by 1px horizontal rules (#ffffff10). 
- High-contrast icons (white) and muted secondary text (zinc-400).