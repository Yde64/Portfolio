# Hero & About Section Rewrite — AI-Era Narrative

## Context

The current Hero and About sections use generic software engineering language ("I build things that work", "full-stack development, embedded systems, and DevOps") that doesn't differentiate Morten from other engineers. The goal is to reframe both sections around a distinctive perspective: in an era where AI is reshaping software engineering, depth, systems thinking, and performance obsession are the real differentiators — not breadth labels.

**Core narrative:** "AI raises the floor, not the ceiling." AI handles the routine; the real engineering lives in architecture, cross-layer debugging, performance, and the judgment that no prompt replaces.

**Tone:** Thoughtful and grounded — reflective, not arrogant or defensive.

**Audience:** Mix of hiring managers and technical peers.

## Changes

### Hero Section (`src/components/Hero.astro`)

**Keep unchanged:**
- Greeting: "Hi, my name is"
- Name: "Morten."
- CTA: "See my work" linking to #projects
- HeroBackground component

**Replace headline (line 10-12):**

Old: `I build things that work.`

New: `I engineer the parts AI can't reach.`

**Replace description (line 13-16):**

Old:
> Software engineer with a passion for full-stack development, embedded systems, and DevOps. I enjoy building reliable systems from hardware to cloud.

New:
> In an era where AI writes boilerplate in seconds, the real engineering lives deeper — in the milliseconds you shave off a critical path, in the architecture that scales, and in the systems thinking that no prompt can replace.

### About Section (`src/components/About.astro`)

**Keep unchanged:**
- Section header ("01. About Me")
- Grid layout with ThroughputDemo component
- All styling/classes

**Replace all three paragraphs (lines 13-28):**

**Paragraph 1 — AI-era framing:**
> AI has made it easy to generate code. What it hasn't changed is the need for engineers who understand why systems behave the way they do. I'm drawn to the problems that live between layers — where a web application meets infrastructure, where a CI pipeline shapes how a team ships, where performance isn't a feature but a foundation.

**Paragraph 2 — Performance as differentiator:**
> I care about making software fast. Not just functional — fast. Whether it's an API response that needs to drop below a threshold or a deployment pipeline that's slowing down a team, I treat performance as a design constraint, not an afterthought.

**Paragraph 3 — Range reframed as product thinking:**
> I've shipped across the entire product surface — web applications, embedded systems, and the infrastructure that connects them. In a world where AI lowers the barrier to writing code in any layer, that breadth isn't about labels. It's about being able to trace a problem from user experience to deployment pipeline and knowing where it actually breaks.

## Files to Modify

1. `src/components/Hero.astro` — headline and description text only
2. `src/components/About.astro` — three paragraph bodies only

No structural, styling, or component changes needed.

## Verification

1. Run `npm run dev` (or equivalent) and check Hero + About sections visually
2. Confirm text renders correctly at mobile and desktop breakpoints
3. Verify no layout shifts from changed text length
4. Read both sections in sequence to confirm narrative flow
