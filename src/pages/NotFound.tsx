import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldOff, Terminal, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 cyber-grid" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      <motion.div
        className="relative text-center max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-severity-critical/10 border border-severity-critical/30 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-2 h-2 rounded-full bg-severity-critical animate-pulse" />
          <span className="text-[10px] font-mono text-severity-critical font-bold tracking-wider">ACCESS DENIED</span>
        </motion.div>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-severity-critical/10 border border-severity-critical/20 flex items-center justify-center">
            <ShieldOff className="w-8 h-8 text-severity-critical" />
          </div>
        </div>

        <h1 className="text-7xl font-display font-bold text-foreground mb-2 glow-text">404</h1>
        <p className="text-lg font-display text-muted-foreground mb-8">Route not found</p>

        <div className="rounded-lg border border-border bg-card p-4 mb-8 text-left glow-box">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground">system.log</span>
          </div>
          <div className="space-y-1.5 font-mono text-xs">
            <p><span className="text-muted-foreground">[timestamp]</span> <span className="text-severity-critical">ERR</span> Route not found</p>
            <p><span className="text-muted-foreground">[path]</span> <span className="text-primary">{location.pathname}</span></p>
            <p><span className="text-muted-foreground">[action]</span> <span className="text-foreground/70">Return to authenticated base</span></p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary/10 border border-primary/30 text-primary text-sm font-mono hover:bg-primary/20 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Base
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
