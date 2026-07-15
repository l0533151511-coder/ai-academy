"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-xl font-bold">ההתחברות עדיין לא מוגדרת</h1>
        <p className="mt-2 text-sm text-muted">
          חסרים משתני סביבה של Supabase (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY) בקובץ .env.local
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-extrabold">התחברות</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="login-email" className="mb-1 block text-sm font-medium">אימייל</label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="mb-1 block text-sm font-medium">סיסמה</label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2"
          />
        </div>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-primary py-2.5 font-semibold text-primary-foreground disabled:opacity-50"
        >
          {loading ? "מתחבר..." : "התחבר"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-muted">
        אין לך חשבון? <Link href="/auth/signup" className="text-primary">הרשם כאן</Link>
      </p>
    </div>
  );
}
