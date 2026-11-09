import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button, Container } from "@/components/ui";

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

      <Container size="wide" className="relative z-10 flex-1">
        <div className="grid h-full items-center gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
          <div className="flex flex-col justify-center">
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] text-gray-900 sm:text-5xl lg:text-6xl">
              Assessoria de Inteligência Pedagógica
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
              A metodologia LUH conecta a BNCC à avaliação por evidências.
              Contamos com tecnologia para transformar os dados de resultados de
              avaliações em diagnóstico e em planejamentos por habilidade com
              acompanhamento. Os relatórios auxiliam na decisão pedagógica da
              equipe gestora.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="#metodo" variant="secondary" size="lg">
                Conheça a Trilha
              </Button>
              <Button href="#autodiagnostico" size="lg">
                Iniciar Diagnóstico
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative z-10">
            <Image
              src="/hero-quadro.png"
              alt="Quadro com o ciclo do método LUH: erro, diagnóstico, intervenção, reavaliação, sequência didática e avaliação"
              width={632}
              height={636}
              priority
              className="h-auto w-full rounded-2xl shadow-[0_25px_60px_-12px_rgba(23,62,253,0.28),0_12px_28px_-8px_rgba(0,0,0,0.22)]"
            />
          </div>
        </div>
      </Container>

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
