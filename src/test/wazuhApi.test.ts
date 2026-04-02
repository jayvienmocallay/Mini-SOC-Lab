import { beforeEach, describe, expect, it, vi } from "vitest";

const ZERO_COUNTS = { critical: 0, high: 0, medium: 0, low: 0 };

describe("wazuhApi", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it("returns fallback agents when live mode is disabled", async () => {
    vi.doMock("@/config/environment", () => ({
      env: {
        useLiveData: false,
        siemServerIp: "192.168.56.100",
        windowsEndpointIp: "192.168.56.10",
        linuxEndpointIp: "192.168.56.11",
        wazuhApiUrl: "https://example.invalid",
        wazuhApiUser: "wazuh-wui",
        wazuhRequestTimeout: 100,
      },
    }));

    const api = await import("@/services/wazuhApi");
    const agents = await api.getAgents();

    expect(agents).toHaveLength(3);
    expect(agents.map((a) => a.name)).toEqual(["windows-ep", "linux-ep", "siem-server"]);
  });

  it("stores and reads Wazuh password from session state", async () => {
    vi.doMock("@/config/environment", () => ({
      env: {
        useLiveData: false,
        siemServerIp: "192.168.56.100",
        windowsEndpointIp: "192.168.56.10",
        linuxEndpointIp: "192.168.56.11",
        wazuhApiUrl: "https://example.invalid",
        wazuhApiUser: "wazuh-wui",
        wazuhRequestTimeout: 100,
      },
    }));

    const api = await import("@/services/wazuhApi");
    expect(api.hasWazuhPassword()).toBe(false);

    api.setWazuhPassword("test-pass");
    expect(api.hasWazuhPassword()).toBe(true);

    api.clearWazuhAuth();
    expect(api.hasWazuhPassword()).toBe(true);
  });

  it("records AUTH_MISSING error when live mode runs without credentials", async () => {
    vi.doMock("@/config/environment", () => ({
      env: {
        useLiveData: true,
        siemServerIp: "192.168.56.100",
        windowsEndpointIp: "192.168.56.10",
        linuxEndpointIp: "192.168.56.11",
        wazuhApiUrl: "https://example.invalid",
        wazuhApiUser: "wazuh-wui",
        wazuhRequestTimeout: 100,
      },
    }));

    const api = await import("@/services/wazuhApi");
    const counts = await api.getAlertSeverityCounts();

    expect(counts).toEqual(ZERO_COUNTS);
    expect(api.getLastWazuhError()).toEqual(
      expect.objectContaining({
        code: "AUTH_MISSING",
      })
    );
  });

  it("records RESPONSE_INVALID when alert response body is malformed", async () => {
    vi.doMock("@/config/environment", () => ({
      env: {
        useLiveData: true,
        siemServerIp: "192.168.56.100",
        windowsEndpointIp: "192.168.56.10",
        linuxEndpointIp: "192.168.56.11",
        wazuhApiUrl: "https://example.invalid",
        wazuhApiUser: "wazuh-wui",
        wazuhRequestTimeout: 100,
      },
    }));

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: { token: "jwt-token" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

    vi.stubGlobal("fetch", fetchMock);

    const api = await import("@/services/wazuhApi");
    api.setWazuhPassword("secret");

    const counts = await api.getAlertSeverityCounts();

    expect(counts).toEqual(ZERO_COUNTS);
    expect(api.getLastWazuhError()).toEqual(
      expect.objectContaining({
        code: "RESPONSE_INVALID",
      })
    );
  });
});
