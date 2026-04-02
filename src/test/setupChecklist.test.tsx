import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SetupChecklist from "@/components/SetupChecklist";

const loadStateMock = vi.fn();
const saveStateMock = vi.fn();

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

vi.mock("@/components/ui/tabs", () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <button type="button">{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("@/components/ui/checkbox", () => ({
  Checkbox: ({ id, checked, onCheckedChange }: any) => (
    <input
      id={id}
      type="checkbox"
      checked={Boolean(checked)}
      onChange={onCheckedChange}
    />
  ),
}));

vi.mock("@/components/ui/progress", () => ({
  Progress: () => <div data-testid="progress" />,
}));

vi.mock("@/components/CodeBlock", () => ({
  default: ({ children }: any) => <pre>{children}</pre>,
}));

vi.mock("@/services/localStorage", () => ({
  loadState: (...args: unknown[]) => loadStateMock(...args),
  saveState: (...args: unknown[]) => saveStateMock(...args),
}));

describe("SetupChecklist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loadStateMock.mockReturnValue({});
  });

  it("loads initial checklist state from persistence", () => {
    loadStateMock.mockReturnValue({ "win-1": true });

    render(<SetupChecklist />);

    expect(loadStateMock).toHaveBeenCalledWith("setup-checklist", {});
    expect(
      screen.getByLabelText(/Install Windows 10\/11 Pro \(22H2\)/i)
    ).toBeChecked();
  });

  it("saves checklist state after user toggles an item", async () => {
    render(<SetupChecklist />);

    fireEvent.click(screen.getByLabelText(/Create test user: testuser \/ Password123!/i));

    await waitFor(() => {
      expect(saveStateMock).toHaveBeenLastCalledWith(
        "setup-checklist",
        expect.objectContaining({ "win-8": true })
      );
    });
  });
});
