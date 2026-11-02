import type { ReactNode } from "react";

type HeadingTag = "h1" | "h2" | "h3";
type Tone = "default" | "inverted";

const titleSizeByTag: Record<HeadingTag, string> = {
  h1: "text-4xl sm:text-5xl",
  h2: "text-3xl md:text-4xl",
  h3: "text-2xl md:text-3xl",
};

const eyebrowToneClasses: Record<Tone, string> = {
  default: "text-brand",
  inverted: "text-brand-muted",
};

const titleToneClasses: Record<Tone, string> = {
  default: "text-gray-900",
  inverted: "text-white",
};

const descriptionToneClasses: Record<Tone, string> = {
  default: "text-gray-600",
  inverted: "text-white/85",
};

type SectionHeadingProps = {
  as?: HeadingTag;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  tone?: Tone;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export default function SectionHeading({
  as = "h2",
  eyebrow,
  title,
  description,
  tone = "default",
  className = "",
  titleClassName = "max-w-2xl",
  descriptionClassName = "max-w-2xl",
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <div className={className}>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-[0.18em] ${eyebrowToneClasses[tone]}`}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        className={`${eyebrow ? "mt-3" : ""} font-[family-name:var(--font-display)] font-bold tracking-tight ${titleSizeByTag[as]} ${titleToneClasses[tone]} ${titleClassName}`.trim()}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={`mt-5 text-lg leading-relaxed ${descriptionToneClasses[tone]} ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
