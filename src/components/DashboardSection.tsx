import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Shield, Users, Wifi, RefreshCw, AlertCircle } from "lucide-react";
import { env } from "@/config/environment";
import { getAgents, getAlertSeverityCounts } from "@/services/wazuhApi";
import type { AlertSeverityCounts, WazuhAgent } from "@/services/wazuhApi";

// ── Types ────────────────────────────────────────────────────────────

interface SeverityRow { name: string; count: number; fill: string }
interface CategoryRow { name: string; value: number; fill: string }
interface TimelineRow { hour: string; events: number }
interface StatCard { label: string; value: string; color: string }
interface AgentRow { name: string; ip: string; status: "active" | "disconnected"; eps: number; uptime: string }

// ── Fallback generators (used when SIEM is not connected) ────────────

function fallbackSeverity(): SeverityRow[] {
  return [
    { name: "Critical", count: 0, fill: "hsl(0, 72%, 51%)" },
    { name: "High", count: 0, fill: "hsl(25, 95%, 53%)" },
    { name: "Medium", count: 0, fill: "hsl(45, 93%, 47%)" },
    { name: "Low", count: 0, fill: "hsl(210, 70%, 50%)" },
  ];
}

function fallbackCategory(): CategoryRow[] {
  return [
    { name: "Brute Force", value: 0, fill: "hsl(160, 100%, 45%)" },
    { name: "PS Abuse", value: 0, fill: "hsl(190, 100%, 45%)" },
    { name: "Priv Esc", value: 0, fill: "hsl(270, 70%, 60%)" },
  ];
}

function fallbackTimeline(): TimelineRow[] {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    events: 0,
  }));
}

function fallbackAgents(): AgentRow[] {
  return [
    { name: "Windows Endpoint", ip: env.windowsEndpointIp, status: "disconnected", eps: 0, uptime: "Not connected" },
    { name: "Linux Endpoint", ip: env.linuxEndpointIp, status: "disconnected", eps: 0, uptime: "Not connected" },
    { name: "SIEM Server", ip: env.siemServerIp, status: "disconnected", eps: 0, uptime: "Not connected" },
  ];
}

function fallbackStats(): StatCard[] {
  return [
    { label: "Total Failed Logins", value: "—", color: "text-severity-critical" },
    { label: "Unique Source IPs", value: "—", color: "text-severity-high" },
    { label: "Brute Force Candidates", value: "—", color: "text-severity-medium" },
    { label: "Accounts Targeted", value: "—", color: "text-primary" },
  ];
}

// ── Sub-components ───────────────────────────────────────────────────

const heatmapData: number[][] = Array.from({ length: 7 }, () =>
  Array.from({ length: 24 }, () => 0)
);
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const heatColor = (v: number) => {
  if (v <= 0) return "bg-secondary";
  if (v <= 2) return "bg-primary/10";
  if (v <= 5) return "bg-primary/25";
  if (v <= 8) return "bg-severity-medium/30";
  if (v <= 12) return "bg-severity-high/40";
  return "bg-severity-critical/50";
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md bg-card border border-border px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="text-foreground font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`rounded-lg border border-border bg-card p-5 glow-box ${className}`}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

// ── Main Component ───────────────────────────────────────────────────

const DashboardSection = () => {
  const [severityData, setSeverityData] = useState<SeverityRow[]>(fallbackSeverity);
  const [categoryData, setCategoryData] = useState<CategoryRow[]>(fallbackCategory);
  const [timelineData, setTimelineData] = useState<TimelineRow[]>(fallbackTimeline);
  const [statsData, setStatsData] = useState<StatCard[]>(fallbackStats);
  const [agentData, setAgentData] = useState<AgentRow[]>(fallbackAgents);
  const [isLive, setIsLive] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!env.useLiveData) return;
    setLoading(true);
    try {
      const [counts, agents] = await Promise.all([
        getAlertSeverityCounts(),
        getAgents(),
      ]);

      setSeverityData([
        { name: "Critical", count: counts.critical, fill: "hsl(0, 72%, 51%)" },
        { name: "High", count: counts.high, fill: "hsl(25, 95%, 53%)" },
        { name: "Medium", count: counts.medium, fill: "hsl(45, 93%, 47%)" },
        { name: "Low", count: counts.low, fill: "hsl(210, 70%, 50%)" },
      ]);

      setAgentData(agents.map((a: WazuhAgent) => ({
        name: a.name,
        ip: a.ip,
        status: a.status === "active" ? "active" as const : "disconnected" as const,
        eps: 0,
        uptime: a.status === "active" ? "Active" : "Disconnected",
      })));

      setIsLive(true);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch {
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (env.useLiveData) {
      const interval = setInterval(fetchData, env.dashboardRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData]);

  return (
    <div className="space-y-8">
      {/* Connection status banner */}
      <div className={`flex items-center gap-3 p-3 rounded-lg border ${
        isLive
          ? "bg-primary/5 border-primary/20"
          : "bg-severity-medium/5 border-severity-medium/20"
      }`}>
        {isLive ? (
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-primary animate-ping opacity-30" />
          </div>
        ) : (
          <AlertCircle className="w-4 h-4 text-severity-medium" />
        )}
        <div className="flex-1">
          <p className="text-[10px] font-mono text-foreground/80">
            {isLive
              ? `Connected to Wazuh API at ${env.wazuhApiUrl}`
              : `Not connected to SIEM — enable VITE_USE_LIVE_DATA=true in .env to connect to ${env.wazuhApiUrl}`
            }
          </p>
          {lastRefresh && (
            <p className="text-[9px] font-mono text-muted-foreground">Last refresh: {lastRefresh}</p>
          )}
        </div>
        {env.useLiveData && (
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${loading ? "animate-spin" : ""}`} />
          </button>
        )}
      </div>

      {/* Security Overview */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Security Overview
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Panel>
            <p className="text-xs font-mono text-muted-foreground mb-3">Alerts by Severity</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={severityData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {severityData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Panel>

          <Panel>
            <p className="text-xs font-mono text-muted-foreground mb-3">Detection Category Distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {categoryData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => <span className="text-[10px] font-mono text-muted-foreground ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </Panel>
        </div>

        <Panel className="mt-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">Events Over Time (24h)</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="eventsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(160, 100%, 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} interval={3} />
              <YAxis tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 9, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="events" stroke="hsl(160, 100%, 45%)" strokeWidth={2} fill="url(#eventsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      {/* Authentication Monitor */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" /> Authentication Monitor
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {statsData.map((s, i) => (
            <Panel key={i}>
              <p className="text-[10px] font-mono text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
            </Panel>
          ))}
        </div>

        <Panel>
          <p className="text-xs font-mono text-muted-foreground mb-3">Failed Login Heatmap (Day x Hour)</p>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex gap-0.5 mb-1 ml-10">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="flex-1 text-center text-[8px] font-mono text-muted-foreground">
                    {h % 4 === 0 ? `${String(h).padStart(2, "0")}` : ""}
                  </div>
                ))}
              </div>
              {heatmapData.map((row, d) => (
                <div key={d} className="flex items-center gap-0.5 mb-0.5">
                  <span className="w-10 text-[9px] font-mono text-muted-foreground text-right pr-2">{dayLabels[d]}</span>
                  {row.map((val, h) => (
                    <div key={h} className={`flex-1 h-5 rounded-sm ${heatColor(val)} transition-colors`} title={`${dayLabels[d]} ${String(h).padStart(2, "0")}:00 — ${val} failures`} />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 justify-end">
            <span className="text-[8px] font-mono text-muted-foreground">None</span>
            {["bg-secondary", "bg-primary/10", "bg-primary/25", "bg-severity-medium/30", "bg-severity-high/40", "bg-severity-critical/50"].map((c, i) => (
              <div key={i} className={`w-4 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-[8px] font-mono text-muted-foreground">High</span>
          </div>
        </Panel>
      </div>

      {/* Agent Health */}
      <div>
        <h3 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-primary" /> Agent Health
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {agentData.map((agent, i) => (
            <Panel key={i}>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full ${agent.status === "active" ? "bg-primary" : "bg-severity-critical"}`} />
                  {agent.status === "active" && (
                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-ping opacity-30" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">{agent.name}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{agent.ip}</p>
                </div>
                <span className={`ml-auto text-[10px] font-mono rounded px-1.5 py-0.5 border ${
                  agent.status === "active"
                    ? "text-primary border-primary/30"
                    : "text-severity-critical border-severity-critical/30"
                }`}>
                  {agent.status === "active" ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Ingestion Rate</span>
                  <span className="text-foreground">{agent.eps} EPS</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(agent.eps / 700) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                  <span>Status</span>
                  <span className={agent.status === "active" ? "text-primary" : "text-severity-critical"}>{agent.uptime}</span>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;
