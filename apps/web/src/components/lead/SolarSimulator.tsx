"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readUtmFromLocation } from "@/lib/whatsapp";
import { calcularEconomiaSolar, type TipoImovel } from "@/lib/solar-calc";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const contatoSchema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  whatsapp: z
    .string()
    .regex(/^[\d\s()+-]{10,20}$/, "WhatsApp inválido — inclua o DDD"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É preciso aceitar a política de privacidade" }),
  }),
  website: z.string().max(200).optional(), // honeypot
});

type ContatoValues = z.infer<typeof contatoSchema>;

const labelClass = "block text-sm font-medium text-brand-black";
const inputClass =
  "mt-1 w-full rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange";
const errorClass = "mt-1 text-xs text-red-600";

export function SolarSimulator() {
  const router = useRouter();
  const [valorConta, setValorConta] = useState(500);
  const [tipo, setTipo] = useState<TipoImovel>("residencial");
  const [serverError, setServerError] = useState<string | null>(null);

  const estimativa = useMemo(
    () => calcularEconomiaSolar(valorConta, tipo),
    [valorConta, tipo],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContatoValues>({ resolver: zodResolver(contatoSchema) });

  const temResultado = estimativa.economiaMensalEstimada > 0;

  const onSubmit = async (data: ContatoValues) => {
    setServerError(null);
    const utm = readUtmFromLocation();

    const payload: Record<string, unknown> = {
      nome: data.nome,
      whatsapp: data.whatsapp,
      tipo,
      valorConta,
      economiaEstimada: estimativa.economiaMensalEstimada,
      systemKwp: estimativa.systemKwp,
    };
    if (data.email) payload.email = data.email;
    if (utm.utm_source) payload.origem = utm.utm_source;
    if (utm.utm_campaign) payload.campanha = utm.utm_campaign;
    if (data.website) payload.website = data.website;

    try {
      const res = await fetch(`${API_URL}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      router.push(`/obrigado?origem=simulador&tipo=${tipo}`);
    } catch {
      setServerError(
        "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.",
      );
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Calculadora */}
      <div className="space-y-6 rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="valorConta" className={labelClass}>
            Sua conta de luz hoje:{" "}
            <span className="font-bold text-brand-orange">
              {brl.format(valorConta)}/mês
            </span>
          </label>
          <input
            id="valorConta"
            type="range"
            min={100}
            max={5000}
            step={50}
            value={valorConta}
            onChange={(e) => setValorConta(Number(e.target.value))}
            className="mt-3 w-full accent-brand-orange"
          />
          <div className="mt-1 flex justify-between text-xs text-brand-black/50">
            <span>R$ 100</span>
            <span>R$ 5.000</span>
          </div>
        </div>

        <div>
          <label htmlFor="tipo" className={labelClass}>
            Tipo de imóvel
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoImovel)}
            className={inputClass}
          >
            <option value="residencial">Residencial</option>
            <option value="empresarial">Empresarial</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <dl className="grid grid-cols-2 gap-4 border-t border-brand-black/10 pt-4">
          <div>
            <dt className="text-xs text-brand-black/60">Economia estimada</dt>
            <dd className="text-xl font-bold text-brand-orange">
              {temResultado
                ? `${brl.format(estimativa.economiaMensalEstimada)}/mês`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-brand-black/60">Sistema sugerido</dt>
            <dd className="text-xl font-bold">
              {temResultado ? `${estimativa.systemKwp} kWp` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-brand-black/60">Economia/ano</dt>
            <dd className="text-lg font-semibold">
              {temResultado
                ? brl.format(estimativa.economiaAnualEstimada)
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-brand-black/60">Retorno (payback)</dt>
            <dd className="text-lg font-semibold">
              {temResultado && estimativa.paybackMeses > 0
                ? `~${(estimativa.paybackMeses / 12).toFixed(1)} anos`
                : "—"}
            </dd>
          </div>
        </dl>

        <p className="text-xs text-brand-black/50">
          Estimativa — o orçamento confirma os valores. Cálculo conservador com
          base na tarifa média e irradiação de Fortaleza/CE.
        </p>
      </div>

      {/* Captura de lead */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4 rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold">Receba o orçamento detalhado</h2>

        <div>
          <label htmlFor="nome" className={labelClass}>
            Nome*
          </label>
          <input id="nome" className={inputClass} {...register("nome")} />
          {errors.nome && <p className={errorClass}>{errors.nome.message}</p>}
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            WhatsApp*
          </label>
          <input
            id="whatsapp"
            inputMode="tel"
            placeholder="(85) 99161-8044"
            className={inputClass}
            {...register("whatsapp")}
          />
          {errors.whatsapp && (
            <p className={errorClass}>{errors.whatsapp.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input id="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        {/* Honeypot anti-bot */}
        <div className="absolute left-[-9999px]" aria-hidden>
          <label htmlFor="website">Não preencher</label>
          <input
            id="website"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        <label className="flex items-start gap-2 text-sm text-brand-black/80">
          <input type="checkbox" className="mt-1" {...register("consent")} />
          <span>
            Concordo com a{" "}
            <a href="/privacidade" className="underline hover:text-brand-black">
              Política de Privacidade
            </a>{" "}
            e autorizo o contato.
          </span>
        </label>
        {errors.consent && (
          <p className={errorClass}>{errors.consent.message}</p>
        )}

        {serverError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand-orange px-4 py-3 text-sm font-semibold text-brand-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Enviando..." : "Quero meu orçamento detalhado"}
        </button>
      </form>
    </div>
  );
}
