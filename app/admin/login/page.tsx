import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { from?: string };
}) {
  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <Image
              src="/codex-icon.png"
              alt="Codex"
              width={64}
              height={64}
              priority
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-admin-text">لوحة تحكم Codex</h1>
          <p className="text-admin-muted mt-2 text-sm">
            سجّل دخولك للوصول لإدارة المحتوى
          </p>
        </div>
        <div className="admin-card p-6 sm:p-8">
          <LoginForm from={searchParams.from} />
        </div>
        <p className="text-center text-admin-subtle text-xs mt-6">
          محمي ولا يُسمح بالوصول إلا للمستخدمين المُسجّلين.
        </p>
      </div>
    </main>
  );
}
