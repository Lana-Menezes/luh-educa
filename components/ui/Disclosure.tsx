import type { ReactNode } from "react";

type DisclosureProps = {
  isOpen: boolean;
  onToggle: () => void;
  question: ReactNode;
  answer: ReactNode;
  toneClassName: string;
  markClassName: string;
};

export default function Disclosure({
  isOpen,
  onToggle,
  question,
  answer,
  toneClassName,
  markClassName,
}: DisclosureProps) {
  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onToggle}
      className={`w-full cursor-pointer rounded-2xl p-5 text-left transition-shadow duration-500 md:p-6 ${toneClassName} ${
        isOpen ? "shadow-md" : ""
      }`}
    >
      <span className="flex items-start justify-between gap-4 text-lg font-semibold">
        <span>{question}</span>
        <span
          aria-hidden
          className={`mt-0.5 shrink-0 text-2xl leading-none transition-transform duration-500 ease-out ${markClassName} ${
            isOpen ? "rotate-45" : "rotate-0"
          }`}
        >
          +
        </span>
      </span>

      <span
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <span className="overflow-hidden">
          <span
            className={`block pt-4 font-normal leading-relaxed text-gray-700 transition-opacity duration-500 ease-out ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            {answer}
          </span>
        </span>
      </span>
    </button>
  );
}
