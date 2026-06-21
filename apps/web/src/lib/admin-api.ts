// Cliente da API administrativa (auth + recursos protegidos).
// Token JWT guardado no localStorage (MVP). Trade-off: simples, porém suscetível a XSS —
// mitigado pela CSP/sanitização; migrar p/ cookie httpOnly é melhoria futura.

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

const TOKEN_KEY = "tocsolar_admin_token";
const USER_KEY = "tocsolar_admin_user";

export type AdminUser = {
  id: string;
  nome: string;
  email: string;
  role: string;
};

export type Client = {
  id: string;
  nome: string;
  whatsapp: string;
  email: string | null;
  documento: string | null;
  cidade: string | null;
  endereco: string | null;
  tipo: "residencial" | "empresarial" | "rural";
  status: "novo" | "em_contato" | "proposta" | "fechado" | "perdido";
  valorConta: number | null;
  observacoes: string | null;
  leadId: string | null;
  createdAt: string;
  updatedAt: string;
};

export const CLIENT_STATUS: { value: Client["status"]; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_contato", label: "Em contato" },
  { value: "proposta", label: "Proposta" },
  { value: "fechado", label: "Fechado" },
  { value: "perdido", label: "Perdido" },
];

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  try {
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

function setSession(token: string, user: AdminUser): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
}

export async function login(email: string, senha: string): Promise<AdminUser> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  if (!res.ok) {
    throw new Error(
      res.status === 401 ? "E-mail ou senha inválidos" : "Erro ao entrar",
    );
  }
  const data = (await res.json()) as { token: string; user: AdminUser };
  setSession(data.token, data.user);
  return data.user;
}

// fetch autenticado; em 401 limpa sessão e manda para o login.
export async function authFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (res.status === 401 && typeof window !== "undefined") {
    clearSession();
    window.location.href = "/admin/login";
  }
  return res;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Falha na requisição (${res.status})`);
  }
  return (await res.json()) as T;
}

export const clientsApi = {
  list: (params?: { status?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return authFetch(`/clients${suffix}`).then((r) => json<Client[]>(r));
  },
  get: (id: string) => authFetch(`/clients/${id}`).then((r) => json<Client>(r)),
  create: (data: Partial<Client>) =>
    authFetch(`/clients`, { method: "POST", body: JSON.stringify(data) }).then(
      (r) => json<Client>(r),
    ),
  update: (id: string, data: Partial<Client>) =>
    authFetch(`/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => json<Client>(r)),
  remove: (id: string) =>
    authFetch(`/clients/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    ),
};

// ===== Orçamentos =====

export type QuoteStatus = "rascunho" | "enviado" | "aprovado" | "recusado";

export const QUOTE_STATUS: { value: QuoteStatus; label: string }[] = [
  { value: "rascunho", label: "Rascunho" },
  { value: "enviado", label: "Enviado" },
  { value: "aprovado", label: "Aprovado" },
  { value: "recusado", label: "Recusado" },
];

export type QuoteItem = {
  id: string;
  descricao: string;
  quantidade: number;
  valorUnit: number;
  ordem: number;
};

export type QuoteItemInput = {
  descricao: string;
  quantidade: number;
  valorUnit: number;
};

export type QuoteListItem = {
  id: string;
  numero: number;
  status: QuoteStatus;
  total: number;
  createdAt: string;
  client: { id: string; nome: string };
  _count: { items: number };
};

export type Quote = {
  id: string;
  numero: number;
  clientId: string;
  status: QuoteStatus;
  systemKwp: number | null;
  validadeDias: number;
  desconto: number;
  total: number;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
  client: Client;
  items: QuoteItem[];
};

export type QuoteInput = {
  clientId: string;
  systemKwp?: number;
  validadeDias?: number;
  desconto?: number;
  observacoes?: string;
  items: QuoteItemInput[];
};

export const quotesApi = {
  list: (clientId?: string) => {
    const suffix = clientId ? `?clientId=${encodeURIComponent(clientId)}` : "";
    return authFetch(`/quotes${suffix}`).then((r) => json<QuoteListItem[]>(r));
  },
  get: (id: string) => authFetch(`/quotes/${id}`).then((r) => json<Quote>(r)),
  create: (data: QuoteInput) =>
    authFetch(`/quotes`, { method: "POST", body: JSON.stringify(data) }).then(
      (r) => json<Quote>(r),
    ),
  update: (
    id: string,
    data: Partial<Omit<QuoteInput, "clientId">> & { status?: QuoteStatus },
  ) =>
    authFetch(`/quotes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => json<Quote>(r)),
  remove: (id: string) =>
    authFetch(`/quotes/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    ),
};

// ===== Recebíveis (financeiro — contas a receber) =====

export type ReceivableStatus = "pendente" | "pago" | "cancelado";

export const RECEIVABLE_STATUS: { value: ReceivableStatus; label: string }[] = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "cancelado", label: "Cancelado" },
];

export type Receivable = {
  id: string;
  clientId: string;
  quoteId: string | null;
  descricao: string;
  parcela: number;
  totalParcelas: number;
  valor: number;
  vencimento: string;
  status: ReceivableStatus;
  pagoEm: string | null;
  formaPagamento: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
  client: { id: string; nome: string };
  quote: { id: string; numero: number } | null;
};

export type GenerateReceivablesInput = {
  parcelas: number;
  primeiroVencimento: string;
  formaPagamento?: string;
};

export const receivablesApi = {
  list: (params?: { status?: string; clientId?: string }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.clientId) qs.set("clientId", params.clientId);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return authFetch(`/receivables${suffix}`).then((r) => json<Receivable[]>(r));
  },
  update: (
    id: string,
    data: Partial<{
      descricao: string;
      valor: number;
      vencimento: string;
      status: ReceivableStatus;
      pagoEm: string | null;
      formaPagamento: string;
      observacoes: string;
    }>,
  ) =>
    authFetch(`/receivables/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => json<Receivable>(r)),
  remove: (id: string) =>
    authFetch(`/receivables/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    ),
  generateFromQuote: (quoteId: string, data: GenerateReceivablesInput) =>
    authFetch(`/receivables/generate-from-quote/${quoteId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((r) => json<Receivable[]>(r)),
};

// ===== Despesas (financeiro — contas a pagar / custos) =====

export type ExpenseCategoria =
  | "equipamento"
  | "mao_de_obra"
  | "operacional"
  | "marketing"
  | "imposto"
  | "outro";

export type ExpenseStatus = "pago" | "pendente";

export const EXPENSE_CATEGORIES: { value: ExpenseCategoria; label: string }[] = [
  { value: "equipamento", label: "Equipamento" },
  { value: "mao_de_obra", label: "Mão de obra" },
  { value: "operacional", label: "Operacional" },
  { value: "marketing", label: "Marketing" },
  { value: "imposto", label: "Impostos/Taxas" },
  { value: "outro", label: "Outro" },
];

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategoria, string> =
  Object.fromEntries(
    EXPENSE_CATEGORIES.map((c) => [c.value, c.label]),
  ) as Record<ExpenseCategoria, string>;

export type Expense = {
  id: string;
  descricao: string;
  categoria: ExpenseCategoria;
  valor: number;
  data: string;
  status: ExpenseStatus;
  pagoEm: string | null;
  fornecedor: string | null;
  formaPagamento: string | null;
  quoteId: string | null;
  observacoes: string | null;
  createdAt: string;
  updatedAt: string;
  quote: { id: string; numero: number } | null;
};

export type ExpenseInput = {
  descricao: string;
  categoria: ExpenseCategoria;
  valor: number;
  data: string;
  status?: ExpenseStatus;
  fornecedor?: string;
  formaPagamento?: string;
  observacoes?: string;
};

export const expensesApi = {
  list: (params?: {
    categoria?: string;
    status?: string;
    from?: string;
    to?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.categoria) qs.set("categoria", params.categoria);
    if (params?.status) qs.set("status", params.status);
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return authFetch(`/expenses${suffix}`).then((r) => json<Expense[]>(r));
  },
  create: (data: ExpenseInput) =>
    authFetch(`/expenses`, { method: "POST", body: JSON.stringify(data) }).then(
      (r) => json<Expense>(r),
    ),
  update: (id: string, data: Partial<ExpenseInput> & { pagoEm?: string | null }) =>
    authFetch(`/expenses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }).then((r) => json<Expense>(r)),
  remove: (id: string) =>
    authFetch(`/expenses/${id}`, { method: "DELETE" }).then((r) =>
      json<{ ok: boolean }>(r),
    ),
};

// vencido = pendente e já passou do vencimento (derivado, não persistido).
export function isOverdue(r: Receivable): boolean {
  if (r.status !== "pendente") return false;
  return new Date(r.vencimento).getTime() < Date.now();
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}
