const keywordSets: Record<string, string[]> = {
  go: [
    "break",
    "case",
    "chan",
    "const",
    "continue",
    "defer",
    "else",
    "fallthrough",
    "for",
    "func",
    "go",
    "if",
    "import",
    "interface",
    "map",
    "package",
    "range",
    "return",
    "select",
    "struct",
    "switch",
    "type",
    "var",
  ],
  javascript: [
    "async",
    "await",
    "catch",
    "class",
    "const",
    "else",
    "export",
    "for",
    "from",
    "function",
    "if",
    "import",
    "let",
    "new",
    "return",
    "throw",
    "try",
    "var",
    "while",
  ],
  python: [
    "and",
    "as",
    "async",
    "await",
    "class",
    "def",
    "elif",
    "else",
    "except",
    "finally",
    "for",
    "from",
    "if",
    "import",
    "in",
    "is",
    "lambda",
    "not",
    "or",
    "pass",
    "raise",
    "return",
    "try",
    "while",
    "with",
    "yield",
  ],
  rust: [
    "async",
    "await",
    "const",
    "crate",
    "else",
    "enum",
    "fn",
    "for",
    "if",
    "impl",
    "let",
    "loop",
    "match",
    "mod",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "self",
    "struct",
    "trait",
    "type",
    "use",
    "where",
    "while",
  ],
  typescript: [
    "async",
    "await",
    "catch",
    "class",
    "const",
    "else",
    "export",
    "extends",
    "for",
    "from",
    "function",
    "if",
    "implements",
    "import",
    "interface",
    "let",
    "new",
    "private",
    "protected",
    "public",
    "readonly",
    "return",
    "throw",
    "try",
    "type",
    "var",
    "while",
  ],
};

const literals = new Set([
  "False",
  "None",
  "True",
  "false",
  "nil",
  "null",
  "true",
  "undefined",
]);

function highlightCode(code: string, language = "typescript") {
  const keywords = new Set([
    ...(keywordSets[language] ?? keywordSets.typescript),
    ...keywordSets.javascript,
  ]);
  const tokenPattern =
    /(\/\/.*|#.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b|[{}()[\].,;:+\-*/%=<>!&|?]+)/g;

  return code.split(tokenPattern).map((part, index) => {
    if (!part) {
      return null;
    }

    let className = "text-zinc-300";

    if (/^(\/\/|#|\/\*)/.test(part)) {
      className = "text-zinc-500";
    } else if (/^["'`]/.test(part)) {
      className = "text-emerald-200";
    } else if (/^\d/.test(part)) {
      className = "text-orange-200";
    } else if (keywords.has(part)) {
      className = "text-violet-200";
    } else if (literals.has(part)) {
      className = "text-cyan-200";
    } else if (/^[{}()[\].,;:+\-*/%=<>!&|?]+$/.test(part)) {
      className = "text-zinc-500";
    }

    return (
      <span className={className} key={`${part}-${index}`}>
        {part}
      </span>
    );
  });
}

type CodeBlockProps = {
  code: string;
  language?: string;
};

export function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <pre className="max-h-[460px] overflow-auto p-4 text-[13px] leading-6 sm:text-sm">
      <code>{highlightCode(code, language)}</code>
    </pre>
  );
}
