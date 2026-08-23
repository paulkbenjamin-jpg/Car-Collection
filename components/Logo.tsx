type LogoProps = {
  size?: "sm" | "lg";
};

export default function Logo({ size = "lg" }: LogoProps) {
  const textSize = size === "lg" ? "text-4xl md:text-6xl" : "text-xl md:text-2xl";

  return (
    <span
      className={`font-[family-name:var(--font-slab)] font-bold ${textSize} tracking-[0.08em] text-[var(--color-brass)] select-none`}
    >
      THE DICKSONIAN
    </span>
  );
}
