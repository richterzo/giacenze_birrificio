import { Metadata } from "next";
import { redirect } from "next/navigation";

import { BarcodeScannerForm } from "@/components/barcode-scanner-form";
import { LogoutButton } from "@/components/logout-button";
import { ProductForm } from "@/components/product-form";
import { ProductTable } from "@/components/product-table";
import { StockMovementForm } from "@/components/stock-movement-form";
import { StockMovementList } from "@/components/stock-movement-list";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Dashboard | App Giacenze",
};

export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const [products, movements] = await Promise.all([
    prisma.product.findMany({ orderBy: { name: "asc" } }),
    prisma.stockMovement.findMany({
      include: {
        product: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const productPayload = products.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    barcode: product.barcode,
    quantity: product.quantity,
  }));

  const movementPayload = movements.map((movement) => ({
    id: movement.id,
    type: movement.type,
    quantity: movement.quantity,
    note: movement.note,
    createdAt: movement.createdAt.toISOString(),
    product: {
      id: movement.product.id,
      name: movement.product.name,
    },
    createdBy: movement.createdBy
      ? {
          id: movement.createdBy.id,
          name: movement.createdBy.name,
          email: movement.createdBy.email,
        }
      : null,
  }));

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Dashboard
            </p>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Benvenuto, {session.user.name ?? session.user.email}
            </h1>
          </div>
          <LogoutButton />
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <BarcodeScannerForm />
            <ProductForm />
          </div>
          <div className="space-y-6 lg:col-span-2">
            <StockMovementForm products={productPayload} />
            <ProductTable products={productPayload} />
            <StockMovementList movements={movementPayload} />
          </div>
        </section>
      </div>
    </main>
  );
}
