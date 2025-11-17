"use client";

type ProductRow = {
  id: string;
  name: string;
  sku: string;
  barcode: string;
  quantity: number;
};

type Props = {
  products: ProductRow[];
};

export function ProductTable({ products }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-zinc-900">
        Prodotti a catalogo
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-zinc-700">
          <thead className="text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Barcode</th>
              <th className="px-3 py-2 text-right">Quantità</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-4 text-center text-sm text-zinc-500"
                >
                  Nessun prodotto ancora presente.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="border-t border-zinc-100">
                <td className="px-3 py-2 font-medium">{product.name}</td>
                <td className="px-3 py-2">{product.sku}</td>
                <td className="px-3 py-2">{product.barcode}</td>
                <td className="px-3 py-2 text-right font-semibold">
                  {product.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

