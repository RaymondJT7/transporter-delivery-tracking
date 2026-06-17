"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  User,
  EyeOff,
  Phone,
  MapPin,
  Truck,
} from "lucide-react";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7e22ce_0%,#1a052e_35%,#000_75%)] opacity-90" />

      <section className="relative z-10 w-full max-w-lg rounded-[2rem] border border-purple-500/40 bg-black/70 p-8 shadow-[0_0_70px_rgba(236,72,153,0.45)] backdrop-blur">
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

        <h1 className="mt-6 text-center text-3xl font-bold">
          Create your account
        </h1>

        <p className="mt-3 text-center text-sm text-pink-200">
          Welcome to LogiTrack! Please enter your details.
        </p>

        <form className="mt-8 space-y-4">
          <Input icon={<User />} type="text" placeholder="Full name" />

          <Input icon={<Mail />} type="email" placeholder="Email address" />

          <Input icon={<Phone />} type="tel" placeholder="Phone number" />

          <Input icon={<MapPin />} type="text" placeholder="Address" />

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Truck className="text-pink-400" />
            <select className="w-full bg-transparent text-gray-400 outline-none">
              <option className="bg-zinc-900">Select account type</option>
              <option className="bg-zinc-900">Customer</option>
              <option className="bg-zinc-900">Driver</option>
              <option className="bg-zinc-900">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Lock className="text-pink-400" />
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-transparent outline-none placeholder:text-gray-500"
            />
            <EyeOff className="text-gray-500" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Lock className="text-pink-400" />
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full bg-transparent outline-none placeholder:text-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] py-4 text-xl font-bold shadow-[0_0_35px_rgba(236,72,153,0.7)] transition hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-full border border-white/60 py-3 font-semibold transition hover:bg-white hover:text-black">
            🌈 Sign up with Google
          </button>

          <button className="w-full rounded-full border border-white/60 py-3 font-semibold transition hover:bg-white hover:text-black">
            📘 Sign up with Facebook
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-pink-400">
            Log In
          </Link>
        </p>
      </section>
    </main>
  );
}

function Input({
  icon,
  type,
  placeholder,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
      <span className="text-pink-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-gray-500"
      />
    </div>
  );
}