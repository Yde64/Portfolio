import { useState, useRef, useEffect } from "react";
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

export function calculateTilt(
  mouseX: number,
  mouseY: number,
  rect: { width: number; height: number }
) {
  const x = (mouseY / rect.height - 0.5) * -10;
  const y = (mouseX / rect.width - 0.5) * 10;
  return { x: Math.round(x * 100) / 100 || 0, y: Math.round(y * 100) / 100 || 0 };
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
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  function handleMouseMove(e: React.MouseEvent) {
    if (prefersReducedMotion) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTilt(calculateTilt(mouseX, mouseY, rect));
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
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
          style={{ viewTransitionName: `project-image-${slug}` }}
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
