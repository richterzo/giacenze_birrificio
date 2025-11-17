import { MovementType } from "@prisma/client";
import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(100),
});

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  barcode: z.string().min(4),
  quantity: z.number().int().default(0),
  description: z.string().optional(),
});

export const barcodeScanSchema = z.object({
  barcode: z.string().min(4),
});

export const stockMovementSchema = z.object({
  productId: z.string().cuid().optional(),
  barcode: z.string().min(4),
  quantity: z.number().int().positive(),
  type: z.nativeEnum(MovementType),
  note: z.string().optional(),
});

