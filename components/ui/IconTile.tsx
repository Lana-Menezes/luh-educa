import type { HTMLAttributes, ReactNode } from "react";

type IconTileShape = "circle" | "square";
type IconTileTone = "brand" | "white";
type IconTileSize = "sm" | "md";

const shapeClasses: Record<IconTileShape, string> = {
  circle: "rounded-full",
  square: "rounded-lg",
};

const toneClasses: Record<IconTileTone, string> = {
  brand: "bg-brand-soft text-brand",
  white: "bg-white text-brand ring-1 ring-brand-muted/60",
};

const sizeClasses: Record<IconTileSize, string> = {
  sm: "h-8 w-8 text-xs font-bold",
  md: "h-10 w-10",
};

type IconTileProps = HTMLAttributes<HTMLSpanElement> & {
  shape?: IconTileShape;
  tone?: IconTileTone;
  size?: IconTileSize;
  children: ReactNode;
};

export default function IconTile({
  shape = "circle",
  tone = "brand",
  size = "md",
  className = "",
  children,
  ...rest
}: IconTileProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center ${shapeClasses[shape]} ${toneClasses[tone]} ${sizeClasses[size]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </span>
  );
}
