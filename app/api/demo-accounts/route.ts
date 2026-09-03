import { NextResponse } from "next/server";

type Account = { id: number; name: string; bankName: string; lastFour: string };
const state = globalThis as typeof globalThis & { rupeeTrackDemoAccounts?: Account[] };
function accounts() {
  state.rupeeTrackDemoAccounts ??= [{ id: 0, name: "Cash wallet", bankName: "Cash", lastFour: "" }];
  return state.rupeeTrackDemoAccounts;
}
export async function GET() { return NextResponse.json(accounts()); }
export async function POST(request: Request) {
  const body = await request.json() as Partial<Account>;
  if (typeof body.name !== "string" || !body.name.trim() || typeof body.bankName !== "string" || !body.bankName.trim()) return NextResponse.json({ error: "Name and bank are required" }, { status: 400 });
  const account = { id: Date.now(), name: body.name.trim(), bankName: body.bankName.trim(), lastFour: typeof body.lastFour === "string" ? body.lastFour.replace(/\D/g, "").slice(-4) : "" };
  accounts().push(account);
  return NextResponse.json(account, { status: 201 });
}
export async function DELETE(request: Request) {
  const body = await request.json() as { id?: number };
  if (body.id === 0) return NextResponse.json({ error: "Cash wallet cannot be deleted" }, { status: 400 });
  const index = accounts().findIndex((account) => account.id === body.id);
  if (index < 0) return NextResponse.json({ error: "Account not found" }, { status: 404 });
  accounts().splice(index, 1);
  return new NextResponse(null, { status: 204 });
}
