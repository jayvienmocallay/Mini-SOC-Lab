import { motion } from "framer-motion";
import { Server, Monitor, Terminal, Laptop } from "lucide-react";
import { env } from "@/config/environment";

interface NodeProps {
  x: number;
  y: number;
  icon: React.ReactNode;
  name: string;
  ip: string;
  role: string;
  delay: number;
}

const DiagramNode = ({ x, y, icon, name, ip, role, delay }: NodeProps) => (
  <motion.div
    className="absolute flex flex-col items-center"
    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
  >
    <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center mb-2 glow-box hover:glow-border hover:border-primary/40 transition-all">
      {icon}
    </div>
    <p className="text-xs font-display font-semibold text-foreground text-center whitespace-nowrap">{name}</p>
    <p className="text-[10px] font-mono text-primary">{ip}</p>
    <p className="text-[8px] font-mono text-muted-foreground text-center">{role}</p>
  </motion.div>
);

const AnimatedLine = ({ x1, y1, x2, y2, delay, label }: { x1: number; y1: number; x2: number; y2: number; delay: number; label: string }) => {
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const labelOffsetX = Math.sin(angle) * 12;
  const labelOffsetY = -Math.cos(angle) * 12;

  return (
    <>
      <motion.line
        x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`}
        stroke="hsl(160, 100%, 45%)"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeOpacity="0.4"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
      />
      <motion.circle
        r="3"
        fill="hsl(160, 100%, 45%)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0] }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.8, duration: 2, repeat: Infinity }}
      >
        <animateMotion
          dur="3s"
          repeatCount="indefinite"
          path={`M${x1 * 4.5},${y1 * 3.5} L${x2 * 4.5},${y2 * 3.5}`}
        />
      </motion.circle>
      <text
        x={`${midX + labelOffsetX}%`}
        y={`${midY + labelOffsetY}%`}
        textAnchor="middle"
        className="text-[8px] font-mono"
        fill="hsl(220, 10%, 50%)"
      >
        {label}
      </text>
    </>
  );
};

const NetworkDiagram = () => (
  <div className="space-y-4">
    <motion.div
      className="relative rounded-lg border border-border bg-card/50 overflow-hidden glow-box"
      style={{ height: 400 }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 cyber-grid opacity-50" />

      {/* Network label */}
      <motion.div
        className="absolute top-3 left-3 px-3 py-1 rounded bg-primary/10 border border-primary/20"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-[10px] font-mono text-primary">{env.networkSubnet} Host-Only Network</span>
      </motion.div>

      {/* Isolation badge */}
      <motion.div
        className="absolute top-3 right-3 px-3 py-1 rounded bg-severity-critical/10 border border-severity-critical/20"
        initial={{ opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-[10px] font-mono text-severity-critical">ISOLATED - NO EXTERNAL ROUTING</span>
      </motion.div>

      {/* SVG connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 450 350" preserveAspectRatio="xMidYMid meet">
        <AnimatedLine x1={50} y1={40} x2={25} y2={75} delay={0.5} label="WinEventLog / Sysmon" />
        <AnimatedLine x1={50} y1={40} x2={75} y2={75} delay={0.7} label="auditd / syslog" />
        <AnimatedLine x1={50} y1={40} x2={50} y2={90} delay={0.9} label="Management" />
      </svg>

      {/* Nodes */}
      <DiagramNode x={50} y={30} icon={<Server className="w-7 h-7 text-primary" />} name="SIEM Server" ip={env.siemServerIp} role="Wazuh Manager + Indexer + Dashboard" delay={0.1} />
      <DiagramNode x={20} y={72} icon={<Monitor className="w-7 h-7 text-accent" />} name="Windows EP" ip={env.windowsEndpointIp} role="Attack Target / Log Source" delay={0.2} />
      <DiagramNode x={80} y={72} icon={<Terminal className="w-7 h-7 text-accent" />} name="Linux EP" ip={env.linuxEndpointIp} role="Attack Target / Log Source" delay={0.3} />
      <DiagramNode x={50} y={92} icon={<Laptop className="w-7 h-7 text-muted-foreground" />} name="Host Machine" ip={env.hostMachineIp} role="Hypervisor Gateway" delay={0.4} />

      {/* Data flow legend */}
      <motion.div
        className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.2 }}
      >
        {[
          { label: "Log Forwarding", color: "bg-primary" },
          { label: "Alerts / Dashboard", color: "bg-accent" },
          { label: "Management", color: "bg-muted-foreground" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={`w-6 h-0.5 ${item.color} rounded-full`} />
            <span className="text-[9px] font-mono text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  </div>
);

export default NetworkDiagram;
