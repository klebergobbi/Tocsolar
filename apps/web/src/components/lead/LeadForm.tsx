"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readUtmFromLocation } from "@/lib/whatsapp";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
  z.number().min(0).optional(),
);

const schema = z.object({
  nome: z.string().min(2, "Informe seu nome"),
  whatsapp: z
    .string()
    .regex(/^[\d\s()+-]{10,20}$/, "WhatsApp inválido — inclua o DDD"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  cidade: z.string().max(120).optional(),
  tipo: z.enum(["residencial", "empresarial", "rural"], {
    errorMap: () => ({ message: "Selecione o tipo" }),
  }),
  valorConta: optionalNumber,
  mensagem: z.string().max(2000).optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "É preciso aceitar a política de privacidade" }),
  }),
  // Honeypot anti-bot: humanos deixam vazio; o servidor descarta se vier preenchido.
  website: z.string().max(200).optional(),
});

type LeadFormValues = z.infer<typeof schema>;

const labelClass = "block text-sm font-medium text-brand-black";
const inputClass =
  "mt-1 w-full rounded-lg border border-brand-black/15 px-3 py-2 text-sm outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange";
const errorClass = "mt-1 text-xs text-red-600";

export function LeadForm({
  defaultTipo = "residencial",
}: {
  defaultTipo?: "residencial" | "empresarial" | "rural";
} = {}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: defaultTipo },
  });

  const onSubmit = async (data: LeadFormValues) => {
    setServerError(null);
    const utm = readUtmFromLocation();

    const payload: Record<string, unknown> = {
      nome: data.nome,
      whatsapp: data.whatsapp,
      tipo: data.tipo,
    };
    if (data.email) payload.email = data.email;
    if (data.cidade) payload.cidade = data.cidade;
    if (data.valorConta !== undefined) payload.valorConta = data.valorConta;
    if (data.mensagem) payload.mensagem = data.mensagem;
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

      // Evento de conversão dispara na /obrigado (padrão do projeto).
      const params = new URLSearchParams({ origem: "form", tipo: data.tipo });
      router.push(`/obrigado?${params.toString()}`);
    } catch {
      setServerError(
        "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-2xl border border-brand-black/10 bg-white p-6 shadow-sm"
    >
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail
          </label>
          <input id="email" className={inputClass} {...register("email")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="cidade" className={labelClass}>
            Cidade
          </label>
          <input id="cidade" className={inputClass} {...register("cidade")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tipo" className={labelClass}>
            Tipo de imóvel*
          </label>
          <select id="tipo" className={inputClass} {...register("tipo")}>
            <option value="residencial">Residencial</option>
            <option value="empresarial">Empresarial</option>
            <option value="rural">Rural</option>
          </select>
          {errors.tipo && <p className={errorClass}>{errors.tipo.message}</p>}
        </div>
        <div>
          <label htmlFor="valorConta" className={labelClass}>
            Valor da conta (R$/mês)
          </label>
          <input
            id="valorConta"
            type="number"
            min={0}
            step="1"
            className={inputClass}
            {...register("valorConta")}
          />
          {errors.valorConta && (
            <p className={errorClass}>{errors.valorConta.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="mensagem" className={labelClass}>
          Mensagem
        </label>
        <textarea
          id="mensagem"
          rows={3}
          className={inputClass}
          {...register("mensagem")}
        />
      </div>

      {/* Honeypot — escondido de humanos, ignorado por leitores de tela. */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Não preencher</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div>
        <label className="flex items-start gap-2 text-sm text-brand-black/80">
          <input type="checkbox" className="mt-1" {...register("consent")} />
          <span>
            Concordo com a{" "}
            <a href="/privacidade" className="underline hover:text-brand-black">
              Política de Privacidade
            </a>{" "}
            e autorizo o contato sobre meu orçamento.
          </span>
        </label>
        {errors.consent && (
          <p className={errorClass}>{errors.consent.message}</p>
        )}
      </div>

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
        {isSubmitting ? "Enviando..." : "Quero meu orçamento"}
      </button>
    </form>
  );
}
