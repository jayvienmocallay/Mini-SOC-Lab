import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText } from "lucide-react";

const HeroSection = () => (
  <section id="hero" className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
    {/* Background effects */}
    <div className="absolute inset-0 cyber-grid" />
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
    
    <motion.div
      className="relative text-center max-w-3xl mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
        <span className="text-xs font-mono text-primary">SRS-SOC-2026-001 • v1.0 • CONFIDENTIAL</span>
      </motion.div>

      <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4 tracking-tight">
        Mini <span className="text-primary glow-text">SOC</span> Lab
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground font-display mb-3">
        Blue Team Detection & Response Platform
      </p>
      <p className="text-sm text-muted-foreground/70 max-w-xl mx-auto mb-10">
        Software Requirements Specification for a controlled, isolated environment for log ingestion, detection engineering, threat hunting, and incident response workflows.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
        {[
          { icon: Shield, label: "12 Detection Rules" },
          { icon: Lock, label: "3 Attack Categories" },
          { icon: Eye, label: "5 Dashboards" },
          { icon: FileText, label: "8 Test Scenarios" },
        ].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            className="flex flex-col items-center gap-2 p-3 rounded-lg bg-card/50 border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Icon className="w-5 h-5 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground text-center">{label}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-10 flex flex-wrap justify-center gap-4 text-[10px] font-mono text-muted-foreground/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span>March 2026</span>
        <span>•</span>
        <span>SOC Engineering Team</span>
        <span>•</span>
        <span>Draft — Pending Approval</span>
      </motion.div>
    </motion.div>
  </section>
);

export default HeroSection;
