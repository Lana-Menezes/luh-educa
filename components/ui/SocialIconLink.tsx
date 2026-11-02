import type { LucideIcon } from "lucide-react";

type SocialIconLinkProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export default function SocialIconLink({
  href,
  label,
  icon: Icon,
}: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-brand-muted/60 transition hover:bg-brand hover:text-white"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
