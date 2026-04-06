"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy to clipboard"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: copied ? "var(--success)" : "var(--text-muted)",
        fontSize: "0.78rem",
        fontFamily: "var(--font-display)",
        letterSpacing: "0.03em",
        padding: "2px 6px",
        borderRadius: "var(--radius-sm)",
        transition: "color 0.2s ease",
      }}
    >
      {copied ? (
        <>
          <Check size={11} strokeWidth={1.25} style={{ marginRight: 4 }} />
          Copied
        </>
      ) : (
        <>
          <Copy size={11} strokeWidth={1.25} style={{ marginRight: 4 }} />
          {label ?? "Copy"}
        </>
      )}
    </button>
  );
}
