import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getSkillById,
  getSkillBody,
  listSkillIds,
  getRelatedSkills,
} from "@/lib/skills";
import { storage } from "@/lib/storage";
import { Markdown } from "@/lib/mdx";
import { Github, User, Tag, ShieldAlert } from "lucide-react";
import LikeButton from "@/components/skill/LikeButton";
import BookmarkButton from "@/components/skill/BookmarkButton";
import ShareMenu from "@/components/skill/ShareMenu";
import InstallTabs from "@/components/skill/InstallTabs";
import SkillCard from "@/components/skill/SkillCard";

export const revalidate = 120;

export async function generateStaticParams() {
  return listSkillIds().map((id) => ({ slug: id.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const id = slug.join("/");
  const skill = getSkillById(id);
  if (!skill) return {};
  const url = `https://skills.mercuryagent.sh/skills/${id}`;
  // Per-skill OG image is generated dynamically by app/api/og/skill/route.tsx
  // (route handler instead of the file-convention because Next 16 forbids
  // `opengraph-image.tsx` inside catch-all segments). The handler emits
  // immutable Cache-Control headers so the CDN serves the same PNG for the
  // lifetime of the build.
  const ogImage = `https://skills.mercuryagent.sh/api/og/skill?id=${encodeURIComponent(id)}`;
  return {
    title: skill.title,
    description: skill.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: skill.title,
      description: skill.description,
      url,
      siteName: "Mercury Skills",
      images: [{ url: ogImage, width: 1200, height: 630, alt: skill.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: skill.title,
      description: skill.description,
      images: [ogImage],
    },
  };
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const id = slug.join("/");
  const skill = getSkillById(id);
  if (!skill) notFound();

  const body = getSkillBody(id);
  const stats = await storage().get(id);
  const related = getRelatedSkills(id, 4);

  return (
    <article className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="text-xs font-mono text-[color:var(--color-fg-subtle)] mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-[color:var(--color-fg-muted)]">
          /
        </Link>
        <span>›</span>
        <Link
          href={`/category/${skill.categorySlug}`}
          className="hover:text-[color:var(--color-fg-muted)]"
        >
          {skill.category}
        </Link>
        <span>›</span>
        <span className="text-[color:var(--color-fg-muted)]">{skill.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
        {/* Main */}
        <div className="min-w-0">
          <header className="space-y-5 pb-8 border-b border-[color:var(--color-border)]">
            {(skill.version || skill.author) && (
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[color:var(--color-fg-subtle)]">
                {skill.version && <span>v{skill.version}</span>}
                {skill.author && (
                  <span className="inline-flex items-center gap-1">
                    <User className="w-3 h-3" /> {skill.author}
                  </span>
                )}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
              {skill.title}
            </h1>
            <p className="text-lg text-[color:var(--color-fg-muted)] leading-relaxed max-w-3xl">
              {skill.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <LikeButton id={skill.id} initial={stats.likes} />
              <BookmarkButton id={skill.id} />
              <ShareMenu
                url={`https://skills.mercuryagent.sh/skills/${skill.id}`}
                title={skill.title}
                description={skill.description}
                imageUrl={`/api/og/skill?id=${encodeURIComponent(skill.id)}`}
              />
              <a
                href={skill.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)]"
              >
                <Github className="w-3.5 h-3.5" />
                View source
              </a>
              <span className="ml-auto text-xs text-[color:var(--color-fg-subtle)] font-mono">
                {stats.downloads} downloads
              </span>
            </div>
            {skill.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <Tag className="w-3 h-3 text-[color:var(--color-fg-subtle)]" />
                {skill.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[color:var(--color-border)] text-[color:var(--color-fg-muted)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="pt-10 space-y-6">
            <ReviewNotice />
            <Markdown source={body} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
          <InstallTabs
            skillId={skill.id}
            skillName={skill.name}
            pageUrl={`https://skills.mercuryagent.sh/skills/${skill.id}`}
          />

          {skill.headings.length > 1 && (
            <div className="space-y-2">
              <div className="text-[11px] uppercase font-mono tracking-wider text-[color:var(--color-fg-subtle)]">
                On this page
              </div>
              <ul className="space-y-1.5 text-sm border-l border-[color:var(--color-border)] pl-3">
                {skill.headings
                  .filter((h) => h.depth >= 2 && h.depth <= 3)
                  .slice(0, 20)
                  .map((h) => (
                    <li
                      key={h.slug}
                      style={{ paddingLeft: `${(h.depth - 2) * 12}px` }}
                    >
                      <a
                        href={`#${h.slug}`}
                        className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] block leading-snug"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {related.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] uppercase font-mono tracking-wider text-[color:var(--color-fg-subtle)]">
                Related
              </div>
              <div className="space-y-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/skills/${r.id}`}
                    className="block p-3 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-elev)]"
                  >
                    <div className="text-sm font-medium leading-snug">{r.title}</div>
                    <div className="text-[11px] uppercase font-mono text-[color:var(--color-fg-subtle)] mt-0.5">
                      {r.category}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* More from category */}
      <section className="mt-20 pt-10 border-t border-[color:var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">More in {skill.category}</h2>
          <Link
            href={`/category/${skill.categorySlug}`}
            className="text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {related.slice(0, 3).map((r) => (
            <SkillCard key={r.id} skill={r} />
          ))}
        </div>
      </section>
    </article>
  );
}

function ReviewNotice() {
  return (
    <aside
      role="note"
      className="flex items-start gap-3 px-4 py-3 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)]"
    >
      <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0 text-[color:var(--color-brand)]" />
      <div className="text-xs leading-relaxed text-[color:var(--color-fg-muted)]">
        <span className="text-[color:var(--color-fg)] font-medium">Review before you ship.</span>{" "}
        Skills in this library are community-contributed and aren&apos;t audited by us.
        Read the SKILL.md, check any commands it asks your agent to run, and confirm it
        fits your use case before installing into a real environment.
      </div>
    </aside>
  );
}
