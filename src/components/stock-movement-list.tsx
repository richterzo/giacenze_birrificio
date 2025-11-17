"use client";

type StockMovementWithRelations = {
  id: string;
  type: "IN" | "OUT" | "ADJUST";
  quantity: number;
  note: string | null;
  createdAt: string | Date;
  product: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

type Props = {
  movements: StockMovementWithRelations[];
};

export function StockMovementList({ movements }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Ultimi movimenti
      </h2>
      <div className="space-y-3 text-sm">
        {movements.length === 0 && (
          <p className="text-zinc-500">Ancora nessun movimento registrato.</p>
        )}
        {movements.map((movement) => (
          <div
            key={movement.id}
            className="rounded-md border border-zinc-200 p-3 text-zinc-800"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-wide text-zinc-500">
              <span>{movement.type}</span>
              <span>
                {new Date(movement.createdAt).toLocaleString("it-IT", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="mt-2 font-semibold">
              {movement.product.name} &middot; Quantità: {movement.quantity}
            </p>
            <p className="text-xs text-zinc-500">
              Registrato da:{" "}
              {movement.createdBy?.name ?? movement.createdBy?.email ?? "N/D"}
            </p>
            {movement.note && (
              <p className="mt-1 text-sm text-zinc-600">
                Nota: {movement.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

