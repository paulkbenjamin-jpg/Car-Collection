type LogoProps = {
  size?: "sm" | "lg";
};

export default function Logo({ size = "lg" }: LogoProps) {
  const textSize = size === "lg" ? "text-4xl md:text-6xl" : "text-xl md:text-2xl";

  return (
    <span
      className={`font-[family-name:var(--font-display)] ${textSize} tracking-wide text-[var(--color-brass)] select-none`}
    >
      The Dicksonian
    </span>
  );
}
