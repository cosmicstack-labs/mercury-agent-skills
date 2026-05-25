/**
 * Site-wide social card fallback (homepage, /category/*, /bookmarks, etc.).
 * Per-skill pages override this via app/skills/[...slug]/opengraph-image.tsx.
 *
 * Statically generated once per build, immutable on the CDN.
 */
import { ImageResponse } from "next/og";
import { listSkillIds } from "@/lib/skills";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Mercury Skills - Open source skills library";
export const dynamic = "force-static";
export const revalidate = false;

export default async function Image() {
  const skillCount = listSkillIds().length;

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
          padding: "72px",
          background:
            "radial-gradient(circle at 50% 30%, rgba(201,168,255,0.25) 0%, transparent 55%), radial-gradient(circle at 15% 90%, rgba(201,168,255,0.12) 0%, transparent 50%), linear-gradient(180deg, #0a0c10 0%, #08090b 100%)",
          color: "#edeef0",
          fontFamily: "Geist, system-ui, sans-serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 112,
            height: 112,
            borderRadius: 26,
            background: "linear-gradient(140deg, #c9a8ff 0%, #8a5cf6 100%)",
            color: "#1a0f2e",
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            boxShadow: "0 12px 36px rgba(201,168,255,0.4)",
            marginBottom: 36,
          }}
        >
          M
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            color: "#ffffff",
            marginBottom: 20,
          }}
        >
          Mercury Skills
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#b1b6bf",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          Open source skills library for Mercury Agent, OpenClaw, Hermes & more.
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: 56,
            fontSize: 22,
            color: "#7b8089",
            fontFamily: "Geist, monospace",
            letterSpacing: "0.02em",
          }}
        >
          <span>{skillCount} skills</span>
          <span style={{ color: "#3a3d44" }}>·</span>
          <span>23 categories</span>
          <span style={{ color: "#3a3d44" }}>·</span>
          <span>skills.mercuryagent.sh</span>
        </div>
      </div>
    ),
    size,
  );
}
