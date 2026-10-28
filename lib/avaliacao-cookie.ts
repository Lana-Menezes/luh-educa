/**
 * Nome do cookie que guarda a última avaliação selecionada, usado como
 * padrão quando a URL não informa `?avaliacao=` (ex.: links do menu
 * lateral). Mantido num módulo sem `next/headers` para poder ser
 * importado tanto por páginas (servidor) quanto pelo componente cliente
 * que grava o cookie.
 */
export const AVALIACAO_COOKIE = "luh_avaliacao";
