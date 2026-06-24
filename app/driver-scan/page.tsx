"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Flashlight,
  ImageIcon,
  HelpCircle,
  Box,
  Phone,
  MapPin,
  Navigation,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

const delivery = {
  driverName: "Ryan",
  trackingId: "LT123456789",
  status: "In Transit",
  bookedDate: "12 May 2024",
  bookedTime: "09:15 AM",
  customerName: "Sarah Smith",
  customerPhone: "071 123 4567",
  pickupCity: "Sandton City",
  pickupAddress: "83 Rivonia Rd, Sandton, Johannesburg",
  dropoffCity: "Pretoria CBD",
  dropoffAddress: "123 Church St, Pretoria Central",
  packageType: "Electronics",
  packageWeight: "3.2 kg",
  packageNote: "Fragile",
};

export default function DriverScanPage() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white flex justify-center">
      <section className="relative min-h-screen w-full max-w-[430px] overflow-hidden bg-black px-5 py-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#4c1d95_0%,transparent_35%)] opacity-40" />

        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-white">
            <span>9:41 Tue Apr 1</span>
            <span>100%</span>
          </div>

          <header className="mt-7 flex items-center gap-6">
            <Image
              src="/logo.png"
              alt="LogiTrack"
              width={120}
              height={70}
              priority
            />
            <div className="h-px flex-1 bg-white/40" />
          </header>

          <div className="mt-5 border-y border-white/20 py-4">
            <div className="flex items-center justify-between">
              <ArrowLeft size={24} />
              <h1 className="text-xl">Scan package</h1>
              <p className="text-right text-lg">
                Welcome back, {delivery.driverName}
              </p>
            </div>
          </div>

          <div className="mx-auto mt-6 flex w-[320px] items-center justify-center gap-3 rounded-full border border-pink-500 px-5 py-3 shadow-[0_0_20px_rgba(236,72,153,0.35)]">
            <HelpCircle size={20} className="text-purple-400" />
            <p className="font-semibold text-gray-300">
              Align QR code within the frame
            </p>
          </div>

          <button
            onClick={() => setShowDetails(true)}
            className="relative mx-auto mt-16 flex h-[260px] w-[340px] items-center justify-center rounded-xl bg-zinc-950/80 shadow-[0_0_45px_rgba(168,85,247,0.35)]"
          >
            <Corner className="left-0 top-0 border-l-8 border-t-8 border-purple-500" />
            <Corner className="right-0 top-0 border-r-8 border-t-8 border-pink-500" />
            <Corner className="bottom-0 left-0 border-b-8 border-l-8 border-purple-500" />
            <Corner className="bottom-0 right-0 border-b-8 border-r-8 border-pink-500" />

            <div className="absolute h-px w-full bg-pink-500 shadow-[0_0_25px_rgba(236,72,153,1)]" />

            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 27 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-6 w-6 ${
                    i % 2 === 0 ? "bg-purple-500" : "bg-pink-500"
                  } shadow-[0_0_10px_rgba(168,85,247,0.8)]`}
                />
              ))}
            </div>

            <p className="absolute bottom-4 text-xs text-gray-400">
              Click to fake scan
            </p>
          </button>

          <div className="mt-9 flex items-center justify-between">
            <CircleButton>
              <Flashlight />
            </CircleButton>

            <div className="rounded-2xl bg-zinc-900/90 px-5 py-4 text-center shadow-[0_0_25px_rgba(168,85,247,0.2)]">
              <div className="flex items-center justify-center gap-3">
                <Box className="text-pink-400" />
                <p className="text-sm font-semibold">
                  Position the QR code on the package within the frame
                </p>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                It will scan automatically
              </p>
            </div>

            <CircleButton>
              <ImageIcon />
            </CircleButton>
          </div>

          <div className="mt-14 flex items-center gap-5">
            <div className="h-px flex-1 bg-white/25" />
            <p className="text-gray-400">Need help?</p>
            <div className="h-px flex-1 bg-white/25" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="rounded-lg border border-purple-500 px-4 py-4 font-semibold text-gray-300">
              <ImageIcon className="mr-2 inline text-purple-400" />
              Upload QR Image
            </button>

            <button className="rounded-lg border border-pink-500 px-4 py-4 font-semibold text-gray-300">
              <HelpCircle className="mr-2 inline text-pink-400" />
              How to scan?
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
            <DeliveryDetailsModal onClose={() => setShowDetails(false)} />
          </div>
        )}
      </section>
    </main>
  );
}

function DeliveryDetailsModal({ onClose }: { onClose: () => void }) {
  return (
    <section className="relative max-h-[95vh] w-full max-w-[430px] overflow-y-auto bg-black px-5 py-5 text-white shadow-[0_0_60px_rgba(236,72,153,0.35)]">
      <div className="flex items-center justify-between text-xs">
        <span>9:41 Tue Apr 1</span>
        <span>100%</span>
      </div>

      <header className="mt-7 flex items-center gap-6">
        <Image src="/logo.png" alt="LogiTrack" width={120} height={70} />
        <div className="h-px flex-1 bg-white/40" />
      </header>

      <div className="mt-5 border-y border-white/20 py-4">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl">Delivery details</h1>
          <p className="text-right text-lg">Welcome back, {delivery.driverName}</p>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <Card>
          <p className="text-xs text-gray-500">Tracking ID</p>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{delivery.trackingId}</h2>
            <span className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-1 text-xs font-semibold">
              {delivery.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Booked on {delivery.bookedDate} | {delivery.bookedTime}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Customer</p>
              <h3 className="text-xl font-bold">{delivery.customerName}</h3>
              <p className="text-sm text-gray-400">{delivery.customerPhone}</p>
            </div>
            <button className="rounded-full border border-pink-500 p-4 text-pink-400">
              <Phone />
            </button>
          </div>
        </Card>

        <Card>
          <LocationBlock
            color="purple"
            title="Pickup Location"
            city={delivery.pickupCity}
            address={delivery.pickupAddress}
          />
          <div className="ml-3 h-10 border-l border-dashed border-purple-400" />
          <LocationBlock
            color="pink"
            title="Drop-off Location"
            city={delivery.dropoffCity}
            address={delivery.dropoffAddress}
          />
        </Card>

        <Card>
          <div className="flex items-center gap-4">
            <Box className="text-purple-400" size={34} />
            <div>
              <p className="text-xs text-gray-500">Package Details</p>
              <h3 className="text-xl font-bold">{delivery.packageType}</h3>
              <p className="text-sm text-gray-400">
                {delivery.packageWeight} <span className="text-pink-400">•</span>{" "}
                {delivery.packageNote}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-8 rounded-xl bg-zinc-950 p-4">
        <h3 className="mb-3 font-bold">Route Overview</h3>
        <div className="relative h-28 overflow-hidden rounded-lg bg-zinc-900">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:35px_35px]" />
          <svg viewBox="0 0 360 90" className="absolute inset-0 h-full w-full">
            <path
              d="M35 60 C80 20 115 85 160 55 C205 25 250 35 320 20"
              stroke="#ec4899"
              strokeWidth="4"
              fill="none"
            />
            <circle cx="35" cy="60" r="9" fill="#8b5cf6" />
            <circle cx="320" cy="20" r="9" fill="#ec4899" />
          </svg>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-zinc-950 p-4">
        <h3 className="mb-5 font-bold">Delivery Progress</h3>
        <div className="flex items-center justify-between">
          <ProgressItem label="Assigned" time="09:30 AM" done />
          <ProgressLine />
          <ProgressItem label="Collected" time="10:15 AM" done />
          <ProgressLine />
          <ProgressItem label="In Transit" time="10:45 AM" done />
          <ProgressLine />
          <ProgressItem label="Verify" time="" />
          <ProgressLine />
          <ProgressItem label="Delivered" time="" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="rounded-lg border border-pink-500 py-4 font-bold text-pink-300">
          <Phone className="mr-2 inline" />
          Call Customer
        </button>
        <button className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 py-4 font-bold">
          <Navigation className="mr-2 inline" />
          Navigate
        </button>
      </div>

      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-pink-500 p-2"
      >
        <X />
      </button>
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-zinc-950/90 p-5 shadow-[0_0_25px_rgba(168,85,247,0.08)]">
      {children}
    </div>
  );
}

function CircleButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white shadow-[0_0_20px_rgba(255,255,255,0.08)]">
      {children}
    </button>
  );
}

function Corner({ className }: { className: string }) {
  return <div className={`absolute h-12 w-12 ${className}`} />;
}

function LocationBlock({
  color,
  title,
  city,
  address,
}: {
  color: "purple" | "pink";
  title: string;
  city: string;
  address: string;
}) {
  return (
    <div className="flex gap-4">
      <MapPin className={color === "purple" ? "text-purple-400" : "text-pink-400"} />
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="text-lg font-bold">{city}</h3>
        <p className="text-sm text-gray-400">{address}</p>
      </div>
    </div>
  );
}

function ProgressItem({
  label,
  time,
  done,
}: {
  label: string;
  time: string;
  done?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full ${
          done ? "bg-purple-600" : "bg-zinc-800"
        }`}
      >
        {done ? <Check size={16} /> : <X size={16} className="text-gray-500" />}
      </div>
      <p className="mt-2 text-xs">{label}</p>
      <p className="text-[10px] text-gray-400">{time}</p>
    </div>
  );
}

function ProgressLine() {
  return <div className="mb-8 h-px flex-1 bg-purple-700" />;
}