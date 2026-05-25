"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2, Copy, Check, X } from "lucide-react";

type Props = {
  /** Fully qualified URL to share. */
  url: string;
  /** Skill / page title used as the share text. */
  title: string;
  /** Short description appended to the share intent text where supported. */
  description?: string;
  /** Absolute URL to the OG image so we can render a live preview. */
  imageUrl?: string;
};

/**
 * ShareMenu - popover that shows a live preview of the generated OG card and
 * one-click share buttons for Twitter / X, LinkedIn, Facebook, WhatsApp,
 * Reddit, plus copy-link and the platform-native share sheet on mobile.
 *
 * The preview uses the same PNG that social crawlers will fetch, so what the
 * user sees here is exactly what their followers will see.
 */
export default function ShareMenu({ url, title, description, imageUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        popRef.current &&
        !popRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shareText = description ? `${title} — ${description}` : title;
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(title);

  const targets: Array<{ label: string; href: string; brand: string }> = [
    {
      label: "X / Twitter",
      brand: "#000000",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      brand: "#0a66c2",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Facebook",
      brand: "#1877f2",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: "WhatsApp",
      brand: "#25d366",
      href: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    },
    {
      label: "Reddit",
      brand: "#ff4500",
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    },
  ];

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  async function onNativeShare() {
    try {
      await navigator.share({ title, text: description, url });
      setOpen(false);
    } catch {
      // user dismissed - ignore
    }
  }

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Share"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)] transition-colors"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span>Share</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popRef}
            role="dialog"
            aria-label="Share this skill"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className="absolute z-50 right-0 mt-2 w-[340px] origin-top-right rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg)] shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--color-border)]">
              <div className="text-xs uppercase font-mono tracking-wider text-[color:var(--color-fg-subtle)]">
                Share
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="p-1 -m-1 rounded text-[color:var(--color-fg-subtle)] hover:text-[color:var(--color-fg)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Live preview of the generated OG card */}
            {imageUrl && (
              <div className="px-4 pt-3">
                <div className="rounded-lg overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] aspect-[1200/630]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={`Social card preview for ${title}`}
                    width={1200}
                    height={630}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-[11px] font-mono text-[color:var(--color-fg-subtle)] truncate">
                  {url.replace(/^https?:\/\//, "")}
                </div>
              </div>
            )}

            {/* Copy link */}
            <div className="px-4 pt-3">
              <button
                type="button"
                onClick={onCopy}
                className="w-full inline-flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)] transition-colors"
              >
                <span className="font-mono text-xs truncate text-[color:var(--color-fg-muted)]">
                  {url.replace(/^https?:\/\//, "")}
                </span>
                <span className="inline-flex items-center gap-1 text-xs shrink-0 text-[color:var(--color-fg)]">
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Share targets */}
            <div className="px-4 py-3 grid grid-cols-5 gap-2">
              {targets.map((t) => (
                <a
                  key={t.label}
                  href={t.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Share on ${t.label}`}
                  title={t.label}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <span
                    aria-hidden
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[11px] font-semibold transition-transform group-hover:scale-105 group-hover:shadow-lg"
                    style={{ backgroundColor: t.brand }}
                  >
                    {brandGlyph(t.label)}
                  </span>
                  <span className="text-[10px] font-mono text-[color:var(--color-fg-subtle)] group-hover:text-[color:var(--color-fg-muted)] truncate w-full text-center">
                    {shortLabel(t.label)}
                  </span>
                </a>
              ))}
            </div>

            {hasNativeShare && (
              <div className="px-4 pb-3 -mt-1">
                <button
                  type="button"
                  onClick={onNativeShare}
                  className="w-full inline-flex items-center justify-center gap-1.5 text-sm px-3 py-2 rounded-md border border-[color:var(--color-brand)]/40 bg-[color:var(--color-brand)]/10 text-[color:var(--color-brand)] hover:bg-[color:var(--color-brand)]/15 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  More options…
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function brandGlyph(name: string): string {
  switch (name) {
    case "X / Twitter":
      return "X";
    case "LinkedIn":
      return "in";
    case "Facebook":
      return "f";
    case "WhatsApp":
      return "Wa";
    case "Reddit":
      return "R";
    default:
      return name.charAt(0);
  }
}

function shortLabel(name: string): string {
  if (name === "X / Twitter") return "X";
  return name;
}
