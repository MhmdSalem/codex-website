"use client";

import { useActionState, useId } from "react";
import { useTranslations } from "next-intl";

import { submitEnquiry } from "@/app/[locale]/contact/actions";
import { initialEnquiryState } from "@/app/[locale]/contact/enquiry";
import { Arrow } from "@/components/ui/Arrow";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const TOPICS = ["product", "existing", "ai", "other"] as const;

const field =
  "w-full border-b border-border bg-transparent py-3 text-body text-foreground " +
  "placeholder:text-disabled transition-colors duration-[var(--duration-fast)] " +
  "focus:border-accent focus:outline-none";

const label = "mb-1 block font-mono text-micro tracking-wider text-subtle uppercase";

/**
 * The enquiry form.
 *
 * Underlined fields rather than boxes: on a black canvas a filled input is the
 * brightest object on the page, and five of them would outshine everything the
 * page is trying to say. A rule under the label is enough to say "type here".
 *
 * Progressive by construction — a real `form` posting to a Server Action, so it
 * works before hydration; `useActionState` only adds the pending state and the
 * error messages.
 */
export function ContactForm({ locale, email }: { locale: Locale; email?: string }) {
  const t = useTranslations("contact.form");
  const [state, action, pending] = useActionState(submitEnquiry, initialEnquiryState);
  const id = useId();

  const errorId = (name: string) => `${id}-${name}-error`;

  if (state.status === "sent") {
    return (
      <div
        // `status` rather than `alert`: the form it replaces is gone from the
        // document, so a screen reader needs to be told what happened, but not
        // interrupted mid-sentence to hear it.
        role="status"
        className="border border-accent/40 bg-accent-wash p-8 md:p-10"
      >
        <p className="font-display text-title-3">{t("successHeadline")}</p>
        <p className="mt-4 max-w-[44ch] text-body text-muted">{t("success")}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate aria-label={t("label")} className="flex flex-col gap-8">
      <input type="hidden" name="locale" value={locale} />

      {/* The honeypot. Off-screen rather than `display: none`, which some bots skip. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            {t("name")}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={state.values?.name}
            aria-invalid={state.errors?.name ? true : undefined}
            aria-describedby={state.errors?.name ? errorId("name") : undefined}
            className={cn(field, state.errors?.name && "border-alert")}
          />
          {state.errors?.name ? (
            <p id={errorId("name")} className="mt-2 text-caption text-alert">
              {state.errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${id}-email`} className={label}>
            {t("email")}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={state.values?.email}
            aria-invalid={state.errors?.email ? true : undefined}
            aria-describedby={state.errors?.email ? errorId("email") : undefined}
            className={cn(field, state.errors?.email && "border-alert")}
          />
          {state.errors?.email ? (
            <p id={errorId("email")} className="mt-2 text-caption text-alert">
              {state.errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${id}-company`} className={label}>
            {t("company")} <span className="text-disabled normal-case">({t("optional")})</span>
          </label>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={state.values?.company}
            className={field}
          />
        </div>

        <div>
          <label htmlFor={`${id}-topic`} className={label}>
            {t("topic")}
          </label>
          <select
            id={`${id}-topic`}
            name="topic"
            defaultValue={state.values?.topic || TOPICS[0]}
            // `appearance-none` would take the caret with it, and a custom one
            // on a native select is a chevron that lies about where the list
            // opens. The native control keeps its own affordance.
            className={cn(field, "text-foreground")}
          >
            {TOPICS.map((topic) => (
              <option key={topic} value={topic} className="bg-surface text-foreground">
                {t(`topics.${topic}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-message`} className={label}>
          {t("message")}
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          rows={5}
          required
          placeholder={t("messagePlaceholder")}
          defaultValue={state.values?.message}
          aria-invalid={state.errors?.message ? true : undefined}
          aria-describedby={state.errors?.message ? errorId("message") : undefined}
          className={cn(field, "resize-y", state.errors?.message && "border-alert")}
        />
        {state.errors?.message ? (
          <p id={errorId("message")} className="mt-2 text-caption text-alert">
            {state.errors.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-6">
        {/*
          A plain `button`, not the `Button` primitive: that component renders a
          `type="button"` element, which inside a form is a control that does
          nothing. The classes are the primary variant's.
        */}
        <button
          type="submit"
          disabled={pending}
          className={cn(
            "group inline-flex items-center justify-center gap-2 rounded-full",
            "bg-accent-fill px-7 py-3 font-sans text-body font-medium text-white",
            "transition duration-[var(--duration-fast)] ease-out-expo hover:-translate-y-0.5",
            "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
            "disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          {pending ? t("sending") : t("submit")}
          <Arrow />
        </button>

        {/*
          Always in the tree so the live region is announced when it fills, and
          the fallback address rides along with the failure — telling someone the
          send failed without giving them the alternative is a dead end.
        */}
        <p aria-live="polite" className="max-w-[46ch] text-caption text-alert">
          {state.status === "error" && state.message ? (
            <>
              {state.message}
              {email ? (
                <>
                  {" "}
                  <a href={`mailto:${email}`} dir="ltr" className="underline hover:no-underline">
                    {email}
                  </a>
                </>
              ) : null}
            </>
          ) : null}
        </p>
      </div>
    </form>
  );
}
