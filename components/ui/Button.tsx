import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "dark";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary:
    "border border-brand-muted bg-white text-brand hover:bg-brand-soft",
  dark: "bg-gray-900 text-white hover:bg-gray-800",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

type LinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    href: string;
  };

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export type ButtonProps = LinkButtonProps | NativeButtonProps;

function baseClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  className: string,
) {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = baseClasses(variant, size, className);

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<LinkButtonProps, keyof SharedProps>;
    const isExternal = /^https?:\/\//.test(href) || href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = rest as Omit<NativeButtonProps, keyof SharedProps>;

  return (
    <button className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
