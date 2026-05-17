"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Loader2, LogIn } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export function LoginForm({ from }: { from?: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="from" value={from ?? "/admin"} />
      <div>
        <label htmlFor="email" className="admin-label">
          البريد الإلكتروني
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          className="admin-input"
          placeholder="admin@codex.local"
        />
      </div>
      <div>
        <label htmlFor="password" className="admin-label">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          className="admin-input"
          placeholder="••••••••"
        />
      </div>
      {state.error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {state.error}
        </p>
      )}
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn-primary w-full">
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogIn className="w-4 h-4" />
      )}
      <span>{pending ? "جارٍ التحقق..." : "دخول"}</span>
    </button>
  );
}
