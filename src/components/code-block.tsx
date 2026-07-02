function highlightCode(code: string) {
  const tokenPattern =
    /(\/\/.*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|type|interface|export|import|from|async|await|class|new|try|catch|throw|null|undefined|true|false)\b|\b\d+(?:\.\d+)?\b)/g;

  return code.split(tokenPattern).map((part, index) => {
    if (!part) {
      return null;
    }

    let className = "text-zinc-300";

    if (/^\/\//.test(part) || /^\/\*/.test(part)) {
      className = "text-zinc-500";
    } else if (/^["'`]/.test(part)) {
      className = "text-emerald-200";
    } else if (/^\d/.test(part)) {
      className = "text-orange-200";
    } else if (/^[a-z]/i.test(part)) {
      className = "text-violet-200";
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
};

export function CodeBlock({ code }: CodeBlockProps) {
  return (
    <pre className="max-h-[460px] overflow-auto p-4 text-[13px] leading-6 sm:text-sm">
      <code>{highlightCode(code)}</code>
    </pre>
  );
}
