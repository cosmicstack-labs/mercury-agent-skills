"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import searchIndex from "@/content/search-index.json";

interface Doc {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  excerpt: string;
}

const docs = searchIndex as Doc[];

function scoreDoc(doc: Doc, q: string): number {
  const qLower = q.toLowerCase();
  const tokens = qLower.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  let score = 0;
  const fields: { value: string; weight: number }[] = [
    { value: doc.name.toLowerCase(), weight: 10 },
    { value: doc.title.toLowerCase(), weight: 8 },
    { value: doc.category.toLowerCase(), weight: 4 },
    { value: doc.tags.join(" ").toLowerCase(), weight: 5 },
    { value: doc.description.toLowerCase(), weight: 2 },
    { value: doc.excerpt.toLowerCase(), weight: 1 },
  ];
  for (const tok of tokens) {
    for (const f of fields) {
      if (!f.value) continue;
      if (f.value === tok) score += f.weight * 3;
      else if (f.value.startsWith(tok)) score += f.weight * 2;
      else if (f.value.includes(tok)) score += f.weight;
      else {
        // simple fuzzy: allow single missing char
        if (tok.length > 3) {
          for (let i = 0; i < tok.length; i++) {
            const trial = tok.slice(0, i) + tok.slice(i + 1);
            if (trial.length > 2 && f.value.includes(trial)) {
              score += f.weight * 0.4;
              break;
            }
          }
        }
      }
    }
  }
  return score;
}

export default function SearchBox({
  autoFocus = false,
  size = "md",
}: {
  autoFocus?: boolean;
  size?: "md" | "lg";
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isLg = size === "lg";

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return docs
      .map((d) => ({ d, s: scoreDoc(d, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.d);
  }, [q]);

  useEffect(() => {
    setActive(0);
  }, [q]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onKeyDown(e: React.KeyboardEvent) {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) router.push(`/skills/${hit.id}`);
    }
  }

  return (
    <div className={`relative w-full ${isLg ? "max-w-3xl" : "max-w-2xl"}`}>
      {isLg && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-2xl bg-[radial-gradient(ellipse_at_center,var(--color-brand)_0%,transparent_60%)] opacity-[0.12] blur-2xl"
        />
      )}
      <div
        className={`relative flex items-center gap-3 rounded-xl border bg-[color:var(--color-bg-elev)] focus-within:border-[color:var(--color-brand)] focus-within:ring-2 focus-within:ring-[color:var(--color-brand)]/30 transition-all ${
          isLg
            ? "border-[color:var(--color-border-strong)] px-5 py-4 shadow-xl shadow-black/20"
            : "border-[color:var(--color-border-strong)] px-4 py-3"
        }`}
      >
        <SearchIcon
          className={`text-[color:var(--color-fg-subtle)] ${isLg ? "w-5 h-5" : "w-4 h-4"}`}
        />
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={
            isLg ? "Search 126 skills, tags, categories…" : "Search skills, tags, categories…"
          }
          className={`flex-1 bg-transparent outline-none placeholder:text-[color:var(--color-fg-subtle)] ${
            isLg ? "text-lg" : "text-[15px]"
          }`}
        />
        <kbd
          className={`hidden sm:inline-block font-mono rounded border border-[color:var(--color-border)] text-[color:var(--color-fg-subtle)] ${
            isLg ? "text-xs px-2 py-1" : "text-[10px] px-1.5 py-0.5"
          }`}
        >
          ⌘K
        </kbd>
      </div>
      {open && q.trim() && (
        <div className="absolute z-40 mt-2 w-full rounded-lg border border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)] shadow-2xl overflow-hidden animate-fade-in">
          {results.length === 0 ? (
            <div className="p-6 text-sm text-[color:var(--color-fg-muted)]">
              No skills match <span className="font-mono text-[color:var(--color-fg)]">{q}</span>
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto">
              {results.map((r, i) => (
                <li key={r.id}>
                  <Link
                    href={`/skills/${r.id}`}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-[color:var(--color-border)] last:border-0 ${
                      i === active ? "bg-[color:var(--color-bg-elev-2)]" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[color:var(--color-fg)] truncate">
                          {r.title}
                        </span>
                        <span className="text-[10px] uppercase font-mono text-[color:var(--color-fg-subtle)]">
                          {r.category}
                        </span>
                      </div>
                      <div className="text-xs text-[color:var(--color-fg-muted)] truncate mt-0.5">
                        {r.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[color:var(--color-fg-subtle)] shrink-0 mt-1" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
