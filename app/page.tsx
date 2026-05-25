import Link from "next/link";
import { getAllSkills, getAllCategories } from "@/lib/skills";
import { getTopSkills, getStatsMap } from "@/lib/stats";
import SkillCard from "@/components/skill/SkillCard";
import SearchBox from "@/components/search/SearchBox";
import { ArrowRight, Sparkles, TrendingUp, Layers } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const allSkills = getAllSkills();
  const categories = getAllCategories();
  const [top, statsMap] = await Promise.all([getTopSkills(8), getStatsMap()]);
  const recent = [...allSkills]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--color-border)]">
        <div className="absolute inset-0 bg-dotted opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color:var(--color-bg)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="flex flex-col items-center text-center gap-7 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono px-3 py-1 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-fg-muted)]">
              <Sparkles className="w-3 h-3" />
              {allSkills.length} skills · {categories.length} categories
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
              Skills for the
              <br />
              <span className="text-[color:var(--color-brand)]">Mercury Agent.</span>
            </h1>
            <p className="text-lg md:text-xl text-[color:var(--color-fg-muted)] max-w-2xl leading-relaxed">
              A curated, open-source library of capabilities you can browse, bookmark, and install
              directly from the Mercury CLI.
            </p>
            <div className="w-full max-w-2xl mt-2 flex justify-center">
              <SearchBox autoFocus size="lg" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[color:var(--color-fg-subtle)] font-mono">
              <span className="mr-1">Try:</span>
              {["react patterns", "audit logging", "habit formation", "tailwind"].map((q) => (
                <Link
                  key={q}
                  href={`/?q=${encodeURIComponent(q)}`}
                  className="px-2.5 py-1 rounded-full border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-fg-muted)] transition-colors"
                >
                  {q}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <SectionHeader
          icon={<TrendingUp className="w-4 h-4" />}
          title="Trending skills"
          subtitle="Ranked by likes & downloads from the community."
          href="/leaderboard"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {top.map((s) => (
            <SkillCard key={s.id} skill={s} stats={statsMap[s.id]} />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[color:var(--color-border)]">
        <SectionHeader
          icon={<Layers className="w-4 h-4" />}
          title="Browse by category"
          subtitle={`${categories.length} curated categories of agent capabilities.`}
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-8">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="group flex items-center justify-between px-4 py-3 rounded-lg border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)] transition-colors"
            >
              <div>
                <div className="text-base font-medium">{c.name}</div>
                <div className="text-xs text-[color:var(--color-fg-subtle)] font-mono mt-1">
                  {c.count} skill{c.count === 1 ? "" : "s"}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[color:var(--color-fg-subtle)] group-hover:text-[color:var(--color-fg-muted)] group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recently added */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[color:var(--color-border)]">
        <SectionHeader title="Recently added" subtitle="The newest skills synced from main." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {recent.map((s) => (
            <SkillCard key={s.id} skill={s} stats={statsMap[s.id]} />
          ))}
        </div>
      </section>

      {/* CLI banner */}
      <section className="mx-auto max-w-6xl px-6 py-16 border-t border-[color:var(--color-border)]">
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider font-mono text-[color:var(--color-fg-subtle)]">
              CLI
            </div>
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Install skills from your terminal
            </h3>
            <p className="text-base text-[color:var(--color-fg-muted)] max-w-xl leading-relaxed">
              The Mercury CLI consumes the same registry that powers this site. Search, install, and
              update skills without leaving your editor.
            </p>
          </div>
          <pre className="bg-[color:var(--color-bg)] border border-[color:var(--color-border)] rounded-lg px-4 py-3 font-mono text-xs text-[color:var(--color-fg)] overflow-x-auto">
            <code>{`mercury skills search "react patterns"
mercury skills install frontend/react-patterns`}</code>
          </pre>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  href,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex items-end justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono text-[color:var(--color-fg-subtle)]">
          {icon}
          <span>{title}</span>
        </div>
        {subtitle && (
          <p className="text-base text-[color:var(--color-fg-muted)]">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] inline-flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
}
