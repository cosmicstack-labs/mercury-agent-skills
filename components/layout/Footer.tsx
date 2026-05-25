import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm text-[color:var(--color-fg-muted)]">
        <div>
          <span className="text-[color:var(--color-fg)] font-medium">Mercury Skills</span> &middot;
          Open source library for Mercury Agent, OpenClaw, Hermes, and more.
        </div>
        <nav className="flex gap-4">
          <Link href="/" className="hover:text-[color:var(--color-fg)]">
            Home
          </Link>
          <Link href="/leaderboard" className="hover:text-[color:var(--color-fg)]">
            Leaderboard
          </Link>
          <a
            href="https://github.com/cosmicstack-labs/mercury-agent-skills"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[color:var(--color-fg)]"
          >
            Contribute
          </a>
          <Link href="/api/feed.json" className="hover:text-[color:var(--color-fg)]">
            JSON Feed
          </Link>
        </nav>
      </div>
    </footer>
  );
}
