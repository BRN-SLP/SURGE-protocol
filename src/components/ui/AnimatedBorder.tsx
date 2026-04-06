"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { type BorderVariant, getVariantPaths } from "@/lib/border-variants";

interface AnimatedBorderProps {
  variant: BorderVariant;
  radius?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
  className?: string;
  /** When true: plays once when parent enters viewport, no hover toggle */
  autoPlay?: boolean;
}

export function AnimatedBorder({
  variant,
  radius = 10,
  color = "var(--accent)",
  strokeWidth = 1.5,
  duration = 0.55,
  className = "",
  autoPlay = false,
}: AnimatedBorderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;

    let ctx: gsap.Context;

    function buildTimeline(w: number, h: number) {
      if (!svg) return;

      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }

      // Clear previous paths
      while (svg.firstChild) svg.removeChild(svg.firstChild);

      // Expand SVG by strokeWidth (pad each side by strokeWidth/2) so that
      // strokes whose center-line sits exactly at y=0, x=0, x=w, y=h are
      // fully inside the SVG viewport and not half-clipped by default overflow:hidden.
      const pad = strokeWidth / 2;
      svg.style.top = `${-pad}px`;
      svg.style.left = `${-pad}px`;
      svg.setAttribute("width", String(w + strokeWidth));
      svg.setAttribute("height", String(h + strokeWidth));
      svg.setAttribute("viewBox", `${-pad} ${-pad} ${w + strokeWidth} ${h + strokeWidth}`);

      const pathStrings = getVariantPaths(w, h, radius, variant);

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ paused: true });

        pathStrings.forEach((d, i) => {
          const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
          path.setAttribute("d", d);
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", color);
          path.setAttribute("stroke-width", String(strokeWidth));
          path.setAttribute("stroke-linecap", "round");
          svg!.appendChild(path);

          const len = path.getTotalLength();
          const hidden = len + strokeWidth;
          // Start invisible: opacity:0 hides the round-linecap artifact that
          // bleeds into the viewBox padding when dashoffset == dasharray.
          gsap.set(path, { strokeDasharray: hidden, strokeDashoffset: hidden, opacity: 0 });

          const stagger = pathStrings.length > 1 ? i * (duration * 0.15) : 0;
          // Reveal instantly at stagger time, then draw the stroke.
          // On reverse: stroke retraces fully, opacity snaps back to 0 at t=stagger.
          tl.set(path, { opacity: 1 }, stagger);
          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: duration - stagger,
              ease: "power2.out",
            },
            stagger,
          );
        });

        tlRef.current = tl;
      }, svg);
    }

    const parent = wrap.parentElement;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      let width: number, height: number;
      if (entry.borderBoxSize?.length > 0) {
        width = entry.borderBoxSize[0].inlineSize;
        height = entry.borderBoxSize[0].blockSize;
      } else {
        const rect = (parent ?? wrap).getBoundingClientRect();
        width = rect.width;
        height = rect.height;
      }
      if (width > 0 && height > 0) buildTimeline(width, height);
    });

    // Observe the parent so ResizeObserver fires on the element whose border
    // the SVG traces (wrap itself is position:absolute inset:0, same size).
    if (parent) ro.observe(parent);

    if (autoPlay) {
      registerGsap();
      // ScrollTrigger fires at the same scroll position as the parent section's
      // card entrance animation — border draws as the card fades in.
      const st = ScrollTrigger.create({
        trigger: parent,
        start: "top 85%",
        onEnter: () => {
          // If RO hasn't fired yet (rare race on first paint), defer one frame.
          if (tlRef.current) {
            tlRef.current.play();
          } else {
            requestAnimationFrame(() => tlRef.current?.play());
          }
        },
        once: true,
      });

      return () => {
        ro.disconnect();
        st.kill();
        tlRef.current?.kill();
        ctx?.revert();
      };
    }

    const onEnter = () => tlRef.current?.play();
    const onLeave = () => tlRef.current?.reverse();

    if (parent) {
      parent.addEventListener("mouseenter", onEnter);
      parent.addEventListener("mouseleave", onLeave);
    }

    return () => {
      ro.disconnect();
      tlRef.current?.kill();
      ctx?.revert();
      if (parent) {
        parent.removeEventListener("mouseenter", onEnter);
        parent.removeEventListener("mouseleave", onLeave);
      }
    };
  }, [variant, radius, color, strokeWidth, duration, autoPlay]);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        borderRadius: `${radius}px`,
      }}
    >
      <svg ref={svgRef} style={{ position: "absolute", top: 0, left: 0 }} aria-hidden="true" />
    </div>
  );
}
