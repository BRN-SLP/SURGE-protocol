import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Step1Review } from "@/components/identity/link/Step1Review";

const defaults = {
  identityId: 42,
  currentAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  walletCount: 1,
  score: 750,
  understood: false,
  onUnderstood: vi.fn(),
  onContinue: vi.fn(),
};

describe("Step1Review", () => {
  it("renders identity info correctly", () => {
    render(<Step1Review {...defaults} />);
    // identity info block shows id + score + wallet count together
    expect(screen.getByText(/750 pts/)).toBeInTheDocument();
    expect(screen.getByText(/1 wallet linked/)).toBeInTheDocument();
    // warning list also mentions the identity id
    expect(screen.getAllByText(/#00042/).length).toBeGreaterThanOrEqual(1);
  });

  it("Continue button is disabled when understood=false", () => {
    render(<Step1Review {...defaults} understood={false} />);
    const btn = screen.getByText("Continue →");
    expect(btn).toBeDisabled();
  });

  it("Continue button is enabled when understood=true", () => {
    render(<Step1Review {...defaults} understood={true} />);
    const btn = screen.getByText("Continue →");
    expect(btn).not.toBeDisabled();
  });

  it("calls onUnderstood when checkbox toggled", () => {
    const onUnderstood = vi.fn();
    render(<Step1Review {...defaults} onUnderstood={onUnderstood} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onUnderstood).toHaveBeenCalledWith(true);
  });

  it("calls onContinue when button clicked and understood", () => {
    const onContinue = vi.fn();
    render(<Step1Review {...defaults} understood={true} onContinue={onContinue} />);
    fireEvent.click(screen.getByText("Continue →"));
    expect(onContinue).toHaveBeenCalledOnce();
  });

  it("does not call onContinue when button disabled", () => {
    const onContinue = vi.fn();
    render(<Step1Review {...defaults} understood={false} onContinue={onContinue} />);
    fireEvent.click(screen.getByText("Continue →"));
    expect(onContinue).not.toHaveBeenCalled();
  });

  it("shows plural wallets count", () => {
    render(<Step1Review {...defaults} walletCount={3} />);
    expect(screen.getByText(/3 wallets linked/)).toBeInTheDocument();
  });
});
