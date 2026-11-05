import type { Metadata } from "next";
import { Suspense } from "react";

import { Logo } from "@/components/Logo";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default function AdminLogin() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="border border-border bg-card p-7">
          <h1 className="text-2xl">Admin sign in</h1>
          <p className="mb-6 mt-1 text-sm text-muted">Only accounts with admin access can continue.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
