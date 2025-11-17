import { MovementType } from "@prisma/client";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stockMovementSchema } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const movements = await prisma.stockMovement.findMany({
    include: {
      product: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  return NextResponse.json(movements);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = stockMovementSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { barcode, productId, quantity, note, type } = parsed.data;

  const product =
    productId !== undefined
      ? await prisma.product.findUnique({ where: { id: productId } })
      : await prisma.product.findUnique({ where: { barcode } });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 },
    );
  }

  const delta =
    type === MovementType.IN
      ? quantity
      : type === MovementType.OUT
        ? -quantity
        : 0;

  if (type === MovementType.OUT && product.quantity < quantity) {
    return NextResponse.json(
      { error: "Insufficient stock for this movement" },
      { status: 400 },
    );
  }

  const [movement, updatedProduct] = await prisma.$transaction([
    prisma.stockMovement.create({
      data: {
        barcode,
        quantity,
        note,
        type,
        productId: product.id,
        createdById: session.user.id,
      },
    }),
    prisma.product.update({
      where: { id: product.id },
      data:
        type === MovementType.ADJUST
          ? { quantity }
          : { quantity: product.quantity + delta },
    }),
  ]);

  return NextResponse.json({ movement, product: updatedProduct }, { status: 201 });
}

