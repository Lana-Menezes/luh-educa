import Image from "next/image";
import { ArrowRight, BarChart3, Users, Target } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#eef1ff] pb-16 pt-28 lg:pb-24 lg:pt-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(145deg, #e4e9ff 0%, #eef1ff 42%, #dce4ff 78%, #e8ecff 100%), radial-gradient(ellipse 60% 50% at 85% 20%, #c5cefe66 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 10% 80%, #173efd18 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 lg:px-8">
        <div className="grid h-full items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-brand ring-1 ring-brand-muted/60">
              <Target className="h-4 w-4" />
              Assessoria Pedagógica com TRI
            </div>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] text-gray-900 sm:text-5xl lg:text-6xl">
              Leitura Unificada de Habilidades
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              O método{" "}
              <strong className="text-gray-900">LUH EDUCA</strong> une a
              precisão da Teoria de Resposta ao Item (TRI) à prática da sala de
              aula, revelando o caminho real para alunos lerem com compreensão,
              fluência e autonomia.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contato"
                className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 text-base font-medium text-white transition-all hover:bg-brand-hover"
              >
                Comece uma assessoria
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#metodo"
                className="inline-flex items-center gap-2 rounded-md border border-brand-muted bg-white/80 px-6 py-3 text-base font-medium text-brand transition-colors hover:bg-brand-soft"
              >
                Conheça o método
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-brand-muted/50 pt-8">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-brand ring-1 ring-brand-muted/50">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Dados precisos
                </p>
                <p className="text-sm text-gray-600">TRI ao invés de notas</p>
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-brand ring-1 ring-brand-muted/50">
                  <Users className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Foco no aluno
                </p>
                <p className="text-sm text-gray-600">Cada habilidade mapeada</p>
              </div>
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-brand ring-1 ring-brand-muted/50">
                  <Target className="h-5 w-5" />
                </div>
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Intervenção certeira
                </p>
                <p className="text-sm text-gray-600">
                  Ações baseadas em evidências
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 order-first lg:order-last">
            <Image
              src="/hero-educacao.png"
              alt="Professoras e alunos em sala de aula com gráficos de aprendizagem"
              width={1536}
              height={1024}
              priority
              className="h-auto w-full rounded-2xl shadow-[0_25px_60px_-12px_rgba(23,62,253,0.28),0_12px_28px_-8px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
