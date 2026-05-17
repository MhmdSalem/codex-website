"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const t = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={t.name} required>
          <input
            type="text"
            name="name"
            required
            placeholder={t.namePlaceholder}
            className={inputClasses}
          />
        </Field>
        <Field label={t.email} required>
          <input
            type="email"
            name="email"
            required
            placeholder={t.emailPlaceholder}
            className={inputClasses}
            dir="ltr"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label={t.phone}>
          <input
            type="tel"
            name="phone"
            placeholder={t.phonePlaceholder}
            className={inputClasses}
            dir="ltr"
          />
        </Field>
        <Field label={t.company}>
          <input
            type="text"
            name="company"
            placeholder={t.companyPlaceholder}
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label={t.service}>
        <select name="service" className={cn(inputClasses, "appearance-none")}>
          <option value="registration">{t.serviceOptions.registration}</option>
          <option value="workshops">{t.serviceOptions.workshops}</option>
          <option value="forms">{t.serviceOptions.forms}</option>
          <option value="marketing">{t.serviceOptions.marketing}</option>
          <option value="other">{t.serviceOptions.other}</option>
        </select>
      </Field>

      <Field label={t.message} required>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t.messagePlaceholder}
          className={cn(inputClasses, "resize-y min-h-[120px] py-3")}
        />
      </Field>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        <Button type="submit" size="lg" disabled={status === "submitting"}>
          {status === "submitting" ? t.submitting : t.submit}
          <Send className="w-4 h-4" aria-hidden="true" />
        </Button>

        {status === "success" && (
          <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            {t.success}
          </div>
        )}
        {status === "error" && (
          <div className="inline-flex items-center gap-2 text-sm text-red-400">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            {t.error}
          </div>
        )}
      </div>
    </form>
  );
}

const inputClasses =
  "w-full h-11 px-4 rounded-xl bg-background-elevated/80 border border-border text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/20 transition-all";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground-muted uppercase tracking-wider">
        {label}
        {required && <span className="text-gold ms-1">*</span>}
      </span>
      {children}
    </label>
  );
}
