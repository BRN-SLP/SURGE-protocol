interface SkeletonShimmerProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function SkeletonShimmer({
  width = "100%",
  height = 16,
  borderRadius = "var(--radius-sm)",
}: SkeletonShimmerProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background:
          "linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s ease infinite",
      }}
    />
  );
}
