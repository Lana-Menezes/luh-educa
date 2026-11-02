import type { ElementType, HTMLAttributes, ReactNode } from "react";

type CardVariant = "default" | "soft" | "outlined-brand";
type CardPadding = "none" | "md" | "lg";

const variantClasses: Record<CardVariant, string> = {
  default: "border border-gray-200 bg-white shadow-sm",
  soft: "bg-brand-soft",
  "outlined-brand": "border border-brand-muted/50 bg-[#f4f6ff] shadow-sm",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  md: "p-6 md:p-8",
  lg: "p-6 md:p-10",
};

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
};

export default function Card({
  as: Tag = "div",
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <Tag
      className={`rounded-2xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
