"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";

interface AnimatedNumberProps {
  value: number;
  style?: CSSProperties;
  format?: (n: number) => string;
}

function defaultFormat(n: number) {
  return n.toLocaleString("en-US");
}

export function AnimatedNumber({ value, style, format = defaultFormat }: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    prevRef.current = value;
    if (from === to) return;

    const duration = 300;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setDisplayed(Math.round(from + (to - from) * eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(to);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  return <span style={style}>{format(displayed)}</span>;
}
