import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  search: string;
  severity: string;
  category: string;
}

interface DetectionFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const severities = ["ALL", "CRITICAL", "HIGH", "MEDIUM"];
const categories = ["ALL", "Brute Force", "PS Abuse", "Priv Esc"];

const severityColors: Record<string, string> = {
  ALL: "text-foreground border-primary/30 bg-primary/10",
  CRITICAL: "text-severity-critical border-severity-critical/30 bg-severity-critical/10",
  HIGH: "text-severity-high border-severity-high/30 bg-severity-high/10",
  MEDIUM: "text-severity-medium border-severity-medium/30 bg-severity-medium/10",
};

const DetectionFilter = ({ onFilterChange }: DetectionFilterProps) => {
  const [filters, setFilters] = useState<FilterState>({ search: "", severity: "ALL", category: "ALL" });

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    onFilterChange(next);
  };

  const isFiltered = filters.search !== "" || filters.severity !== "ALL" || filters.category !== "ALL";

  return (
    <motion.div
      className="rounded-xl border border-border bg-card/80 p-4 glow-box space-y-3"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by rule ID, name, or ATT&CK technique..."
          value={filters.search}
          onChange={(e) => update({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/80 border border-border text-xs font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
        />
        {isFiltered && (
          <button
            onClick={() => update({ search: "", severity: "ALL", category: "ALL" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* Severity filter */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-[10px] font-mono text-muted-foreground/60 mr-1">Severity</span>
          <div className="flex gap-1">
            {severities.map((s) => (
              <button
                key={s}
                onClick={() => update({ severity: s })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold border transition-all ${
                  filters.severity === s
                    ? severityColors[s]
                    : "text-muted-foreground/60 bg-secondary/50 border-border hover:border-primary/15 hover:text-muted-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-muted-foreground/60 mr-1">Category</span>
          <div className="flex gap-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => update({ category: c })}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all ${
                  filters.category === c
                    ? "text-primary bg-primary/10 border-primary/30"
                    : "text-muted-foreground/60 bg-secondary/50 border-border hover:border-primary/15 hover:text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetectionFilter;
