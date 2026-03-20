import { motion } from "framer-motion";
import SeverityBadge from "./SeverityBadge";

interface DetectionCardProps {
  ruleId: string;
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  category: string;
  attack: string;
  triggerLogic: string;
  logSource?: string;
}

const severityStripe: Record<string, string> = {
  CRITICAL: "severity-stripe-critical",
  HIGH: "severity-stripe-high",
  MEDIUM: "severity-stripe-medium",
  LOW: "severity-stripe-low",
};

const DetectionCard = ({ ruleId, name, severity, category, attack, triggerLogic, logSource }: DetectionCardProps) => (
  <motion.div
    className={`rounded-xl border border-border bg-card p-5 card-hover glow-box ${severityStripe[severity]}`}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-start justify-between mb-3">
      <div>
        <span className="text-[10px] font-mono text-muted-foreground/60">{ruleId}</span>
        <h4 className="text-sm font-display font-semibold text-foreground">{name}</h4>
      </div>
      <SeverityBadge level={severity} />
    </div>

    <div className="flex flex-wrap gap-2 mb-3">
      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-secondary text-secondary-foreground border border-border">{category}</span>
      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-accent/10 text-accent border border-accent/20">{attack}</span>
    </div>

    {logSource && (
      <p className="text-xs text-muted-foreground mb-2">
        <span className="text-primary/50 font-mono text-[10px] uppercase tracking-wider mr-1.5">Log</span>
        <span className="text-foreground/60">{logSource}</span>
      </p>
    )}

    <p className="text-xs text-foreground/60 leading-relaxed">
      <span className="text-primary/50 font-mono text-[10px] uppercase tracking-wider mr-1.5">Trigger</span>
      {triggerLogic}
    </p>
  </motion.div>
);

export default DetectionCard;
