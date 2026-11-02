import Card from "./Card";
import Button from "./Button";

type CTAAction = {
  label: string;
  href: string;
};

type CTABannerProps = {
  title: string;
  description: string;
  primaryAction: CTAAction;
  secondaryAction?: CTAAction;
  className?: string;
};

export default function CTABanner({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = "",
}: CTABannerProps) {
  return (
    <Card variant="soft" className={className}>
      <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-900">
        {title}
      </p>
      <p className="mt-3 leading-relaxed text-gray-700">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href={primaryAction.href}>{primaryAction.label}</Button>
        {secondaryAction && (
          <Button href={secondaryAction.href} variant="secondary">
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </Card>
  );
}
