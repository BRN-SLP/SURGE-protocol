interface SectionHeaderProps {
  overline?: string;
  heading: React.ReactNode;
  subtext?: string;
  align?: "left" | "center";
}

export function SectionHeader({ overline, heading, subtext, align = "left" }: SectionHeaderProps) {
  const textAlign = align === "center" ? "center" : "left";

  return (
    <div style={{ textAlign, marginBottom: 40 }}>
      {overline && (
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "0.7rem",
            fontWeight: 500,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {overline}
        </p>
      )}
      <h2
        style={{
          margin: 0,
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 300,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
          color: "var(--text)",
        }}
      >
        {heading}
      </h2>
      {subtext && (
        <p
          style={{
            margin: "16px 0 0",
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: align === "center" ? 560 : "100%",
            marginLeft: align === "center" ? "auto" : undefined,
            marginRight: align === "center" ? "auto" : undefined,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
