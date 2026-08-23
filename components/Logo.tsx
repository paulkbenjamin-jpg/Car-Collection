import Image from "next/image";

type LogoProps = {
  size?: "sm" | "lg";
  reflection?: boolean;
};

// Renders the source "Dicksonian" wordmark asset (public/logo.png), which
// already includes its own gold bevel and reflection.
export default function Logo({ size = "lg" }: LogoProps) {
  const heightClass = size === "lg" ? "h-16 md:h-24" : "h-8 md:h-10";

  return (
    <Image
      src="/logo.png"
      alt="Dicksonian"
      width={1242}
      height={388}
      priority
      className={`${heightClass} w-auto select-none`}
    />
  );
}
