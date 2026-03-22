import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Technique {
  id: string;
  name: string;
  rules: string[];
}

interface TacticColumn {
  tactic: string;
  tacticId: string;
  techniques: Technique[];
}

const coverage: TacticColumn[] = [
  {
    tactic: "Credential Access",
    tacticId: "TA0006",
    techniques: [
      { id: "T1110.001", name: "Password Guessing", rules: ["DET-BF-WIN-001", "DET-BF-LNX-001"] },
      { id: "T1110.003", name: "Password Spraying", rules: ["DET-BF-WIN-001"] },
      { id: "T1110", name: "Brute Force (Success)", rules: ["DET-BF-WIN-002"] },
    ],
  },
  {
    tactic: "Execution",
    tacticId: "TA0002",
    techniques: [
      { id: "T1059.001", name: "PowerShell", rules: ["DET-PS-001", "DET-PS-002", "DET-PS-003"] },
    ],
  },
  {
    tactic: "Defense Evasion",
    tacticId: "TA0005",
    techniques: [
      { id: "T1027.010", name: "Command Obfuscation", rules: ["DET-PS-001"] },
      { id: "T1562.001", name: "Disable/Modify Tools", rules: ["DET-PS-004"] },
    ],
  },
  {
    tactic: "Privilege Escalation",
    tacticId: "TA0004",
    techniques: [
      { id: "T1078.001", name: "Local Accounts", rules: ["DET-PE-WIN-001"] },
      { id: "T1134.001", name: "Token Impersonation", rules: ["DET-PE-WIN-002"] },
      { id: "T1548.001", name: "Setuid/Setgid", rules: ["DET-PE-LNX-002"] },
      { id: "T1548.003", name: "Sudo Caching", rules: ["DET-PE-LNX-001"] },
    ],
  },
  {
    tactic: "Persistence",
    tacticId: "TA0003",
    techniques: [
      { id: "T1053.005", name: "Scheduled Task", rules: ["DET-PE-WIN-003"] },
    ],
  },
  {
    tactic: "Lateral Movement",
    tacticId: "TA0008",
    techniques: [
      { id: "T1105", name: "Ingress Tool Transfer", rules: ["DET-PS-002"] },
    ],
  },
];

const MitreAttackMap = () => {
  const [selected, setSelected] = useState<Technique | null>(null);

  const totalTechniques = coverage.reduce((sum, t) => sum + t.techniques.length, 0);

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary/40 border border-primary/20" />
          <span className="text-[10px] font-mono text-muted-foreground">Covered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border" />
          <span className="text-[10px] font-mono text-muted-foreground">Not Covered</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[10px] font-mono text-primary/70">
            {coverage.length} Tactics
          </span>
          <span className="text-muted-foreground/30">|</span>
          <span className="text-[10px] font-mono text-primary/70">
            {totalTechniques} Techniques
          </span>
        </div>
      </div>

      {/* Matrix grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {coverage.map((col, ci) => (
          <motion.div
            key={col.tacticId}
            className="space-y-2"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: ci * 0.08 }}
          >
            {/* Tactic header */}
            <div className="rounded-lg bg-primary/8 border border-primary/15 p-2.5 text-center">
              <p className="text-[8px] font-mono text-primary/40 tracking-wider">{col.tacticId}</p>
              <p className="text-[11px] font-mono font-semibold text-primary leading-tight mt-0.5">{col.tactic}</p>
              <div className="mt-1.5 h-0.5 w-6 mx-auto rounded-full bg-primary/20" />
            </div>

            {/* Technique cells */}
            {col.techniques.map((tech) => (
              <motion.button
                key={tech.id}
                onClick={() => setSelected(selected?.id === tech.id ? null : tech)}
                className={`w-full rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                  selected?.id === tech.id
                    ? "bg-primary/15 border-primary/30 shadow-[0_0_15px_hsl(160_100%_45%/0.1)]"
                    : "bg-card/50 border-border hover:border-primary/25 hover:bg-primary/5"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <p className="text-[8px] font-mono text-primary/40">{tech.id}</p>
                <p className="text-[10px] font-mono text-foreground/80 leading-tight">{tech.name}</p>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {tech.rules.map((r) => (
                    <span key={r} className="text-[7px] font-mono text-primary/70 bg-primary/8 rounded-md px-1 py-0.5">
                      {r}
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="rounded-xl border border-primary/25 bg-card/80 p-5 glow-box"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono text-primary/50">{selected.id}</span>
                <h4 className="text-sm font-display font-semibold text-foreground">{selected.name}</h4>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider mb-2">Covered by detection rules</p>
            <div className="flex flex-wrap gap-2">
              {selected.rules.map((r) => (
                <span key={r} className="px-2.5 py-1.5 rounded-lg text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                  {r}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MitreAttackMap;
