"use client";

import { Send } from "lucide-react";
import { FormEvent, useState } from "react";
import { serviceOptions, services } from "@/lib/data";
import { submitContact } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type FormState = {
  name: string;
  email: string;
  company: string;
  service: (typeof serviceOptions)[number];
  budget: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  service: serviceOptions[0],
  budget: "",
  message: ""
};

function normalizeBudget(value: string) {
  const budget = value.trim();

  if (!budget) {
    return undefined;
  }

  return budget.startsWith("$") ? budget : `$${budget}`;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const selectedService = services.find((service) => service.title === form.service);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await submitContact({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        service: form.service,
        budget: normalizeBudget(form.budget),
        message: form.message
      });
      setStatus("success");
      setMessage("Your inquiry is in. We will reply with next steps shortly.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="min-w-0 rounded-lg border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-white/72">
          Name
          <input
            required
            minLength={2}
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
            placeholder="Your name"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-white/72">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
            placeholder="you@company.com"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-white/72">
          Company
          <input
            value={form.company}
            onChange={(event) => setForm({ ...form, company: event.target.value })}
            className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
            placeholder="Company name"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-white/72">
          Service
          <select
            value={form.service}
            onChange={(event) =>
              setForm({
                ...form,
                service: event.target.value as (typeof serviceOptions)[number]
              })
            }
            className="h-12 rounded-md border border-white/12 bg-deep-black/70 px-4 text-white-text outline-none transition focus:border-yellow-accent"
          >
            {serviceOptions.map((service) => (
              <option key={service}>{service}</option>
            ))}
          </select>
          {selectedService ? (
            <span className="text-xs leading-5 text-white/52">
              Starts at {selectedService.pricing.startingAt}; typical range {selectedService.pricing.range}.
            </span>
          ) : null}
        </label>
        <label className="grid gap-2 text-sm font-medium text-white/72 md:col-span-2">
          Your Budget (USD)
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/46">
              $
            </span>
            <input
              value={form.budget}
              onChange={(event) => setForm({ ...form, budget: event.target.value })}
              inputMode="decimal"
              className="h-12 w-full rounded-md border border-white/12 bg-deep-black/70 px-4 pl-8 text-white-text outline-none transition focus:border-yellow-accent"
              placeholder="500, 1,500, or 2,000 - 5,000"
            />
          </div>
          <span className="text-xs leading-5 text-white/52">
            Add your own budget or price range in dollars. We will match the scope to it.
          </span>
        </label>
        <div className="border-y border-white/10 py-4 md:col-span-2">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-sm font-semibold text-white-text">USD price guide</p>
            <p className="text-xs text-white/48">Starting prices before final scope.</p>
          </div>
          <div className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {services.map((service, index) => (
              <div
                key={service.title}
                className={cn(
                  "flex items-start justify-between gap-4 border-b border-white/10 pb-3",
                  index === services.length - 1 && "border-b-0",
                  index >= services.length - 2 && "sm:border-b-0"
                )}
              >
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-white/76">{service.title}</p>
                  <p className="mt-1 text-xs text-white/42">{service.pricing.range}</p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-yellow-accent">
                  {service.pricing.startingAt}
                </p>
              </div>
            ))}
          </div>
        </div>
        <label className="grid gap-2 text-sm font-medium text-white/72 md:col-span-2">
          Message
          <textarea
            required
            minLength={20}
            rows={6}
            value={form.message}
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            className="rounded-md border border-white/12 bg-deep-black/70 px-4 py-3 text-white-text outline-none transition focus:border-yellow-accent"
            placeholder="Tell us what you want to build, improve, automate, or design."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Send Inquiry"}
          <Send size={16} aria-hidden="true" />
        </Button>
        <p
          aria-live="polite"
          className={
            status === "error"
              ? "text-sm text-red-300"
              : "text-sm text-white/58"
          }
        >
          {message}
        </p>
      </div>
    </form>
  );
}
