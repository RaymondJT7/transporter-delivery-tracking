"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      
      localStorage.setItem("user", JSON.stringify(data.user));
      document.cookie = `userRole=${data.user.role}; path=/`;

      if (data.user.role === "DRIVER") {
        window.location.href = "/driver";
}     else if (data.user.role === "ADMIN") {
        window.location.href = "/admin";
}     else {
        window.location.href = "/track";
}
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7e22ce_0%,#1a052e_35%,#000_75%)] opacity-90" />

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-purple-500/40 bg-black/70 p-8 shadow-[0_0_70px_rgba(236,72,153,0.45)] backdrop-blur">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            alt="LogiTrack Logo"
            width={260}
            height={160}
            priority
            className="drop-shadow-[0_0_30px_rgba(236,72,153,0.7)]"
          />
        </div>

        <h1 className="mt-8 text-center text-3xl font-bold">
          Log into your account
        </h1>

        <p className="mt-3 text-center text-sm text-pink-200">
          Welcome back to LogiTrack! Please enter your details.
        </p>

        {error && (
          <p className="mt-5 rounded-lg bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Mail className="text-pink-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Lock className="text-pink-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-transparent outline-none placeholder:text-gray-500"
            />
            <EyeOff className="text-gray-500" />
          </div>

          <div className="text-right text-sm">
            <Link href="#" className="text-pink-300 hover:text-pink-400">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-4 text-xl font-bold shadow-[0_0_35px_rgba(236,72,153,0.7)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-full border border-white/60 py-3 font-semibold transition hover:bg-white hover:text-black">
            🌈 Log in with Google
          </button>

          <button className="w-full rounded-full border border-white/60 py-3 font-semibold transition hover:bg-white hover:text-black">
            📘 Log in with Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-300">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-pink-400">
            Sign Up!
          </Link>
        </p>
      </section>
    </main>
  );
}