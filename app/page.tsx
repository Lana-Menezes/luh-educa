import Hero from "./Hero";
import FaqSection from "./FaqSection";
import DiagnosticQuiz from "./DiagnosticQuiz";
import ContactSection from "./ContactSection";
import GrowthInfographic from "./GrowthInfographic";
import { Container, SectionHeading, StepCard } from "@/components/ui";

const trilhaSteps = [
  {
    number: "01",
    title: "Cultura de dados",
    description:
      "Transformamos registros escolares dispersos em inteligência estratégica para gestores e diretores da rede.",
    accentClassName: "text-brand",
  },
  {
    number: "02",
    title: "Diagnóstico das Fragilidades",
    description:
      "Mapeamento granular que usa os descritores para identificar lacunas estruturais nas redes, escolas, turmas e estudantes antes da prova oficial.",
    accentClassName: "text-success",
  },
  {
    number: "03",
    title: "Planejamento por Habilidade",
    description:
      "Roteiros pedagógicos focados nas habilidades estruturantes da BNCC, otimizando o tempo do professor em sala.",
    accentClassName: "text-accent",
  },
  {
    number: "04",
    title: "Favorece o avanço de aprendizagem com equidade",
    description: "Personalização do ensino no ritmo de cada estudante.",
    accentClassName: "text-danger",
  },
] as const;

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Hero />

      <section id="metodo">
        <Container className="py-20 md:py-28">
          <SectionHeading
            eyebrow="Método LUH"
            title="A sua rede de ensino conhece a lacuna real da aprendizagem?"
            description="O método LUH – Leitura Unificada de Habilidades conta com Assessoria Educacional para redes públicas e privadas que precisam recompor e aprofundar as aprendizagens com maior precisão. A metodologia unifica as habilidades da avaliação ao planejamento, contando com ferramentas de tecnologia e utilizando a IA a favor de resultados."
          />
        </Container>
      </section>

      <section id="tri" className="border-y border-gray-200 bg-[#eef1ff]">
        <Container className="py-20 md:py-28">
          <SectionHeading
            eyebrow="TRILHA DE APRENDIZAGEM"
            title="Recomposição em 4 estações."
            description="Um caminho técnico, sequencial e mensurável."
          />

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {trilhaSteps.map((step) => (
              <StepCard key={step.number} {...step} />
            ))}
          </ol>
        </Container>
      </section>

      <DiagnosticQuiz />

      <section>
        <Container className="py-20 md:py-28">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
            <div>
              <SectionHeading
                eyebrow="Próximo passo"
                title="Pronto para elevar sua rede ao próximo nível?"
                description="Atendemos redes e unidades de ensino públicas e privadas que desejam sair do modelo tradicional de avaliação e avançar para uma leitura coerente de aprendizagem que utiliza portal de acompanhamento para gestão unido à assessoria especializada."
              />
              <p className="mt-5 max-w-2xl rounded-xl border border-brand-muted/60 bg-brand-soft/80 px-5 py-4 text-lg font-semibold leading-relaxed text-brand">
                Agende uma consulta e peça uma demonstração gratuita para secretarias municipais e
                estaduais de educação.
              </p>
            </div>

            <GrowthInfographic />
          </div>
        </Container>
      </section>

      <FaqSection />

      <ContactSection />

      <section className="bg-brand">
        <Container className="flex flex-col gap-6 py-20 md:flex-row md:items-end md:justify-between md:py-24">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
            Quer ser uma escola parceira?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
            Solicite uma senha degustação e acesse o Portal LUH Educa.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/85">
            Assessoria Inteligência Pedagógica - Método LUH Educacional
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
