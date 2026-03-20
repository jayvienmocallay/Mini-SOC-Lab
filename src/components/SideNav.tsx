import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Server, Database, FileText, AlertTriangle, Terminal, TestTube, Lock, BookOpen, ChevronRight, Menu, X, BarChart3, ClipboardCheck, ScrollText } from "lucide-react";

const sections = [
  { id: "hero", label: "Overview", icon: Shield },
  { id: "purpose", label: "Purpose & Scope", icon: FileText },
  { id: "infrastructure", label: "Infrastructure", icon: Server },
  { id: "setup", label: "Setup Checklists", icon: ClipboardCheck },
  { id: "logs", label: "Log Collection", icon: Database },
  { id: "siem", label: "SIEM Platform", icon: Terminal },
  { id: "dashboards", label: "Dashboards", icon: BarChart3 },
  { id: "detections", label: "Detection Rules", icon: AlertTriangle },
  { id: "playbooks", label: "Response Playbooks", icon: ScrollText },
  { id: "testing", label: "Testing & Validation", icon: TestTube },
  { id: "nonfunctional", label: "Non-Functional", icon: Lock },
  { id: "appendix", label: "Appendices", icon: BookOpen },
];

interface SideNavProps {
  activeSection: string;
  onNavigate: (id: string) => void;
}

const SideNav = ({ activeSection, onNavigate }: SideNavProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = sections.findIndex((s) => s.id === activeSection);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-lg glass"
      >
        {collapsed ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {collapsed && (
          <motion.div
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCollapsed(false)}
          />
        )}
      </AnimatePresence>

      <nav className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300
        ${collapsed ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 w-64`}>

        {/* Scroll progress track along the right edge */}
        <div className="absolute right-0 top-0 w-[2px] h-full bg-border">
          <motion.div
            className="w-full bg-gradient-to-b from-primary to-accent rounded-full"
            style={{ height: `${scrollProgress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center relative">
              <Shield className="w-4 h-4 text-primary" />
              <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse-glow" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold text-primary tracking-wider">MINI SOC</h2>
              <p className="text-[10px] font-mono text-muted-foreground">SRS v1.0</p>
            </div>
          </div>
          {/* Mini progress bar */}
          <div className="mt-4 h-1 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <p className="text-[9px] font-mono text-muted-foreground/60 mt-1.5">{Math.round(scrollProgress * 100)}% read</p>
        </div>

        <div className="py-3 px-3 space-y-0.5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            const isPast = index < activeIndex;
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => {
                  onNavigate(section.id);
                  setCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-all group relative
                  ${isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'
                  }`}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
                    layoutId="activeIndicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : isPast
                      ? 'bg-primary/8 text-primary/50'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary/70'
                }`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="flex-1 text-left text-xs">{section.label}</span>
                {isActive && (
                  <ChevronRight className="w-3 h-3 text-primary" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-[10px] font-mono text-muted-foreground">CONFIDENTIAL &bull; INTERNAL USE</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
