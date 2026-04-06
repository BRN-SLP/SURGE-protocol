import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 1-based
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div
            key={stepNum}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? 1 : "none",
            }}
          >
            {/* Circle */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  border: `1px solid ${isDone ? "var(--accent)" : isActive ? "var(--accent)" : "var(--border)"}`,
                  background: isDone ? "var(--accent)" : "transparent",
                  color: isDone ? "#fff" : isActive ? "var(--accent)" : "var(--text-faint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
              >
                {isDone ? <Check size={14} strokeWidth={1.5} /> : stepNum}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: isActive ? "var(--text)" : "var(--text-faint)",
                  whiteSpace: "nowrap",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: isDone ? "var(--accent)" : "var(--border)",
                  margin: "0 8px",
                  marginBottom: 20,
                  transition: "background 0.2s ease",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
