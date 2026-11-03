import Image from "next/image";
import type { Metadata } from "next";
import { Container, CTABanner, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Quem somos | LUH Educa",
  description:
    "Conheça as pessoas por trás da metodologia LUH Educacional e do portal que torna as avaliações e os planejamentos por habilidade acessíveis para escolas reais.",
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

        <Container className="relative pb-16 pt-32 md:pb-20 md:pt-36">
          <SectionHeading
            as="h1"
            eyebrow="LUH Educa"
            title="Quem somos"
            description="Conheça as pessoas por trás da metodologia LUH Educacional e do portal que torna as avaliações e os planejamentos por habilidade acessíveis para escolas reais."
            tone="inverted"
            titleClassName=""
          />
        </Container>
      </header>

      <Container className="py-14 md:py-20">
        <section className="grid items-start gap-10 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-14 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <figure className="mx-auto w-full max-w-[280px] md:mx-0 md:max-w-none">
            <div className="relative aspect-[801/1024] w-full overflow-hidden rounded-2xl bg-brand-soft shadow-[0_20px_50px_-16px_rgba(23,62,253,0.28)]">
              <Image
                src="/luciana-quem-somos.png"
                alt="Luciana Menezes de Souza, pedagoga e fundadora da LUH Educa"
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="mt-4 text-center md:text-left">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-900">
                Luciana Menezes de Souza
              </p>
              <p className="mt-1 text-sm font-medium text-brand">
                Pedagoga · Fundadora da LUH Educa
              </p>
            </figcaption>
          </figure>

          <div className="space-y-6 text-lg leading-relaxed text-gray-700">
            <SectionHeading as="h2" title="A pedagoga Luciana" titleClassName="" />
            <p>
              Autora do livro{" "}
              <strong className="font-semibold text-gray-900">
                Manual de Recomposição das Aprendizagens
              </strong>
              , criadora do método LUH. Fundadora da empresa de assessoria em
              Inteligência Pedagógica LUH Educacional que sistematiza a
              metodologia para redes públicas e privadas.
            </p>
            <p>
              A LUH Educa nasceu de uma pergunta prática:{" "}
              <strong className="font-semibold text-gray-900">
                como ajudar escolas a implementar o DE e PARA habilidade sem
                perder o sentido pedagógico do processo?
              </strong>
            </p>
            <p>
              Luciana transformou essa pergunta em método, formação e, depois,
              no portal que permite que a gestão acompanhe sua rede, escola,
              turmas e alunos, através de ferramentas de tecnologia e uso de IA
              construídas pela sua principal colaboradora no processo.
            </p>
            <p>
              Com formação e experiência de mais de 25 anos em educação, ela
              atua na ponte entre o técnico e a sala de aula.
            </p>
            <p className="font-semibold text-gray-900">
              Após receber o diagnóstico da rede de ensino, o que a equipe
              pedagógica deve fazer com esses números?
            </p>
          </div>
        </section>

        <section className="mt-16 grid items-start gap-10 border-t border-gray-200 pt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,280px)] md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
          <div className="order-2 space-y-6 text-lg leading-relaxed text-gray-700 md:order-1">
            <SectionHeading as="h2" title="A engenheira Lana" titleClassName="" />
            <p>
              Lana Menezes Fidelis é engenheira de software, mestranda em IA,
              responsável por transformar o método LUH Educacional em produto
              digital. Criadora da ferramenta de tecnologia que transforma dados
              das avaliações em relatórios no portal de acompanhamento,
              permitindo visualizações da aprendizagem da sua instituição de
              ensino com clareza.
            </p>
            <p>
              Ela conecta a visão pedagógica da assessoria à experiência de uso:
              dashboards da rede, da escola, da turma e do aluno, e uma
              interface pensada para o dia a dia de gestão escolar.
            </p>
            <p>
              Através da união da engenharia e da pedagogia, a LUH Educa une
              método avaliativo e planejamentos à tecnologia, para que a leitura
              de habilidades vire decisão prática na escola.
            </p>
          </div>

          <figure className="order-1 mx-auto w-full max-w-[280px] md:order-2 md:mx-0 md:max-w-none">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-brand-soft shadow-[0_20px_50px_-16px_rgba(23,62,253,0.28)]">
              <Image
                src="/lana-quem-somos.png"
                alt="Lana Menezes Fidelis, engenheira de software da Luh Educa"
                fill
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover object-center"
              />
            </div>
            <figcaption className="mt-4 text-center md:text-right">
              <p className="font-[family-name:var(--font-display)] text-xl font-bold text-gray-900">
                Lana Menezes Fidelis
              </p>
              <p className="mt-1 text-sm font-medium text-brand">
                Engenheira de Software
              </p>
            </figcaption>
          </figure>
        </section>

        <div className="mt-16 max-w-3xl space-y-8 text-lg leading-relaxed text-gray-700">
          <SectionHeading as="h2" title="Para quem trabalhamos" titleClassName="" />
          <p>
            Redes de publicas e privadas de educação e unidades escolares que
            querem construir uma cultura avaliativa mais justa, comparável e
            útil para o planejamento pedagógico. O trabalho começa na avaliação
            diagnóstica, juntamente com a formação das equipes, segue com os
            planejamentos por habilidade (recomposição e/ou aprofundamento) para
            as avaliações formativas, que acompanham o avanço da aprendizagem
            dos estudantes e conclui o ciclo na avaliação somativa que revela os
            resultados obtidos.
          </p>
        </div>

        <CTABanner
          className="mt-14"
          title="Quer conhecer o método na prática?"
          description="Solicite uma senha degustação e acesse o Portal LUH Educa"
          primaryAction={{ label: "Entrar em contato", href: "/#contato" }}
          secondaryAction={{ label: "Voltar à home", href: "/" }}
        />
      </Container>
    </article>
  );
}
