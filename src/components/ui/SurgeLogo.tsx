"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

interface SurgeLogoProps {
  className?: string;
  size?: number;
}

export function SurgeLogo({ className, size = 32 }: SurgeLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const src =
    mounted && resolvedTheme === "light" ? "/surge-icon-dark.svg" : "/surge-icon-light.svg";

  // icon is 655×690 — height drives layout
  const width = Math.round(size * (655 / 690));

  return (
    <Image
      src={src}
      alt="SURGE Protocol"
      width={width}
      height={size}
      className={className}
      aria-label="SURGE Protocol logo mark"
      priority
    />
  );
}
