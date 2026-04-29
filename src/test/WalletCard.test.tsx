import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WalletCard } from "@/components/identity/manage/WalletCard";
import type { WalletInfo } from "@/types";

const base: WalletInfo = {
  address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  role: "regular",
  status: "active",
  isSecurityWallet: false,
  score: 120,
  txCount: 5,
  chains: ["Base"],
  linkedSince: "2024-01-01",
  isCurrentWallet: false,
};

const noop = vi.fn();

function make(overrides: Partial<WalletInfo> = {}) {
  return { ...base, ...overrides };
}

describe("WalletCard", () => {
  it("renders truncated address in collapsed state", () => {
    render(
      <WalletCard
        wallet={make()}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    expect(screen.getByText("0xd8dA…6045")).toBeInTheDocument();
  });

  it("shows CONNECTED badge for isCurrentWallet", () => {
    render(
      <WalletCard
        wallet={make({ isCurrentWallet: true })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    expect(screen.getByText("CONNECTED")).toBeInTheDocument();
  });

  it("expands on click and shows actions", () => {
    render(
      <WalletCard
        wallet={make({ isCurrentWallet: true })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.getByText("Emergency Freeze")).toBeInTheDocument();
  });

  it("shows Emergency Freeze only for isCurrentWallet", () => {
    const { unmount } = render(
      <WalletCard
        wallet={make({ isCurrentWallet: false })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.queryByText("Emergency Freeze")).not.toBeInTheDocument();
    unmount();

    render(
      <WalletCard
        wallet={make({ isCurrentWallet: true })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.getByText("Emergency Freeze")).toBeInTheDocument();
  });

  it("shows Unfreeze for frozen wallet", () => {
    render(
      <WalletCard
        wallet={make({ status: "frozen" })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.getByText("Unfreeze Wallet")).toBeInTheDocument();
    expect(screen.queryByText("Emergency Freeze")).not.toBeInTheDocument();
  });

  it("shows Mark as Compromised for active non-current wallet", () => {
    render(
      <WalletCard
        wallet={make({ isCurrentWallet: false, status: "active" })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.getByText("Mark as Compromised")).toBeInTheDocument();
  });

  it("does NOT show Mark as Compromised for current wallet", () => {
    render(
      <WalletCard
        wallet={make({ isCurrentWallet: true, status: "active" })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.queryByText("Mark as Compromised")).not.toBeInTheDocument();
  });

  it("hides Set as Primary for primary wallet", () => {
    render(
      <WalletCard
        wallet={make({ role: "primary" })}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.queryByText("Set as Primary")).not.toBeInTheDocument();
  });

  it("shows Cancel Request for pending wallet within timelock", () => {
    const request = {
      targetWallet: base.address as `0x${string}`,
      requestIndex: 0n,
      requestedAt: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      timelockEnd: Math.floor(Date.now() / 1000) + 29 * 86400, // 29 days left
      canCancel: true,
      canFinalize: false,
    };
    render(
      <WalletCard
        wallet={make({ status: "pending" })}
        compromiseRequest={request}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
        onCancelCompromise={noop}
        onFinalizeCompromise={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.getByText("Cancel Request")).toBeInTheDocument();
    expect(screen.queryByText("Finalize Compromise")).not.toBeInTheDocument();
  });

  it("shows Finalize Compromise after timelock expired", () => {
    const request = {
      targetWallet: base.address as `0x${string}`,
      requestIndex: 0n,
      requestedAt: Math.floor(Date.now() / 1000) - 31 * 86400,
      timelockEnd: Math.floor(Date.now() / 1000) - 86400,
      canCancel: false,
      canFinalize: true,
    };
    render(
      <WalletCard
        wallet={make({ status: "pending" })}
        compromiseRequest={request}
        onSetPrimary={noop}
        onFreeze={noop}
        onUnfreeze={noop}
        onMarkCompromised={noop}
        onCancelCompromise={noop}
        onFinalizeCompromise={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    expect(screen.queryByText("Cancel Request")).not.toBeInTheDocument();
    expect(screen.getByText("Finalize Compromise")).toBeInTheDocument();
  });

  it("calls onFreeze when Emergency Freeze clicked", () => {
    const onFreeze = vi.fn();
    render(
      <WalletCard
        wallet={make({ isCurrentWallet: true })}
        onSetPrimary={noop}
        onFreeze={onFreeze}
        onUnfreeze={noop}
        onMarkCompromised={noop}
      />,
    );
    fireEvent.click(screen.getByText("0xd8dA…6045").closest("button")!);
    fireEvent.click(screen.getByText("Emergency Freeze"));
    expect(onFreeze).toHaveBeenCalledOnce();
  });
});
