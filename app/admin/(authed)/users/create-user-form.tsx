"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { createUserAction, type UserActionState } from "./actions";

const initial: UserActionState = {};

export function CreateUserForm() {
  const [state, action] = useFormState(createUserAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={action} className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="admin-label">الاسم</label>
        <input name="name" required className="admin-input" placeholder="مثلاً: محمد أحمد" />
      </div>
      <div>
        <label className="admin-label">البريد الإلكتروني</label>
        <input
          name="email"
          type="email"
          dir="ltr"
          required
          className="admin-input"
          placeholder="user@example.com"
        />
      </div>
      <div>
        <label className="admin-label">كلمة المرور (8 حروف على الأقل)</label>
        <input
          name="password"
          type="password"
          dir="ltr"
          required
          minLength={8}
          className="admin-input"
        />
      </div>
      <div>
        <label className="admin-label">الدور</label>
        <select name="role" defaultValue="admin" className="admin-input">
          <option value="admin">مدير</option>
          <option value="super_admin">مدير عام</option>
        </select>
      </div>
      <div className="sm:col-span-2 flex items-center justify-between gap-3 flex-wrap">
        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm text-green-400">{state.success}</p>
        )}
        <div className="flex-1" />
        <SubmitBtn />
      </div>
    </form>
  );
}

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="admin-btn-primary">
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
      {pending ? "جارٍ الإضافة..." : "إضافة"}
    </button>
  );
}
