import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quem somos | Luh Educa",
  description:
    "Conheça Luciana Fidelis, fundadora da Luh Educa, e a história por trás da consultoria em TRI.",
};

export default function QuemSomosPage() {
  return (
    <article className="bg-white text-gray-900">
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #06124a 0%, #0b1f8f 18%, #1232d4 36%, #173efd 52%, #4a6fff 68%, #0d2bb8 84%, #070f3d 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 70% 55% at 15% 25%, #5b7cff66 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 85% 70%, #0a166088 0%, transparent 50%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-3xl px-6 pb-16 pt-32 md:px-8 md:pb-20 md:pt-36">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-muted">
            Luh Educa
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Quem somos
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            Luciana Fidelis é a fundadora da Luh Educa. Sua trajetória une
            avaliação educacional, leitura pedagógica de dados e o desejo de
            tornar a TRI acessível para escolas reais.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
        <div className="space-y-8 text-lg leading-relaxed text-gray-700">
          <p>
            A Luh Educa nasceu de uma pergunta prática: como ajudar escolas a
            implementar a Teoria de Resposta ao Item sem perder o sentido
            pedagógico do processo? Luciana transformou essa pergunta em método,
            formação e, depois, no portal que acompanha gestão, turmas e alunos.
          </p>

          <p>
            Com formação e experiência em educação, ela atua na ponte entre o
            técnico e o cotidiano escolar — calibragem de itens, régua de
            proficiência, faixas de desempenho e, principalmente, o que a equipe
            faz com esses números na sala de aula.
          </p>

          <h2 className="pt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-gray-900 md:text-3xl">
            Por que a TRI?
          </h2>
          <p>
            Luciana defende a TRI porque ela muda a lógica da avaliação: em vez
            de contar só acertos, a escola passa a estimar proficiência em uma
            escala comparável ao longo do tempo. Isso permite ver avanço real,
            identificar lacunas com mais precisão e organizar reforço por turma e
            por estudante.
          </p>

          <h2 className="pt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-gray-900 md:text-3xl">
            O método Luh Educa
          </h2>
          <p>
            O método que leva seu nome organiza a implementação em três
            movimentos: diagnóstico e desenho, construção e calibração de itens,
            e leitura para ação pedagógica. A ideia é simples — a escola não
            precisa virar um centro de estatística; precisa de um caminho claro
            para usar a TRI com confiança.
          </p>
          <p>
            Além da consultoria, Luciana impulsiona o Portal Luh Educa para que
            coordenadores e professores acompanhem os resultados no mesmo
            ambiente em que decidem intervenções.
          </p>

          <h2 className="pt-4 font-[family-name:var(--font-display)] text-2xl font-bold text-gray-900 md:text-3xl">
            Para quem trabalhamos
          </h2>
          <p>
            Redes e unidades escolares que querem sair do modelo só por nota e
            construir uma cultura avaliativa mais justa, comparável e útil para
            o planejamento pedagógico. O trabalho começa no diagnóstico da
            escola e segue até a formação das equipes.
          </p>
        </div>

        <aside className="mt-14 rounded-2xl bg-brand-soft p-6 md:p-8">
          <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-900">
            Quer conhecer o método na prática?
          </p>
          <p className="mt-3 leading-relaxed text-gray-700">
            Veja como a Luh Educa apoia a implementação da TRI na sua escola.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#metodo"
              className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Conhecer o método
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand-muted/40"
            >
              Voltar à home
            </Link>
          </div>
        </aside>
      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-[family-name:var(--font-display)] font-semibold text-gray-800">
            Luh Educa
          </p>
          <p>Consultoria em TRI · Método Luh Educa</p>
        </div>
      </footer>
    </article>
  );
}
