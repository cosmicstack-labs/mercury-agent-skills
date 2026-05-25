"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface Props {
  /** Width in px. Height is computed from the asset's aspect ratio. */
  size?: number;
  className?: string;
  /** Alt text. Defaults to "Mercury Skills". */
  alt?: string;
  /**
   * - "icon" (default): square mark, 1:1.
   * - "full":          wordmark / lockup, ~16:9.
   */
  variant?: "icon" | "full";
}

const ASSETS = {
  icon: {
    dark: { src: "/logo-dark.png", w: 500, h: 500 },
    light: { src: "/logo-light.png", w: 500, h: 500 },
  },
  full: {
    dark: { src: "/logo-full-dark.png", w: 674, h: 370 },
    light: { src: "/logo-full-light.png", w: 674, h: 370 },
  },
} as const;

/**
 * Theme-aware Mercury Skills logo.
 *
 * SSR renders the dark-mode asset (matches our default `dark` theme);
 * once mounted, swaps to whatever `next-themes` resolves the client to.
 */
export default function Logo({
  size = 20,
  className,
  alt = "Mercury Skills",
  variant = "icon",
}: Props) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const themeKey = !mounted || resolvedTheme === "dark" ? "dark" : "light";
  const asset = ASSETS[variant][themeKey];
  const height = Math.round((size * asset.h) / asset.w);

  return (
    <Image
      src={asset.src}
      alt={alt}
      width={size}
      height={height}
      priority
      className={className}
      // Skip optimization for these small static brand assets so the
      // theme swap can be a simple <img> re-render without serving
      // through /_next/image (which can't be conditional on theme).
      unoptimized
    />
  );
}
