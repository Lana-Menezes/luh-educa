import Link from "next/link";
import InteractiveDotGrid from "./InteractiveDotGrid";
import FaqSection from "./FaqSection";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <section className="relative isolate min-h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#0b1f8f_0%,#173efd_42%,#0a1660_100%)]" />
          <div
            className="absolute inset-0 opacity-35 luh-animate-fade-in"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #ffd10355 0%, transparent 42%), radial-gradient(circle at 80% 10%, #00b80033 0%, transparent 35%), radial-gradient(circle at 70% 80%, #ffffff22 0%, transparent 40%)",
            }}
          />
          <InteractiveDotGrid className="luh-animate-fade-in" />
        </div>

        <div className="relative mx-auto flex min-h-dvh max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:justify-center md:px-8 md:pb-24 md:pt-24">
          <p className="luh-animate-fade-up font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Luh Educa
          </p>
          <h1 className="luh-animate-fade-up luh-delay-1 mt-5 max-w-3xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
            Consultoria para implementar a TRI com método próprio.
          </h1>
          <p className="luh-animate-fade-up luh-delay-2 mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Ajudamos escolas a adotar a Teoria de Resposta ao Item com clareza
            pedagógica, escala comparável e rotina de acompanhamento.
          </p>
          <div className="luh-animate-fade-up luh-delay-3 mt-8 flex flex-wrap gap-3">
            <a
              href="#metodo"
              className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-accent-hover"
            >
              Conhecer o método
            </a>
            <Link
              href="/login"
              className="rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Acessar o portal
            </Link>
          </div>
        </div>
      </section>

      <section id="metodo" className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Método Luh Educa
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Da teoria à prática escolar, sem perder o sentido pedagógico.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          O método Luh Educa organiza a implementação da TRI em etapas que
          conectam banco de itens, leitura de escala e decisão pedagógica — para
          a escola usar a avaliação como bússola, não só como nota.
        </p>
      </section>

      <section
        id="tri"
        className="border-y border-gray-200 bg-[linear-gradient(180deg,#f7f8ff_0%,#ffffff_100%)]"
      >
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
            Implementação da TRI
          </p>
          <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Três movimentos para a escola dominar a régua de proficiência.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            <li>
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-brand/20">
                01
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Diagnóstico e desenho
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Mapeamos matriz, anos e rotinas atuais para definir o recorte
                TRI adequado à realidade da escola.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-accent-ink/40">
                02
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Itens e escala
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Construímos e calibramos itens (parâmetros a, b e c) para
                posicionar estudantes e questões na mesma régua.
              </p>
            </li>
            <li>
              <p className="font-[family-name:var(--font-display)] text-5xl font-bold text-success/35">
                03
              </p>
              <h3 className="mt-3 text-xl font-semibold text-gray-900">
                Leitura e ação
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                Formamos equipes para interpretar faixas de proficiência e
                transformar dados em planos de reforço por turma e por aluno.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
          Para quem é
        </p>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Escolas que querem avaliação comparável e decisão pedagógica sólida.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
          Atendemos redes e unidades que desejam sair do modelo só por acertos e
          avançar para uma leitura coerente de aprendizagem — com portal de
          acompanhamento para gestão e professores.
        </p>
      </section>

      <FaqSection />

      <section className="relative overflow-hidden bg-brand">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 50%, #ffd10366 0%, transparent 40%), radial-gradient(circle at 90% 20%, #00b80044 0%, transparent 35%)",
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-20 md:flex-row md:items-end md:justify-between md:px-8 md:py-24">
          <div className="max-w-xl">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold text-white md:text-4xl">
              Entre no Portal Luh Educa
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/85">
              Acompanhe dashboards TRI da escola, turmas e alunos em um só lugar.
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

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-[family-name:var(--font-display)] font-semibold text-gray-800">
            Luh Educa
          </p>
          <p>Consultoria em TRI · Método Luh Educa</p>
        </div>
      </footer>
    </div>
  );
}
