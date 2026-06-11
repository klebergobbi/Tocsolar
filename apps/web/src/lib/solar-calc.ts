/**
 * Cálculo de economia/payback solar — modelo simplificado e CONSERVADOR.
 * Subestimar é melhor que prometer demais (a insatisfação do setor vem de
 * expectativa de retorno furada). O resultado é ESTIMATIVA — o orçamento confirma.
 *
 * Todas as constantes ficam aqui no topo, fáceis de calibrar.
 */

// Tarifa média Enel CE (R$/kWh, com tributos). <<CONFIRMAR R$/kWh exato>>
export const TARIFA_ENEL_CE = 0.98;

// Irradiação média de Fortaleza (kWh/m²/dia). Faixa ~5,4–5,7; usamos o piso.
export const IRRADIACAO_FORTALEZA = 5.4;

// Performance Ratio (perdas de inversor, temperatura, sujeira). Conservador.
export const PERFORMANCE_RATIO = 0.75;

const DIAS_MES = 30;

// Dimensiona o sistema para cobrir só parte do consumo (conservador).
export const COBERTURA_ALVO = 0.9;

// Consumo mínimo que permanece na conta mesmo com solar (custo de
// disponibilidade — depende do padrão de ligação). <<CONFIRMAR>> (50 = bifásico)
export const CONSUMO_DISPONIBILIDADE_KWH = 50;

// Custo turnkey por Wp instalado (R$/Wp). <<CONFIRMAR ticket real>>
export const CUSTO_POR_WP = 4.0;

export type TipoImovel = "residencial" | "empresarial" | "rural";

export type SolarEstimate = {
  consumoMensalKwh: number;
  systemKwp: number;
  geracaoMensalKwh: number;
  economiaMensalEstimada: number;
  economiaAnualEstimada: number;
  custoEstimado: number;
  /** 0 quando não há economia estimável (conta muito baixa). */
  paybackMeses: number;
};

/** Geração mensal (kWh) por kWp instalado em Fortaleza. */
const geracaoMensalPorKwp = () =>
  IRRADIACAO_FORTALEZA * PERFORMANCE_RATIO * DIAS_MES;

const round = (n: number, casas = 2) => {
  const f = 10 ** casas;
  return Math.round(n * f) / f;
};

/**
 * Estima sistema, economia e payback a partir do valor da conta (R$/mês).
 * `tipo` é aceito para calibração futura (tarifas comerciais/rurais diferem);
 * por ora o modelo é o mesmo para todos.
 */
export function calcularEconomiaSolar(
  valorConta: number,
  _tipo: TipoImovel = "residencial",
): SolarEstimate {
  const zero: SolarEstimate = {
    consumoMensalKwh: 0,
    systemKwp: 0,
    geracaoMensalKwh: 0,
    economiaMensalEstimada: 0,
    economiaAnualEstimada: 0,
    custoEstimado: 0,
    paybackMeses: 0,
  };

  if (!valorConta || valorConta <= 0) return zero;

  const consumoMensalKwh = valorConta / TARIFA_ENEL_CE;

  // Energia que o sistema vai cobrir (descontando o mínimo da concessionária).
  const energiaAlvoKwh =
    Math.max(0, consumoMensalKwh - CONSUMO_DISPONIBILIDADE_KWH) * COBERTURA_ALVO;

  if (energiaAlvoKwh <= 0) return { ...zero, consumoMensalKwh: round(consumoMensalKwh) };

  const porKwp = geracaoMensalPorKwp();
  const systemKwp = energiaAlvoKwh / porKwp;
  const geracaoMensalKwh = systemKwp * porKwp;

  const economiaMensalEstimada = geracaoMensalKwh * TARIFA_ENEL_CE;
  const custoEstimado = systemKwp * 1000 * CUSTO_POR_WP;
  const paybackMeses =
    economiaMensalEstimada > 0 ? custoEstimado / economiaMensalEstimada : 0;

  return {
    consumoMensalKwh: round(consumoMensalKwh),
    systemKwp: round(systemKwp),
    geracaoMensalKwh: round(geracaoMensalKwh),
    economiaMensalEstimada: round(economiaMensalEstimada),
    economiaAnualEstimada: round(economiaMensalEstimada * 12),
    custoEstimado: round(custoEstimado),
    paybackMeses: Math.round(paybackMeses),
  };
}
