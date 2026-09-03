import { NextResponse } from "next/server";
import { db, demoUser } from "@/lib/db";

export const dynamic = "force-dynamic";

function jsonTransaction(transaction: { id: string; notes: string | null; amount: unknown; type: string; category: string; paymentMode: string | null; isRecurring: boolean; accountId: string | null }) {
  return { id: transaction.id, label: transaction.notes ?? "", amount: Number(transaction.amount), type: transaction.type, category: transaction.category, paymentMode: transaction.paymentMode ?? "UPI", isRecurring: transaction.isRecurring, accountId: transaction.accountId ?? 0 };
}

export async function GET() {
  const user = await demoUser();
  const rows = await db.transaction.findMany({ where: { userId: user.id }, orderBy: { transactionDate: "desc" } });
  return NextResponse.json(rows.map(jsonTransaction), { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await demoUser();
  const row = await db.transaction.create({ data: { userId: user.id, type: body.type, amount: body.amount, category: body.category || "Other", paymentMode: body.paymentMode || "UPI", transactionDate: new Date(), notes: body.label, isRecurring: body.isRecurring === true, accountId: body.accountId ? String(body.accountId) : null } });
  return NextResponse.json(jsonTransaction(row), { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const row = await db.transaction.update({ where: { id: String(body.id) }, data: { type: body.type, amount: body.amount, category: body.category || "Other", paymentMode: body.paymentMode || "UPI", notes: body.label, isRecurring: body.isRecurring === true, accountId: body.accountId ? String(body.accountId) : null } });
  return NextResponse.json(jsonTransaction(row));
}

export async function PATCH(request: Request) {
  const body = await request.json();
  await db.transaction.delete({ where: { id: String(body.id) } });
  return new NextResponse(null, { status: 204 });
}

export async function DELETE() {
  const user = await demoUser();
  await db.transaction.deleteMany({ where: { userId: user.id } });
  return new NextResponse(null, { status: 204 });
}
