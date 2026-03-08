interface SeverityBadgeProps {
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

const styles: Record<string, string> = {
  CRITICAL: "bg-severity-critical/20 text-severity-critical border-severity-critical/30",
  HIGH: "bg-severity-high/20 text-severity-high border-severity-high/30",
  MEDIUM: "bg-severity-medium/20 text-severity-medium border-severity-medium/30",
  LOW: "bg-severity-low/20 text-severity-low border-severity-low/30",
};

const SeverityBadge = ({ level }: SeverityBadgeProps) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${styles[level]}`}>
    <span className="w-1.5 h-1.5 rounded-full bg-current" />
    {level}
  </span>
);

export default SeverityBadge;
