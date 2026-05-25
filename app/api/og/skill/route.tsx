/**
 * Dynamic per-skill social card (1200x630) for Twitter / X, Facebook, LinkedIn,
 * Slack, WhatsApp, Discord, etc.
 *
 * Why a route handler (instead of an `opengraph-image.tsx` file)?
 *   Next.js 16 does not allow the `opengraph-image` metadata-file convention
 *   inside a catch-all segment (`[...slug]`). The build fails with
 *   "Catch-all must be the last part of the URL in route". We get equivalent
 *   behavior by exposing this handler at `/api/og/skill?id=...` and pointing
 *   the page's `<meta og:image>` at it via `generateMetadata`.
 *
 * Caching:
 *   - `dynamic = "force-static"` + `revalidate = false` makes Next prerender
 *     one PNG per unique `?id=` query at build time (when reached via
 *     `generateStaticParams`-like crawling) and serve it from the CDN with an
 *     immutable Cache-Control header.
 *   - We also set explicit `Cache-Control: public, max-age=0,
 *     s-maxage=31536000, immutable` on the response so any CDN (including
 *     Vercel's) caches it forever and revalidates only when our build emits a
 *     new artifact.
 *   - Social crawlers (Twitter, Facebook, WhatsApp, Slack, LinkedIn, Discord)
 *     hit the CDN; this function does not re-run on each share.
 */
import { ImageResponse } from "next/og";
import { getSkillById } from "@/lib/skills";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

const SIZE = { width: 1200, height: 630 };

// Long-lived immutable cache headers - PNG bytes are content-addressed by
// build hash, so safe to cache forever.
const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
  "Content-Type": "image/png",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  const skill = getSkillById(id);

  if (!skill) {
    // Fallback so this endpoint never 500s; matches the site-wide card.
    return fallbackCard();
  }

  const title = skill.title;
  const titleSize =
    title.length > 60 ? 56 : title.length > 40 ? 68 : title.length > 24 ? 80 : 92;
  const description = clamp(skill.description, 180);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background:
            "radial-gradient(circle at 12% 8%, rgba(201,168,255,0.22) 0%, transparent 55%), radial-gradient(circle at 88% 92%, rgba(201,168,255,0.10) 0%, transparent 55%), linear-gradient(180deg, #0a0c10 0%, #08090b 100%)",
          color: "#edeef0",
          fontFamily: "Geist, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar: brand lockup + category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <LogoMark />
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#b1b6bf",
                fontWeight: 600,
              }}
            >
              Mercury Skills
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              borderRadius: 999,
              border: "1px solid rgba(201,168,255,0.4)",
              background: "rgba(201,168,255,0.10)",
              color: "#c9a8ff",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            {skill.category}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: titleSize,
            lineHeight: 1.05,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            color: "#ffffff",
            marginBottom: 24,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            lineHeight: 1.45,
            color: "#b1b6bf",
            maxWidth: "92%",
          }}
        >
          {description}
        </div>

        <div style={{ flex: 1, display: "flex" }} />

        {/* Bottom bar: install command + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "Geist, monospace",
              fontSize: 22,
              color: "#edeef0",
            }}
          >
            <span style={{ color: "#7b8089" }}>$</span>
            <span>mercury skills install {skill.id}</span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: "#7b8089",
              letterSpacing: "0.02em",
            }}
          >
            skills.mercuryagent.sh
          </div>
        </div>
      </div>
    ),
    { ...SIZE, headers: CACHE_HEADERS },
  );
}

function fallbackCard() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 30%, rgba(201,168,255,0.22), transparent 60%), #08090b",
          color: "#edeef0",
          fontFamily: "Geist, system-ui, sans-serif",
          gap: 24,
        }}
      >
        <LogoMark size={96} />
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "#ffffff",
          }}
        >
          Mercury Skills
        </div>
        <div style={{ fontSize: 30, color: "#b1b6bf" }}>
          Open source skills for the Mercury Agent.
        </div>
      </div>
    ),
    { ...SIZE, headers: CACHE_HEADERS },
  );
}

function LogoMark({ size: s = 56 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: s,
        height: s,
        borderRadius: s * 0.22,
        background: "linear-gradient(140deg, #c9a8ff 0%, #8a5cf6 100%)",
        color: "#1a0f2e",
        fontSize: s * 0.55,
        fontWeight: 800,
        letterSpacing: "-0.04em",
        boxShadow: "0 8px 24px rgba(201,168,255,0.35)",
      }}
    >
      M
    </div>
  );
}

function clamp(s: string, n: number) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return cut.slice(0, cut.lastIndexOf(" ") || n).trimEnd() + "…";
}
