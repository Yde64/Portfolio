---
title: "Portfolio Website"
description: "Personal portfolio built with Astro, React islands, and Tailwind CSS"
tags: ["Astro", "React", "TypeScript", "Tailwind"]
image: "/images/projects/website.svg"
github: "https://github.com/Yde64/Portfolio"
featured: true
order: 2
---

## Overview

A fast, accessible portfolio site built with Astro's static-first architecture, enhanced with interactive React islands and smooth Framer Motion animations — all wrapped in a custom dark theme powered by Tailwind CSS v4.

## Motivation

I wanted a portfolio that reflects how I actually build software: performance-conscious, well-tested, and with attention to detail. Rather than reaching for a heavy SPA framework, I chose Astro's island architecture to keep the site fast by default while selectively hydrating only the components that need interactivity.

## Architecture

```
Astro (Static SSG)
├── Pages & Layouts      → Astro components (zero JS)
├── React Islands         → Hydrated only when needed
│   ├── CursorSpotlight   → client:only (full-page effect)
│   ├── HeroBackground    → client:load (above the fold)
│   ├── ScrollReveal      → client:visible (lazy)
│   ├── ProjectCard       → client:visible (lazy)
│   └── ThroughputDemo    → client:visible (lazy)
├── Content Collection    → Markdown project pages
└── Tailwind CSS v4       → CSS-first theming
```

## Key Features

- **View Transitions** — Astro's client router with shared element transitions between project cards and detail pages for seamless navigation.
- **3D Tilt Cards** — Project cards respond to pointer movement with spring-animated 3D transforms via Framer Motion.
- **Cursor Spotlight** — A full-screen radial gradient that follows the cursor, adding depth to the dark theme.
- **Scroll Reveal** — Sections fade and slide into view as you scroll, using Intersection Observer under the hood.
- **Throughput Demo** — An interactive performance benchmark with live metrics, sparkline chart, and animated diff panel — running a Web Worker in the browser.
- **Typing Animation** — The nav bar features a terminal-style typing effect with a blinking cursor.
- **Reduced Motion Support** — All animations gracefully degrade when the user prefers reduced motion, checked both in CSS and JavaScript.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro (static SSG) |
| Islands | React 19, Framer Motion |
| Styling | Tailwind CSS v4, CSS-first config, Typography plugin |
| Content | Astro Content Collections (Markdown) |
| Testing | Vitest + Testing Library (unit), Playwright (E2E) |
| Deployment | AWS (S3 + CloudFront) |
