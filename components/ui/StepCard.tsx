import Card from "./Card";

type StepCardProps = {
  number: string;
  title: string;
  description: string;
  accentClassName?: string;
};

export default function StepCard({
  number,
  title,
  description,
  accentClassName = "text-brand",
}: StepCardProps) {
  return (
    <Card as="li">
      <p
        className={`font-[family-name:var(--font-display)] text-5xl font-bold ${accentClassName}`}
      >
        {number}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-3 leading-relaxed text-gray-600">{description}</p>
    </Card>
  );
}
