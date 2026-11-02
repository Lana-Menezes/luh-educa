import type { ElementType, HTMLAttributes, ReactNode } from "react";

type ContainerSize = "default" | "wide";

const sizeClasses: Record<ContainerSize, string> = {
  default: "max-w-6xl px-6 md:px-8",
  wide: "max-w-7xl px-4 sm:px-6 lg:px-8",
};

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  size?: ContainerSize;
  children: ReactNode;
};

export default function Container({
  as: Tag = "div",
  size = "default",
  className = "",
  children,
  ...rest
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full ${sizeClasses[size]} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
