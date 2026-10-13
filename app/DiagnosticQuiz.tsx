"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const questions = [
  "A sua rede conhece as condicionalidades do VAAR relacionadas à gestão e aos resultados educacionais?",
  "Conseguem realizar uma análise real da aprendizagem por habilidade?",
  "São capazes de identificar lacunas estruturais antes da avaliação oficial?",
  "Oferecem personalização do ensino com base no ritmo de cada aluno?",
] as const;

type Answer = "sim" | "nao" | null;

export default function DiagnosticQuiz() {
  const [answers, setAnswers] = useState<Answer[]>(
    () => questions.map(() => null),
  );

  const hasNo = answers.some((answer) => answer === "nao");

  function setAnswer(index: number, value: Exclude<Answer, null>) {
    setAnswers((current) =>
      current.map((answer, i) => {
        if (i !== index) return answer;
        return answer === value ? null : value;
      }),
    );
  }

  return (
    <section id="autodiagnostico" className="bg-white">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-12 md:px-8 md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            O problema real
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            A sua rede de ensino conhece a lacuna real da aprendizagem?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Assessoria educacional para redes públicas e privadas que precisam
            recompor aprendizagens com precisão, com apoio de tecnologia e IA a
            favor dos resultados.
          </p>
        </div>

        <div className="rounded-2xl border border-brand-muted/50 bg-[#f4f6ff] p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Autodiagnóstico
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-gray-900">
            Sua rede de ensino já trabalha com cultura de dados?
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Quatro perguntas que separam redes que reagem das redes que se
            antecipam.
          </p>

          <ul className="mt-8 divide-y divide-brand-muted/40">
            {questions.map((question, index) => {
              const answer = answers[index];

              return (
                <li
                  key={question}
                  className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-sm leading-snug text-gray-800 sm:text-[15px]">
                      {question}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      aria-pressed={answer === "sim"}
                      onClick={() => setAnswer(index, "sim")}
                      className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                        answer === "sim"
                          ? "bg-brand text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-brand-muted hover:text-brand"
                      }`}
                    >
                      SIM
                    </button>
                    <button
                      type="button"
                      aria-pressed={answer === "nao"}
                      onClick={() => setAnswer(index, "nao")}
                      className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition ${
                        answer === "nao"
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900"
                      }`}
                    >
                      NÃO
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {hasNo && (
            <div className="mt-6 flex flex-col gap-4 rounded-xl bg-brand-soft/80 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className="mt-0.5 h-5 w-5 shrink-0 text-brand"
                  aria-hidden
                />
                <div>
                  <p className="text-sm font-semibold text-brand">
                    Respondeu NÃO em alguma?
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  A recomposição necessita de ferramentas mais precisas e nós as temos.
                  </p>
                </div>
              </div>
              <a
                href="#contato"
                className="inline-flex shrink-0 items-center justify-center self-stretch rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover sm:self-center"
              >
                Entrar em contato
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
