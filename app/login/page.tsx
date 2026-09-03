"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [signup, setSignup] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password"), ...(signup ? { name: data.get("name") } : {}) }) });
    if (!response.ok) { setError((await response.json()).error ?? "Unable to continue."); return; }
    router.push("/");
    router.refresh();
  }
  return <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"><h1 className="text-2xl font-bold">Rupee<span className="text-teal-500">Track</span></h1><p className="mt-2 text-sm text-slate-500">{signup ? "Create your private finance account." : "Sign in to your private finance account."}</p>{signup && <input required name="name" placeholder="Your name" className="mt-6 w-full rounded-xl border p-3" />}<input required type="email" name="email" placeholder="Email address" className="mt-6 w-full rounded-xl border p-3" /><input required minLength={8} type="password" name="password" placeholder="Password (8+ characters)" className="mt-3 w-full rounded-xl border p-3" />{error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}<button className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white">{signup ? "Create account" : "Sign in"}</button><button type="button" onClick={() => setSignup(!signup)} className="mt-4 w-full text-sm text-teal-600">{signup ? "Already have an account? Sign in" : "Create a new account"}</button></form></main>;
}
