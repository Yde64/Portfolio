# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, minimal portfolio site that showcases Morten's projects with tasteful interactive moments.

**Architecture:** Astro static site with React islands for interactivity (card hover, scroll reveal, hero background). Content collection for project data. Single-page main flow with dedicated project detail pages.

**Tech Stack:** Astro, React, Framer Motion, Tailwind CSS, TypeScript, Vitest, Playwright

**Spec:** `docs/superpowers/specs/2026-03-25-portfolio-design.md`

---

## File Map

| File | Responsibility |
|------|---------------|
| `astro.config.mjs` | Astro config: integrations, site URL, view transitions |
| `tailwind.config.mjs` | Theme colors, fonts, custom utilities |
| `tsconfig.json` | TypeScript config |
| `src/styles/global.css` | Tailwind directives, CSS custom properties, base typography |
| `src/content/config.ts` | Zod schema for project content collection |
| `src/content/projects/indoor-climate.md` | Project: Indoor Climate System |
| `src/content/projects/website.md` | Project: Portfolio Website |
| `src/layouts/BaseLayout.astro` | HTML head, meta/OG tags, nav, footer, view transitions |
| `src/layouts/ProjectLayout.astro` | Project detail page wrapper |
| `src/components/Nav.astro` | Fixed nav with glass blur, mobile hamburger |
| `src/components/Footer.astro` | Minimal footer |
| `src/components/Hero.astro` | Hero section with name, title, one-liner |
| `src/components/HeroBackground.tsx` | React island: animated CSS gradient mesh |
| `src/components/About.astro` | About section |
| `src/components/ProjectCard.tsx` | React island: 3D tilt hover card |
| `src/components/ProjectGrid.astro` | Grid of featured project cards |
| `src/components/Contact.astro` | Contact section |
| `src/components/ScrollReveal.tsx` | React island: intersection observer fade-in |
| `src/pages/index.astro` | Main single-page layout |
| `src/pages/projects/[slug].astro` | Dynamic project detail pages |
| `src/pages/404.astro` | Custom 404 page |
| `public/favicon.svg` | Site favicon |
| `public/robots.txt` | Robots file |
| `tests/components/ProjectCard.test.tsx` | Unit: card hover logic |
| `tests/components/ScrollReveal.test.tsx` | Unit: scroll reveal trigger |
| `tests/e2e/portfolio.spec.ts` | E2E: full site navigation and rendering |

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`, `public/robots.txt`

- [ ] **Step 1: Initialize Astro project**

```bash
cd /Users/morten/projects/Private/Portfolio
npm create astro@latest . -- --template minimal --install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npx astro add react tailwind sitemap -y
npm install framer-motion
npm install -D vitest @playwright/test jsdom @testing-library/react @testing-library/jest-dom @tailwindcss/typography
```

- [ ] **Step 3: Configure astro.config.mjs**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://morten.dev",
  integrations: [react(), tailwind(), sitemap()],
});
```

- [ ] **Step 4: Configure Tailwind theme**

Replace `tailwind.config.mjs` with:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0a192f",
        "bg-card": "#112240",
        "text-primary": "#ccd6f6",
        "text-heading": "#e6f1ff",
        accent: "#64ffda",
        "accent-muted": "rgba(100, 255, 218, 0.2)",
        "text-muted": "#8892b0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1100px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
```

- [ ] **Step 5: Create global.css**

Create `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg-primary text-text-primary font-sans;
  }

  h1, h2, h3, h4 {
    @apply text-text-heading font-bold;
  }

  a {
    @apply text-accent hover:underline;
  }

  ::selection {
    @apply bg-accent/20 text-text-heading;
  }
}
```

- [ ] **Step 6: Add favicon and robots.txt**

Create `public/favicon.svg` (simple monogram):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#0a192f"/>
  <text x="16" y="22" text-anchor="middle" fill="#64ffda" font-family="monospace" font-size="18" font-weight="bold">M</text>
</svg>
```

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://morten.dev/sitemap-index.xml
```

- [ ] **Step 7: Create Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/components/**/*.test.{ts,tsx}"],
    environment: "jsdom",
  },
});
```

- [ ] **Step 8: Add test scripts to package.json**

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 9: Verify build works**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tailwind.config.mjs tsconfig.json vitest.config.ts src/styles/global.css public/
git commit -m "chore: scaffold Astro project with React, Tailwind, and TypeScript"
```

---

## Task 2: Content Collection & Project Data

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/indoor-climate.md`
- Create: `src/content/projects/website.md`

- [ ] **Step 1: Create content collection schema**

Create `src/content/config.ts`:

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
    live: z.string().url().optional(),
    featured: z.boolean(),
    order: z.number(),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Create indoor-climate project**

Create `src/content/projects/indoor-climate.md`:

```markdown
---
title: "Indoor Climate System"
description: "Embedded system for monitoring and controlling indoor climate"
tags: ["Embedded", "C++", "Sensors", "IoT"]
image: "/images/projects/indoor-climate.png"
github: "https://github.com/morten/indoor-climate"
featured: true
order: 1
---

Detailed write-up goes here. Replace with real content.
```

- [ ] **Step 3: Create website project**

Create `src/content/projects/website.md`:

```markdown
---
title: "Portfolio Website"
description: "Personal portfolio built with Astro, React islands, and Tailwind CSS"
tags: ["Astro", "React", "TypeScript", "Tailwind"]
image: "/images/projects/website.png"
github: "https://github.com/morten/portfolio"
featured: true
order: 2
---

Detailed write-up goes here. Replace with real content.
```

- [ ] **Step 4: Add placeholder project images**

```bash
mkdir -p public/images/projects
```

Create `public/images/projects/indoor-climate.png` as a placeholder SVG (rename to .png later with real screenshot):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#112240"/>
  <text x="300" y="200" text-anchor="middle" fill="#64ffda" font-family="monospace" font-size="24">Indoor Climate System</text>
</svg>
```

Create `public/images/projects/website.png` similarly:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">
  <rect width="600" height="400" fill="#112240"/>
  <text x="300" y="200" text-anchor="middle" fill="#64ffda" font-family="monospace" font-size="24">Portfolio Website</text>
</svg>
```

Note: Save these as `.svg` files initially and update the frontmatter `image` field to `.svg`. Replace with real `.png` screenshots later.

- [ ] **Step 5: Verify build — schema validation works**

```bash
npm run build
```

Expected: Build succeeds. If frontmatter is invalid, Astro reports the error.

- [ ] **Step 6: Commit**

```bash
git add src/content/ public/images/
git commit -m "feat: add content collection schema and project data"
```

---

## Task 3: Base Layout & Nav

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create BaseLayout**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import { ViewTransitions } from "astro:transitions";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description?: string;
  image?: string;
}

const {
  title,
  description = "Morten — Software Engineer",
  image = "/favicon.svg",
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(image, Astro.site)} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={new URL(image, Astro.site)} />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />

    <title>{title}</title>
    <ViewTransitions />
  </head>
  <body class="antialiased">
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Create Nav component**

Create `src/components/Nav.astro`:

```astro
---
const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];
---

<nav
  id="nav"
  class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
>
  <div class="mx-auto flex max-w-content items-center justify-between px-6 py-4">
    <a href="/" class="font-mono text-accent text-lg font-bold no-underline hover:no-underline">
      M
    </a>

    <!-- Desktop links -->
    <div class="hidden md:flex items-center gap-8">
      {navLinks.map(({ label, href }) => (
        <a
          href={href}
          class="font-mono text-sm text-text-muted hover:text-accent no-underline transition-colors"
        >
          {label}
        </a>
      ))}
    </div>

    <!-- Mobile hamburger (CSS-only) -->
    <input type="checkbox" id="menu-toggle" class="hidden" />
    <label
      for="menu-toggle"
      class="md:hidden flex flex-col gap-1.5 cursor-pointer z-50"
      aria-label="Toggle menu"
    >
      <span class="hamburger-bar block h-0.5 w-6 bg-text-primary transition-transform" />
      <span class="hamburger-bar block h-0.5 w-6 bg-text-primary transition-opacity" />
      <span class="hamburger-bar block h-0.5 w-6 bg-text-primary transition-transform" />
    </label>

    <!-- Mobile overlay -->
    <div id="menu-overlay" class="fixed inset-0 bg-bg-primary/95 flex items-center justify-center opacity-0 pointer-events-none transition-opacity md:hidden">
      <div class="flex flex-col items-center gap-8">
        {navLinks.map(({ label, href }) => (
          <a
            href={href}
            class="font-mono text-lg text-text-heading hover:text-accent no-underline"
            onclick="document.getElementById('menu-toggle').checked = false"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  </div>
</nav>

<style>
  /* Hamburger animation via sibling selector */
  #menu-toggle:checked ~ label .hamburger-bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  #menu-toggle:checked ~ label .hamburger-bar:nth-child(2) {
    opacity: 0;
  }
  #menu-toggle:checked ~ label .hamburger-bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
  #menu-toggle:checked ~ #menu-overlay {
    opacity: 1;
    pointer-events: auto;
  }
</style>

<script>
  document.addEventListener("astro:page-load", () => {
    const nav = document.getElementById("nav");
    const hero = document.getElementById("hero");
    if (!nav || !hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          nav.classList.add("bg-bg-primary/80", "backdrop-blur-md", "shadow-lg");
        } else {
          nav.classList.remove("bg-bg-primary/80", "backdrop-blur-md", "shadow-lg");
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(hero);
  });
</script>
```

- [ ] **Step 3: Create Footer component**

Create `src/components/Footer.astro`:

```astro
<footer class="border-t border-text-muted/10 py-8 text-center">
  <p class="text-sm text-text-muted">
    Built with
    <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a>.
    <a href="https://github.com/morten/portfolio" target="_blank" rel="noopener noreferrer">
      Source code
    </a>.
  </p>
</footer>
```

- [ ] **Step 4: Create minimal index.astro to test layout**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="Morten — Software Engineer">
  <section id="hero" class="min-h-screen flex items-center justify-center">
    <h1 class="text-4xl">Portfolio coming soon</h1>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Verify dev server renders correctly**

```bash
npm run dev
```

Open `http://localhost:4321`. Expected: dark background, nav bar at top, placeholder hero text, footer.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add base layout with nav, footer, and SEO meta tags"
```

---

## Task 4: Hero Section

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/HeroBackground.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create HeroBackground React island**

Create `src/components/HeroBackground.tsx`:

```tsx
import { useEffect, useRef } from "react";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const el = canvasRef.current;
    if (!el) return;

    el.style.animation = "gradient-shift 15s ease infinite";
  }, []);

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0 opacity-50"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(100, 255, 218, 0.08) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 80% 20%, rgba(100, 255, 218, 0.05) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 50% 80%, rgba(100, 255, 218, 0.03) 0%, transparent 50%)",
        backgroundSize: "200% 200%",
      }}
      aria-hidden="true"
    />
  );
}
```

Add to `src/styles/global.css`:

```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

- [ ] **Step 2: Create Hero component**

Create `src/components/Hero.astro`:

```astro
---
import HeroBackground from "./HeroBackground.tsx";
---

<section id="hero" class="relative min-h-screen flex items-center">
  <HeroBackground client:load />
  <div class="relative z-10 mx-auto max-w-content px-6">
    <p class="font-mono text-accent mb-4">Hi, my name is</p>
    <h1 class="text-5xl md:text-7xl font-bold mb-4">Morten.</h1>
    <h2 class="text-3xl md:text-5xl font-bold text-text-muted mb-6">
      I build things that work.
    </h2>
    <p class="max-w-lg text-text-muted text-lg leading-relaxed mb-8">
      Software engineer with a passion for full-stack development, embedded
      systems, and DevOps. I enjoy building reliable systems from hardware
      to cloud.
    </p>
    <a
      href="#projects"
      class="inline-block font-mono text-accent border border-accent rounded px-6 py-3 hover:bg-accent-muted no-underline transition-colors"
    >
      See my work
    </a>
  </div>
</section>
```

- [ ] **Step 3: Update index.astro to use Hero**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
---

<BaseLayout title="Morten — Software Engineer">
  <Hero />
</BaseLayout>
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: Full-height hero with subtle gradient background, name, title, CTA button. Nav glass effect activates on scroll past hero.

- [ ] **Step 5: Commit**

```bash
git add src/components/Hero.astro src/components/HeroBackground.tsx src/styles/global.css src/pages/index.astro
git commit -m "feat: add hero section with animated gradient background"
```

---

## Task 5: About Section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create About component**

Create `src/components/About.astro`:

```astro
<section id="about" class="py-24">
  <div class="mx-auto max-w-content px-6">
    <h2 class="text-2xl font-bold mb-8">
      <span class="font-mono text-accent text-lg font-normal mr-2">01.</span>
      About Me
    </h2>
    <div class="max-w-2xl space-y-4 text-text-muted leading-relaxed">
      <p>
        I'm a software engineer who enjoys working across the full stack — from
        embedded firmware to cloud infrastructure. I find the most interesting
        problems live at the boundaries between systems.
      </p>
      <p>
        My experience spans building web applications, designing embedded sensor
        systems, and setting up the DevOps pipelines that tie everything together.
        I value clean code, simple solutions, and tools that just work.
      </p>
      <p>
        When I'm not coding, I'm usually tinkering with hardware projects or
        exploring new technologies to add to my toolkit.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add About to index.astro**

Add import and component after `<Hero />`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
---

<BaseLayout title="Morten — Software Engineer">
  <Hero />
  <About />
</BaseLayout>
```

- [ ] **Step 3: Verify in browser**

Expected: About section visible below hero with numbered heading and paragraphs.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro src/pages/index.astro
git commit -m "feat: add about section"
```

---

## Task 6: Project Cards & Grid

**Files:**
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/ProjectGrid.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing test for ProjectCard tilt logic**

Create `tests/components/ProjectCard.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { calculateTilt } from "../../src/components/ProjectCard";

describe("calculateTilt", () => {
  it("returns zero tilt at center", () => {
    const result = calculateTilt(150, 100, { width: 300, height: 200 });
    expect(result).toEqual({ x: 0, y: 0 });
  });

  it("tilts negative when mouse is top-left", () => {
    const result = calculateTilt(0, 0, { width: 300, height: 200 });
    expect(result.x).toBeGreaterThan(0);
    expect(result.y).toBeLessThan(0);
  });

  it("tilts positive when mouse is bottom-right", () => {
    const result = calculateTilt(300, 200, { width: 300, height: 200 });
    expect(result.x).toBeLessThan(0);
    expect(result.y).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it FAILS (RED)**

```bash
npx vitest run tests/components/ProjectCard.test.tsx
```

Expected: FAIL — cannot find module `../../src/components/ProjectCard`.

- [ ] **Step 3: Create ProjectCard component (GREEN)**

Create `src/components/ProjectCard.tsx`:

```tsx
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  description: string;
  tags: string[];
  image: string;
  github: string;
  live?: string;
  slug: string;
}

function calculateTilt(
  mouseX: number,
  mouseY: number,
  rect: { width: number; height: number }
) {
  const x = (mouseY / rect.height - 0.5) * -10;
  const y = (mouseX / rect.width - 0.5) * 10;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

export default function ProjectCard({
  title,
  description,
  tags,
  image,
  github,
  live,
  slug,
}: Props) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTilt(calculateTilt(mouseX, mouseY, rect));
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
      className="bg-bg-card rounded-lg overflow-hidden border border-text-muted/10 hover:border-accent/30 transition-colors"
    >
      <a href={`/projects/${slug}`} className="block no-underline">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        <div className="p-6">
          <h3 className="text-text-heading text-xl font-bold mb-2">{title}</h3>
          <p className="text-text-muted text-sm mb-4 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-xs text-accent bg-accent-muted px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-4">
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent text-sm no-underline transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub
            </a>
            {live && (
              <a
                href={live}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent text-sm no-underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Live
              </a>
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
}

export { calculateTilt };
```

- [ ] **Step 4: Run tests (GREEN)**

```bash
npx vitest run tests/components/ProjectCard.test.tsx
```

Expected: 3 tests pass.

- [ ] **Step 5: Create ProjectGrid component**

Create `src/components/ProjectGrid.astro`:

```astro
---
import { getCollection } from "astro:content";
import ProjectCard from "./ProjectCard.tsx";

const projects = (await getCollection("projects"))
  .filter((p) => p.data.featured)
  .sort((a, b) => a.data.order - b.data.order);
---

<section id="projects" class="py-24">
  <div class="mx-auto max-w-content px-6">
    <h2 class="text-2xl font-bold mb-12">
      <span class="font-mono text-accent text-lg font-normal mr-2">02.</span>
      Projects
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard
          client:visible
          title={project.data.title}
          description={project.data.description}
          tags={project.data.tags}
          image={project.data.image}
          github={project.data.github}
          live={project.data.live}
          slug={project.slug}
        />
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 6: Add ProjectGrid to index.astro**

Update imports and add `<ProjectGrid />` after `<About />`.

- [ ] **Step 7: Verify in browser**

Expected: Project cards render in 2-column grid with tilt hover effect.

- [ ] **Step 8: Commit**

```bash
git add src/components/ProjectCard.tsx src/components/ProjectGrid.astro src/pages/index.astro tests/
git commit -m "feat: add project cards with 3D tilt hover effect"
```

---

## Task 7: Contact Section

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create Contact component**

Create `src/components/Contact.astro`:

```astro
<section id="contact" class="py-24">
  <div class="mx-auto max-w-content px-6 text-center">
    <h2 class="text-2xl font-bold mb-4">
      <span class="font-mono text-accent text-lg font-normal mr-2">03.</span>
      Get In Touch
    </h2>
    <p class="max-w-md mx-auto text-text-muted leading-relaxed mb-8">
      I'm always open to interesting projects and collaborations.
      Whether you have a question or just want to say hi, feel free to reach out.
    </p>
    <a
      href="mailto:hello@morten.dev"
      class="inline-block font-mono text-accent border border-accent rounded px-8 py-4 hover:bg-accent-muted no-underline transition-colors"
    >
      Say Hello
    </a>
    <div class="flex justify-center gap-6 mt-8">
      <a
        href="https://github.com/Yde64"
        target="_blank"
        rel="noopener noreferrer"
        class="text-text-muted hover:text-accent no-underline transition-colors"
        aria-label="GitHub"
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/morten-yde-christensen"
        target="_blank"
        rel="noopener noreferrer"
        class="text-text-muted hover:text-accent no-underline transition-colors"
        aria-label="LinkedIn"
      >
        LinkedIn
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add Contact to index.astro**

Add import and `<Contact />` after `<ProjectGrid />`.

- [ ] **Step 3: Verify in browser**

Expected: Contact section centered with email CTA and social links.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.astro src/pages/index.astro
git commit -m "feat: add contact section"
```

---

## Task 8: Scroll Reveal Animations

**Files:**
- Create: `src/components/ScrollReveal.tsx`
- Create: `tests/components/ScrollReveal.test.tsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write failing test for ScrollReveal**

Create `tests/components/ScrollReveal.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ScrollReveal from "../../src/components/ScrollReveal";

describe("ScrollReveal", () => {
  it("renders children", () => {
    const { getByText } = render(
      <ScrollReveal>
        <p>Hello world</p>
      </ScrollReveal>
    );
    expect(getByText("Hello world")).toBeDefined();
  });

  it("applies initial hidden styles", () => {
    const { container } = render(
      <ScrollReveal>
        <p>Content</p>
      </ScrollReveal>
    );
    const wrapper = container.firstChild as HTMLElement;
    // Framer Motion sets initial opacity via style attribute
    expect(wrapper.style.opacity).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it FAILS (RED)**

```bash
npx vitest run tests/components/ScrollReveal.test.tsx
```

Expected: FAIL — cannot find module `../../src/components/ScrollReveal`.

- [ ] **Step 3: Create ScrollReveal component (GREEN)**

Create `src/components/ScrollReveal.tsx`:

```tsx
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Props {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
      style={{
        // @ts-expect-error CSS custom property
        "--reduce-motion": "var(--prefers-reduced-motion, )",
      }}
    >
      {children}
    </motion.div>
  );
}
```

Add to `src/styles/global.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 3: Wrap sections in ScrollReveal on index.astro**

Update `src/pages/index.astro` to wrap About, ProjectGrid, and Contact in ScrollReveal:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Hero from "../components/Hero.astro";
import About from "../components/About.astro";
import ProjectGrid from "../components/ProjectGrid.astro";
import Contact from "../components/Contact.astro";
import ScrollReveal from "../components/ScrollReveal.tsx";
---

<BaseLayout title="Morten — Software Engineer">
  <Hero />
  <ScrollReveal client:visible>
    <About />
  </ScrollReveal>
  <ScrollReveal client:visible delay={0.1}>
    <ProjectGrid />
  </ScrollReveal>
  <ScrollReveal client:visible delay={0.2}>
    <Contact />
  </ScrollReveal>
</BaseLayout>
```

- [ ] **Step 4: Verify in browser**

Expected: Sections fade in and slide up as they enter viewport on scroll.

- [ ] **Step 5: Run tests**

```bash
npx vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/ScrollReveal.tsx src/styles/global.css src/pages/index.astro tests/
git commit -m "feat: add scroll reveal animations with reduced motion support"
```

---

## Task 9: Project Detail Pages

**Files:**
- Create: `src/layouts/ProjectLayout.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create ProjectLayout**

Create `src/layouts/ProjectLayout.astro`:

```astro
---
import BaseLayout from "./BaseLayout.astro";

interface Props {
  title: string;
  description: string;
  tags: string[];
  image: string;
  github: string;
  live?: string;
}

const { title, description, tags, image, github, live } = Astro.props;
---

<BaseLayout title={`${title} — Morten`} description={description} image={image}>
  <article class="py-24">
    <div class="mx-auto max-w-content px-6">
      <!-- Back link -->
      <a
        href="/#projects"
        class="inline-block font-mono text-sm text-accent mb-8 no-underline hover:underline"
      >
        &larr; Back to projects
      </a>

      <!-- Hero -->
      <img
        src={image}
        alt={title}
        class="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        transition:name={`project-image-${Astro.url.pathname.split("/").pop()}`}
      />

      <h1 class="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p class="text-text-muted text-lg mb-6">{description}</p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-2 mb-6">
        {tags.map((tag) => (
          <span class="font-mono text-xs text-accent bg-accent-muted px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <!-- Links -->
      <div class="flex gap-4 mb-12">
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-sm text-accent border border-accent rounded px-4 py-2 hover:bg-accent-muted no-underline transition-colors"
        >
          View on GitHub
        </a>
        {live && (
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-sm text-accent border border-accent rounded px-4 py-2 hover:bg-accent-muted no-underline transition-colors"
          >
            Live Demo
          </a>
        )}
      </div>

      <!-- Markdown content -->
      <div class="prose prose-invert prose-lg max-w-[65ch] prose-a:text-accent prose-code:font-mono">
        <slot />
      </div>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Create dynamic project page**

Create `src/pages/projects/[slug].astro`:

```astro
---
import { getCollection } from "astro:content";
import ProjectLayout from "../../layouts/ProjectLayout.astro";

export async function getStaticPaths() {
  const projects = (await getCollection("projects")).sort(
    (a, b) => a.data.order - b.data.order
  );

  return projects.map((project, index) => ({
    params: { slug: project.slug },
    props: {
      project,
      prev: index > 0 ? projects[index - 1] : null,
      next: index < projects.length - 1 ? projects[index + 1] : null,
    },
  }));
}

const { project, prev, next } = Astro.props;
const { Content } = await project.render();
---

<ProjectLayout
  title={project.data.title}
  description={project.data.description}
  tags={project.data.tags}
  image={project.data.image}
  github={project.data.github}
  live={project.data.live}
>
  <Content />

  <!-- Prev/Next navigation -->
  <nav class="flex justify-between mt-16 pt-8 border-t border-text-muted/10">
    {prev ? (
      <a href={`/projects/${prev.slug}`} class="font-mono text-sm text-text-muted hover:text-accent no-underline">
        &larr; {prev.data.title}
      </a>
    ) : <span />}
    {next ? (
      <a href={`/projects/${next.slug}`} class="font-mono text-sm text-text-muted hover:text-accent no-underline">
        {next.data.title} &rarr;
      </a>
    ) : <span />}
  </nav>
</ProjectLayout>
```

- [ ] **Step 3: Create 404 page**

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---

<BaseLayout title="404 — Morten">
  <section class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="font-mono text-accent text-6xl mb-4">404</h1>
      <p class="text-text-muted text-lg mb-8">Page not found.</p>
      <a
        href="/"
        class="font-mono text-accent border border-accent rounded px-6 py-3 hover:bg-accent-muted no-underline transition-colors"
      >
        Go home
      </a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Verify in browser**

Navigate to `http://localhost:4321/projects/indoor-climate`. Expected: project detail page with image, tags, content, back link.

Navigate to `http://localhost:4321/nonexistent`. Expected: 404 page.

- [ ] **Step 5: Verify View Transitions work**

Click a project card on the main page. Expected: smooth image morph transition to detail page.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ProjectLayout.astro src/pages/projects/ src/pages/404.astro
git commit -m "feat: add project detail pages with view transitions and 404 page"
```

---

## Task 10: E2E Tests

**Files:**
- Create: `tests/e2e/portfolio.spec.ts`
- Create: `playwright.config.ts`

- [ ] **Step 1: Configure Playwright**

Create `playwright.config.ts`:

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run preview",
    port: 4321,
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:4321",
  },
});
```

- [ ] **Step 2: Write E2E tests**

Create `tests/e2e/portfolio.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Portfolio", () => {
  test("main page loads with all sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#projects")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("nav links scroll to sections", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/#about"]');
    await expect(page.locator("#about")).toBeInViewport();
  });

  test("project detail page loads", async ({ page }) => {
    await page.goto("/projects/indoor-climate");
    await expect(page.locator("h1")).toContainText("Indoor Climate");
    await expect(page.locator('a[href="/#projects"]')).toBeVisible();
  });

  test("404 page renders", async ({ page }) => {
    await page.goto("/nonexistent");
    await expect(page.locator("h1")).toContainText("404");
  });

  test("responsive: mobile nav toggle works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.click('label[for="menu-toggle"]');
    await expect(page.locator("#menu-toggle")).toBeChecked();
  });
});
```

- [ ] **Step 3: Build and run E2E tests**

```bash
npm run build
npx playwright install --with-deps chromium
npx playwright test
```

Expected: All 5 tests pass.

- [ ] **Step 4: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "test: add E2E tests for main page, navigation, and project detail pages"
```

---

## Task 11: Polish & Final Verification

- [ ] **Step 1: Review all pages in browser**

```bash
npm run dev
```

Check:
- Main page scrolls smoothly through all sections
- Nav glass effect works on scroll
- Project cards tilt on hover
- Scroll reveals animate in
- Project detail pages load with view transitions
- 404 page renders
- Mobile nav works at 375px viewport

- [ ] **Step 2: Run Lighthouse audit**

Open Chrome DevTools → Lighthouse → run audit on `http://localhost:4321`.

Target: 95+ on Performance, Accessibility, Best Practices, SEO.

- [ ] **Step 3: Fix any issues found**

Address any Lighthouse or visual issues.

- [ ] **Step 4: Final commit if any fixes were made**

```bash
git add -A
git commit -m "chore: polish and Lighthouse fixes"
```
