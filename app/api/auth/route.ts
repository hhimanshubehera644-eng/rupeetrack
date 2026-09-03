import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { clearSession, hashPassword, requireUser, setSession, verifyPassword } from "@/lib/auth";

const credentials = z.object({ email: z.string().email(), password: z.string().min(8), name: z.string().trim().min(1).max(80).optional() });

export async function GET() {
  const user = await requireUser().catch(() => null);
  return NextResponse.json(user ? { id: user.id, name: user.name, email: user.email } : null);
}

export async function POST(request: Request) {
  const body = credentials.parse(await request.json());
  const email = body.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (body.name) {
    if (existing) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    const user = await db.user.create({ data: { email, name: body.name, passwordHash: hashPassword(body.password) } });
    await setSession(user.id);
    return NextResponse.json({ name: user.name, email: user.email }, { status: 201 });
  }
  if (!existing?.passwordHash || !verifyPassword(body.password, existing.passwordHash)) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  await setSession(existing.id);
  return NextResponse.json({ name: existing.name, email: existing.email });
}

export async function DELETE() {
  await clearSession();
  return new NextResponse(null, { status: 204 });
}
