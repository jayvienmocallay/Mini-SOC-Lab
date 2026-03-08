import { Terminal } from "lucide-react";

interface CodeBlockProps {
  title?: string;
  children: string;
  language?: string;
}

const CodeBlock = ({ title, children, language = "bash" }: CodeBlockProps) => (
  <div className="rounded-lg border border-border overflow-hidden my-4 glow-box">
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary border-b border-border">
      <Terminal className="w-3.5 h-3.5 text-primary" />
      <span className="text-xs font-mono text-muted-foreground">{title || language}</span>
      <div className="ml-auto flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-severity-critical/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-severity-medium/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-primary/60" />
      </div>
    </div>
    <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-foreground bg-background/50">
      <code>{children}</code>
    </pre>
  </div>
);

export default CodeBlock;
