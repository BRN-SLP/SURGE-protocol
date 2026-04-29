import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SecurityBanner } from "@/components/identity/manage/SecurityBanner";

describe("SecurityBanner", () => {
  it("shows secure state when activeCount >= 3", () => {
    render(<SecurityBanner activeCount={3} />);
    expect(screen.getByText("Multi-Wallet Security Active")).toBeInTheDocument();
    expect(screen.getByText(/distributed trust enabled/)).toBeInTheDocument();
  });

  it("shows recommendation when activeCount < 3", () => {
    render(<SecurityBanner activeCount={1} />);
    expect(screen.getByText("Security Recommendation")).toBeInTheDocument();
    expect(screen.getByText(/Link 2 more wallets/)).toBeInTheDocument();
  });

  it("shows singular 'wallet' when 1 more needed", () => {
    render(<SecurityBanner activeCount={2} />);
    expect(screen.getByText(/Link 1 more wallet to activate/)).toBeInTheDocument();
  });

  it("shows plural 'wallets' when 2+ more needed", () => {
    render(<SecurityBanner activeCount={0} />);
    expect(screen.getByText(/Link 3 more wallets/)).toBeInTheDocument();
  });

  it("shows Link Wallet button when not secure", () => {
    render(<SecurityBanner activeCount={2} />);
    expect(screen.getByText("+ Link Wallet")).toBeInTheDocument();
  });

  it("does not show Link Wallet button when secure", () => {
    render(<SecurityBanner activeCount={5} />);
    expect(screen.queryByText("+ Link Wallet")).not.toBeInTheDocument();
  });
});
