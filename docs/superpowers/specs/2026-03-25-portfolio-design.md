# Portfolio Website — Design Spec

## Overview

A personal portfolio for Morten, a software engineer with full-stack, embedded, and DevOps experience. The portfolio highlights personality, projects, and skills through a clean, minimal design with selective interactive moments.

**Primary audience:** Recruiters/hiring managers and fellow engineers (the source code itself is a signal).

**Core philosophy:** Clean Brittany Chiang-inspired aesthetic with tasteful wow moments. The portfolio itself is a project that demonstrates engineering quality. The source code must be as clean and simple as the design — readable, well-structured, no unnecessary abstractions. Engineers will read it.

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Astro | Purpose-built for content sites, ships near-zero JS, static output |
| Interactive islands | React + Framer Motion | Only where interactivity is needed (cards, scroll, hero) |
| Styling | Tailwind CSS | Utility-first, consistent spacing/color, responsive |
| Content | Astro Content Collections (Markdown) | Typed frontmatter via Zod, validated at build time, easy to extend |
| Language | TypeScript | Throughout — type safety for components and content schema |
| Page transitions | Astro View Transitions | Native smooth navigation between main page and project details |
| Deployment | Static output (Vercel / Netlify / GitHub Pages) | Free, fast, zero server maintenance |

### Dependencies

```
# Astro integrations (required — register in astro.config.mjs)
@astrojs/react          # React island support
@astrojs/tailwind       # Tailwind CSS integration
@astrojs/sitemap        # Auto-generated sitemap
astro                   # Core framework

# React
react
react-dom
framer-motion           # Animations for React islands

# Styling
tailwindcss

# Dev / Testing
typescript
vitest                  # Unit test runner (Vite-native)
@playwright/test        # E2E testing
```

## Architecture

```
Portfolio/
├── src/
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── HeroBackground.tsx     # React island — animated gradient/particle mesh
│   │   ├── About.astro
│   │   ├── ProjectCard.tsx        # React island — 3D tilt hover effect
│   │   ├── ProjectGrid.astro
│   │   ├── Contact.astro
│   │   ├── Nav.astro
│   │   ├── Footer.astro
│   │   └── ScrollReveal.tsx       # React island — intersection observer animations
│   ├── content/
│   │   ├── config.ts              # Zod schema for content collections
│   │   └── projects/
│   │       ├── indoor-climate.md
│   │       └── website.md
│   ├── layouts/
│   │   ├── BaseLayout.astro       # HTML head, meta, nav, footer, view transitions
│   │   └── ProjectLayout.astro    # Layout for project detail pages
│   ├── pages/
│   │   ├── index.astro            # Single-page main flow
│   │   ├── 404.astro             # Custom 404 page
│   │   └── projects/
│   │       └── [slug].astro       # Dynamic project detail pages from content collection
│   └── styles/
│       └── global.css             # Tailwind directives + CSS custom properties
├── public/
│   ├── images/
│   │   └── projects/              # Project screenshots: project-name.png
│   ├── favicon.svg
│   └── resume.pdf                 # Optional
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

### Key architectural decisions

- **`.astro` for static sections** — Hero, About, Contact, Nav, Footer ship zero JavaScript
- **`.tsx` React islands only where needed** — ProjectCard (hover effect), ScrollReveal (intersection observer), HeroBackground (animated canvas)
- **Content collection** — each project is a `.md` file with validated frontmatter; adding a project = adding a file
- **Astro View Transitions** — smooth morphing navigation between pages without a client-side router
- **No client-side routing framework** — Astro handles this natively

## Content Model

### Content collection config (`src/content/config.ts`)

```typescript
import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    image: z.string(),
    github: z.string().url(),
    live: z.string().url().optional(),   // Omit field entirely if no live URL
    featured: z.boolean(),
    order: z.number(),
  }),
});

export const collections = { projects };
```

### Adding a new project

Create a new `.md` file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Brief one-liner"
tags: ["Tech", "Stack"]
image: "/images/projects/project-name.png"
github: "https://github.com/morten/project"
featured: true
order: 3
---

Full write-up: architecture, challenges, learnings.
```

Astro validates the schema at build time — missing required fields cause build errors.

## Page Design

### Main Page (Single-Page Scroll)

Sections render in this order on `index.astro`:

#### Nav
- Fixed top bar with glass-morphism backdrop blur on scroll
- Name/logo left, section links right (About, Projects, Contact)
- Collapses to hamburger menu on mobile (full-screen overlay, CSS-only with checkbox hack — no React island needed)
- Smooth scroll to sections via anchor links

#### Hero
- Full viewport height
- Name, title ("Software Engineer"), one-liner
- Subtle animated background — slow-moving gradient mesh or faint particle effect on a dark canvas
- Call-to-action to scroll down or jump to projects
- Clean typography, generous whitespace

#### About
- 2-3 paragraphs max
- Who Morten is, what drives him, range across full-stack/embedded/DevOps
- No separate skills grid — breadth conveyed through writing and project showcase

#### Projects
- Grid of `ProjectCard` components (2 columns desktop, 1 column mobile)
- Only `featured: true` projects shown, sorted by `order`
- Each card: image, title, description, tech tags, GitHub/live links
- Cards have 3D tilt hover effect with glow (React island)
- Clicking navigates to project detail page with View Transition

#### Contact
- Simple closing section
- "Want to work together?" with email link and social icons (GitHub, LinkedIn)
- No contact form — direct email

#### Footer
- Minimal: source code link, "Built with Astro" or similar

### Project Detail Pages

Route: `/projects/[slug]`

#### Hero area
- Project image (morphs from card via View Transition)
- Title, description, tags
- GitHub and live links as buttons

#### Content body
- Rendered from Markdown body
- Clean typography, ~65ch reading width
- Supports headings, code blocks, and images

#### Navigation
- Back link to main page
- Previous/next project links at bottom

## Interactive Elements (Wow Moments)

### Hero Background (HeroBackground.tsx)
- CSS animated gradient mesh preferred (multiple radial gradients with `@keyframes` movement)
- If CSS cannot achieve desired effect, use lightweight canvas with simplex-noise — no heavy libraries (no three.js, no tsparticles)
- Dark canvas with slowly shifting light — not overwhelming
- Degrades gracefully: static dark background if JS disabled or `prefers-reduced-motion` is set

### Project Card Hover (ProjectCard.tsx)
- 3D perspective tilt following cursor position
- Soft glow/light reflection tracking the mouse
- Tags and links subtly elevate on hover
- Uses `onMouseMove` for cursor tracking + CSS `transform: perspective() rotateX() rotateY()`
- Framer Motion for smooth enter/exit transitions

### Scroll Reveal (ScrollReveal.tsx)
- Intersection Observer-based reveal animations
- Elements stagger: heading slides up first, then body text, then cards with delay
- Uses Framer Motion `useInView` + `staggerChildren`
- Respects `prefers-reduced-motion` — disables animations if set

### Page Transitions (Astro View Transitions)
- Card image morphs into project detail page hero image
- Smooth cross-fade for page content
- Native Astro `transition:name` and `transition:animate` directives
- No additional library needed

### Nav Glass Effect
- `backdrop-filter: blur()` activates on scroll (Intersection Observer on hero)
- Transparent when at top, blurred glass when scrolled

## Scope Decisions

- **Dark theme only.** No light mode toggle.
- **No MDX.** Plain Markdown is sufficient for project content. Can be added later if needed.
- **No blog.** Out of scope for initial build.
- **No CMS.** Content lives in the repo as Markdown files.

## Code Quality Principles

- **Simplicity over cleverness.** Every file should be obvious to read. No abstraction until the third repetition.
- **Small, focused files.** Each component does one thing. 200-400 lines typical, 800 max.
- **Flat over nested.** Avoid deep nesting in both file structure and code logic.
- **No premature abstraction.** No utility libraries, no helper factories, no wrapper components unless genuinely needed.
- **Minimal dependencies.** Only add a package if it solves a real problem better than a few lines of code would.
- **Self-documenting code.** Clear naming, obvious structure. Comments only where the "why" isn't self-evident.

## Styling & Theme

### Colors
```css
--bg-primary: #0a192f;        /* Dark slate background */
--bg-card: #112240;           /* Slightly lighter for cards */
--text-primary: #ccd6f6;      /* Light slate for body text */
--text-heading: #e6f1ff;      /* Near-white for headings */
--accent: #64ffda;            /* Teal/cyan for links, highlights */
--accent-muted: #64ffda33;    /* Accent at low opacity for glows */
--text-muted: #8892b0;        /* Muted text for secondary content */
```

### Typography
- Primary: Inter (single Google Fonts import) or system sans-serif stack
- Monospace: `JetBrains Mono` or system monospace for code snippets and tech tags
- Large confident headings, relaxed line-height on body
- Font sizes via Tailwind scale

### Spacing & Layout
- Max content width: ~1100px, centered
- Generous whitespace between sections
- Consistent padding scale via Tailwind spacing utilities
- CSS Grid for project cards, Flexbox for nav and hero

### Responsive Design
- Mobile-first Tailwind breakpoints
- Nav: hamburger menu on mobile
- Project grid: 2 columns → 1 column on mobile
- Hero: scales down, no wasted vertical space
- Touch-friendly tap targets (min 44px)

### Performance Targets
- Lighthouse: 95+ across all four categories
- Images: Astro `<Image>` component for automatic optimization (WebP, lazy loading, srcset)
- Fonts: `font-display: swap`, preloaded
- Zero render-blocking JS for static sections
- Total JS bundle: minimal (only React islands hydrate)

## Accessibility
- Semantic HTML: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- ARIA labels on interactive elements
- Keyboard navigable: all links and buttons focusable with visible focus rings
- Color contrast: WCAG AA minimum (accent on dark passes)
- `prefers-reduced-motion`: disables all animations
- Alt text on all images

## SEO & Meta

- Open Graph tags (title, description, image) on all pages via `BaseLayout.astro`
- Twitter card meta tags
- Canonical URLs
- Auto-generated sitemap via `@astrojs/sitemap`
- `robots.txt` in `public/`

## Testing Strategy
- Unit tests (Vitest): React island components (ProjectCard hover logic, ScrollReveal trigger)
- Integration: Astro content collection schema validation (built-in at build time)
- E2E (Playwright): main page loads, navigation works, project detail pages render, responsive breakpoints
- Lighthouse CI: automated performance/accessibility checks in GitHub Actions

## Deployment
- Static site generation via `astro build`
- Host on Vercel, Netlify, or GitHub Pages (all support static sites for free)
- Custom domain when ready
- CI: GitHub Actions — build, test, Lighthouse check on PR
