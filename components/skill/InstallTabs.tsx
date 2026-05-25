"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, ExternalLink, Terminal, Zap } from "lucide-react";

type AgentKey = "mercury" | "claude" | "codex" | "openclaw" | "hermes" | "other";

const RAW_BASE =
  "https://raw.githubusercontent.com/cosmicstack-labs/mercury-agent-skills/main/categories";
const REPO_BASE =
  "https://github.com/cosmicstack-labs/mercury-agent-skills/tree/main/categories";

interface Props {
  skillId: string;
  skillName: string;
  pageUrl: string;
}

interface Tab {
  key: AgentKey;
  label: string;
}

const TABS: Tab[] = [
  { key: "mercury", label: "Mercury" },
  { key: "claude", label: "Claude Code" },
  { key: "codex", label: "Codex" },
  { key: "openclaw", label: "OpenClaw" },
  { key: "hermes", label: "Hermes" },
  { key: "other", label: "Other" },
];

interface Step {
  title: string;
  command?: string;
  multiline?: boolean;
  hint?: React.ReactNode;
}

function buildSteps(active: AgentKey, ctx: { skillId: string; skillName: string; pageUrl: string }): Step[] {
  const { skillId, skillName, pageUrl } = ctx;
  const rawUrl = `${RAW_BASE}/${skillId}/SKILL.md`;
  const repoUrl = `${REPO_BASE}/${skillId}`;

  switch (active) {
    case "mercury":
      return [
        {
          title: "Install with the Mercury CLI",
          command: `mercury skills install ${skillId}`,
          hint: (
            <>
              Lands in <Code>~/.mercury/skills/</Code>. Requires the{" "}
              <Inline href="https://github.com/cosmicstack-labs/mercury-agent">
                Mercury agent
              </Inline>
              .
            </>
          ),
        },
      ];
    case "claude":
      return [
        {
          title: "Create the skill folder",
          command: `mkdir -p ~/.claude/skills/${skillName}`,
        },
        {
          title: "Download the SKILL.md",
          command: `curl -fsSL ${rawUrl} \\\n  -o ~/.claude/skills/${skillName}/SKILL.md`,
          multiline: true,
        },
        {
          title: "Restart Claude Code",
          hint: (
            <>
              <Inline href="https://docs.claude.com/en/docs/claude-code/overview">
                Claude Code
              </Inline>{" "}
              auto-discovers skills in <Code>~/.claude/skills/</Code> on launch.
            </>
          ),
        },
      ];
    case "codex":
      return [
        {
          title: "Append the skill to your Codex instructions",
          command: `curl -fsSL ${rawUrl} >> ~/.codex/AGENTS.md`,
        },
        {
          title: "Or reference it inline in chat",
          hint: (
            <>
              Paste the skill page URL into a Codex session and it will fetch the
              context on demand.
              <LinkRow href={pageUrl} label="Skill page" />
            </>
          ),
        },
      ];
    case "openclaw":
      return [
        {
          title: "Create the skill folder",
          command: `mkdir -p ~/.openclaw/skills/${skillName}`,
        },
        {
          title: "Download the SKILL.md",
          command: `curl -fsSL ${rawUrl} \\\n  -o ~/.openclaw/skills/${skillName}/SKILL.md`,
          multiline: true,
        },
        {
          title: "Reload your OpenClaw session",
          hint: <>The skill registers on the next agent restart.</>,
        },
      ];
    case "hermes":
      return [
        {
          title: "Download the SKILL.md",
          command: `curl -fsSL ${rawUrl} -o ./skills/${skillName}.md`,
        },
        {
          title: "Load it as system-prompt context",
          hint: (
            <>
              Hermes (Nous Research) is a model family — feed the file to your
              inference harness, e.g. <Code>llama.cpp --system-prompt-file</Code>{" "}
              or an Ollama <Code>Modelfile</Code>.
            </>
          ),
        },
      ];
    case "other":
      return [
        {
          title: "Fetch the raw skill",
          command: `curl -fsSL ${rawUrl}`,
        },
        {
          title: "Or point your agent at a URL",
          hint: (
            <>
              Every skill is a single <Code>SKILL.md</Code> file. Pick whichever
              URL your agent prefers:
              <div className="grid gap-1.5 pt-2">
                <LinkRow href={pageUrl} label="Skill page" />
                <LinkRow href={rawUrl} label="Raw SKILL.md" />
                <LinkRow href={repoUrl} label="Source on GitHub" />
              </div>
            </>
          ),
        },
      ];
  }
}

export default function InstallTabs({ skillId, skillName, pageUrl }: Props) {
  const [active, setActive] = useState<AgentKey>("mercury");
  const steps = buildSteps(active, { skillId, skillName, pageUrl });

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[11px] uppercase font-mono tracking-wider text-[color:var(--color-fg-subtle)]">
        <Terminal className="w-3.5 h-3.5" />
        Install
      </div>

      {/* Tab strip — sliding brand-color indicator behind the active tab. */}
      <div
        role="tablist"
        aria-label="Install instructions per agent"
        className="relative flex flex-wrap items-center gap-0.5 p-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)]"
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              aria-controls="install-panel"
              id={`install-tab-${t.key}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.key)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  const i = TABS.findIndex((x) => x.key === active);
                  const next =
                    e.key === "ArrowRight"
                      ? TABS[(i + 1) % TABS.length]
                      : TABS[(i - 1 + TABS.length) % TABS.length];
                  setActive(next.key);
                }
              }}
              className={`relative z-10 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                isActive
                  ? "text-[color:var(--color-brand)] font-medium"
                  : "text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)]"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="install-tab-indicator"
                  className="absolute inset-0 rounded-md bg-[color:var(--color-brand)]/10 border border-[color:var(--color-brand)]/40"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  aria-hidden
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Animated panel swap */}
      <div
        role="tabpanel"
        id="install-panel"
        aria-labelledby={`install-tab-${active}`}
        className="relative"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="space-y-2.5"
          >
            {steps.map((step, i) => (
              <StepRow key={i} index={i + 1} step={step} total={steps.length} />
            ))}
            <FooterMeta active={active} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Step row ---------- */

function StepRow({
  index,
  step,
  total,
}: {
  index: number;
  step: Step;
  total: number;
}) {
  const single = total === 1;
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        {!single && (
          <span
            className="mt-0.5 inline-flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-[color:var(--color-bg-elev)] border border-[color:var(--color-border)] text-[10px] font-mono text-[color:var(--color-fg-muted)]"
            aria-hidden
          >
            {index}
          </span>
        )}
        <div className="text-xs text-[color:var(--color-fg)] leading-snug pt-0.5">
          {step.title}
        </div>
      </div>
      {step.command && (
        <CommandBlock command={step.command} multiline={step.multiline} />
      )}
      {step.hint && (
        <div className="text-[11.5px] text-[color:var(--color-fg-subtle)] leading-relaxed pl-0">
          {step.hint}
        </div>
      )}
    </div>
  );
}

function FooterMeta({ active }: { active: AgentKey }) {
  if (active !== "mercury") return null;
  return (
    <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[color:var(--color-fg-subtle)]">
      <Zap className="w-3 h-3 text-[color:var(--color-brand)]" />
      Default installer for Mercury Skills.
    </div>
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
      className={`group relative w-full flex items-start justify-between gap-2 px-3 py-2.5 rounded-md border bg-[color:var(--color-bg-elev)] font-mono text-xs text-left transition-colors ${
        copied
          ? "border-[color:var(--color-success)]/60"
          : "border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)]"
      }`}
    >
      <code
        className={`text-[color:var(--color-fg)] ${
          multiline ? "whitespace-pre-wrap break-all" : "truncate"
        }`}
      >
        <span className="text-[color:var(--color-fg-subtle)] mr-1.5 select-none">$</span>
        {command}
      </code>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0 mt-0.5"
            aria-label="Copied"
          >
            <Check className="w-3.5 h-3.5 text-[color:var(--color-success)]" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="shrink-0 mt-0.5"
          >
            <Copy className="w-3.5 h-3.5 text-[color:var(--color-fg-subtle)] group-hover:text-[color:var(--color-fg)]" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-mono text-[11px] px-1 py-0.5 rounded border border-[color:var(--color-border)] bg-[color:var(--color-bg-elev)] text-[color:var(--color-fg-muted)]">
      {children}
    </code>
  );
}

function Inline({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 hover:opacity-80 text-[color:var(--color-fg-muted)]"
    >
      {children}
    </a>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-2 text-xs text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-fg)] px-2.5 py-1.5 rounded-md border border-[color:var(--color-border)] hover:border-[color:var(--color-border-strong)] bg-[color:var(--color-bg-elev)] transition-colors"
    >
      <span>{label}</span>
      <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
    </a>
  );
}
