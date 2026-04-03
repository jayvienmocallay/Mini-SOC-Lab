import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ChevronDown } from "lucide-react";

const useCounter = (target: number, duration = 1500, delay = 600) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const step = Math.ceil(target / (duration / 16));
      const interval = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(interval);
        } else {
          setCount(start);
        }
      }, 16);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
};

const Particles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; life: number; maxLife: number }[] = [];
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        life: Math.random() * 200,
        maxLife: 200 + Math.random() * 200,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        if (p.life > p.maxLife) {
          p.life = 0;
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }
        const progress = p.life / p.maxLife;
        const fade = progress < 0.1 ? progress / 0.1 : progress > 0.9 ? (1 - progress) / 0.1 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(160, 100%, 45%, ${p.opacity * fade})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(160, 100%, 45%, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
};

const stats = [
  { icon: Shield, label: "Detection Rules", value: 12, suffix: "" },
  { icon: Lock, label: "Attack Categories", value: 3, suffix: "" },
  { icon: Eye, label: "Dashboards", value: 5, suffix: "" },
  { icon: FileText, label: "Test Scenarios", value: 8, suffix: "" },
];

const HeroSection = () => {
  // Keep hook calls at top level to satisfy Rules of Hooks.
  const counter0 = useCounter(stats[0].value, 1200, 500);
  const counter1 = useCounter(stats[1].value, 1200, 650);
  const counter2 = useCounter(stats[2].value, 1200, 800);
  const counter3 = useCounter(stats[3].value, 1200, 950);
  const counters = [counter0, counter1, counter2, counter3];

  return (
    <section id="hero" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-accent/3" />
      <Particles />

      {/* Radial glow behind title */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="relative text-center max-w-3xl mx-auto px-6 z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-xs font-mono text-primary/90">SRS-SOC-2026-001 &bull; v1.0 &bull; CONFIDENTIAL</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-4 tracking-tight">
          Mini <span className="text-primary glow-text relative">SOC
            <span className="absolute -inset-1 bg-primary/10 blur-xl rounded-lg -z-10" />
          </span> Lab
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-display mb-2">
          Blue Team Detection & Response Platform
        </p>
        <p className="text-sm text-muted-foreground/60 max-w-xl mx-auto mb-12 leading-relaxed">
          Software Requirements Specification for a controlled, isolated environment for log ingestion, detection engineering, threat hunting, and incident response workflows.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
          {stats.map(({ icon: Icon, label, suffix }, i) => (
            <motion.div
              key={label}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl glass card-hover cursor-default"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-2xl font-display font-bold text-primary tabular-nums">
                {counters[i]}{suffix}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground text-center leading-tight">{label}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 flex flex-wrap justify-center gap-4 text-[10px] font-mono text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span>March 2026</span>
          <span>&bull;</span>
          <span>SOC Engineering Team</span>
          <span>&bull;</span>
          <span>Draft &mdash; Pending Approval</span>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-primary/40 mx-auto" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
