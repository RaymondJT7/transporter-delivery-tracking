// Coded by Antonie Potgieter
// Design by Cione Botha

"use client";

import { useState } from "react";
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
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "Customer",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
        alert("Passwords do not match");
        return;
        }

        const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: form.email,
            password: form.password,
            name: form.name,
            phone: form.phone,
            address: form.address,
            role: form.role,
        }),
        });

        const data = await res.json();
        if (res.ok) {
        alert("Signup successful!");
        } else {
        alert(data.error || "Signup failed");
        }
    };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7e22ce_0%,#1a052e_35%,#000_75%)] opacity-90" />

      <section className="relative z-10 w-full max-w-lg rounded-4xl border border-purple-500/40 bg-black/70 p-8 shadow-[0_0_70px_rgba(236,72,153,0.45)] backdrop-blur">
        <div className="flex justify-center">
          <Image
            src="/LogiTrackLogo.png"
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input icon={<User />} type="text" placeholder="Full name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />

          <Input icon={<Mail />} type="email" placeholder="Email address" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />

          <Input icon={<Phone />} type="tel" placeholder="Phone number" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />

          <Input icon={<MapPin />} type="text" placeholder="Address" value={form.address} onChange={(e) => handleChange("address", e.target.value)}  />

          <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
            <Truck className="text-pink-400" />
            <select className="w-full bg-transparent text-gray-400 outline-none" value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
              <option className="bg-zinc-900">Select account type</option>
              <option className="bg-zinc-900">Customer</option>
              <option className="bg-zinc-900">Driver</option>
              <option className="bg-zinc-900">Admin</option>
            </select>
          </div>

          <Input icon={<Lock />} type="password" placeholder="Password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
          <Input icon={<Lock />} type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} />

          <button
            type="submit"
            className="w-full rounded-2xl bg-linear-to-r from-[#8B5CF6] to-[#EC4899] py-4 text-xl font-bold shadow-[0_0_35px_rgba(236,72,153,0.7)] transition hover:scale-105"
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
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-zinc-900 px-4 py-4 ring-1 ring-purple-500/40">
      <span className="text-pink-400">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent outline-none placeholder:text-gray-500"
      />
    </div>
  );
}