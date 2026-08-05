"use client";

import { useState } from "react";

const faqs = [
  {
    question: "O que é a TRI e por que usar na escola?",
    answer:
      "A Teoria de Resposta ao Item estima a proficiência do estudante em uma escala contínua, considerando dificuldade, discriminação e coerência das respostas — e não apenas a quantidade de acertos. Isso permite comparar resultados ao longo do tempo e orientar intervenções pedagógicas com mais precisão.",
    tone: "bg-brand-soft text-gray-900",
    mark: "text-brand",
  },
  {
    question: "O que diferencia o método Luh Educa?",
    answer:
      "O método conecta calibração de itens, leitura da régua de proficiência e rotina de decisão na escola. Além da consultoria, o Portal Luh Educa apoia a gestão com dashboards da escola, da turma e do aluno.",
    tone: "bg-brand-muted/40 text-gray-900",
    mark: "text-brand",
  },
  {
    question: "Quanto tempo leva para implementar?",
    answer:
      "O prazo varia conforme o tamanho da rede, a maturidade avaliativa e o escopo (anos, áreas e frequência de aplicação). Em geral, iniciamos com diagnóstico e um ciclo piloto antes de expandir para toda a escola.",
    tone: "bg-success-soft text-gray-900",
    mark: "text-success",
  },
  {
    question: "A TRI substitui as provas que já fazemos?",
    answer:
      "Não necessariamente. Podemos evoluir instrumentos existentes, construir novos itens e integrar a TRI à rotina avaliativa da escola, preservando o que já funciona e elevando a qualidade da interpretação dos resultados.",
    tone: "bg-brand-soft text-gray-900",
    mark: "text-brand",
  },
  {
    question: "Quem deve participar do processo?",
    answer:
      "Idealmente gestão pedagógica, coordenação e professores das áreas envolvidas. A formação conjunta é parte do método: sem leitura pedagógica compartilhada, o dado da TRI perde potência na sala de aula.",
    tone: "bg-brand-muted/40 text-gray-900",
    mark: "text-brand",
  },
  {
    question: "Como acesso o Portal Luh Educa?",
    answer:
      "Escolas parceiras recebem acesso ao portal para acompanhar métricas TRI. Na home, use o botão Portal Luh Educa no menu superior ou Acessar o portal para entrar com suas credenciais.",
    tone: "bg-success-soft text-gray-900",
    mark: "text-success",
  },
] as const;

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Perguntas frequentes
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Dúvidas comuns sobre TRI e o método Luh Educa.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Respostas diretas para ajudar sua escola a entender o caminho de
          implementação.
        </p>

        <div className="mt-12 flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`rounded-2xl p-5 transition-shadow duration-500 md:p-6 ${faq.tone} ${
                  isOpen ? "shadow-md" : ""
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full cursor-pointer items-start justify-between gap-4 text-left text-lg font-semibold"
                >
                  <span>{faq.question}</span>
                  <span
                    aria-hidden
                    className={`mt-0.5 shrink-0 text-2xl leading-none transition-transform duration-500 ease-out ${
                      faq.mark
                    } ${isOpen ? "rotate-45" : "rotate-0"}`}
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`pt-4 leading-relaxed text-gray-700 transition-opacity duration-500 ease-out ${
                        isOpen ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
