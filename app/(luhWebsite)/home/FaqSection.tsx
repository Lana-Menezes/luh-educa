"use client";

import { useState } from "react";
import { Container, Disclosure, SectionHeading } from "@/components/ui";

type FaqItem = {
  question: string;
  answer: string;
  tone: string;
  mark: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const tones = [
  { tone: "bg-brand-soft text-gray-900", mark: "text-brand" },
  { tone: "bg-success-soft text-gray-900", mark: "text-success" },
  { tone: "bg-accent-soft text-gray-900", mark: "text-accent-ink" },
  { tone: "bg-danger-soft text-gray-900", mark: "text-danger" },
] as const;

function withTones(items: { question: string; answer: string }[]): FaqItem[] {
  return items.map((item, index) => ({
    ...item,
    ...tones[index % tones.length],
  }));
}

const faqGroups: FaqGroup[] = [
  {
    title: "Sobre a metodologia",
    items: withTones([
      {
        question: "O que é a Metodologia LUH?",
        answer:
          "A LUH — Leitura Unificada de Habilidades Educacionais — é uma metodologia que articula currículo, avaliação por evidências, diagnóstico da aprendizagem, planejamento por habilidade e acompanhamento dos resultados. Seu objetivo é apoiar a rede de ensino na transformação dos dados de aprendizagem em informações que possam subsidiar decisões pedagógicas.",
      },
      {
        question:
          "O que diferencia a Metodologia LUH de uma avaliação tradicional?",
        answer:
          "A metodologia não se limita à produção de um resultado ou à identificação do percentual de acertos. Ela busca relacionar os resultados das avaliações às habilidades avaliadas e utilizá-los como evidência para orientar o planejamento pedagógico e o acompanhamento da aprendizagem.",
      },
      {
        question: "A LUH utiliza a mesma escala de proficiência do Saeb?",
        answer:
          "Não se deve presumir equivalência entre uma escala produzida para uma avaliação da rede e a escala oficial do Saeb. Os resultados de avaliações próprias dependerão do modelo estatístico, do desenho da avaliação e dos procedimentos de comparabilidade adotados.",
      },
      {
        question:
          "A LUH identifica quais habilidades precisam ser trabalhadas?",
        answer:
          "A metodologia utiliza os resultados das avaliações e as habilidades representadas pelos itens para apoiar a identificação de fragilidades de aprendizagem. A interpretação dos resultados considera as evidências disponíveis e o contexto pedagógico da rede.",
      },
      {
        question: "O método entrega apenas um relatório?",
        answer:
          "Não. A proposta é utilizar os resultados como ponto de partida para a tomada de decisão pedagógica. Conforme o escopo contratado, a assessoria pode apoiar a interpretação dos dados, a identificação de prioridades, o planejamento por habilidade e o acompanhamento dos resultados.",
      },
      {
        question: "O método LUH atende também o público da educação especial?",
        answer:
          "Sim. A metodologia pode apoiar a análise das aprendizagens dos estudantes público da educação especial, considerando suas necessidades específicas, as condições de acessibilidade e as adaptações necessárias. “A educação especial talvez seja o ambiente em que a leitura individualizada das habilidades mais revela sua importância. Quando o planejamento deixa de ser orientado apenas pela série e passa a considerar também o percurso singular do estudante, a aprendizagem deixa de ser uma expectativa coletiva e passa a constituir uma possibilidade concreta para o indivíduo”. Através da tecnologia construída para personalizar o acompanhamento das aprendizagens conseguimos alcançar estudantes que necessitam de percursos educacionais diferenciados.",
      },
      {
        question: "De que maneira o método LUH se aplica as redes de ensino que desejam o aprofundamento da aprendizagem?",
        answer:
        "A metodologia também contempla o aprofundamento das aprendizagens. A partir das evidências de aprendizagem, apoia a identificação de habilidades consolidadas e o planejamento de propostas que ampliem a complexidade cognitiva, favorecendo o desenvolvimento e a progressão das aprendizagens.",
      },
    ]),
  },
  {
    title: "Sobre a assessoria e a entrega",
    items: withTones([
      {
        question: "O que exatamente a LUH Educa oferece?",
        answer:
          "A LUH Educa oferece assessoria de inteligência pedagógica apoiada pela Metodologia LUH e por recursos tecnológicos. O escopo de cada contratação é definido de acordo com as necessidades da rede, podendo envolver diagnóstico, análise de resultados, planejamento por habilidade, formação, acompanhamento pedagógico e utilização dos recursos tecnológicos disponíveis.",
      },
      {
        question: "Minha rede de ensino recebeu o resultado de desempenho após a avaliação diagnóstica, o que fazer com estes dados?",
        answer:
        "Os resultados devem orientar decisões pedagógicas. A LUH Educa apoia a rede na interpretação das evidências, identificação das habilidades que exigem atenção, definição de prioridades e elaboração de planos de recomposição e aprofundamento, com acompanhamento dos resultados.",
      },
      {
        question:
          "A LUH Educa substitui o sistema de ensino ou o material didático da rede?",
        answer:
          "Não. A metodologia não pressupõe a substituição do sistema de ensino, do material didático ou das práticas pedagógicas da rede. A proposta é apoiar a gestão e as equipes pedagógicas na leitura das evidências de aprendizagem e na tomada de decisões.",
      },
      {
        question: "A LUH Educa substitui o trabalho do professor?",
        answer:
          "Não. A tecnologia e a metodologia apoiam o trabalho pedagógico, mas não substituem a atuação profissional do professor ou da equipe gestora. As evidências produzidas devem ser interpretadas à luz do contexto da turma e dos estudantes.",
      },
      {
        question:
          "A rede precisa contratar a assessoria para aplicar a metodologia LUH?",
        answer:
          "Não necessariamente. A metodologia é ensinável e pode ser apropriada pelas equipes da própria rede. A assessoria existe para apoiar e acelerar sua implementação, reduzir a complexidade operacional e oferecer acompanhamento especializado, conforme o escopo contratado.",
      },
      {
        question: "Quem deve participar da implementação?",
        answer:
          "A participação pode envolver diferentes profissionais, de acordo com o escopo e as características da rede: gestores da educação, equipes técnicas das secretarias, gestores escolares, coordenadores pedagógicos e professores. A definição dos participantes e das responsabilidades é estabelecida no planejamento da contratação.",
      },
    ]),
  },
  {
    title: "Sobre tecnologia e IA",
    items: withTones([
      {
        question: "Para que serve o Portal Escola?",
        answer:
          "O Portal Escola é o ambiente destinado às instituições parceiras para acompanhamento das informações e resultados disponibilizados pela solução contratada. O acesso é realizado mediante credenciais e os perfis de acesso são definidos conforme as responsabilidades dos usuários.",
      },
      {
        question: "O que a inteligência artificial faz dentro da solução?",
        answer:
          "A inteligência artificial pode ser utilizada como recurso de apoio ao processamento, organização, análise ou apresentação de informações, conforme as funcionalidades disponibilizadas. Seu uso não substitui a análise profissional nem a decisão pedagógica da equipe responsável.",
      },
      {
        question:
          "A inteligência artificial toma decisões sobre os estudantes?",
        answer:
          "Não. As informações produzidas por recursos tecnológicos devem subsidiar a análise dos profissionais responsáveis. A decisão pedagógica deve considerar os dados disponíveis, o contexto educacional e o conhecimento da equipe sobre os estudantes.",
      },
      {
        question: "A LUH utiliza dados pessoais dos estudantes?",
        answer:
          "A utilização de dados depende do escopo da contratação e das funcionalidades utilizadas. Quando houver tratamento de dados pessoais, deverão ser observadas as disposições aplicáveis da Lei Geral de Proteção de Dados Pessoais (LGPD), incluindo finalidade, necessidade, segurança, governança e definição das responsabilidades dos agentes de tratamento.",
      },
      {
        question:
          "Os dados dos estudantes ficam disponíveis para qualquer usuário?",
        answer:
          "Não. O acesso deve observar os perfis e as permissões definidos para a solução e para a contratação. O tratamento e o compartilhamento de dados devem respeitar as finalidades estabelecidas e a legislação aplicável.",
      },
    ]),
  },
  {
    title: "Para redes públicas",
    items: withTones([
      {
        question: "A solução pode ser utilizada por redes públicas de ensino?",
        answer:
          "Sim. A LUH Educa desenvolve serviços destinados a redes públicas e privadas. No caso das redes públicas, o objeto, os requisitos, as entregas, os critérios de aceitação e as responsabilidades das partes devem ser definidos de acordo com o instrumento de contratação e com a legislação aplicável.",
      },
      {
        question: "A contratação da LUH inclui obrigatoriamente a plataforma?",
        answer:
          "Não necessariamente. A composição da solução depende do objeto e do escopo definido para cada contratação. Assessoria, metodologia e recursos tecnológicos podem ser estruturados de acordo com a necessidade da instituição ou rede.",
      },
      {
        question: "A implementação tem prazo fixo?",
        answer:
          "Não há um prazo único aplicável a todas as redes. O tempo necessário depende do escopo contratado, das condições de infraestrutura, da disponibilidade e qualidade dos dados, da organização da rede e do nível de participação das equipes. O cronograma deve ser estabelecido conforme as características de cada contratação.",
      },
      {
        question:
          "A metodologia garante aumento dos resultados de aprendizagem?",
        answer:
          "Nenhuma metodologia ou tecnologia pode garantir, isoladamente, determinado resultado de aprendizagem. A LUH oferece instrumentos, processos e apoio técnico para qualificar a leitura das evidências e orientar decisões pedagógicas. Os resultados dependem também das condições de implementação, das práticas pedagógicas e de outros fatores que influenciam a aprendizagem.",
      },
      {
        question:
          "A LUH Educa pode apoiar a rede na recomposição das aprendizagens?",
        answer:
          "Sim. A metodologia foi estruturada para apoiar processos de recomposição e aprofundamento das aprendizagens por meio da identificação de necessidades, definição de prioridades, planejamento por habilidade e acompanhamento dos resultados, de acordo com o escopo definido na contratação.",
      },
      {
        question: "Como saber se a solução é adequada para minha rede?",
        answer:
          "A adequação depende das necessidades da rede, das características dos dados disponíveis, da infraestrutura, dos objetivos pedagógicos e do escopo pretendido. A LUH Educa pode realizar uma análise inicial para compreender a demanda e apresentar uma proposta compatível com essas condições.",
      },
      {
        question:
          "A contratação da LUH exige a aquisição de um produto específico?",
        answer:
          "Não. A solução pode ser estruturada de acordo com o objeto e as necessidades definidas pela instituição contratante. A metodologia, os serviços de assessoria e os recursos tecnológicos são apresentados conforme o escopo da contratação e os requisitos estabelecidos pelo contratante.",
      },
    ]),
  },
];

export default function FaqSection() {
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set());

  function toggleKey(key: string) {
    setOpenKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <section id="faq" className="border-t border-gray-200 bg-white">
      <Container className="py-20 md:py-28">
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title="Dúvidas comuns sobre a Metodologia LUH e a assessoria."
          description="Respostas diretas sobre metodologia, entrega, tecnologia e contratação para redes de ensino."
        />

        <div className="mt-12 space-y-12">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-900 md:text-2xl">
                {group.title}
              </h3>

              <div className="mt-5 flex flex-col gap-4">
                {group.items.map((faq) => {
                  const key = `${group.title}:${faq.question}`;
                  const isOpen = openKeys.has(key);

                  return (
                    <Disclosure
                      key={key}
                      isOpen={isOpen}
                      onToggle={() => toggleKey(key)}
                      question={faq.question}
                      answer={faq.answer}
                      toneClassName={faq.tone}
                      markClassName={faq.mark}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
