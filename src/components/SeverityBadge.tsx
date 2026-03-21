interface SeverityBadgeProps {
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

const styles: Record<string, string> = {
  CRITICAL: "bg-severity-critical/15 text-severity-critical border-severity-critical/25",
  HIGH: "bg-severity-high/15 text-severity-high border-severity-high/25",
  MEDIUM: "bg-severity-medium/15 text-severity-medium border-severity-medium/25",
  LOW: "bg-severity-low/15 text-severity-low border-severity-low/25",
};

const SeverityBadge = ({ level }: SeverityBadgeProps) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${styles[level]}`}>
    <span className={`w-1.5 h-1.5 rounded-full bg-current ${level === "CRITICAL" ? "animate-pulse-glow" : ""}`} />
    {level}
  </span>
);

export default SeverityBadge;
