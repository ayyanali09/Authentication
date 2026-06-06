"use client";

import {
  CircleDollarSign,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Table2,
  Trash2,
  TrendingDown,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  type FinanceEntry,
  type FinanceEntryPayload,
  type FinanceEntryStatus,
  type FinanceEntryType,
  createFinanceEntry,
  deleteFinanceEntry,
  listFinanceEntries,
  updateFinanceEntry
} from "@/lib/api";
import { cn } from "@/lib/utils";

type FinanceRow = FinanceEntry & {
  localId: string;
  isDraft?: boolean;
};

const typeOptions: FinanceEntryType[] = ["income", "expense"];
const statusOptions: FinanceEntryStatus[] = ["paid", "pending", "overdue"];

const typeLabels: Record<FinanceEntryType, string> = {
  income: "Income",
  expense: "Expense"
};

const statusLabels: Record<FinanceEntryStatus, string> = {
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue"
};

function entryId(entry: FinanceEntry) {
  return entry.id ?? entry._id ?? "";
}

function todayInputDate() {
  return new Date().toISOString().slice(0, 10);
}

function toInputDate(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function normalizeRow(entry: FinanceEntry): FinanceRow {
  return {
    ...entry,
    date: toInputDate(entry.date),
    localId: entryId(entry)
  };
}

function cleanOptional(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toPayload(row: FinanceRow): FinanceEntryPayload {
  return {
    date: row.date,
    type: row.type,
    category: row.category.trim(),
    description: row.description.trim(),
    client: cleanOptional(row.client),
    amount: Number(row.amount),
    paymentMethod: cleanOptional(row.paymentMethod),
    status: row.status,
    notes: cleanOptional(row.notes)
  };
}

export function AdminFinanceSheet({ token }: { token: string }) {
  const [rows, setRows] = useState<FinanceRow[]>([]);
  const [dirtyRows, setDirtyRows] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<FinanceEntryType | "all">("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        const amount = Number(row.amount) || 0;

        if (row.type === "income") {
          acc.income += amount;
        } else {
          acc.expenses += amount;
        }

        if (row.status !== "paid") {
          acc.pending += amount;
        }

        acc.net = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, net: 0, pending: 0 }
    );
  }, [rows]);

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesType = typeFilter === "all" || row.type === typeFilter;

      if (!matchesType) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        row.category,
        row.description,
        row.client,
        row.paymentMethod,
        row.status,
        row.notes
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [query, rows, typeFilter]);

  useEffect(() => {
    refreshRows();
  }, []);

  async function refreshRows() {
    setLoading(true);
    setNotice("");
    setError("");

    try {
      const entries = await listFinanceEntries(token);
      setRows(entries.map(normalizeRow));
      setDirtyRows(new Set());
    } catch (loadError) {
      setError(normalizeError(loadError));
    } finally {
      setLoading(false);
    }
  }

  function addRow() {
    const localId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? `draft-${crypto.randomUUID()}`
        : `draft-${Date.now()}`;

    const row: FinanceRow = {
      localId,
      isDraft: true,
      date: todayInputDate(),
      type: "income",
      category: "",
      description: "",
      client: "",
      amount: 0,
      paymentMethod: "",
      status: "pending",
      notes: ""
    };

    setRows((current) => [row, ...current]);
    setDirtyRows((current) => new Set(current).add(localId));
  }

  function updateRow<K extends keyof FinanceRow>(
    localId: string,
    field: K,
    value: FinanceRow[K]
  ) {
    setRows((current) =>
      current.map((row) => (row.localId === localId ? { ...row, [field]: value } : row))
    );
    setDirtyRows((current) => new Set(current).add(localId));
  }

  function validateRow(row: FinanceRow) {
    if (!row.date || !row.category.trim() || !row.description.trim()) {
      return "Date, category, and description are required.";
    }

    if (!Number.isFinite(Number(row.amount)) || Number(row.amount) <= 0) {
      return "Amount must be greater than 0.";
    }

    return "";
  }

  async function saveRow(row: FinanceRow) {
    const validationError = validateRow(row);

    if (validationError) {
      setError(validationError);
      return;
    }

    const id = entryId(row);
    setSavingId(row.localId);
    setNotice("");
    setError("");

    try {
      const saved = row.isDraft
        ? await createFinanceEntry(toPayload(row), token)
        : await updateFinanceEntry(id, toPayload(row), token);
      const normalized = normalizeRow(saved);

      setRows((current) =>
        current.map((item) => (item.localId === row.localId ? normalized : item))
      );
      setDirtyRows((current) => {
        const next = new Set(current);
        next.delete(row.localId);
        next.delete(normalized.localId);
        return next;
      });
      setNotice("Finance row saved.");
    } catch (saveError) {
      setError(normalizeError(saveError));
    } finally {
      setSavingId(null);
    }
  }

  async function removeRow(row: FinanceRow) {
    const id = entryId(row);

    if (row.isDraft || !id) {
      setRows((current) => current.filter((item) => item.localId !== row.localId));
      setDirtyRows((current) => {
        const next = new Set(current);
        next.delete(row.localId);
        return next;
      });
      return;
    }

    if (!window.confirm(`Delete finance row "${row.description}"?`)) {
      return;
    }

    setDeletingId(row.localId);
    setNotice("");
    setError("");

    try {
      await deleteFinanceEntry(id, token);
      setRows((current) => current.filter((item) => item.localId !== row.localId));
      setNotice("Finance row deleted.");
    } catch (deleteError) {
      setError(normalizeError(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-yellow-accent">Finance Sheet</p>
          <h2 className="mt-2 text-2xl font-semibold text-white-text md:text-3xl">
            Income and expenses
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshRows}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white-text transition hover:border-electric-blue/70 hover:bg-electric-blue/10 disabled:pointer-events-none disabled:opacity-55"
          >
            Refresh
            <RefreshCw
              className={cn(loading && "animate-spin")}
              size={16}
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-yellow-accent px-4 py-3 text-sm font-semibold text-deep-black transition hover:bg-white-text"
          >
            Add Row <Plus size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Income", value: currency(summary.income), icon: TrendingUp },
          { label: "Expenses", value: currency(summary.expenses), icon: TrendingDown },
          { label: "Net", value: currency(summary.net), icon: CircleDollarSign },
          { label: "Pending", value: currency(summary.pending), icon: WalletCards }
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-white/58">{item.label}</p>
              <item.icon size={18} className="text-yellow-accent" aria-hidden="true" />
            </div>
            <p className="mt-4 break-words text-2xl font-semibold text-white-text">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search finance rows</span>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38"
            size={18}
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-md border border-white/12 bg-deep-black/70 px-4 pl-11 text-white-text outline-none transition focus:border-yellow-accent"
            placeholder="Search category, client, method, or notes"
          />
        </label>

        <label className="grid gap-2 text-sm font-medium text-white/62 sm:w-56">
          Type
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as FinanceEntryType | "all")}
            className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
          >
            <option value="all">All</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error || notice ? (
        <p
          aria-live="polite"
          className={cn("mt-5 text-sm", error ? "text-red-300" : "text-white/58")}
        >
          {error || notice}
        </p>
      ) : null}

      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.035]">
        <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
          <thead className="bg-white/[0.055] text-xs uppercase text-white/48">
            <tr>
              {[
                "Date",
                "Type",
                "Category",
                "Description",
                "Client",
                "Amount",
                "Method",
                "Status",
                "Notes",
                "Actions"
              ].map((heading) => (
                <th key={heading} className="border-b border-white/10 px-3 py-3 font-semibold">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-white/58">
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                    Loading finance rows...
                  </span>
                </td>
              </tr>
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row) => {
                const dirty = dirtyRows.has(row.localId);
                const busy = savingId === row.localId || deletingId === row.localId;

                return (
                  <tr key={row.localId} className="border-b border-white/10 last:border-b-0">
                    <td className="px-3 py-3 align-top">
                      <input
                        type="date"
                        value={row.date}
                        onChange={(event) => updateRow(row.localId, "date", event.target.value)}
                        className="h-10 w-36 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <select
                        value={row.type}
                        onChange={(event) =>
                          updateRow(row.localId, "type", event.target.value as FinanceEntryType)
                        }
                        className="h-10 w-32 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                      >
                        {typeOptions.map((type) => (
                          <option key={type} value={type}>
                            {typeLabels[type]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        value={row.category}
                        onChange={(event) =>
                          updateRow(row.localId, "category", event.target.value)
                        }
                        className="h-10 w-36 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                        placeholder="Project"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        value={row.description}
                        onChange={(event) =>
                          updateRow(row.localId, "description", event.target.value)
                        }
                        className="h-10 w-52 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                        placeholder="Invoice, ad spend..."
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        value={row.client ?? ""}
                        onChange={(event) => updateRow(row.localId, "client", event.target.value)}
                        className="h-10 w-40 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                        placeholder="Client"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.amount || ""}
                        onChange={(event) =>
                          updateRow(row.localId, "amount", Number(event.target.value))
                        }
                        className="h-10 w-32 rounded-md border border-white/12 bg-deep-black/70 px-3 text-right text-white-text outline-none focus:border-yellow-accent"
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        value={row.paymentMethod ?? ""}
                        onChange={(event) =>
                          updateRow(row.localId, "paymentMethod", event.target.value)
                        }
                        className="h-10 w-36 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                        placeholder="Cash, bank..."
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <select
                        value={row.status}
                        onChange={(event) =>
                          updateRow(
                            row.localId,
                            "status",
                            event.target.value as FinanceEntryStatus
                          )
                        }
                        className="h-10 w-32 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 align-top">
                      <input
                        value={row.notes ?? ""}
                        onChange={(event) => updateRow(row.localId, "notes", event.target.value)}
                        className="h-10 w-52 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none focus:border-yellow-accent"
                        placeholder="Notes"
                      />
                    </td>
                    <td className="px-3 py-3 align-top">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveRow(row)}
                          disabled={!dirty || busy}
                          title="Save row"
                          aria-label="Save row"
                          className="grid size-10 place-items-center rounded-md border border-yellow-accent/35 bg-yellow-accent/12 text-yellow-accent transition hover:bg-yellow-accent hover:text-deep-black disabled:pointer-events-none disabled:opacity-45"
                        >
                          {savingId === row.localId ? (
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                          ) : (
                            <Save size={16} aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(row)}
                          disabled={busy}
                          title="Delete row"
                          aria-label="Delete row"
                          className="grid size-10 place-items-center rounded-md border border-white/12 bg-white/5 text-white/70 transition hover:border-red-300/50 hover:bg-red-400/10 hover:text-red-200 disabled:pointer-events-none disabled:opacity-45"
                        >
                          {deletingId === row.localId ? (
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                          ) : (
                            <Trash2 size={16} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center">
                  <Table2 className="mx-auto text-yellow-accent" size={28} aria-hidden="true" />
                  <p className="mt-4 text-lg font-semibold text-white-text">No finance rows</p>
                  <p className="mt-2 text-sm text-white/52">
                    Add a row to start tracking income and expenses.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
