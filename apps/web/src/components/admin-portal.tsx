"use client";

import {
  Archive,
  Building2,
  Calculator,
  CheckCheck,
  Clock3,
  DollarSign,
  Inbox,
  Loader2,
  LogIn,
  LogOut,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserRound
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  type AdminUser,
  type ContactMessage,
  type ContactStatus,
  deleteContactMessage,
  fetchCurrentAdmin,
  listContactMessages,
  loginAdmin,
  updateContactMessageStatus
} from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { AdminFinanceSheet } from "./admin-finance-sheet";
import { Button } from "./ui/button";

const TOKEN_KEY = "duron_admin_token";
const statusOptions: ContactStatus[] = ["new", "read", "archived"];

const statusLabels: Record<ContactStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived"
};

const statusStyles: Record<ContactStatus, string> = {
  new: "border-yellow-accent/55 bg-yellow-accent/12 text-yellow-accent",
  read: "border-electric-blue/50 bg-electric-blue/12 text-sky-200",
  archived: "border-white/15 bg-white/[0.08] text-white/58"
};

function messageId(message: ContactMessage) {
  return message.id ?? message._id ?? "";
}

function formatDateTime(input: string) {
  const date = new Date(input);
  const time = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);

  return `${formatDate(date)} at ${time}`;
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function createReplyLink(message: ContactMessage) {
  const subject = encodeURIComponent(`Re: ${message.service} inquiry`);
  const body = encodeURIComponent(
    `Hi ${message.name},\n\nThanks for reaching out to DURON. I reviewed your inquiry and wanted to follow up.\n\n`
  );

  return `mailto:${message.email}?subject=${subject}&body=${body}`;
}

export function AdminPortal() {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<"inquiries" | "finances">("inquiries");

  const counts = useMemo(() => {
    return messages.reduce(
      (acc, message) => {
        acc.total += 1;
        acc[message.status] += 1;
        return acc;
      },
      { total: 0, new: 0, read: 0, archived: 0 }
    );
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesStatus = statusFilter === "all" || message.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [
        message.name,
        message.email,
        message.company,
        message.service,
        message.budget,
        message.message
      ]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
    });
  }, [messages, query, statusFilter]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(TOKEN_KEY);

    if (savedToken) {
      setToken(savedToken);
      return;
    }

    setBooting(false);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    const activeToken = token;

    async function loadSession() {
      setLoading(true);
      setError("");

      try {
        const [user, contactMessages] = await Promise.all([
          fetchCurrentAdmin(activeToken),
          listContactMessages(activeToken)
        ]);

        if (!cancelled) {
          setAdmin(user);
          setMessages(contactMessages);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(normalizeError(loadError));
          handleLogout(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setBooting(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoggingIn(true);
    setNotice("");
    setError("");

    try {
      const response = await loginAdmin(loginForm);
      window.localStorage.setItem(TOKEN_KEY, response.token);
      setAdmin(response.user);
      setToken(response.token);
      setLoginForm((current) => ({ ...current, password: "" }));
      setNotice("Signed in.");
    } catch (loginError) {
      setError(normalizeError(loginError));
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout(showNotice = true) {
    window.localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdmin(null);
    setMessages([]);
    setBooting(false);

    if (showNotice) {
      setNotice("Signed out.");
    }
  }

  async function refreshMessages() {
    if (!token) {
      return;
    }

    setLoading(true);
    setNotice("");
    setError("");

    try {
      setMessages(await listContactMessages(token));
      setNotice("Inquiries refreshed.");
    } catch (refreshError) {
      setError(normalizeError(refreshError));
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(message: ContactMessage, status: ContactStatus) {
    const id = messageId(message);

    if (!token || !id || message.status === status) {
      return;
    }

    setUpdatingId(id);
    setNotice("");
    setError("");

    try {
      const updatedMessage = await updateContactMessageStatus(id, status, token);
      setMessages((current) =>
        current.map((item) =>
          messageId(item) === id ? { ...item, ...updatedMessage, status } : item
        )
      );
    } catch (statusError) {
      setError(normalizeError(statusError));
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeMessage(message: ContactMessage) {
    const id = messageId(message);

    if (!token || !id || !window.confirm(`Delete inquiry from ${message.name}?`)) {
      return;
    }

    setDeletingId(id);
    setNotice("");
    setError("");

    try {
      await deleteContactMessage(id, token);
      setMessages((current) => current.filter((item) => messageId(item) !== id));
      setNotice("Inquiry deleted.");
    } catch (deleteError) {
      setError(normalizeError(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  if (booting) {
    return (
      <main id="main-content" className="pt-24">
        <section className="section-shell min-h-[calc(100vh-5rem)]">
          <div className="mx-auto flex max-w-7xl items-center gap-3 text-white/62">
            <Loader2 className="animate-spin" size={20} aria-hidden="true" />
            Loading admin portal...
          </div>
        </section>
      </main>
    );
  }

  if (!token || !admin) {
    return (
      <main id="main-content" className="pt-24">
        <section className="section-shell min-h-[calc(100vh-5rem)]">
          <div className="mx-auto max-w-lg">
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl md:p-8">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-md border border-yellow-accent/35 bg-yellow-accent/12 text-yellow-accent">
                  <ShieldCheck size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase text-yellow-accent">Admin</p>
                  <h1 className="text-2xl font-semibold text-white-text">Inquiry Portal</h1>
                </div>
              </div>

              <form onSubmit={handleLogin} className="mt-8 grid gap-5">
                <label className="grid gap-2 text-sm font-medium text-white/72">
                  Email
                  <input
                    required
                    type="email"
                    value={loginForm.email}
                    onChange={(event) =>
                      setLoginForm({ ...loginForm, email: event.target.value })
                    }
                    className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
                    placeholder="admin@company.com"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-white/72">
                  Password
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={loginForm.password}
                    onChange={(event) =>
                      setLoginForm({ ...loginForm, password: event.target.value })
                    }
                    className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
                    placeholder="Password"
                  />
                </label>

                <Button type="submit" disabled={loggingIn} className="w-full">
                  {loggingIn ? "Signing in..." : "Sign In"}
                  {loggingIn ? (
                    <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                  ) : (
                    <LogIn size={16} aria-hidden="true" />
                  )}
                </Button>
              </form>

              {error || notice ? (
                <p
                  aria-live="polite"
                  className={cn(
                    "mt-5 text-sm",
                    error ? "text-red-300" : "text-white/58"
                  )}
                >
                  {error || notice}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main id="main-content" className="pt-24">
      <section className="section-shell min-h-[calc(100vh-5rem)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-yellow-accent">Admin Portal</p>
              <h1 className="mt-2 text-3xl font-semibold text-white-text md:text-5xl">
                {activeSection === "inquiries" ? "Inquiries" : "Finances"}
              </h1>
              <p className="mt-3 text-sm leading-6 text-white/58">
                Signed in as {admin.name} ({admin.email})
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeSection === "inquiries" ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={refreshMessages}
                  disabled={loading}
                >
                  Refresh
                  <RefreshCw
                    className={cn(loading && "animate-spin")}
                    size={16}
                    aria-hidden="true"
                  />
                </Button>
              ) : null}
              <Button type="button" variant="ghost" onClick={() => handleLogout()}>
                Sign Out <LogOut size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === "inquiries"}
              onClick={() => setActiveSection("inquiries")}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition",
                activeSection === "inquiries"
                  ? "border-yellow-accent bg-yellow-accent text-deep-black"
                  : "border-white/12 bg-white/5 text-white/65 hover:border-electric-blue/70 hover:text-white-text"
              )}
            >
              <MessageSquareText size={16} aria-hidden="true" />
              Inquiries
              <span className="rounded-sm bg-deep-black/15 px-2 py-0.5 text-xs">
                {counts.total}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSection === "finances"}
              onClick={() => setActiveSection("finances")}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold transition",
                activeSection === "finances"
                  ? "border-yellow-accent bg-yellow-accent text-deep-black"
                  : "border-white/12 bg-white/5 text-white/65 hover:border-electric-blue/70 hover:text-white-text"
              )}
            >
              <Calculator size={16} aria-hidden="true" />
              Finances
            </button>
          </div>

          {activeSection === "inquiries" ? (
            <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total", value: counts.total, icon: Inbox },
              { label: "New", value: counts.new, icon: Clock3 },
              { label: "Read", value: counts.read, icon: CheckCheck },
              { label: "Archived", value: counts.archived, icon: Archive }
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-medium text-white/58">{item.label}</p>
                  <item.icon size={18} className="text-yellow-accent" aria-hidden="true" />
                </div>
                <p className="mt-4 text-3xl font-semibold text-white-text">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-y border-white/10 py-5 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search inquiries</span>
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/38"
                size={18}
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 w-full rounded-md border border-white/12 bg-deep-black/70 px-4 pl-11 text-white-text outline-none transition focus:border-yellow-accent"
                placeholder="Search name, email, service, or message"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-white/62 sm:w-56">
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as ContactStatus | "all")
                }
                className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
              >
                <option value="all">All</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
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

          <div className="mt-6 grid gap-4">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => {
                const id = messageId(message);
                const busy = updatingId === id || deletingId === id;

                return (
                  <article
                    key={id}
                    className={cn(
                      "rounded-lg border bg-white/[0.045] p-5 transition md:p-6",
                      message.status === "new"
                        ? "border-yellow-accent/35"
                        : "border-white/10"
                    )}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="break-words text-xl font-semibold text-white-text">
                            {message.name}
                          </h2>
                          <span
                            className={cn(
                              "rounded-md border px-2.5 py-1 text-xs font-semibold uppercase",
                              statusStyles[message.status]
                            )}
                          >
                            {statusLabels[message.status]}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/48">
                          {formatDateTime(message.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <a
                          href={createReplyLink(message)}
                          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white-text transition hover:border-electric-blue/70 hover:bg-electric-blue/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-accent"
                        >
                          Reply <Mail size={16} aria-hidden="true" />
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeMessage(message)}
                          disabled={busy}
                        >
                          Delete
                          {deletingId === id ? (
                            <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                          ) : (
                            <Trash2 size={16} aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-x-6 gap-y-3 border-y border-white/10 py-4 text-sm text-white/64 md:grid-cols-2 lg:grid-cols-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <Mail size={16} className="shrink-0 text-yellow-accent" aria-hidden="true" />
                        <span className="break-all">{message.email}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-2">
                        <UserRound
                          size={16}
                          className="shrink-0 text-yellow-accent"
                          aria-hidden="true"
                        />
                        <span className="break-words">{message.service}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-2">
                        <Building2
                          size={16}
                          className="shrink-0 text-yellow-accent"
                          aria-hidden="true"
                        />
                        <span className="break-words">{message.company || "No company"}</span>
                      </div>
                      <div className="flex min-w-0 items-center gap-2">
                        <DollarSign
                          size={16}
                          className="shrink-0 text-yellow-accent"
                          aria-hidden="true"
                        />
                        <span className="break-words">{message.budget || "No budget"}</span>
                      </div>
                    </div>

                    <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-white/72">
                      {message.message}
                    </p>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <label className="grid gap-2 text-sm font-medium text-white/62 sm:w-56">
                        Status
                        <select
                          value={message.status}
                          onChange={(event) =>
                            changeStatus(message, event.target.value as ContactStatus)
                          }
                          disabled={busy}
                          className="h-11 rounded-md border border-white/12 bg-deep-black/70 px-3 text-white-text outline-none transition focus:border-yellow-accent disabled:opacity-55"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabels[status]}
                            </option>
                          ))}
                        </select>
                      </label>

                      {updatingId === id ? (
                        <span className="inline-flex items-center gap-2 text-sm text-white/52">
                          <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                          Updating status...
                        </span>
                      ) : null}
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-lg border border-white/10 bg-white/[0.045] p-8 text-center">
                <Inbox className="mx-auto text-yellow-accent" size={28} aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold text-white-text">No inquiries found</h2>
                <p className="mt-2 text-sm text-white/52">
                  New contact form submissions will appear here.
                </p>
              </div>
            )}
          </div>
            </>
          ) : (
            <AdminFinanceSheet token={token} />
          )}
        </div>
      </section>
    </main>
  );
}
