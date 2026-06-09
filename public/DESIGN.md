---
name: Agro-Industrial Precision
colors:
  surface: '#faf9fa'
  surface-dim: '#dbdadb'
  surface-bright: '#faf9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f4'
  surface-container: '#efedee'
  surface-container-high: '#e9e8e9'
  surface-container-highest: '#e3e2e3'
  on-surface: '#1a1c1d'
  on-surface-variant: '#3f484c'
  inverse-surface: '#2f3031'
  inverse-on-surface: '#f2f0f1'
  outline: '#6f797d'
  outline-variant: '#bec8cd'
  surface-tint: '#006780'
  primary: '#005c72'
  on-primary: '#ffffff'
  primary-container: '#007692'
  on-primary-container: '#d9f3ff'
  inverse-primary: '#7dd2f1'
  secondary: '#bc000a'
  on-secondary: '#ffffff'
  secondary-container: '#e3221e'
  on-secondary-container: '#fffbff'
  tertiary: '#484d94'
  on-tertiary: '#ffffff'
  tertiary-container: '#6166ae'
  on-tertiary-container: '#efedff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b8eaff'
  primary-fixed-dim: '#7dd2f1'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004d61'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#930006'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bec2ff'
  on-tertiary-fixed: '#0b0f58'
  on-tertiary-fixed-variant: '#3b4085'
  background: '#faf9fa'
  on-background: '#1a1c1d'
  surface-variant: '#e3e2e3'
  agri-green: '#2B5F2B'
  background-alt: '#F7F7F7'
  border-subtle: '#E5E5E5'
  rating-stars: '#FF9C23'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Open Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Open Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Open Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  price-display:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 32px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  margin-mobile: 16px
  margin-desktop: 48px
  gutter: 24px
  max-width: 1280px
---

## Brand & Style
The design system is engineered for an industrial agricultural marketplace, balancing the rugged utility of the field with the digital precision of modern commerce. The brand personality is **authoritative, efficient, and transparent**, specifically designed to foster trust between B2B buyers and sellers of high-value machinery, chemicals, and biologicals.

The visual style is **Corporate / Modern with High-Contrast accents**. It utilizes a structured, functional aesthetic characterized by clear information hierarchy, high-density data presentation, and a reliance on rigid grids. The emotional response should be one of "operational confidence"—the user should feel they are using a robust tool rather than a casual consumer app.

## Colors
The palette is rooted in industry reliability. The **primary blue (#007692)** acts as the foundational color for navigation and headers, signaling stability and professional service. The **secondary red (#D71616)** is reserved exclusively for high-priority Call-to-Actions (CTAs) and critical "Buy" buttons, ensuring maximum conversion visibility against the white and gray background.

A **tertiary navy (#2D3277)** is utilized for category labels and secondary interactive elements to provide depth. **Agri-green** is used as a semantic color specifically for eco-friendly biologicals and healthy crop protection categories. The background remains predominantly white to maintain a clean, "uncluttered" workspace feel, with light gray (#F7F7F7) used to differentiate horizontal content sections (like product carousels).

## Typography
The typography system prioritizes legibility of technical specifications and commercial values. 
- **Hanken Grotesk** is the display face, used for high-impact headlines and price displays to give the system a modern, sharp edge.
- **Open Sans** is the workhorse for body copy, chosen for its excellent readability in multi-paragraph product descriptions and data sheets.
- **Inter** is used for functional labels, tags, and data tables where compact vertical space and clarity of numerals are essential.

On mobile devices, `headline-xl` should scale down to `headline-lg` (32px) to prevent awkward line breaks on narrow screens.

## Layout & Spacing
This design system uses a **Fixed Grid** model for desktop to maintain professional constraints, and a **Fluid Grid** for mobile. 
- **Desktop:** 12-column grid with a 1280px max-width, 24px gutters, and 48px side margins.
- **Mobile:** 4-column fluid grid with 16px margins.

Spacing follows an 8px base unit. Component-level spacing (padding within cards or inputs) should use 8px/16px increments, while section-level spacing (between carousels) should use 48px/64px to provide clear visual breathing room between different business categories.

## Elevation & Depth
Depth is conveyed through **Tonal Layers and Low-Contrast Outlines** rather than heavy shadows. This maintains a clean, "flat-plus" industrial look. 
- **Level 0 (Background):** Primary white (#FFFFFF) or light gray (#F7F7F7) for sectioning.
- **Level 1 (Cards):** White background with a 1px solid border (#E5E5E5). 
- **Level 2 (Hover/Active):** A very soft, diffused shadow (0px 4px 12px rgba(0,0,0,0.05)) is applied only on hover to product cards to indicate interactivity.
- **Header:** Remains sticky at the top with a subtle 1px bottom border rather than a shadow, ensuring the focus stays on the content.

## Shapes
The shape language is **Soft (0.25rem)**. The minimal radius provides a hint of modern approachability while maintaining the structural integrity and "seriousness" of an industrial platform.
- **Standard UI elements** (Inputs, Buttons): 4px radius.
- **Containers/Cards**: 8px (`rounded-lg`) to soften larger surface areas.
- **Search Bar**: 4px radius to match the structured, utilitarian look of the header.

## Components
- **Buttons:** Primary buttons use the secondary red (#D71616) with white text for high contrast. Secondary buttons use the primary blue (#007692) or a ghost style with a 1px border.
- **Search Bar:** Occupies 60% of the header width. Includes a category dropdown on the left (e.g., "Seeds", "Machinery") to facilitate rapid B2B sourcing.
- **Product Cards:** Must include a high-visibility price, a "Verified Seller" badge, and a Yelp-style star rating system. Technical specs (e.g., "Weight: 50kg" or "Active Ingredient: 15%") should be displayed in `label-md` Inter font.
- **Category Navigation:** A horizontal bar below the header using icons and `label-lg` typography for categories like Fertilizers, Biologicals, and Machinery.
- **Horizontal Carousels:** Used for "Flash Deals" and "Recommended for Your Farm." Cards within carousels have fixed widths to ensure consistent layout across screen sizes.
- **Footer:** A 4-column robust footer containing site map, business transparency links (reputation system info), and agricultural certification logos.