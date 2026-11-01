"use client";

import { useId, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { CURRENCY } from "@/content/pricing";
import { Link } from "@/i18n/navigation";
import { routes } from "@/i18n/routes";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const field =
  "w-full border border-border-strong bg-surface-raised px-4 py-3.5 text-body text-foreground " +
  "placeholder:text-muted transition-colors duration-[var(--duration-fast)] " +
  "focus:border-accent focus:outline-none";

const labelClass = "mb-2 block text-caption text-foreground";
const sectionClass = "font-display text-title-3 text-foreground";

export type CheckoutGroup = "product" | "service";

export interface CheckoutOffer {
  id: string;
  group: CheckoutGroup;
  name: string;
  summary: string;
  /** Starting price in whole pounds. The total is the sum of the ticked rows. */
  amount: number;
}

interface CheckoutFormProps {
  locale: Locale;
  offers: readonly CheckoutOffer[];
  initialIds: readonly string[];
  email: string;
}

type FieldError = "name" | "email" | "phone" | "items" | "terms" | "refunds";

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function formatMoney(locale: Locale, amount: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: 0,
    numberingSystem: "latn",
  }).format(amount);
}

/**
 * The order form.
 *
 * Several rows can be ticked at once: the two products and the six services
 * from the pricing page. The total is the sum of their starting prices. Nothing
 * is sent and nothing is charged — a valid submit only says payment is not open.
 */
export function CheckoutForm({ locale, offers, initialIds, email }: CheckoutFormProps) {
  const t = useTranslations("checkout");
  const id = useId();
  const [selectedIds, setSelectedIds] = useState<string[]>(() => [...initialIds]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedRefunds, setAcceptedRefunds] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldError, string>>>({});
  const [unavailable, setUnavailable] = useState(false);

  const selected = offers.filter((offer) => selectedIds.includes(offer.id));
  const total = selected.reduce((sum, offer) => sum + offer.amount, 0);

  function errorId(name: FieldError) {
    return `${id}-${name}-error`;
  }

  function toggle(offerId: string) {
    setSelectedIds((current) =>
      current.includes(offerId)
        ? current.filter((item) => item !== offerId)
        : [...current, offerId],
    );
    setErrors((existing) => {
      if (!existing.items) return existing;
      const next = { ...existing };
      delete next.items;
      return next;
    });
    setUnavailable(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const emailValue = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();

    const next: Partial<Record<FieldError, string>> = {};
    if (selectedIds.length === 0) next.items = t("errors.items");
    if (name.length < 2) next.name = t("errors.name");
    if (!isEmail(emailValue)) next.email = t("errors.email");
    if (!isPhone(phone)) next.phone = t("errors.phone");
    if (!acceptedTerms) next.terms = t("errors.terms");
    if (!acceptedRefunds) next.refunds = t("errors.refunds");

    setErrors(next);
    setUnavailable(Object.keys(next).length === 0);
  }

  function group(kind: CheckoutGroup) {
    return offers.filter((offer) => offer.group === kind);
  }

  return (
    <form noValidate aria-label={t("title")} onSubmit={onSubmit} className="flex flex-col gap-12">
      {(["product", "service"] as const).map((kind) =>
        group(kind).length === 0 ? null : (
          <fieldset key={kind}>
            <legend className={sectionClass}>
              {kind === "product" ? t("productLabel") : t("servicesLabel")}
            </legend>
            <div className="mt-4 flex flex-col">
              {group(kind).map((offer) => {
                const checked = selectedIds.includes(offer.id);
                return (
                  <label
                    key={offer.id}
                    className="flex cursor-pointer items-start justify-between gap-6 border-b border-hairline py-4"
                  >
                    <span className="flex min-w-0 items-start gap-3">
                      <input
                        type="checkbox"
                        name="item"
                        value={offer.id}
                        checked={checked}
                        onChange={() => toggle(offer.id)}
                        className="mt-1.5 size-4 shrink-0 accent-accent"
                      />
                      <span className="min-w-0">
                        <span className="block font-display text-title-3">{offer.name}</span>
                        <span className="mt-1 block text-caption text-muted">{offer.summary}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-body">{formatMoney(locale, offer.amount)}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ),
      )}
      {errors.items ? (
        <p id={errorId("items")} className="text-caption text-alert">
          {errors.items}
        </p>
      ) : null}

      <div className="flex flex-col gap-10 border border-border-strong bg-surface p-6 md:p-8">
        <fieldset className="flex flex-col gap-6">
          <legend className={sectionClass}>{t("customerLabel")}</legend>

          <div>
            <label htmlFor={`${id}-name`} className={labelClass}>
              {t("name")}
            </label>
            <input
              id={`${id}-name`}
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder={t("namePlaceholder")}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? errorId("name") : undefined}
              onChange={() => setUnavailable(false)}
              className={cn(field, errors.name && "border-alert")}
            />
            {errors.name ? (
              <p id={errorId("name")} className="mt-2 text-caption text-alert">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor={`${id}-email`} className={labelClass}>
                {t("email")}
              </label>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                required
                dir="ltr"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? errorId("email") : undefined}
                onChange={() => setUnavailable(false)}
                className={cn(field, "text-start", errors.email && "border-alert")}
              />
              {errors.email ? (
                <p id={errorId("email")} className="mt-2 text-caption text-alert">
                  {errors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${id}-phone`} className={labelClass}>
                {t("phone")}
              </label>
              <input
                id={`${id}-phone`}
                name="phone"
                type="tel"
                required
                dir="ltr"
                autoComplete="tel"
                placeholder={t("phonePlaceholder")}
                inputMode="tel"
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? errorId("phone") : undefined}
                onChange={() => setUnavailable(false)}
                className={cn(field, "text-start", errors.phone && "border-alert")}
              />
              {errors.phone ? (
                <p id={errorId("phone")} className="mt-2 text-caption text-alert">
                  {errors.phone}
                </p>
              ) : null}
            </div>
          </div>
        </fieldset>

        <div>
          <p className={sectionClass}>{t("summaryLabel")}</p>
          <div className="mt-4 border border-border-strong bg-surface-raised px-5">
            {selected.length === 0 ? (
              <p className="border-b border-hairline py-4 text-body text-muted">
                {t("emptySummary")}
              </p>
            ) : (
              selected.map((offer) => (
                <div
                  key={offer.id}
                  className="flex items-baseline justify-between gap-6 border-b border-hairline py-4"
                >
                  <p className="font-display text-title-3">{offer.name}</p>
                  <p className="shrink-0 text-body">{formatMoney(locale, offer.amount)}</p>
                </div>
              ))
            )}
            <div className="flex items-baseline justify-between gap-6 py-5">
              <p className="font-display text-title-3">{t("totalLabel")}</p>
              <p className="font-display text-title-3 text-accent-text">
                {selected.length === 0 ? "—" : formatMoney(locale, total)}
              </p>
            </div>
            <p className="max-w-[52ch] pb-5 text-caption text-muted">{t("priceNote")}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-3 text-body">
          <input
            type="checkbox"
            name="terms"
            checked={acceptedTerms}
            onChange={(event) => {
              const checked = event.target.checked;
              setAcceptedTerms(checked);
              setUnavailable(false);
              if (checked) {
                setErrors((current) => {
                  if (!current.terms) return current;
                  const next = { ...current };
                  delete next.terms;
                  return next;
                });
              }
            }}
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? errorId("terms") : undefined}
            className="mt-1 size-4 accent-accent"
          />
          <span>
            {t("termsLead")}{" "}
            <Link
              href={routes.privacy}
              className="underline underline-offset-4 hover:text-accent-text"
            >
              {t("termsLink")}
            </Link>
          </span>
        </label>
        {errors.terms ? (
          <p id={errorId("terms")} className="text-caption text-alert">
            {errors.terms}
          </p>
        ) : null}

        <label className="flex items-start gap-3 text-body">
          <input
            type="checkbox"
            name="refunds"
            checked={acceptedRefunds}
            onChange={(event) => {
              const checked = event.target.checked;
              setAcceptedRefunds(checked);
              setUnavailable(false);
              if (checked) {
                setErrors((current) => {
                  if (!current.refunds) return current;
                  const next = { ...current };
                  delete next.refunds;
                  return next;
                });
              }
            }}
            aria-invalid={errors.refunds ? true : undefined}
            aria-describedby={errors.refunds ? errorId("refunds") : undefined}
            className="mt-1 size-4 accent-accent"
          />
          <span>
            {t("refundsLead")}{" "}
            <Link
              href={routes.refunds}
              className="underline underline-offset-4 hover:text-accent-text"
            >
              {t("refundsLink")}
            </Link>
          </span>
        </label>
        {errors.refunds ? (
          <p id={errorId("refunds")} className="text-caption text-alert">
            {errors.refunds}
          </p>
        ) : null}

        <div className="mt-4">
          <button
            type="submit"
            className={cn(
              "group inline-flex items-center justify-center gap-2 rounded-full",
              "bg-accent-fill px-7 py-3 font-sans text-body font-medium text-white",
              "transition duration-[var(--duration-fast)] ease-out-expo hover:-translate-y-0.5",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            )}
          >
            {t("pay")}
          </button>
        </div>

        {unavailable ? (
          <div role="status" className="border border-accent/40 bg-accent-wash p-8">
            <p className="font-display text-title-3">{t("unavailableHeadline")}</p>
            <p className="mt-4 max-w-[48ch] text-body text-muted">{t("unavailable")}</p>
            <p className="mt-4 text-body text-muted">
              {t("unavailableContact")}{" "}
              <a
                href={`mailto:${email}`}
                dir="ltr"
                className="text-accent-text underline underline-offset-4"
              >
                {email}
              </a>
            </p>
          </div>
        ) : null}
      </div>
    </form>
  );
}
