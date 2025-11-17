"use client";

import { useState } from "react";

type ProductResponse = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
};

export function BarcodeScannerForm() {
  const [barcode, setBarcode] = useState("");
  const [result, setResult] = useState<ProductResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleScan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const response = await fetch("/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Errore nella scansione");
      } else {
        setResult(data);
      }
    } catch {
      setError("Errore di rete, riprova");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Scansione codice a barre
      </h2>
      <form onSubmit={handleScan} className="space-y-3">
        <input
          type="text"
          required
          placeholder="EAN o codice interno"
          value={barcode}
          onChange={(event) => setBarcode(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {loading ? "Ricerca in corso..." : "Scansiona"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {result && (
        <div className="mt-4 rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
          <p className="font-semibold">{result.name}</p>
          <p>SKU: {result.sku}</p>
          <p>Barcode: {result.barcode}</p>
          <p>Disponibilità: {result.quantity}</p>
        </div>
      )}
    </div>
  );
}

