import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
}

export function Section({ children, className = "", id, style }: SectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        paddingLeft: "var(--section-px)",
        paddingRight: "var(--section-px)",
        paddingTop: "var(--section-py)",
        paddingBottom: "var(--section-py)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}
