import Link from "next/link";
import type { SkillIndexEntry } from "@/lib/skills";

interface Props {
  skill: SkillIndexEntry;
  stats?: { likes: number; downloads: number };
}

export default function SkillCard({ skill, stats }: Props) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      className="group relative flex flex-col gap-3 p-5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev-2)] transition-colors"
    >
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-[color:var(--color-fg-subtle)]">
        <span>{skill.category}</span>
        <span className="font-mono">{skill.readingTime} min</span>
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--color-fg)] leading-snug tracking-tight">
        {skill.title}
      </h3>
      <p className="text-[15px] text-[color:var(--color-fg-muted)] line-clamp-3 leading-relaxed">
        {skill.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-2">
        <div className="flex flex-wrap gap-1.5">
          {skill.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
        {stats && (
          <div className="flex items-center gap-3 text-xs text-[color:var(--color-fg-subtle)] font-mono">
            <span>♥ {stats.likes}</span>
            <span>↓ {stats.downloads}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
