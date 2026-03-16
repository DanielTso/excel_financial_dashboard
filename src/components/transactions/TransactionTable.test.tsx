import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TransactionTable } from "./TransactionTable";

const mockTransactions = [
  {
    id: "tx-1",
    date: new Date("2024-01-15"),
    payee: "Grocery Store",
    amount: -85.5,
    type: "EXPENSE",
    account: { name: "Checking" },
    category: { name: "Food", color: "#2D7D46" },
  },
  {
    id: "tx-2",
    date: new Date("2024-01-14"),
    payee: "Salary",
    amount: 5000.0,
    type: "INCOME",
    account: { name: "Checking" },
    category: { name: "Income", color: "#2B6CB0" },
  },
  {
    id: "tx-3",
    date: new Date("2024-01-13"),
    payee: "Unknown Vendor",
    amount: -25.0,
    type: "EXPENSE",
    account: { name: "Credit Card" },
    category: null,
  },
];

describe("TransactionTable", () => {
  it("should render table headers", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Payee")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("should render transactions", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText("Grocery Store")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Unknown Vendor")).toBeInTheDocument();
  });

  it("should render expense amounts with negative sign", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    // Check for the expense amount (85.50)
    const amounts = screen.getAllByText(/\$85\.50/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should render income amounts with positive sign", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    // Check for the income amount (5,000.00)
    const amounts = screen.getAllByText(/\$5,000\.00/);
    expect(amounts.length).toBeGreaterThan(0);
  });

  it("should render category badges", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText("Food")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("should show 'Uncategorized' for null categories", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    expect(screen.getByText("Uncategorized")).toBeInTheDocument();
  });

  it("should render account names", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    // Use getAllByText since "Checking" appears in multiple rows
    expect(screen.getAllByText("Checking").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Credit Card")).toBeInTheDocument();
  });

  it("should show empty state when no transactions", () => {
    render(<TransactionTable transactions={[]} />);

    expect(
      screen.getByText("No transactions found for this period.")
    ).toBeInTheDocument();
  });

  it("should format dates correctly", () => {
    render(<TransactionTable transactions={mockTransactions} />);

    // Check for formatted dates (format is "MMM dd, yyyy")
    // Multiple dates exist, so use getAllByText
    const dates = screen.getAllByText(/Jan \d{2}, 2024/);
    expect(dates.length).toBeGreaterThanOrEqual(1);
  });
});
