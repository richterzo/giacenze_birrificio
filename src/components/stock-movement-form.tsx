"use client";

import { useState } from "react";

type MovementTypeOption = "IN" | "OUT" | "ADJUST";

type ProductOption = {
  id: string;
  name: string;
  quantity: number;
};

type Props = {
  products: ProductOption[];
  onSubmitted?: () => void;
};

export function StockMovementForm({ products, onSubmitted }: Props) {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<MovementTypeOption>("IN");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/stock-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId || undefined,
          barcode,
          quantity,
          type,
          note: note || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Errore nella registrazione del movimento");
      } else {
        setMessage("Movimento registrato correttamente");
        setNote("");
        setBarcode("");
        setQuantity(1);
        if (onSubmitted) {
          onSubmitted();
        }
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
        Nuovo movimento
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700">
          Prodotto
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            <option value="">Seleziona un prodotto</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.quantity})
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Barcode
          <input
            type="text"
            required
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Quantità
          <input
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          />
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Tipo
          <select
            value={type}
            onChange={(e) => setType(e.target.value as MovementTypeOption)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
          >
            {["IN", "OUT", "ADJUST"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-zinc-700">
          Note (opzionale)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
            rows={3}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          {loading ? "Salvataggio..." : "Registra movimento"}
        </button>
      </form>
    </div>
  );
}

