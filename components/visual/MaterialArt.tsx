import Image, { type StaticImageData } from "next/image";
import concrete from "@/assets/materials/concrete.jpg";
import gravel from "@/assets/materials/gravel.jpg";
import mulch from "@/assets/materials/mulch.jpg";
import paint from "@/assets/materials/paint.jpg";

export type Material = "concrete" | "gravel" | "mulch" | "paint";

const photos: Record<Material, StaticImageData> = { concrete, gravel, mulch, paint };

export function materialFromPath(path: string): Material | null {
  if (path.includes("paint")) return "paint";
  if (path.includes("mulch")) return "mulch";
  if (path.includes("gravel")) return "gravel";
  if (path.includes("concrete")) return "concrete";
  return null;
}

const labels: Record<Material, string> = {
  concrete: "Concrete slab and form boards",
  gravel: "Loose gravel stones",
  mulch: "Wood mulch in a bed",
  paint: "Paint roller and an open can",
};

export function MaterialArt({
  material,
  className,
  labeled = false,
}: {
  material: Material;
  className?: string;
  labeled?: boolean;
}) {
  return (
    <span className={`relative block overflow-hidden ${className ?? ""}`}>
      <Image
        src={photos[material]}
        alt={labeled ? labels[material] : ""}
        fill
        sizes="(max-width: 640px) 46vw, 320px"
        placeholder="blur"
        className="object-cover"
      />
    </span>
  );
}

export function Wordmark() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="10" fill="#9a3412" />
      <rect x="7" y="8" width="18" height="3.5" rx="1.75" fill="#fffdf8" />
      <rect x="8" y="16" width="6" height="8" rx="1.5" fill="#fffdf8" />
      <rect x="18" y="16" width="6" height="8" rx="1.5" fill="#fffdf8" />
    </svg>
  );
}

