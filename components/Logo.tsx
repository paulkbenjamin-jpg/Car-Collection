type LogoProps = {
  size?: "sm" | "lg";
  reflection?: boolean;
};

// Wordmark recreating the gold "Dicksonian" logo in the app's own
// typeface (Fraunces) and palette (brass gradient), rather than
// embedding the source image. The reflection nods to the original
// asset's mirrored, showroom-floor finish.
export default function Logo({ size = "lg", reflection = true }: LogoProps) {
  const textSize = size === "lg" ? "text-4xl md:text-6xl" : "text-xl md:text-2xl";

  return (
    <div className="inline-block select-none">
      <span
        className={`font-[family-name:var(--font-display)] ${textSize} tracking-wide`}
        style={{
          backgroundImage:
            "linear-gradient(180deg, #f3d99a 0%, #d4af6a 30%, #b08d57 55%, #8a6a3d 75%, #d4af6a 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Dicksonian
      </span>

      {reflection && (
        <div
          aria-hidden
          className={`font-[family-name:var(--font-display)] ${textSize} tracking-wide leading-none`}
          style={{
            backgroundImage:
              "linear-gradient(180deg, #f3d99a 0%, #d4af6a 30%, #b08d57 55%, #8a6a3d 75%, #d4af6a 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            transform: "scaleY(-1)",
            marginTop: size === "lg" ? "-0.15em" : "-0.1em",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 65%)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 65%)",
          }}
        >
          Dicksonian
        </div>
      )}
    </div>
  );
}
