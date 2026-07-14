"use client";

import { useEffect, useRef, useState } from "react";
import { Course } from "@/types/curriculum";

interface ArrowOverlayProps {
  selectedId: string | null;
  prerequisites: Set<string>;
  dependents: Set<string>;
  courses: Course[];
}

type OverlayPath = { id: string; d: string; type: "prereq" | "dep" };

export function ArrowOverlay({ selectedId, prerequisites, dependents, courses }: ArrowOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [paths, setPaths] = useState<OverlayPath[]>([]);

  useEffect(() => {
    let frameId: number;

    if (!selectedId) {
      frameId = requestAnimationFrame(() => setPaths([]));
      return () => cancelAnimationFrame(frameId);
    }

    const updatePaths = () => {
      const selectedEl = document.getElementById(`course-${selectedId}`);
      if (!selectedEl) return;

      const selectedRect = selectedEl.getBoundingClientRect();
      const newPaths: OverlayPath[] = [];

      Array.from(prerequisites).forEach((id) => {
        const el = document.getElementById(`course-${id}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        const startX = rect.right;
        const startY = rect.top + rect.height / 2;
        const endX = selectedRect.left;
        const endY = selectedRect.top + selectedRect.height / 2;
        
        const cp1X = startX + (endX - startX) / 2;
        const cp1Y = startY;
        const cp2X = startX + (endX - startX) / 2;
        const cp2Y = endY;
        
        newPaths.push({
          id: `prereq-${id}`,
          d: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
          type: "prereq"
        });
      });

      Array.from(dependents).forEach((id) => {
        const el = document.getElementById(`course-${id}`);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        
        const startX = selectedRect.right;
        const startY = selectedRect.top + selectedRect.height / 2;
        const endX = rect.left;
        const endY = rect.top + rect.height / 2;
        
        const cp1X = startX + (endX - startX) / 2;
        const cp1Y = startY;
        const cp2X = startX + (endX - startX) / 2;
        const cp2Y = endY;
        
        newPaths.push({
          id: `dep-${id}`,
          d: `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`,
          type: "dep"
        });
      });

      setPaths(newPaths);
    };

    const loop = () => {
      updatePaths();
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);

    window.addEventListener("resize", updatePaths);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", updatePaths);
    };
  }, [selectedId, prerequisites, dependents, courses]);

  if (!selectedId || paths.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ minHeight: "100vh" }}
    >
      <defs>
        <marker id="arrow-prereq" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="color-mix(in srgb, var(--accent) 78%, transparent)" />
        </marker>
        <marker id="arrow-dep" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="color-mix(in srgb, var(--accent-2) 78%, transparent)" />
        </marker>
      </defs>
      
      {paths.map((p) => (
        <path
          key={p.id}
          d={p.d}
          fill="none"
          stroke={p.type === "prereq" ? "color-mix(in srgb, var(--accent) 52%, transparent)" : "color-mix(in srgb, var(--accent-2) 52%, transparent)"}
          strokeWidth="2"
          markerEnd={p.type === "prereq" ? "url(#arrow-prereq)" : "url(#arrow-dep)"}
        />
      ))}
    </svg>
  );
}
