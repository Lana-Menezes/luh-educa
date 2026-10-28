"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Download, FileSpreadsheet, FileText } from "lucide-react";

export type SecaoRelatorio = {
  titulo: string;
  colunas: string[];
  linhas: (string | number)[][];
};

export type GraficoRelatorio = {
  titulo: string;
  /** id do elemento no DOM (o próprio gráfico ou um contêiner em torno dele) a capturar como imagem. */
  elementId: string;
};

export type RelatorioExportavel = {
  /** Nome do arquivo gerado, sem extensão. */
  arquivo: string;
  titulo: string;
  subtitulo?: string;
  secoes: SecaoRelatorio[];
  /** Gráficos a incluir como imagem — só no PDF, o Excel permanece só com as tabelas. */
  graficos?: GraficoRelatorio[];
};

/** Nomes de planilha do Excel só aceitam até 31 caracteres e não podem repetir. */
function nomesDePlanilha(secoes: SecaoRelatorio[]) {
  const usados = new Set<string>();
  return secoes.map((secao) => {
    let nome = secao.titulo.slice(0, 31);
    let i = 2;
    while (usados.has(nome)) {
      const sufixo = ` (${i++})`;
      nome = `${secao.titulo.slice(0, 31 - sufixo.length)}${sufixo}`;
    }
    usados.add(nome);
    return nome;
  });
}

async function baixarExcel({ arquivo, secoes }: RelatorioExportavel) {
  const ExcelJS = (await import("exceljs")).default;
  const workbook = new ExcelJS.Workbook();
  const nomes = nomesDePlanilha(secoes);

  secoes.forEach((secao, i) => {
    const sheet = workbook.addWorksheet(nomes[i]);
    sheet.addRow(secao.colunas).font = { bold: true };
    secao.linhas.forEach((linha) => sheet.addRow(linha));
    sheet.columns.forEach((coluna) => {
      let largura = 10;
      coluna.eachCell?.((cell) => {
        largura = Math.max(largura, String(cell.value ?? "").length + 2);
      });
      coluna.width = Math.min(largura, 40);
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  triggerDownload(blob, `${arquivo}.xlsx`);
}

type ImagemCarregada = { dataUrl: string; largura: number; altura: number };

/** Rasteriza uma imagem (PNG ou SVG) via canvas para uso em `doc.addImage`, que não lê SVG direto. */
function carregarImagem(url: string): Promise<ImagemCarregada> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas 2D não disponível"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve({ dataUrl: canvas.toDataURL("image/png"), largura: img.naturalWidth, altura: img.naturalHeight });
    };
    img.onerror = () => reject(new Error(`Não foi possível carregar ${url}`));
    img.src = url;
  });
}

const MARGEM = 14;

async function baixarPdf({ arquivo, titulo, subtitulo, secoes, graficos }: RelatorioExportavel) {
  const { jsPDF } = await import("jspdf");
  const { autoTable } = await import("jspdf-autotable");
  const [brasaoMafra, logoLuh] = await Promise.all([
    carregarImagem("/brasao-mafra.svg"),
    carregarImagem("/logo-luh.png"),
  ]);

  const doc = new jsPDF();
  const larguraPagina = doc.internal.pageSize.getWidth();
  const alturaPagina = doc.internal.pageSize.getHeight();

  const alturaBrasao = 14;
  const larguraBrasao = (brasaoMafra.largura / brasaoMafra.altura) * alturaBrasao;
  doc.addImage(brasaoMafra.dataUrl, "PNG", MARGEM, 8, larguraBrasao, alturaBrasao);

  const textoX = MARGEM + larguraBrasao + 4;
  doc.setFontSize(14);
  doc.text(titulo, textoX, 14);
  let y = 26;

  if (subtitulo) {
    doc.setFontSize(10);
    doc.setTextColor(110);
    doc.text(subtitulo, textoX, 20);
    doc.setTextColor(0);
  }

  secoes.forEach((secao) => {
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(secao.titulo, MARGEM, y + 4);
    autoTable(doc, {
      head: [secao.colunas],
      body: secao.linhas.map((linha) => linha.map(String)),
      startY: y + 7,
      margin: { left: MARGEM, right: MARGEM, bottom: 22 },
      styles: { fontSize: 8 },
      headStyles: { fillColor: [31, 41, 55] },
    });
    const finalY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
    y = (finalY ?? y + 7) + 10;
  });

  if (graficos && graficos.length > 0) {
    const { toPng } = await import("html-to-image");
    const larguraConteudo = larguraPagina - MARGEM * 2;
    const alturaMaximaConteudo = alturaPagina - 26;

    for (const grafico of graficos) {
      const elemento = document.getElementById(grafico.elementId);
      if (!elemento) continue;
      const retangulo = elemento.getBoundingClientRect();
      if (retangulo.width === 0 || retangulo.height === 0) continue;

      const dataUrl = await toPng(elemento, { backgroundColor: "#ffffff", pixelRatio: 2 });
      const alturaImagem = Math.min(
        (retangulo.height / retangulo.width) * larguraConteudo,
        alturaMaximaConteudo - 11,
      );

      if (y + alturaImagem + 11 > alturaMaximaConteudo) {
        doc.addPage();
        y = 16;
      }

      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(grafico.titulo, MARGEM, y + 4);
      doc.addImage(dataUrl, "PNG", MARGEM, y + 7, larguraConteudo, alturaImagem);
      y += alturaImagem + 17;
    }
  }

  const alturaLogoLuh = 10;
  const larguraLogoLuh = (logoLuh.largura / logoLuh.altura) * alturaLogoLuh;
  const rodapeY = alturaPagina - alturaLogoLuh - 8;
  const logoLuhX = larguraPagina - MARGEM - larguraLogoLuh;
  const totalPaginas = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    doc.setPage(pagina);
    doc.addImage(logoLuh.dataUrl, "PNG", logoLuhX, rodapeY, larguraLogoLuh, alturaLogoLuh);
    doc.setFontSize(9);
    doc.setTextColor(0);
    doc.text("LUH Educa", logoLuhX - 4, rodapeY + alturaLogoLuh / 2 + 1, { align: "right" });
  }

  doc.save(`${arquivo}.pdf`);
}

function triggerDownload(blob: Blob, nomeArquivo: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/**
 * Botão com menu para baixar um relatório tabular em Excel ou PDF.
 * `compacto` troca o botão por um ícone só, para caber em linhas de tabela
 * ou cards (ex.: exportar uma turma sem abrir a página dela).
 */
export function ExportButtons(relatorio: RelatorioExportavel & { compacto?: boolean }) {
  const { compacto, ...dados } = relatorio;
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function aoClicarFora(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [aberto]);

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onClick={(event) => event.stopPropagation()}
    >
      {compacto ? (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={aberto}
          aria-label="Baixar relatório da turma"
          title="Baixar relatório"
          className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:border-brand-muted hover:text-brand"
        >
          <Download className="h-4 w-4" aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={aberto}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-brand-muted hover:text-brand"
        >
          <Download className="h-4 w-4" aria-hidden />
          Baixar relatório
          <ChevronDown className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
      {aberto && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              void baixarExcel(dados);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            <FileSpreadsheet className="h-4 w-4 text-success" aria-hidden />
            Excel (.xlsx)
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setAberto(false);
              void baixarPdf(dados);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 text-danger" aria-hidden />
            PDF
          </button>
        </div>
      )}
    </div>
  );
}
