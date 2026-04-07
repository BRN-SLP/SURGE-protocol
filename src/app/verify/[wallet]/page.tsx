import { VerifyClient } from "./VerifyClient";

export default async function VerifyPage({ params }: { params: Promise<{ wallet: string }> }) {
  const { wallet } = await params;
  return <VerifyClient initialQuery={decodeURIComponent(wallet)} />;
}
