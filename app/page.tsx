import Link from "next/link";
import Hero from "./Hero";
import FaqSection from "./FaqSection";
import TriCurveSection from "./TriCurveSection";
import DiagnosticQuiz from "./DiagnosticQuiz";
import ContactSection from "./ContactSection";
import TriEvidenceCard from "./TriEvidenceCard";
import GrowthInfographic from "./GrowthInfographic";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Hero />

      <section
        id="metodo"
        className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Método LUH
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          A sua rede de ensino conhece a lacuna real da aprendizagem?
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          O método LUH – Leitura Unificada de Habilidades conta com Assessoria
          Educacional para redes públicas e privadas que precisam recompor e
          aprofundar as aprendizagens com maior precisão. A metodologia unifica
          as habilidades da avaliação ao planejamento, contando com ferramentas
          de tecnologia e utilizando a IA a favor de resultados.
        </p>
      </section>

      <section
        id="tri"
        className="border-y border-gray-200 bg-[#eef1ff]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            TRILHA DE APRENDIZAGEM
          </p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Recomposição em 4 estações.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Um caminho técnico para transformar dados de aprendizagem em
            diagnóstico, planejamento e acompanhamento pedagógico.
          </p>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <li className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-brand">
                01
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Cultura de dados
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Transformamos registros escolares dispersos em inteligência
                estratégica para gestores e diretores da rede.
              </p>
            </li>
            <li className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-success">
                02
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Diagnóstico das Fragilidades
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Mapeamento granular que usa os descritores para identificar
                lacunas estruturais nas redes, escolas, turmas e estudantes
                antes da prova oficial.
              </p>
            </li>
            <li className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-accent">
                03
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Planejamento por Habilidade
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Roteiros pedagógicos focados nas habilidades estruturantes da
                BNCC, otimizando o tempo do professor em sala.
              </p>
            </li>
            <li className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-danger">
                04
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Favorece o avanço de aprendizagem com equidade
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Personalização do ensino no ritmo de cada estudante.
              </p>
            </li>
          </ol>

          <TriEvidenceCard />
        </div>
      </section>

      <DiagnosticQuiz />

      <TriCurveSection />

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Para quem é
            </p>
            <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Escolas que querem avaliação comparável e decisão pedagógica
              sólida.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
              Atendemos redes e unidades que desejam sair do modelo só por
              acertos e avançar para uma leitura coerente de aprendizagem — com
              portal de acompanhamento para gestão e professores.
            </p>
          </div>

          <GrowthInfographic />
        </div>
      </section>

      <FaqSection />

      <ContactSection />

      <section className="bg-brand">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-24">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
              Entre no Portal Luh Educa
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Acompanhe dashboards TRI da escola, turmas e alunos em um só
              lugar.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand transition hover:bg-brand-soft"
          >
            Acessar o portal
          </Link>
        </div>
      </section>

      <footer className="bg-brand">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/15 px-6 py-8 text-sm text-white/75 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-[family-name:var(--font-display)] font-semibold text-white">
            Luh Educa
          </p>
          <p>Assessoria em TRI · Método Luh Educa</p>
        </div>
      </footer>
    </div>
  );
}
