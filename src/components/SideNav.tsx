import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Server, Database, FileText, AlertTriangle, Terminal, TestTube, Lock, BookOpen, ChevronRight, Menu, X } from "lucide-react";

const sections = [
  { id: "hero", label: "Overview", icon: Shield },
  { id: "purpose", label: "Purpose & Scope", icon: FileText },
  { id: "infrastructure", label: "Infrastructure", icon: Server },
  { id: "logs", label: "Log Collection", icon: Database },
  { id: "siem", label: "SIEM Platform", icon: Terminal },
  { id: "detections", label: "Detection Rules", icon: AlertTriangle },
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

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-card border border-border"
      >
        {collapsed ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
      </button>

      <nav className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300
        ${collapsed ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:w-64 w-64`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-mono text-sm font-bold text-primary">MINI SOC</h2>
              <p className="text-[10px] font-mono text-muted-foreground">SRS v1.0</p>
            </div>
          </div>
        </div>

        <div className="py-4 px-3 space-y-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => {
                  onNavigate(section.id);
                  setCollapsed(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-mono transition-all group
                  ${isActive ? 'bg-primary/10 text-primary glow-border border' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent'}`}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15 }}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                <span className="flex-1 text-left text-xs">{section.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-primary" />}
              </motion.button>
            );
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-[10px] font-mono text-muted-foreground">CONFIDENTIAL • INTERNAL USE</span>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SideNav;
