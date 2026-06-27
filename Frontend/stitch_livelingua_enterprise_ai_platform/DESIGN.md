---
name: Obsidian Flux
colors:
  surface: '#15121b'
  surface-dim: '#15121b'
  surface-bright: '#3b3742'
  surface-container-lowest: '#0f0d15'
  surface-container-low: '#1d1a23'
  surface-container: '#211e27'
  surface-container-high: '#2c2832'
  surface-container-highest: '#37333d'
  on-surface: '#e7e0ed'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e7e0ed'
  inverse-on-surface: '#322f39'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#adc6ff'
  on-secondary: '#002e6a'
  secondary-container: '#0566d9'
  on-secondary-container: '#e6ecff'
  tertiary: '#ffb869'
  on-tertiary: '#482900'
  tertiary-container: '#ca801e'
  on-tertiary-container: '#3f2300'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdcbb'
  tertiary-fixed-dim: '#ffb869'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#673d00'
  background: '#15121b'
  on-background: '#e7e0ed'
  surface-variant: '#37333d'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  mono-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-safe: 32px
  container-max: 1200px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  section-gap: 80px
---

## Brand & Style

The design system embodies a premium, developer-centric aesthetic inspired by high-growth infrastructure and AI platforms. The visual narrative centers on "Precision through Darkness," utilizing a deep black foundation to eliminate visual noise and allow AI-generated content to command focus.

The style is a synthesis of **Minimalism** and **High-Contrast Digitalism**. It leverages the structural discipline of Linear and the typographic clarity of Vercel. The interface relies on hairline precision, strict geometric alignment, and a "less but better" philosophy. Emotional responses should range from perceived technical superiority to a sense of calm, professional efficiency.

Key stylistic pillars:
- **Absolute Blacks:** Using #000000 for primary backgrounds to create infinite depth.
- **Hairline Borders:** Defining structure through subtle contrast rather than shadows.
- **Intentional Friction:** High-impact accents are reserved strictly for primary actions and system-critical states.

## Colors

The palette is anchored in a monochromatic spectrum designed for high legibility in low-light environments. 

- **Foundation:** True Black (#000000) serves as the page root. Surface containers use Charcoal Grays (#0A0A0A, #111111) to create subtle hierarchical layers.
- **Accents:** Electric Purple (#8B5CF6) is the signature primary action color, symbolizing AI intelligence. Deep Blue (#3B82F6) is used for secondary utilities, links, and informational states.
- **Borders:** Hairline borders (#1F1F1F) are the primary method of element separation, ensuring the UI feels structured without becoming heavy.
- **Status:** Use standard high-saturation semantic colors for error (Red-500) and success (Green-500), but keep their footprint minimal.

## Typography

The typographic system utilizes **Geist** for headings and UI labels to provide a technical, monospaced-adjacent feel that resonates with developer audiences. **Inter** is utilized for body copy to ensure maximum readability for long-form AI transcripts and data.

- **Headlines:** Use tight letter spacing (-0.02em to -0.04em) for larger displays to create a "locked-in" editorial look.
- **Labels:** Use uppercase Geist with generous tracking (0.05em) for small metadata and section headers.
- **Contrast:** Maintain a strict hierarchy where headlines are pure white (#FFFFFF) and body text is muted zinc/gray (#A1A1AA) to reduce eye strain.

## Layout & Spacing

This design system follows a **Fixed-Fluid Hybrid** grid. The content is contained within a max-width of 1200px for readability, but background elements (like borders and headers) stretch to the viewport edges.

- **Grid:** A 12-column grid is standard for desktop, collapsing to 4 columns on mobile. 
- **Rhythm:** Spacing follows a 4px base unit. Generous white space (80px+ between sections) is mandatory to maintain the "premium" feel and avoid the cluttered appearance of traditional SaaS dashboards.
- **Margins:** Use 32px safe margins on tablet/desktop and 20px on mobile.
- **Alignment:** All elements must align to the baseline grid. Vertical spacing between related components (e.g., label and input) should be 8px (stack-sm).

## Elevation & Depth

Depth is conveyed through **Tonal Layering** and **Hairline Outlines** rather than traditional shadows.

- **Layer 0 (Base):** #000000. Used for the main canvas.
- **Layer 1 (Surface):** #0A0A0A with a 1px #1F1F1F solid border. Used for cards, sidebars, and input fields.
- **Layer 2 (Popovers):** #111111 with a 1px #2E2E2E border. Used for tooltips and dropdown menus.
- **Glassmorphism:** Only applied to navigation bars and sticky headers. Use a background blur of 12px and a 60% opacity on the surface color (#00000099).
- **Shadows:** Avoid shadows entirely, except for floating modals which may use a single, extremely diffused 40px black shadow with 0% spread to subtly lift it from the background.

## Shapes

The shape language is "Soft-Geometric." We use subtle rounding to prevent the interface from feeling aggressive or "brutalist," while maintaining the precision of a professional tool.

- **Standard Elements:** Buttons, inputs, and small cards use a 0.25rem (4px) radius.
- **Large Containers:** Large dashboard cards or modals use 0.5rem (8px).
- **Icons:** Use 24px bounding boxes with 1.5px or 2px stroke weights. Avoid filled icons unless indicating an active toggle state.

## Components

### Buttons
- **Primary:** Electric Purple (#8B5CF6) background, white text. No gradient. High-contrast hover state (slight lighten).
- **Secondary:** Transparent background, #1F1F1F border, pure white text.
- **Ghost:** No border or background. #A1A1AA text, turning white on hover.

### Inputs
- Background: #0A0A0A. Border: #1F1F1F. Focus state: Border changes to #FFFFFF or #8B5CF6 with a 0px offset and 1px thickness.
- Typography: Geist Mono for data-entry fields.

### Cards
- Background: #0A0A0A.
- Border: 1px solid #1F1F1F.
- Padding: 24px (stack-lg) for internal content.

### Chips & Badges
- Small, uppercase labels. Background #111111, border #1F1F1F. Text #A1A1AA.

### Progress & Loading
- Use a slim 2px horizontal bar for loading. Accent colors (Purple/Blue) should be used for progress indicators. Use a "shimmer" effect for skeleton screens instead of static grays.