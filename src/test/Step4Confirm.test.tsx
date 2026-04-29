import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Step4Confirm } from "@/components/identity/link/Step4Confirm";

const defaults = {
  identityId: 42,
  walletCount: 2,
  newAddress: "0xAbCd1234AbCd1234AbCd1234AbCd1234AbCd1234" as `0x${string}`,
  submitLinkWallet: vi.fn(),
  isSubmitting: false,
  isLinked: false,
  txHash: undefined,
  error: null,
  onDashboard: vi.fn(),
  onLinkAnother: vi.fn(),
};

describe("Step4Confirm", () => {
  it("shows Ready to Submit when not linked", () => {
    render(<Step4Confirm {...defaults} />);
    expect(screen.getByText("Ready to Submit")).toBeInTheDocument();
    expect(screen.getByText("Submit Transaction")).toBeInTheDocument();
  });

  it("shows Wallet Linked Successfully when isLinked=true", () => {
    render(<Step4Confirm {...defaults} isLinked={true} />);
    expect(screen.getByText("Wallet Linked Successfully")).toBeInTheDocument();
    expect(screen.queryByText("Submit Transaction")).not.toBeInTheDocument();
  });

  it("calls submitLinkWallet on button click", () => {
    const submit = vi.fn();
    render(<Step4Confirm {...defaults} submitLinkWallet={submit} />);
    fireEvent.click(screen.getByText("Submit Transaction"));
    expect(submit).toHaveBeenCalledOnce();
  });

  it("disables submit button while submitting", () => {
    render(<Step4Confirm {...defaults} isSubmitting={true} />);
    expect(screen.getByText("Submitting...")).toBeDisabled();
  });

  it("shows error message when error prop is set", () => {
    render(<Step4Confirm {...defaults} error="Signature expired" />);
    expect(screen.getByText("Signature expired")).toBeInTheDocument();
  });

  it("shows tx hash when provided", () => {
    const hash =
      "0xdeadbeef00000000000000000000000000000000000000000000000000000000" as `0x${string}`;
    render(<Step4Confirm {...defaults} txHash={hash} />);
    expect(screen.getByText(/0xdeadbeef/)).toBeInTheDocument();
  });

  it("shows security unlocked when walletCount+1 >= 3", () => {
    render(<Step4Confirm {...defaults} isLinked={true} walletCount={2} />);
    expect(screen.getByText(/Security features unlocked/)).toBeInTheDocument();
  });

  it("does NOT show security unlocked when walletCount+1 < 3", () => {
    render(<Step4Confirm {...defaults} isLinked={true} walletCount={1} />);
    expect(screen.queryByText(/Security features unlocked/)).not.toBeInTheDocument();
  });

  it("shows all 3 checklist items, last one pending before linked", () => {
    render(<Step4Confirm {...defaults} isLinked={false} />);
    expect(screen.getByText("Authorization signature collected")).toBeInTheDocument();
    expect(screen.getByText("New wallet signature collected")).toBeInTheDocument();
    expect(screen.getByText("On-chain transaction confirmed")).toBeInTheDocument();
  });

  it("calls onDashboard and onLinkAnother after success", () => {
    const onDashboard = vi.fn();
    const onLinkAnother = vi.fn();
    render(
      <Step4Confirm
        {...defaults}
        isLinked={true}
        onDashboard={onDashboard}
        onLinkAnother={onLinkAnother}
      />,
    );
    fireEvent.click(screen.getByText("Go to Dashboard"));
    expect(onDashboard).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByText("Link Another Wallet"));
    expect(onLinkAnother).toHaveBeenCalledOnce();
  });
});
