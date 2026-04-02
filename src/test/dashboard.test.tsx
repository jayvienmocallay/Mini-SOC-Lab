import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DashboardSection from "@/components/DashboardSection";

const hasWazuhPasswordMock = vi.fn(() => false);
const setWazuhPasswordMock = vi.fn((password: string) => {
  if (password) hasWazuhPasswordMock.mockReturnValue(true);
});
const getAlertSeverityCountsMock = vi.fn();
const getAgentsMock = vi.fn();
const getLastWazuhErrorMock = vi.fn(() => null);

function filterDomProps(props: Record<string, unknown>) {
  const blocked = new Set([
    "initial",
    "animate",
    "exit",
    "whileInView",
    "whileHover",
    "whileTap",
    "viewport",
    "transition",
    "variants",
    "layoutId",
  ]);
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!blocked.has(key)) clean[key] = value;
  }
  return clean;
}

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterDomProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterDomProps(props)}>{children}</button>,
  },
}));

vi.mock("recharts", () => {
  const HtmlWrapper = ({ children }: any) => <div>{children}</div>;
  const SvgWrapper = ({ children }: any) => <svg>{children}</svg>;
  return {
    BarChart: SvgWrapper,
    Bar: SvgWrapper,
    PieChart: SvgWrapper,
    Pie: SvgWrapper,
    Cell: SvgWrapper,
    AreaChart: SvgWrapper,
    Area: SvgWrapper,
    XAxis: SvgWrapper,
    YAxis: SvgWrapper,
    CartesianGrid: SvgWrapper,
    Tooltip: HtmlWrapper,
    ResponsiveContainer: HtmlWrapper,
    Legend: HtmlWrapper,
  };
});

vi.mock("@/config/environment", () => ({
  env: {
    useLiveData: true,
    wazuhApiUrl: "https://192.168.56.100:55000",
    wazuhApiUser: "wazuh-wui",
    dashboardRefreshInterval: 60000,
    windowsEndpointIp: "192.168.56.10",
    linuxEndpointIp: "192.168.56.11",
    siemServerIp: "192.168.56.100",
  },
  getLiveDataEnvironmentIssues: () => [],
}));

vi.mock("@/services/wazuhApi", () => ({
  clearLastWazuhError: vi.fn(),
  getAgents: (...args: unknown[]) => getAgentsMock(...args),
  getAlertSeverityCounts: (...args: unknown[]) => getAlertSeverityCountsMock(...args),
  getLastWazuhError: (...args: unknown[]) => getLastWazuhErrorMock(...args),
  hasWazuhPassword: (...args: unknown[]) => hasWazuhPasswordMock(...args),
  setWazuhPassword: (...args: unknown[]) => setWazuhPasswordMock(...args),
}));

describe("DashboardSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    hasWazuhPasswordMock.mockReturnValue(false);
    getLastWazuhErrorMock.mockReturnValue(null);
    getAlertSeverityCountsMock.mockResolvedValue({ critical: 0, high: 0, medium: 0, low: 0 });
    getAgentsMock.mockResolvedValue([]);
  });

  it("shows credential prompt when live mode has no password", async () => {
    render(<DashboardSection />);

    expect(
      await screen.findByText(/Live data enabled, but Wazuh credentials are missing/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Wazuh API password/i)).toBeInTheDocument();
  });

  it("saves credentials and retries when Save & Retry is clicked", async () => {
    render(<DashboardSection />);

    const input = await screen.findByPlaceholderText(/Enter Wazuh API password/i);
    fireEvent.change(input, { target: { value: "my-secret" } });

    fireEvent.click(screen.getByRole("button", { name: /Save & Retry/i }));

    await waitFor(() => {
      expect(setWazuhPasswordMock).toHaveBeenCalledWith("my-secret");
    });

    await waitFor(() => {
      expect(getAlertSeverityCountsMock).toHaveBeenCalled();
      expect(getAgentsMock).toHaveBeenCalled();
    });
  });
});
