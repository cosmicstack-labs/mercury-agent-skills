#!/usr/bin/env tsx
/**
 * build-skills.ts
 *
 * Walks ./categories/<category>/<slug>/SKILL.md and emits:
 *   - content/skills.json          (flat index for listings + APIs)
 *   - content/skills/<id>.mdx      (full body per skill, with frontmatter stripped)
 *   - content/search-index.json    (pre-built FlexSearch index data)
 *
 * The id of a skill is "<category>/<slug>" and matches the URL.
 *
 * Designed to be idempotent and tolerant of an empty `categories/` directory
 * (which is the state of the orphan branch before the sync workflow runs).
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, rmSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";

const ROOT = process.cwd();
const CATEGORIES_DIR = join(ROOT, "categories");
const CONTENT_DIR = join(ROOT, "content");
const SKILLS_OUT_DIR = join(CONTENT_DIR, "skills");

const GITHUB_BASE =
  "https://github.com/cosmicstack-labs/mercury-agent-skills/tree/main/categories";

/**
 * In production the GitHub Action copies categories/ from main into this branch
 * before building. In local dev (and on a fresh clone) we hydrate it ourselves
 * from the main branch via `git archive`, so `npm run dev` just works.
 */
function hydrateCategoriesFromMain() {
  if (existsSync(CATEGORIES_DIR) && readdirSync(CATEGORIES_DIR).length > 0) return;
  // try git archive from main (works in clones that have main fetched)
  const candidates = ["main", "origin/main", "refs/remotes/origin/main"];
  for (const ref of candidates) {
    try {
      console.log(`→ categories/ missing; hydrating from ${ref} via git archive`);
      execSync(`git archive ${ref} categories | tar -x -C "${ROOT}"`, {
        stdio: ["ignore", "ignore", "pipe"],
        shell: "/bin/bash",
      });
      if (existsSync(CATEGORIES_DIR)) {
        console.log("✓ hydrated categories/ successfully");
        return;
      }
    } catch {
      // try next ref
    }
  }
  console.warn(
    "! could not hydrate categories/ from a local main branch. " +
      "Run `git fetch origin main` and rerun, or copy categories/ manually."
  );
}

export interface SkillIndexEntry {
  id: string;
  slug: string;
  category: string;
  categorySlug: string;
  name: string;
  title: string;
  description: string;
  tags: string[];
  author?: string;
  version?: string;
  icon?: string;
  readingTime: number;
  headings: { depth: number; text: string; slug: string }[];
  excerpt: string;
  githubUrl: string;
  updatedAt: string;
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry === "SKILL.md") out.push(full);
  }
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CATEGORY_OVERRIDES: Record<string, string> = {
  "ai-ml": "AI / ML",
  "devops": "DevOps",
  "pdf-generation": "PDF Generation",
  "testing-qa": "Testing & QA",
  "shop-restaurant": "Shop & Restaurant",
  "media-download": "Media",
  "finance-legal": "Finance & Legal",
  "health-wellness": "Health & Wellness",
  "creative-personal-development": "Personal Development",
  "education-learning": "Education",
};

function titleize(s: string): string {
  return s
    .split(/[-_/]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function categoryName(slug: string): string {
  return CATEGORY_OVERRIDES[slug] ?? titleize(slug);
}

function extractHeadings(body: string) {
  const lines = body.split("\n");
  const headings: { depth: number; text: string; slug: string }[] = [];
  let inCode = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) inCode = !inCode;
    if (inCode) continue;
    const m = /^(#{1,6})\s+(.+)$/.exec(line);
    if (m) {
      const depth = m[1].length;
      const text = m[2].replace(/[#*`]/g, "").trim();
      headings.push({ depth, text, slug: slugify(text) });
    }
  }
  return headings;
}

function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function firstParagraph(body: string): string {
  const trimmed = body.replace(/^#.*\n+/, "").trim();
  const para = trimmed.split(/\n\s*\n/)[0] ?? "";
  return para.replace(/\s+/g, " ").slice(0, 280);
}

function normalizeTags(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof raw === "string") {
    return raw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function ensureDir(d: string) {
  mkdirSync(d, { recursive: true });
}

function clean() {
  if (existsSync(SKILLS_OUT_DIR)) rmSync(SKILLS_OUT_DIR, { recursive: true, force: true });
  ensureDir(SKILLS_OUT_DIR);
}

function build() {
  hydrateCategoriesFromMain();
  ensureDir(CONTENT_DIR);
  clean();

  const files = walk(CATEGORIES_DIR);
  const entries: SkillIndexEntry[] = [];

  for (const file of files) {
    const rel = relative(CATEGORIES_DIR, file);
    const parts = rel.split(sep);
    if (parts.length < 2) continue;
    const categorySlug = parts[0];
    const slug = parts.slice(1, -1).join("/"); // support nested
    const id = `${categorySlug}/${slug}`;
    const raw = readFileSync(file, "utf8");

    let data: Record<string, unknown> = {};
    let meta: Record<string, unknown> = {};
    let body = raw.trim();
    try {
      const parsed = matter(raw);
      data = (parsed.data ?? {}) as Record<string, unknown>;
      meta = (data.metadata ?? {}) as Record<string, unknown>;
      body = parsed.content.trim();
    } catch {
      // Fallback: hand-parse minimal frontmatter (tolerates unescaped quotes etc.)
      const m = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/.exec(raw);
      if (m) {
        body = m[2].trim();
        for (const line of m[1].split("\n")) {
          const kv = /^(\w+):\s*(.*)$/.exec(line);
          if (kv) {
            const v = kv[2].trim().replace(/^['"]|['"]$/g, "");
            data[kv[1]] = v;
          }
        }
      } else {
        console.warn(`! frontmatter parse failed for ${rel}; using filename only`);
      }
    }

    const name = String(data.name ?? slug);
    const titleFromBody = /^#\s+(.+)$/m.exec(body)?.[1]?.trim();
    const title = titleFromBody ?? titleize(name);
    const description = String(data.description ?? "").replace(/^['"]|['"]$/g, "").trim();
    const tags = normalizeTags(meta.tags ?? data.tags);
    const author = meta.author ? String(meta.author) : undefined;
    const version = meta.version ? String(meta.version) : undefined;
    const icon = data.icon ? String(data.icon) : undefined;

    const headings = extractHeadings(body);
    const excerpt = firstParagraph(body);
    const readingTime = estimateReadingTime(body);
    const updatedAt = statSync(file).mtime.toISOString();

    const entry: SkillIndexEntry = {
      id,
      slug,
      category: categoryName(categorySlug),
      categorySlug,
      name,
      title,
      description: description || excerpt,
      tags,
      author,
      version,
      icon,
      readingTime,
      headings,
      excerpt,
      githubUrl: `${GITHUB_BASE}/${id}`,
      updatedAt,
    };
    entries.push(entry);

    // write per-skill mdx body (just the markdown after frontmatter)
    const outPath = join(SKILLS_OUT_DIR, `${id.replace(/\//g, "__")}.mdx`);
    ensureDir(join(SKILLS_OUT_DIR));
    writeFileSync(outPath, body, "utf8");
  }

  entries.sort((a, b) => a.id.localeCompare(b.id));

  // categories summary
  const categoryMap = new Map<string, { slug: string; name: string; count: number }>();
  for (const e of entries) {
    const cur = categoryMap.get(e.categorySlug);
    if (cur) cur.count++;
    else categoryMap.set(e.categorySlug, { slug: e.categorySlug, name: e.category, count: 1 });
  }
  const categories = [...categoryMap.values()].sort((a, b) => a.name.localeCompare(b.name));

  writeFileSync(
    join(CONTENT_DIR, "skills.json"),
    JSON.stringify({ skills: entries, categories, generatedAt: new Date().toISOString() }, null, 2),
    "utf8"
  );

  // simple search index payload — FlexSearch instances are rebuilt on the client
  // from this lightweight doc list so we don't ship a serialized index format.
  const searchDocs = entries.map((e) => ({
    id: e.id,
    name: e.name,
    title: e.title,
    description: e.description,
    category: e.category,
    tags: e.tags,
    excerpt: e.excerpt,
  }));
  writeFileSync(
    join(CONTENT_DIR, "search-index.json"),
    JSON.stringify(searchDocs),
    "utf8"
  );

  console.log(`✓ built ${entries.length} skills across ${categories.length} categories`);
  for (const c of categories) console.log(`  ${c.name.padEnd(30)} ${c.count}`);
}

build();
