import { NextResponse } from "next/server";

type Budget = { id: number; category: string; limit: number };
const state = globalThis as typeof globalThis & { rupeeTrackDemoBudgets?: Budget[] };
function budgets() { state.rupeeTrackDemoBudgets ??= []; return state.rupeeTrackDemoBudgets; }
export async function GET() { return NextResponse.json(budgets(), { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  const body = await request.json() as Partial<Budget>;
  if (typeof body.category !== "string" || !body.category.trim() || typeof body.limit !== "number" || !Number.isFinite(body.limit) || body.limit <= 0) return NextResponse.json({ error: "Category and positive limit are required" }, { status: 400 });
  const existing = budgets().find((budget) => budget.category === body.category);
  if (existing) existing.limit = body.limit;
  else budgets().push({ id: Date.now(), category: body.category.trim(), limit: body.limit });
  return NextResponse.json(existing ?? budgets()[budgets().length - 1], { status: 201 });
}
export async function DELETE(request: Request) {
  const body = await request.json() as { id?: number };
  const index = budgets().findIndex((budget) => budget.id === body.id);
  if (index < 0) return NextResponse.json({ error: "Budget not found" }, { status: 404 });
  budgets().splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
