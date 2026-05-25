import { createHighlighter, type Highlighter } from "shiki";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Cache the highlighter on globalThis so each worker keeps a single instance
// across page renders (Shiki warns at 10+ instances per process otherwise).
declare global {
  // eslint-disable-next-line no-var
  var __mercuryShiki: Promise<Highlighter> | undefined;
}

function getHighlighter(): Promise<Highlighter> {
  if (!globalThis.__mercuryShiki) {
    globalThis.__mercuryShiki = createHighlighter({
      themes: ["github-dark-dimmed", "github-light"],
      langs: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "bash",
        "shell",
        "py",
        "python",
        "md",
        "markdown",
        "css",
        "html",
        "yaml",
        "yml",
        "sql",
        "go",
        "rust",
        "dockerfile",
      ],
    });
  }
  return globalThis.__mercuryShiki;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function flattenChildren(children: ReactNode): string {
  if (children == null) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(flattenChildren).join("");
  if (typeof children === "object" && "props" in (children as object)) {
    return flattenChildren((children as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

const headingFactory = (level: 1 | 2 | 3 | 4) => {
  const Tag = `h${level}` as const;
  return function Heading({ children }: { children?: ReactNode }) {
    const id = slugify(flattenChildren(children));
    return (
      <Tag id={id} className="heading-anchor group">
        {children}
        <a
          href={`#${id}`}
          aria-label="Link to this section"
          className="heading-anchor-link"
        >
          #
        </a>
      </Tag>
    );
  };
};

async function CodeBlock({ code, lang }: { code: string; lang: string }) {
  try {
    const hl = await getHighlighter();
    const resolvedLang = hl.getLoadedLanguages().includes(lang as never) ? lang : "text";
    const html = hl.codeToHtml(code, {
      lang: resolvedLang,
      themes: {
        dark: "github-dark-dimmed",
        light: "github-light",
      },
      defaultColor: false,
    });
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return (
      <pre>
        <code>{code}</code>
      </pre>
    );
  }
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: headingFactory(1),
          h2: headingFactory(2),
          h3: headingFactory(3),
          h4: headingFactory(4),
          // ReactMarkdown emits <pre><code class="language-x">...</code></pre>
          // for fenced blocks. We intercept the <pre> wrapper to render via Shiki.
          pre({ children }) {
            // children should be a single <code> element
            const el = children as { props?: { className?: string; children?: ReactNode } };
            const className = el?.props?.className ?? "";
            const lang = /language-(\w+)/.exec(className)?.[1] ?? "text";
            const code = flattenChildren(el?.props?.children).replace(/\n$/, "");
            return <CodeBlock code={code} lang={lang} />;
          },
          code({ className, children }) {
            // inline code only (fenced blocks are handled by `pre` above)
            if (className) return <code className={className}>{children}</code>;
            return <code>{children}</code>;
          },
          a({ href, children }) {
            return (
              <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                {children}
              </a>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
