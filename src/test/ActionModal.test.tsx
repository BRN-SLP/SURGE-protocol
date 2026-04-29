import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ActionModal } from "@/components/identity/manage/ActionModal";
import type { WalletInfo } from "@/types";

const wallet: WalletInfo = {
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  role: "regular",
  status: "active",
  isSecurityWallet: false,
  score: 0,
  txCount: 0,
  chains: [],
  linkedSince: "",
  isCurrentWallet: false,
};

describe("ActionModal", () => {
  it("renders nothing when type is null", () => {
    const { container } = render(
      <ActionModal
        type={null}
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders primary modal with correct title", () => {
    render(
      <ActionModal
        type="primary"
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Set as Primary Wallet")).toBeInTheDocument();
    expect(screen.getByText("Set as Primary")).toBeInTheDocument();
  });

  it("renders freeze modal with warning", () => {
    render(
      <ActionModal
        type="freeze"
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Emergency Freeze")).toBeInTheDocument();
    expect(screen.getByText(/takes effect immediately/)).toBeInTheDocument();
  });

  it("shows wallet address in both modals", () => {
    render(
      <ActionModal
        type="primary"
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText(wallet.address)).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", () => {
    const onConfirm = vi.fn();
    render(
      <ActionModal
        type="primary"
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={onConfirm}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText("Set as Primary"));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = vi.fn();
    render(
      <ActionModal
        type="freeze"
        wallet={wallet}
        onClose={onClose}
        onConfirm={vi.fn()}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("shows Processing… and disables buttons when isLoading", () => {
    render(
      <ActionModal
        type="freeze"
        wallet={wallet}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={true}
      />,
    );
    expect(screen.getByText("Processing…")).toBeInTheDocument();
    expect(screen.getByText("Processing…")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();
  });
});
