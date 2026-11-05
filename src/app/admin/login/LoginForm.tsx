"use client";

import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { login } from "./actions";

const inputClass =
  "mt-1.5 w-full border border-border bg-bg px-3 py-2.5 text-sm outline-none focus:border-accent";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const expired = useSearchParams().get("error") === "session";

  return (
    <form action={action} className="space-y-4">
      {expired && !state?.error && (
        <p className="border border-border px-3 py-2.5 text-sm text-muted">
          Your session ended. Please sign in again.
        </p>
      )}
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
      </label>
      <label className="block text-sm font-medium">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state?.error && <p className="text-sm text-error">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full bg-accent px-4 py-2.5 text-sm font-medium text-on-accent hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
