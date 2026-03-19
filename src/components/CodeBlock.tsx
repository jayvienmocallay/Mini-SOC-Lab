import { useState, useCallback } from "react";
import { Terminal, Copy, Check } from "lucide-react";

interface CodeBlockProps {
  title?: string;
  children: string;
  language?: string;
}

const CodeBlock = ({ title, children, language = "bash" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const lines = children.split("\n");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(children).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  return (
    <div className="rounded-xl border border-border overflow-hidden my-4 glow-box card-hover group">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/80 border-b border-border">
        <div className="flex gap-1.5 mr-2">
          <div className="w-2.5 h-2.5 rounded-full bg-severity-critical/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-severity-medium/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
        </div>
        <Terminal className="w-3.5 h-3.5 text-primary/60" />
        <span className="text-xs font-mono text-muted-foreground flex-1">{title || language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-mono text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-primary" />
              <span className="text-primary">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto bg-background/50">
        <table className="w-full">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-primary/3">
                <td className="px-3 py-0 text-right select-none w-8 text-[10px] font-mono text-muted-foreground/30 border-r border-border/30">
                  {i + 1}
                </td>
                <td className="px-4 py-0">
                  <pre className="text-xs font-mono leading-relaxed text-foreground/85 whitespace-pre">
                    <code>{line}</code>
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-2" />
      </div>
    </div>
  );
};

export default CodeBlock;
