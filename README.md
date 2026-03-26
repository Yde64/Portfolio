# Portfolio

Personal portfolio website built with [Astro](https://astro.build), React islands, Framer Motion, and Tailwind CSS v4.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22.12.0
- npm (comes with Node.js)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Yde64/Portfolio.git
cd Portfolio

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The site will be available at `http://localhost:4321`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the production site to `./dist` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |

## Project Structure

```
src/
├── components/       # Astro components & React islands
├── content/
│   └── projects/     # Markdown project pages (Content Collections)
├── layouts/          # Base and project page layouts
├── pages/            # Astro file-based routes
└── styles/           # Global CSS and Tailwind theme
public/
└── images/           # Static assets (project images, etc.)
tests/
├── components/       # Unit tests (Vitest + Testing Library)
└── e2e/              # End-to-end tests (Playwright)
```

## Adding a Project

Create a new Markdown file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Short description"
tags: ["Tag1", "Tag2"]
image: "/images/projects/project-name.png"
github: "https://github.com/user/repo"
featured: true
order: 3
---

Write-up content here.
```

Place the corresponding image in `public/images/projects/`.

## Running Tests

```bash
# Unit tests
npm run test

# E2E tests (requires a build first)
npm run build
npx playwright install --with-deps  # first time only
npm run test:e2e
```

## Tech Stack

- **Astro** — Static site generation with island architecture
- **React** — Interactive components hydrated selectively
- **Framer Motion** — Animations (scroll reveal, 3D tilt, cursor spotlight)
- **Tailwind CSS v4** — Utility-first styling with CSS-first theming
- **Vitest** — Unit testing
- **Playwright** — End-to-end testing
