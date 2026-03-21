import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SeverityBadge from "@/components/SeverityBadge";
import DetectionFilter from "@/components/DetectionFilter";
import DataTable from "@/components/DataTable";
import CodeBlock from "@/components/CodeBlock";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...filterDomProps(props)}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...filterDomProps(props)}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

function filterDomProps(props: Record<string, any>) {
  const filtered: Record<string, any> = {};
  for (const [key, val] of Object.entries(props)) {
    if (!["initial", "animate", "exit", "whileInView", "whileHover", "whileTap", "viewport", "transition", "variants"].includes(key)) {
      filtered[key] = val;
    }
  }
  return filtered;
}

describe("SeverityBadge", () => {
  it("renders CRITICAL severity", () => {
    render(<SeverityBadge level="CRITICAL" />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("renders HIGH severity", () => {
    render(<SeverityBadge level="HIGH" />);
    expect(screen.getByText("HIGH")).toBeInTheDocument();
  });

  it("renders MEDIUM severity", () => {
    render(<SeverityBadge level="MEDIUM" />);
    expect(screen.getByText("MEDIUM")).toBeInTheDocument();
  });

  it("renders LOW severity", () => {
    render(<SeverityBadge level="LOW" />);
    expect(screen.getByText("LOW")).toBeInTheDocument();
  });
});

describe("DataTable", () => {
  it("renders headers and rows", () => {
    render(
      <DataTable
        headers={["Name", "Value"]}
        rows={[
          ["Alpha", "100"],
          ["Beta", "200"],
        ]}
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Value")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
  });

  it("renders compact variant", () => {
    const { container } = render(
      <DataTable compact headers={["H1"]} rows={[["R1"]]} />
    );
    expect(container.querySelector("table")).toBeInTheDocument();
  });
});

describe("CodeBlock", () => {
  it("renders code content", () => {
    render(<CodeBlock title="test.sh">echo hello</CodeBlock>);
    expect(screen.getByText("echo hello")).toBeInTheDocument();
    expect(screen.getByText("test.sh")).toBeInTheDocument();
  });
});

describe("DetectionFilter", () => {
  it("calls onFilterChange when search changes", () => {
    const onChange = vi.fn();
    render(<DetectionFilter onFilterChange={onChange} />);

    const input = screen.getByPlaceholderText(/search by rule/i);
    fireEvent.change(input, { target: { value: "T1110" } });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: "T1110" })
    );
  });

  it("calls onFilterChange when severity filter clicked", () => {
    const onChange = vi.fn();
    render(<DetectionFilter onFilterChange={onChange} />);

    fireEvent.click(screen.getByText("CRITICAL"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "CRITICAL" })
    );
  });

  it("calls onFilterChange when category filter clicked", () => {
    const onChange = vi.fn();
    render(<DetectionFilter onFilterChange={onChange} />);

    fireEvent.click(screen.getByText("Brute Force"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ category: "Brute Force" })
    );
  });
});
