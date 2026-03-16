import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "./KpiCard";

describe("KpiCard", () => {
  it("should render label and value", () => {
    render(<KpiCard label="Net Worth" value="$124,500" />);

    expect(screen.getByText("Net Worth")).toBeInTheDocument();
    expect(screen.getByText("$124,500")).toBeInTheDocument();
  });

  it("should render positive delta", () => {
    render(
      <KpiCard
        label="Revenue"
        value="$50,000"
        delta={{ value: "+12%", isPositive: true, label: "vs last month" }}
      />
    );

    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("should render negative delta", () => {
    render(
      <KpiCard
        label="Expenses"
        value="$30,000"
        delta={{ value: "-5%", isPositive: false }}
      />
    );

    expect(screen.getByText("-5%")).toBeInTheDocument();
  });

  it("should render without delta", () => {
    render(<KpiCard label="Total" value="$100" />);

    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const { container } = render(
      <KpiCard label="Test" value="$0" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should render delta without label", () => {
    render(
      <KpiCard
        label="Test"
        value="$100"
        delta={{ value: "+10%", isPositive: true }}
      />
    );

    expect(screen.getByText("+10%")).toBeInTheDocument();
    expect(screen.queryByText(/vs/)).not.toBeInTheDocument();
  });
});
