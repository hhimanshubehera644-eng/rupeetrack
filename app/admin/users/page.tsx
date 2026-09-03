import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") redirect("/login");
    redirect("/");
  }

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-900 sm:px-6">
      <section className="mx-auto max-w-5xl rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-600">Admin</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-950">Registered users</h1>
            <p className="mt-2 text-sm text-slate-600">Account names, email addresses, and signup dates.</p>
          </div>
          <a href="/" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Back to dashboard</a>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Joined</th></tr></thead>
            <tbody className="divide-y divide-slate-100">{users.map((user) => <tr key={user.id}><td className="px-3 py-4 font-semibold text-slate-900">{user.name ?? "Unnamed user"}</td><td className="px-3 py-4 text-slate-700">{user.email}</td><td className="px-3 py-4 text-slate-600">{user.createdAt.toLocaleDateString("en-IN")}</td></tr>)}</tbody>
          </table>
          {users.length === 0 && <p className="py-10 text-center text-sm text-slate-500">No registered users found.</p>}
        </div>
        <p className="mt-6 text-xs text-slate-500">Passwords and password hashes are never displayed.</p>
      </section>
    </main>
  );
                                                                                                                                                                                      }
