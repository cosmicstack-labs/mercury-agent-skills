"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";

type AgentKey = "mercury" | "claude" | "codex" | "openclaw" | "hermes" | "other";

const RAW_BASE =
  "https://raw.githubusercontent.com/cosmicstack-labs/mercury-agent-skills/main/categories";
const REPO_BASE =
  "https://github.com/cosmicstack-labs/mercury-agent-skills/tree/main/categories";

interface Props {
  skillId: string; // e.g. "ai-ml/agent-audit-logging"
  skillName: string; // e.g. "agent-audit-logging"
  pageUrl: string; // canonical site URL for this skill
}

interface Tab {
  key: AgentKey;
  label: string;
  badge?: string;
}

const TABS: Tab[] = [
  { key: "mercury", label: "Mercury", badge: "Default" },
  { key: "claude", label: "Claude Code" },
  { key: "codex", label: "Codex" },
  { key: "openclaw", label: "OpenClaw" },
  { key: "hermes", label: "Hermes" },
  { key: "other", label: "Other" },
];

export default function InstallTabs({ skillId, skillName, pageUrl }: Props) {
  const [active, setActive] = useState<AgentKey>("mercury");
  const rawUrl = `${RAW_BASE}/${skillId}/SKILL.md`;
  const repoUrl = `${REPO_BASE}/${skillId}`;

  return (
    <div className="space-y-3">
      <div className="text-[11px] uppercase font-mono tracking-wider text-[color:var(--color-fg-subtle)]">
        Install
      </div>

      {/* Tab strip — underlined active tab in brand color, muted inactives.
          Only one tab is "active" at a time (mutually exclusive). */}
      <div
        role="tablist"
        aria-label="Install instructions per agent"
        className="flex flex-wrap items-center gap-x-1 gap-y-0 border-b border-[color:var(--color-border)] -mx-0.5"
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`install-panel-${t.key}`}
              id={`install-tab-${t.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.key)}
              className={`relative text-xs px-2.5 py-2 -mb-px border-b-2 transition-colors ${
                isActive
                  ? "text-[color:var(--color-brand)] border-[color:var(--color-brand)] font-medium"
                  : "text-[color:var(--color-fg-muted)] border-transparent hover:text-[color:var(--color-fg)]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <div
        role="tabpanel"
        id={`install-panel-${active}`}
        aria-labelledby={`install-tab-${active}`}
        className="space-y-3"
      >
        {active === "mercury" && (
          <MercuryPanel skillId={skillId} />
        )}
        {active === "claude" && (
          <ClaudePanel skillName={skillName} rawUrl={rawUrl} />
        )}
        {active === "codex" && (
          <CodexPanel skillName={skillName} rawUrl={rawUrl} pageUrl={pageUrl} />
        )}
        {active === "openclaw" && (
          <OpenClawPanel skillName={skillName} rawUrl={rawUrl} />
        )}
        {active === "hermes" && (
          <HermesPanel skillName={skillName} rawUrl={rawUrl} />
        )}
        {active === "other" && (
          <OtherPanel rawUrl={rawUrl} pageUrl={pageUrl} repoUrl={repoUrl} />
        )}
      </div>
    </div>
  );
}

/* ---------- Panels ---------- */

function MercuryPanel({ skillId }: { skillId: string }) {
  return (
    <>
      <CommandBlock command={`mercury skills install ${skillId}`} />
      <Hint>
        Requires the{" "}
        <a
          href="https://github.com/cosmicstack-labs/mercury-agent-skills"
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-80"
        >
          Mercury CLI
        </a>
        . Skills land in <Code>~/.mercury/skills/</Code>.
      </Hint>
    </>
  );
}

function ClaudePanel({ skillName, rawUrl }: { skillName: string; rawUrl: string }) {
  // Claude Code reads project-level CLAUDE.md and user-level skills from
  // ~/.claude/skills/<name>/SKILL.md. We mirror the SKILL.md into that path.
  const cmd = `mkdir -p ~/.claude/skills/${skillName} && \\\n  curl -fsSL ${rawUrl} -o ~/.claude/skills/${skillName}/SKILL.md`;
  return (
    <>
      <CommandBlock command={cmd} multiline />
      <Hint>
        Installs the skill into <Code>~/.claude/skills/</Code> where{" "}
        <a
          href="https://docs.claude.com/en/docs/claude-code/overview"
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-80"
        >
          Claude Code
        </a>{" "}
        auto-discovers it on next launch.
      </Hint>
    </>
  );
}

function CodexPanel({
  skillName,
  rawUrl,
  pageUrl,
}: {
  skillName: string;
  rawUrl: string;
  pageUrl: string;
}) {
  // OpenAI Codex CLI uses ~/.codex/AGENTS.md for instructions and supports
  // per-project AGENTS.md. We append the skill as a section.
  const cmd = `curl -fsSL ${rawUrl} >> ~/.codex/AGENTS.md`;
  return (
    <>
      <CommandBlock command={cmd} />
      <Hint>
        Appends the skill to your global{" "}
        <a
          href="https://github.com/openai/codex"
          target="_blank"
          rel="noreferrer"
          className="underline hover:opacity-80"
        >
          Codex CLI
        </a>{" "}
        instructions at <Code>~/.codex/AGENTS.md</Code>. Or reference it directly
        in a chat: paste the page URL.
      </Hint>
      <LinkRow href={pageUrl} label="Skill page" />
    </>
  );
}

function OpenClawPanel({
  skillName,
  rawUrl,
}: {
  skillName: string;
  rawUrl: string;
}) {
  const cmd = `mkdir -p ~/.openclaw/skills/${skillName} && \\\n  curl -fsSL ${rawUrl} -o ~/.openclaw/skills/${skillName}/SKILL.md`;
  return (
    <>
      <CommandBlock command={cmd} multiline />
      <Hint>
        Drops the skill into <Code>~/.openclaw/skills/</Code>. Restart your
        OpenClaw session for it to register.
      </Hint>
    </>
  );
}

function HermesPanel({
  skillName,
  rawUrl,
}: {
  skillName: string;
  rawUrl: string;
}) {
  // Hermes (Nous Research) is a model family. Pattern: fetch SKILL.md and
  // prepend it to the system prompt for a given session/project.
  const cmd = `curl -fsSL ${rawUrl} -o ./skills/${skillName}.md`;
  return (
    <>
      <CommandBlock command={cmd} />
      <Hint>
        Hermes models (Nous Research) consume skills as system-prompt context.
        Download the SKILL.md and prepend it to your system prompt, or load it
        through your inference harness (e.g. Ollama Modelfile, llama.cpp{" "}
        <Code>--system-prompt-file</Code>).
      </Hint>
    </>
  );
}

function OtherPanel({
  rawUrl,
  pageUrl,
  repoUrl,
}: {
  rawUrl: string;
  pageUrl: string;
  repoUrl: string;
}) {
  return (
    <>
      <CommandBlock command={`curl -fsSL ${rawUrl}`} />
      <Hint>
        Every skill is a single <Code>SKILL.md</Code> file. Point your agent at
        one of the URLs below, or pipe the file straight into its system prompt.
      </Hint>
      <div className="grid gap-1.5 pt-1">
        <LinkRow href={pageUrl} label="Skill page" />
        <LinkRow href={rawUrl} label="Raw SKILL.md" />
        <LinkRow href={repoUrl} label="Source on GitHub" />
      </div>
    </>
  );
}

/* ---------- Primitives ---------- */

function CommandBlock({
  command,
  multiline = false,
}: {
  command: string;
  multiline?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={copy}
      className="group w-full flex items-start justify-between gap-2 px-3 py-2.5 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] hover:border-[color:var(--color-border-strong)] font-mono text-xs text-left"
    >
      <code
        className={`text-[color:var(--color-fg)] ${
          multiline ? "whitespace-pre-wrap break-all" : "truncate"
        }`}
      >
        $ {command}
      </code>
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[color:var(--color-success)] shrink-0 mt-0.5" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-[color:var(--color-fg-subtle)] group-hover:text-[color:var(--color-fg)] shrink-0 mt-0.5" />
      )}
    </button>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-[color:var(--color-fg-subtle)] leading-relaxed">
      {children}
    </p>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11px] px-1 py-0.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-fg-muted)]">
      {children}
    </code>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-2 text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] px-2 py-1.5 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)]"
    >
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
    </a>
  );
}
