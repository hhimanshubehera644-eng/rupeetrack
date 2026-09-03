"use server";

import { db } from "@/lib/db";
import { PaymentMode, TransactionType } from "@prisma/client";
import { z } from "zod";

const transactionSchema = z.object({
  userId: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  category: z.string().trim().min(1).max(80),
  paymentMode: z.nativeEnum(PaymentMode).optional(),
  transactionDate: z.coerce.date(),
  notes: z.string().trim().max(500).optional(),
  isRecurring: z.boolean().optional().default(false),
});

export type TransactionInput = z.input<typeof transactionSchema>;

export async function addTransaction(input: TransactionInput) {
  const parsed = transactionSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.flatten().fieldErrors };
  const data = parsed.data;
  const transaction = await db.transaction.create({
    data: { ...data, amount: data.amount.toFixed(2) },
  });
  return { success: true as const, transaction };
}

export async function getTransactions(userId: string, from?: Date, to?: Date) {
  const id = z.string().min(1).parse(userId);
  return db.transaction.findMany({
    where: { userId: id, transactionDate: { gte: from, lte: to } },
    orderBy: { transactionDate: "desc" },
  });
}
