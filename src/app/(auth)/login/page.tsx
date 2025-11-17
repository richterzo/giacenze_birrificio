import { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login | App Giacenze",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="flex w-full max-w-5xl flex-col gap-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg md:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-zinc-900">
            App Giacenze
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Gestisci i movimenti di magazzino, registra le entrate e le uscite e
            tieni traccia dei prodotti scansionando i codici a barre.
          </p>
          <p className="mt-4 text-xs text-zinc-500">
            Non hai ancora un account? Il primo utente può essere creato tramite
            API `POST /api/auth/register`.
          </p>
          <Link
            href="https://nextjs.org/docs"
            className="mt-6 inline-flex items-center text-sm font-medium text-zinc-900 hover:underline"
          >
            Leggi la documentazione
          </Link>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

