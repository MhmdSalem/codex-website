export function AnimatedGrid({
  className = "",
  intensity = "medium",
}: {
  className?: string;
  intensity?: "subtle" | "medium" | "strong";
}) {
  const opacityMap = {
    subtle: 0.15,
    medium: 0.3,
    strong: 0.5,
  };
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: opacityMap[intensity] }}
    >
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
    </div>
  );
}

export function GoldOrbs() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/15 blur-[120px] animate-spotlight" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full bg-gold/10 blur-[100px] animate-float-slow" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gold/8 blur-[120px]" />
    </div>
  );
}
